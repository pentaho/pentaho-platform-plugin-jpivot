

AclEditorController = function( dialog )
{
  this.dialog = dialog;
  this.dialog.setTitle( AclEditorController.DIALOG_TITLE );
  this.aclCtrl = dialog.getAclEditorCtrl();
  this.dialog.enableOkBtnEl( false );
  var localThis = this;
  
  dialog.setOnSaveHandler( 
    function( event )
    {
      var value = localThis.aclCtrl.getValue();
      localThis.saveAcl( value );
    }
  );
  
  dialog.setOnCancelHandler( 
    function( event )
    {
      localThis.dialog.hide();
    }
  );
  
  // as soon as any checkbox is modified, enable the Ok button
  this.aclCtrl.setOnItemCheckHandler(
    function( event )
    {
      localThis.dialog.enableOkBtnEl( localThis.canEnableOkBtn() );
    }
  );
};

/*private static*/AclEditorController.PENTAHO_HTTP_WEBSERVICE_URL = "../ServiceAction";
/*private static*/AclEditorController.SOLUTION_REPOSITORY_WEBSERVICE_URL = "../SolutionRepositoryService";
// TODO sbarkdull, need to localize text
/*private static*/AclEditorController.FILE_LABEL = Messages.getString( "PATH_LABEL" );
/*private static*/AclEditorController.DIALOG_TITLE = Messages.getString( "SHARE_PERMISSIONS" );

/**
 * 
 */
AclEditorController.prototype.loadPage = function( solution, path, filename )
{
  this.solution = solution;
  this.path = path;
  this.filename = filename;
  var localThis = this;
  this.aclCtrl.setTitle( AclEditorController.FILE_LABEL 
    + "/" + solution 
    + ( path != "" ? "/" : "" ) + path 
    + "/" + filename );
  this.loadUsers( 
    function( xmlDoc )
    { 
      if ( undefined != xmlDoc )
      {
        var errorMsg = XmlUtil.getErrorMsg( xmlDoc );
        if ( !errorMsg )
        {
          localThis.aclCtrl.setUsers( xmlDoc );
        }
        else
        {
          alert( errorMsg );  // TODO sbarkdull, better msg UI?
        }
      }
      // start loadRoles --------------------------
      localThis.loadRoles( 
        function( xmlDoc )
        { 
          if ( undefined != xmlDoc )
          {
            var errorMsg = XmlUtil.getErrorMsg( xmlDoc );
            if ( !errorMsg )
            {
              localThis.aclCtrl.setRoles( xmlDoc );
            }
            else
            {
              alert( errorMsg );  // TODO sbarkdull, better msg UI?
            }
          }
          
          // start loadAcl --------------------------
          localThis.loadAcl(
            function( xmlDoc )
            { 
              if ( undefined != xmlDoc )
              {
                var errorMsg = XmlUtil.getErrorMsg( xmlDoc );
                if ( !errorMsg )
                {
                  localThis.aclCtrl.setAcl( xmlDoc );
                }
                else
                {
                  alert( errorMsg );  // TODO sbarkdull, better msg UI?
                }
              }
            }
          );
          // end loadAcl --------------------------
        }
      );
      // end loadRoles --------------------------
    }
  );
};

AclEditorController.prototype.saveAcl = function( strXml )
{
  // TODO sbarkdull, show "working" and "hour glass", see WAQR code
  this.dialog.enableOkBtnEl( false );
  this.dialog.enableCancelBtnEl( false );
  var localThis = this;
  WebServiceProxy.post( AclEditorController.SOLUTION_REPOSITORY_WEBSERVICE_URL, "setAcl",
    {
      solution: this.solution,
      path: this.path,
      filename: this.filename,
      aclXml: strXml
    },
    function( xmlDoc )
    {
      localThis.dialog.enableOkBtnEl( true );
      localThis.dialog.enableCancelBtnEl( true );
      if ( undefined != xmlDoc )
      {
        var errorMsg = XmlUtil.getErrorMsg( xmlDoc );
        if ( errorMsg )
        {
          alert( errorMsg );  // TODO sbarkdull, better msg UI?
        }
        else
        {
          localThis.dialog.hide();
// NO NEED TO SHOW DIALOG SAYING SAVE WORKED, USEFUL FOR DEBUGGING
//  				var statusMsg = XmlUtil.getStatusMsg( xmlDoc );
//  				if ( statusMsg )
//  				{
//  					alert( statusMsg );
//  				}
        }
      }
    }
  );
};

AclEditorController.prototype.loadAcl = function( onLoadHandler )
{
  var localThis = this;
  WebServiceProxy.post( AclEditorController.SOLUTION_REPOSITORY_WEBSERVICE_URL, "getAcl",
    {
      solution: localThis.solution,
      path: localThis.path,
      filename: localThis.filename
    },
    onLoadHandler
  );
};

AclEditorController.prototype.loadUsers = function( onLoadHandler )
{
  var localThis = this;
  WebServiceProxy.post( AclEditorController.PENTAHO_HTTP_WEBSERVICE_URL, undefined,
    {
      action:"securitydetails",
      details:"users"
    },
    onLoadHandler
  );
};

AclEditorController.prototype.loadRoles = function( onLoadHandler )
{
  var localThis = this;
  WebServiceProxy.post( AclEditorController.PENTAHO_HTTP_WEBSERVICE_URL, undefined,
    {
      action:"securitydetails",
      details:"roles"
    },
    onLoadHandler
  );
};

AclEditorController.prototype.canEnableOkBtn = function()
{
  return true;
};