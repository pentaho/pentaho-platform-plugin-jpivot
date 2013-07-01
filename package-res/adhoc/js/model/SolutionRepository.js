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
 * NOTE: the solutionDoc is private data. It should never be leaked from the class's interface.
 * Clients should not access it. That's why they call it private data, dawg.
 */
SolutionRepository = function()
{
  this.solutionDoc = null;
  this.solutionRootPath = null; // the name of the solution repository
}

/*static*/SolutionRepository.ROOT_FOLDER = "/";
/*static*/SolutionRepository.IS_LOADED_ATTR = "isLoaded";
/*static*/SolutionRepository.TRUE = "true";
/*static*/SolutionRepository.FALSE = "false";
/*static*/SolutionRepository.WAQR_ACTION_EXTENSION = ".waqr.xaction";
/*static*/SolutionRepository.WAQR_REPORTSPEC_EXTENSION = ".waqr.xreportspec";
/*static*/SolutionRepository.EMPTY_SOLUTION_NAME = "";
/*static*/SolutionRepository.EMPTY_FOLDER = "";
/*static*/SolutionRepository.IS_LOADED_ATTR = "isLoaded";
/*static*/SolutionRepository.TRUE = "true";
/*static*/SolutionRepository.FALSE = "false";

/*static*/SolutionRepository.isSolutionRoot = function( solution, path )
{
  return solution != SolutionRepository.EMPTY_SOLUTION_NAME
    && path != SolutionRepository.EMPTY_FOLDER;
}

/**
 * @param path String path to the folder/file whose path
 * needs to be loaded
 */
/*private*/SolutionRepository.prototype.loadPath = function( solution, path )
{
  if ( !this.isPathLoaded( solution, path ) )
  {
    this.loadPathFromWebService( solution, path, false, null );
  }
};

/**
 * 
 */
/*private*/SolutionRepository.prototype.loadSolutionFolder = function( solution, path, async, callback )
{
  this.loadPath( solution, path );
  if ( callback )
  {
    callback();
  }
}

/**
 * Load "path" from the server into the SolutionRepository's local model.
 * 
 * @param path String solution relative path to the solution folder
 * @param async boolean true if the method is to run asynchronously, else false
 * @param callback Function function gets called after the solution folder had been fetched
 * NOTE: this method can be asynchronous
 */
/*private*/SolutionRepository.prototype.loadPathFromWebService = function( solution, path, async, callback )
{
  var localThis = this;
  var queryStringParams = {
    path: path,
    solution: solution };
  var component = "getSolutionRepositoryDoc";
  // asynchronous call
  if ( async )
  {
    WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, queryStringParams, 
      function( incomingDoc )
      {
        // TODO sbarkdull handle null incomingDoc       
        if ( null === incomingDoc )
        {
          throw new Error( "server failed to return info" ); //internationalize, and better msg
        }
        localThis.handleGetSolutionFolderResponse( incomingDoc, solution, path, callback );
      }
    );
  }
  else
  {
    var incomingDoc = WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, queryStringParams, null );
        // TODO sbarkdull handle null incomingDoc
        
    if ( null === incomingDoc )
    {
      throw new Error( "server failed to return info" ); //internationalize, and better msg
    }
    this.handleGetSolutionFolderResponse( incomingDoc, solution, path, callback );
  }
}

/**
 * If the path-node already has children, or has an attribute marking
 * it as loaded, return true, else return false.
 * 
 * @return boolean true if the path has been loaded, else false
 */
SolutionRepository.prototype.isPathLoaded = function( solution, path )
{
  if ( this.solutionDoc != null )
  {
    var parentXPath = this.solutionFolderPathToXPath( solution, path );
    var childrenXPath =  parentXPath + "/file";
    var nodes = XmlUtil.selectNodes( this.solutionDoc, childrenXPath );
    if ( 0 == nodes.length )
    {
      // check for the attribute
      var node = XmlUtil.selectSingleNode( this.solutionDoc, parentXPath );
      return node && node.getAttribute( SolutionRepository.IS_LOADED_ATTR ) == SolutionRepository.TRUE;
    }
    else
    {
      return true;
    }
  }
  return false;
}

