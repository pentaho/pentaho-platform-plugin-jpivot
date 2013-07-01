/*
 * Copyright 2007 Pentaho Corporation.  All rights reserved. 
 * This software was developed by Pentaho Corporation and is provided under the terms 
 * of the Mozilla Public License, Version 1.1, or any later version. You may not use 
 * this file except in compliance with the license. If you need a copy of the license, 
 * please go to http://www.mozilla.org/MPL/MPL-1.1.txt. The Original Code is the Pentaho 
 * BI Platform.  The Initial Developer is Pentaho Corporation.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS" 
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to 
 * the license for the specific language governing your rights and limitations.
 *
 * Created  
 * @author Steven Barkdull
 */

/**
 * @param msgCtrl MessageCtrl
 */
RepositoryBrowserController = function( wiz, solutionRepository )
{
  this.wiz = wiz;
  this.reportSpec = null;
  this.solutionRepository = solutionRepository;
  this.repositoryBrowser = null;
  this.solution = null;
  this.path = null;
  this.filename = null;
  this.bIsSaving = false;
  this.onAfterSaveCallback = null;
}

/*static*/RepositoryBrowserController.RE_FILE_FILTER = /^.*\.waqr\.xaction$/;
/*static*/RepositoryBrowserController.RE_WAQR_INVALID_FILENAME = /[\/\\\?%*:|<>"]/;

RepositoryBrowserController.prototype.setReportSpec = function( reportSpec )
{
  this.reportSpec = reportSpec;
}

RepositoryBrowserController.prototype.init = function()
{
  var rootFolderPathData = { 
      isDir: true,
      solution: SolutionRepository.EMPTY_SOLUTION_NAME,
      path: SolutionRepository.EMPTY_FOLDER, 
      name: SolutionRepository.ROOT_FOLDER, 
      displayName: SolutionRepository.ROOT_FOLDER,
      description: Messages.getString("SOLUTION_REPOSITORY")
    };
  var localThis = this;
  this.repositoryBrowser = new WaqrRepositoryBrowser( Messages.getString("saveAsBtnTxt"),
    this.solutionRepository, rootFolderPathData,
    function( solution, path )
    {
      localThis.handleFolderChange( solution, path );
    }
  );
  this.repositoryBrowser.setOnSaveHandler( this.handleSave, this );
  this.repositoryBrowser.setOnCancelHandler( this.handleCancel, this );
}
RepositoryBrowserController.isValidFilename = function( filename )  
{
  var match = filename.match( RepositoryBrowserController.RE_WAQR_INVALID_FILENAME );
  return null == match;
}
RepositoryBrowserController.prototype.handleSave = function()
{
  var filename = this.repositoryBrowser.getSaveAsName();
  var solution = this.repositoryBrowser.getSolutionName();
  var path = this.repositoryBrowser.getPath();
  
  var bSaveOk = this.saveReportSpecAs( filename, solution, path, false );
  
  return bSaveOk;
}

RepositoryBrowserController.prototype.handleFolderChange = function( solution, path )
{
  var localThis = this;
  this.solutionRepository.getSolutionFolderChildren( solution, path, 
    RepositoryBrowserController.RE_FILE_FILTER, /*async*/true,
    function( children )
    {
      localThis.repositoryBrowser.loadListCtrl( children );
      localThis.repositoryBrowser.tryToEnableSaveBtn();
    }
  );
};

RepositoryBrowserController.prototype.handleCancel = function()
{
  this.wiz.getSaveBtn().setEnabled( true );
  this.wiz.getSaveAsBtn().setEnabled( true );
}

RepositoryBrowserController.prototype.getOutputType = function(){
  if(this.requestedOutputType != null){
    return this.requestedOutputType;
  } else {
    return this.repositoryBrowser.getOutputType();
  }
}

RepositoryBrowserController.prototype.remoteSave= function( filename,
  solution, path, type, bOverwrite )
{
  this.requestedOutputType = type;
  this.saveReportSpecAs(filename, solution, path, bOverwrite);
}

/*private*/RepositoryBrowserController.prototype.saveReportSpecAs = function( filename,
  solution, path, bOverwrite )
{
  if ( !this.repositoryBrowser )
  {
    this.init();
  }
  if ( RepositoryBrowserController.isValidFilename( filename ) )
  {
    /*
     * if bOverwrite is false, check to see if the file exists in the client solutionRepository. If
     * the file doesn't exist, we can safely set bOverwrite to false, that way if the file
     * somehow gets created by another process before we save, the server will still
     * detect it and return an error msg preventing an overwrite.
     * If the file does exist, prompt the user for overwrite.
     */
    if ( !bOverwrite )
    {
      var bExists = this.solutionRepository.doesSolutionFileExist( solution, path, filename + SolutionRepository.WAQR_ACTION_EXTENSION );
      if ( bExists )
      {
        bOverwrite = window.confirm( Messages.getString( "overwriteFile", filename ) );
        
        if ( !bOverwrite )
        {
          return;
        }
      }
      else
      {
        bOverwrite = false;
      }
    }
  
    this.wiz.getBusyCtrl().setText( Messages.getString("saving") );
    this.wiz.getBusyCtrl().show();
    
    this.solution = solution;
    this.path = path;
    this.filename = filename;
    var outputType = this.getOutputType();
    if ( "" == outputType )
    {
      outputType = "html,xls,pdf,csv";
    }
    this.reportSpec.reportName = filename;
    
    var templatesListCtrl = this.wiz.getPg( 0 ).getTemplatesListCtrl();
    var items = templatesListCtrl.getSelectedItems();
    var templatePath = items.length > 0
      ? items[0].itemData.templateFolderPath + "/" + items[0].itemData.jfreeTemplate
      : "";
    
    var localThis = this;
    this.bIsSaving = true;
    var params = {
      outputType:outputType,
      templatePath: templatePath
    };
    
    this.solutionRepository.save( solution, path, filename, this.reportSpec.asXml(),
      params, bOverwrite, 
      function( xmlDoc )
      {
        localThis.wiz.getBusyCtrl().hide();
        if ( undefined != xmlDoc )
        {
          var msg = XmlUtil.getErrorMsg( xmlDoc );
          if ( msg )
          {
            localThis.solution = null;
            localThis.filename = null;
            localThis.repositoryBrowser.msgCtrl.error( msg );
          }
          else
          {
            msg = XmlUtil.getStatusMsg( xmlDoc );
            localThis.repositoryBrowser.msgCtrl.warn( msg );
          }
          localThis.bIsSaving = false;
          
          if ( localThis.onAfterSaveCallback )
          {
            localThis.onAfterSaveCallback()
          }
        }
        if (window.parent != null && window.parent.mantle_initialized == true) {
          window.parent.mantle_refreshRepository();
        }
        
      }
    );
    return true;
  }
  else
  {
    this.wiz.msgCtrl.error( Messages.getString("invalidFileName", filename));
    return false;
  }
}

  
RepositoryBrowserController.prototype.openSaveAsDialog = function()
{
  if ( !this.repositoryBrowser )
  {
    this.init();
  }
  this.repositoryBrowser.show();
}


/**
 * @throws Status when the report spec is not valid and cannot be saved
 */
RepositoryBrowserController.prototype.saveReportSpec = function()
{
  if ( StringUtils.isEmpty( this.solution ) 
    || StringUtils.isEmpty( this.path ) 
    || StringUtils.isEmpty( this.filename ) )
  {
    this.openSaveAsDialog()
  }
  else
  {
    // this.path better be non-empty too!
    this.saveReportSpecAs( this.filename , this.solution, this.path, true );
  }
}

RepositoryBrowserController.prototype.reset = function()
{
  this.solution = null;
  this.path = null;
  this.filename = null;
  this.reportSpec = null;
}

RepositoryBrowserController.prototype.setOnAfterSaveCallback = function( callback )
{
  this.onAfterSaveCallback = callback;
}