/*private*/SolutionRepository.prototype.handleGetSolutionFolderResponse = function( incomingDoc, solution, path, callback )
{
  if ( undefined != incomingDoc )
  {
    var errorMsg = XmlUtil.getErrorMsg( incomingDoc );
    if ( null != errorMsg )
    {
        var postStatus = new Status();
        postStatus.status = Status.FAIL;
        postStatus.message = errorMsg;
        throw postStatus;
    }
    var targetNd = null;
    if ( this.solutionDoc == null )
    {
      this.solutionDoc = incomingDoc;
    }
    else
    {
      // add in the new node at the appropriate location in the doc
      var xpath = this.solutionFolderPathToXPath( solution, path );
      var oldNd = XmlUtil.selectSingleNode( this.solutionDoc, xpath );
      var newNd = XmlUtil.selectSingleNode( incomingDoc, "/files/file" );
      if ( newNd )
      {
        // must have children
        XmlUtil.replaceNode( this.solutionDoc, newNd, oldNd );
        targetNd = newNd;
      }
      else
      {
        // has no children
        targetNd = oldNd;
      }
    }
    
    // mark the parent node as loaded
    if ( targetNd )
    {
      targetNd.setAttribute( SolutionRepository.IS_LOADED_ATTR, SolutionRepository.TRUE );
    }
    
    if ( callback )
    {
      callback();
    }
  }
}

/**
 * 
 * @param path String identifies the folder whose children are to be returned.
 * @param fileFilterRegexp Javascript regular expression object, regular expression
 * applied to folder's children filenames (not directory names), if the filename
 * matches the regular expression, it is added to the methods results
 * applied to folder's children foldernames (not file names), if the foldername
 * matches the regular expression, it is added to the methods results
 * 
 * @return Array of pathData, where each element of the array is an Object
 * with properties:
 *    path String specifying full path to object
 *    isDir boolean true if the path is a directory, else false
 *    name String the right-most component of path 
 * and each array element represents one of the children of the input parameter
 * pathData
 */
SolutionRepository.prototype.getSolutionFolderChildren = function( solution, path,
  fileFilterRegexp, async, callback )
{
  if ( null == this.solutionDoc )
  {
    //this is the first time the method has been called, initialize the root folder
    this.loadPathFromWebService( SolutionRepository.EMPTY_SOLUTION_NAME,
      SolutionRepository.EMPTY_FOLDER, false, null );
  }
  var localThis = this;
  this.loadSolutionFolder( solution, path, async, 
    function()
    {
      var children = localThis.getChildren( solution, path, fileFilterRegexp );
      if ( callback )
      {
        callback( children );
      }
    } );
};

/*static*/SolutionRepository.isNodeVisible = function( nd )
{
  var visibleText = XmlUtil.getAttribute( nd, "visible" );
  return visibleText == "true";
}
/**
 *
* @return Array of pathData, where each element of the array is an Object
 * with properties:
 *    path String specifying full path to object
 *    isDir boolean true if the path is a directory, else false
 *    name String the right-most component of path 
 * and each array element represents one of the children of the input parameter
 * parentPath
 */
/*private*/SolutionRepository.prototype.getChildren = function( solutionNameParam, parentPathParam,
  fileFilterRegexp )
{
  var children = new Array();
  
  var xpath = this.solutionFolderPathToXPath( solutionNameParam, parentPathParam );
  var foldersXPath = xpath + "/file[@type='FILE.FOLDER']";
  var nds = XmlUtil.selectNodes( this.solutionDoc, foldersXPath );
  for ( var idx in nds )
  {
    var nd = nds[ idx ];
    if ( SolutionRepository.isNodeVisible( nd ) )
    {
      var folderObj = this.getFolderObject( nd );    
      children.push( folderObj );
    }
  }
  var filesXPath = xpath + "/file[@type='FILE.ACTIVITY']";
  var nds = XmlUtil.selectNodes( this.solutionDoc, filesXPath );
  for ( var idx in nds )
  {
    var nd = nds[ idx ];
    if ( SolutionRepository.isNodeVisible( nd ) )
    {
      var fileObj = this.getFileObject( nd );
      // if the file satisifies the filter or there is not filter
      if ( !fileFilterRegexp || fileObj.name.match( fileFilterRegexp ) )
      {
        children.push( fileObj );
      }
    }
  }
  return children;
};

/*private*/SolutionRepository.prototype.getFolderObject = function( nd )
{
  var pathNd = XmlUtil.selectSingleNode( nd, "path" );
  var path = ( pathNd )
    ? XmlUtil.getNodeText( pathNd ) // must be child of solution folder
    : "";                           // must be a solution folder, since they don't have a path node child
  var solutionNd = XmlUtil.selectSingleNode( nd, "solution" );
  var solutionName = XmlUtil.getNodeText( solutionNd );
  var descriptionNd = XmlUtil.selectSingleNode( nd, "description" );
  var description = XmlUtil.getNodeTextOrEmptyString( descriptionNd );
  var nameAttrNd = XmlUtil.selectSingleNode( nd, "@name" );
  var name = XmlUtil.getNodeTextOrEmptyString( nameAttrNd );
  var titleNd = XmlUtil.selectSingleNode( nd, "title" );
  var title = XmlUtil.getNodeTextOrEmptyString( titleNd );

  return { solution: solutionName, path:path, isDir:true,
    name:name, description: description, displayName: title };
};

/*private*/SolutionRepository.prototype.getFileObject = function( nd )
{
  var fileNd = XmlUtil.selectSingleNode( nd, "filename" );
  var fileName = XmlUtil.getNodeTextOrEmptyString( fileNd );
  var titleNd = XmlUtil.selectSingleNode( nd, "title" );
  var title = XmlUtil.getNodeTextOrEmptyString( titleNd );
  var descriptionNd = XmlUtil.selectSingleNode( nd, "description" );
  var description = XmlUtil.getNodeTextOrEmptyString( descriptionNd );
  var solutionNd = XmlUtil.selectSingleNode( nd, "solution" );
  var solutionName = XmlUtil.getNodeText( solutionNd );
  var pathNd = XmlUtil.selectSingleNode( nd, "path" );
  var path = XmlUtil.getNodeText( pathNd );
  
  return { solution: solutionName, path:path, isDir:false,
      name:fileName, description: description, displayName: title };
}
/**
 * @param solution String
 * @param path String
 * @param filename String
 * @param strContents String the contents to be saved to the file.
 * @param overwrite boolean, if true, and the file exists, overwrite it, otherwise don't overwrite
 * @param outputType String comma delimited list of output types. For instance
 * to specify pdf and html, the string would be "pdf,html". Acceptable values
 * are pdf, html, csv, xls.
 * @param afterSaveCallback function 
 */
SolutionRepository.prototype.save = function( solution, path, filename, strContents,
  clientParams, overwrite, afterSaveCallback )
{
  var component = "saveFile";

    if(filename.indexOf(SolutionRepository.WAQR_ACTION_EXTENSION) > -1){
        filename = filename.replace(SolutionRepository.WAQR_ACTION_EXTENSION,'');
    }
    var params = {
    content:strContents,
    solution:solution,
    path:path,
    name:filename + SolutionRepository.WAQR_REPORTSPEC_EXTENSION,
    overwrite:overwrite ? "true" : "false",
    ajax:'true'
  };
  // load the caller's parameters into the parameters the we are sending to the server
  for ( var key in clientParams )
  {
    params[ key ] = clientParams[ key ];
  }
  var localThis = this;
  WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, params,
    function( xmlDoc )
    {
      afterSaveCallback( xmlDoc );
      if ( undefined != xmlDoc )
      {
        var msg = XmlUtil.getErrorMsg( xmlDoc );
        if ( !msg )
        {
          // no errors add the node to our doc
          var fullFilename = filename + SolutionRepository.WAQR_ACTION_EXTENSION;
          if ( localThis.solutionDoc != undefined && !localThis.doesSolutionFileExist( solution, path, fullFilename ) )
          {
            localThis.addFile( solution, path, fullFilename, filename );
          }     
        }
      }
    }, 'text/xml' );
};


/**
 * Add the file to the client's view of the repository
 */
/*private*/SolutionRepository.prototype.addFile = function( solution, path, filename, title )
{
  if(this.solutionDoc == undefined || this.solutionDoc == null){
    return;
  }
  var parentXPath = this.solutionFolderPathToXPath( solution, path );
  var parentNd = XmlUtil.selectSingleNode( this.solutionDoc, parentXPath );
  var fileNd = this.createFileNode( solution, path, filename, title );
  XmlUtil.appendChild( parentNd, fileNd );   
};

/*private*/SolutionRepository.prototype.createFileNode = function( solution, path, filename, title )
{
  var fileNd = XmlUtil.createElement( this.solutionDoc, "file" );
  XmlUtil.setAttribute( fileNd, "type", "FILE.ACTIVITY" );
  XmlUtil.setAttribute( fileNd, "visible", "true" );
  XmlUtil.setAttribute( fileNd, "displaytype", "report" );
  this.addFileNodeChildNodes( fileNd, solution, path, filename, title );
  return fileNd;  
};

/**
 * it may be useful to add these in the future
 */
/*private*/SolutionRepository.prototype.addFileNodeChildNodes = function( fileNd, solution, path, filename, title )
{
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "filename" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, filename ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "path" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, path ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "solution" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, solution ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "title" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, title ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "description" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, "" ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "author" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, "" ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "icon" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, "" ) );
  XmlUtil.appendChild( fileNd, tmpNd );
  
  var tmpNd = XmlUtil.createElement( this.solutionDoc, "properties" );
  XmlUtil.appendChild( tmpNd, XmlUtil.createTextNode( this.solutionDoc, "" ) );
  XmlUtil.appendChild( fileNd, tmpNd );
};

/*static*/SolutionRepository.RE_GET_WAQR_FILENAME = /(.*)\.waqr\.xreportspec/;
/*private*/SolutionRepository.removeExtension = function( filename )
{
  var parts = filename.match( SolutionRepository.RE_GET_WAQR_FILENAME );
  return ( null != parts ) ? parts[1] : filename;
};

/**
 * @return boolean true if path is already in the 
 */
SolutionRepository.prototype.doesSolutionFileExist = function( solution, path, fullFilname )
{
  if (!this.solutionDoc) {
    return false;
  }
  var xpath = this.solutionFilePathToXPath( solution, path, fullFilname );
  var node = XmlUtil.selectSingleNode( this.solutionDoc, xpath );
  return undefined != node && null != node;
};

SolutionRepository.prototype.solutionFilePathToXPath = function( solution, path, fileName )
{
  var fileXPath = '/file[@type="FILE.ACTIVITY"]/filename[text()="' + fileName + '"]';
 
  var xpath = this.solutionFolderPathToXPath( solution, path )
    + fileXPath;
  return xpath;
};
/*
 * IMPLEMENTATION NOTE: properly implemented xpath parsers do not require the attribute
 * value in the xpath expression to be xml-encoded. However, we are not
 * using a particularly robust parser, and it does require the xml-encoding.
 */
/*private*/SolutionRepository.prototype.solutionFolderPathToXPath = function( solution, path )
{
  var xpath = "/repository";
  if ( !StringUtils.isEmpty( solution ) )
  {
    xpath += '/file[@type="FILE.FOLDER" and @name="' + XmlUtil.escapeXmlAttr( solution ) + '"]';
  }
  if ( !StringUtils.isEmpty( path ) && "/" != path )
  {
    var pComponents = path.split( "/" );
    // 0th element will be an empty string, so start iteration at 1
    for ( var ii=0; ii<pComponents.length; ++ii )
    {
      var comp = XmlUtil.escapeXmlAttr( pComponents[ ii ] );
      xpath += '/file[@type="FILE.FOLDER" and @name="' + comp + '"]';
    }
  }
  return xpath;
};

/**
 * NOTE: caller should check the return doc using XmlUtil.getErrorMsg( xmlDoc ) to
 * see if the returned document contains an error msg.
 * 
 * @return XDocument if the user session has expired, it returns undefined, else returns the xml document
 * (XDocument, see dom.js) returned by the server.
 */
SolutionRepository.prototype.getWaqrReportSpecDoc = function( solution, path, filename )
{
  var component = "getWaqrReportSpecDoc";
  var params = { 
    solution: solution,
    path: path,
    filename: filename };
  var reportDoc = WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, params, undefined, 'text/xml' );

  return reportDoc;
};
