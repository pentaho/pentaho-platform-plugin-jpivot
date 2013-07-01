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
WaqrRepository = function()
{
	this.solutionDoc = null;
	this.solutionRootPath = null;	// the name of the solution repository
}

/*static*/WaqrRepository.ROOT_FOLDER = "/";
/*static*/WaqrRepository.IS_LOADED_ATTR = "isLoaded";
/*static*/WaqrRepository.TRUE = "true";
/*static*/WaqrRepository.FALSE = "false";
/**
 * @param path String solution relative path to the solution folder
 * @param async boolean true if the method is to run asynchronously, else false
 * @param callback Function function gets called after the solution folder had been fetched
 * NOTE: this method can be asynchronous
 * NOTE: when this method is called for the first time, "path" must be "/"
 */
/*public*/WaqrRepository.prototype.getFolder = function( path, async, callback )
{
	if ( null == this.solutionRootPath )
	{
		//this is the first time the method has been called, initialize the root folder
		this.loadPathFromWebService( WaqrRepository.ROOT_FOLDER, false, null );
	}
	var fixedPath = path;
	this.loadSolutionFolder( fixedPath, async, callback );
}

/*static*/WaqrRepository.isRootPath = function( path )
{
  return path == WaqrRepository.ROOT_FOLDER;
}

/**
 * @param path String path to the folder/file whose path
 * needs to be loaded
 */
/*private*/WaqrRepository.prototype.loadPath = function( path )
{
	if ( !this.isPathLoaded( path ) )
	{
	  // recursively walk up the path making sure parents are loaded
    var parentPath = StringUtils.getParentPath( path );
    if ( null != parentPath && !WaqrRepository.isRootPath( parentPath ))
    {
		  this.loadPath( parentPath );
    }
    this.loadPathFromWebService( path, false, null );
	}
}
/**
 * 
 */
/*private*/WaqrRepository.prototype.loadSolutionFolder = function( path, async, callback )
{
	this.loadPath( path );
	if ( callback )
	{
		callback();
	}
}
/**
 * Load "path" from the server into the WaqrRepository's local model.
 * 
 * @param path String solution relative path to the solution folder
 * @param async boolean true if the method is to run asynchronously, else false
 * @param callback Function function gets called after the solution folder had been fetched
 * NOTE: this method can be asynchronous
 */
/*private*/WaqrRepository.prototype.loadPathFromWebService = function( path, async, callback )
{
	var localThis = this;
	var queryStringParams = { folderPath:path };
	var component = "getWaqrRepositoryDoc";
	// asynchronous call
	if ( async )
	{
		WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, queryStringParams, 
			function( incomingDoc )
			{
				localThis.handleGetFolderResponse( incomingDoc, path, callback );
			}
		);
	}
	else
	{
		var incomingDoc = WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, queryStringParams, null );
		this.handleGetFolderResponse( incomingDoc, path, callback );
	}
}
/**
 * @return boolean true if the path has been loaded, else false
 */
/*private*/WaqrRepository.prototype.isPathLoaded = function( path )
{
	if ( this.solutionDoc != null )
	{
		// see if we already have the node
		var strXpath = "//branch[@id='" + path + "']";
		var node = XmlUtil.selectSingleNode( this.solutionDoc, strXpath );
		return node && node.getAttribute( WaqrRepository.IS_LOADED_ATTR ) == WaqrRepository.TRUE;
	}
	return false;
}
/*private*/WaqrRepository.prototype.handleGetFolderResponse = function( incomingDoc, fixedPath, callback )
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
			var branchIdNd = XmlUtil.selectSingleNode( this.solutionDoc, "/branch/@id" );
			this.solutionRootPath = branchIdNd.nodeValue;
			targetNd = XmlUtil.selectSingleNode( this.solutionDoc, "/branch" );
		}
		else
		{
			targetNd = XmlUtil.selectSingleNode( incomingDoc, "/branch" );
			fixedPath = this.fixIncomingPath( fixedPath );
			var strXpath = "//branch[@id='" + fixedPath + "']";
			var oldNode = XmlUtil.selectSingleNode( this.solutionDoc, strXpath );
			XmlUtil.replaceNode( this.solutionDoc, targetNd, oldNode );
		}
		if ( targetNd )
		{
			targetNd.setAttribute( WaqrRepository.IS_LOADED_ATTR, WaqrRepository.TRUE );
		}
		if ( callback )
		{
			callback();
		}
	}
}

/**
 * if path == "/", return "pentaho-solutions", else return path
 */
/*private*/WaqrRepository.prototype.fixIncomingPath = function( path )
{
	return WaqrRepository.isRootPath( path ) ? this.solutionRootPath : this.solutionRootPath + path;
}

/**
 * if path == "pentaho-solutions", return "/", else return path
 */
/*private*/WaqrRepository.prototype.fixOutgoingPath = function( path )
{
	return path.replace( this.solutionRootPath, "" );
}

/**
 * 
 * @param path String identifies the folder whose children are to be returned.
 * @param fileFilterRegexp Javascript regular expression object, regular expression
 * applied to folder's children filenames (not directory names), if the filename
 * matches the regular expression, it is added to the methods results
 * @param folderFilterRegexp Javascript regular expression object, regular expression
 * applied to folder's children foldernames (not file names), if the foldername
 * matches the regular expression, it is added to the methods results
 * 
 * @return Array of pathData, where each element of the array is an Object
 * with properties:
 * 		path String specifying full path to object
 * 		isDir boolean true if the path is a directory, else false
 * 		name String the right-most component of path 
 * and each array element represents one of the children of the input parameter
 * pathData
 */
WaqrRepository.prototype.getFolderChildren = function( path,
	fileFilterRegexp, folderFilterRegexp, async, callback )
{
	if ( null == this.solutionRootPath )
	{
		//this is the first time the method has been called, initialize the root folder
		this.loadPathFromWebService( WaqrRepository.ROOT_FOLDER, false, null );
	}
	var parentPath = path;
	var localThis = this;
	this.loadSolutionFolder( parentPath, async, 
		function()
		{
			var children = localThis.getChildren( parentPath, fileFilterRegexp, folderFilterRegexp );
			if ( callback )
			{
				callback( children );
			}
		} );
}

/**
 *
 * @return Array of pathData, where each element of the array is an Object
 * with properties:
 * 		path String specifying full path to object
 * 		isDir boolean true if the path is a directory, else false
 * 		name String the right-most component of path 
 * and each array element represents one of the children of the input parameter
 * parentPath
 */
/*private*/WaqrRepository.prototype.getChildren = function( parentPath, fileFilterRegexp, folderFilterRegexp )
{
	var children = new Array();
	
	parentPath = this.fixIncomingPath( parentPath );
	var xpath = "//branch[@id='" + parentPath + "']/branch";
	var nds = XmlUtil.selectNodes( this.solutionDoc, xpath );
	for ( var idx in nds )
	{
		var nd = nds[ idx ];
		var branchIdAttrNd = XmlUtil.selectSingleNode( nd, "@id" );
		var folderPath = this.fixOutgoingPath( branchIdAttrNd.nodeValue );
		
		var branchIsDirAttrNd = XmlUtil.selectSingleNode( nd, "@isDir" );
		var isDir = branchIsDirAttrNd.nodeValue.toLowerCase() == "true";
		var textNd = null;
		if ( isDir )
		{
			textNd = XmlUtil.selectSingleNode( nd, "branchText" );
		}
		else
		{
			throw new Error( Messages.getString("invalidBranchElement") );
		}
		if ( !folderFilterRegexp || folderPath.match( folderFilterRegexp ) )
		{
			var listItemText = XmlUtil.getNodeText( textNd );
			children.push( { path:folderPath,
        isDir:isDir, name:listItemText } );
		}
	}
	xpath = "//branch[@id='" + parentPath + "']/leaf";
	var nds = XmlUtil.selectNodes( this.solutionDoc, xpath );
	for ( var idx in nds )
	{
		var nd = nds[ idx ];
		var pathNd = XmlUtil.selectSingleNode( nd, "path" );
		var folderPath = this.fixOutgoingPath( XmlUtil.getNodeText( pathNd ) );
		
		var branchIsDirAttrNd = XmlUtil.selectSingleNode( nd, "@isDir" );
		var isDir = branchIsDirAttrNd.nodeValue.toLowerCase() == "true";
		var textNd = textNd = XmlUtil.selectSingleNode( nd, "leafText" );
		var listItemText = XmlUtil.getNodeText( textNd );
		// if we have a file, and it satisifies the filter or there is not filter or...
		// we have a dir, and it satisfies the filter or there is no filter
		if ( ( !isDir && ( !fileFilterRegexp || listItemText.match( fileFilterRegexp ) ) )
			|| ( isDir && ( !folderFilterRegexp || listItemText.match( folderFilterRegexp ) ) ) )
		{
			children.push( { path:folderPath,
        isDir:isDir, name:listItemText } );
		}
	}
	return children;
};

/**
 * @return boolean true if path is already in the 
 */
/*private*/WaqrRepository.prototype.doesSolutionFileExist = function( path )
{
	path = this.fixIncomingPath( path );
	var parentPath = StringUtils.getParentPath( path );
	var fileName = StringUtils.getLastPathElement( path );
	var xpath = "//branch[@id='" + parentPath + "']/leaf/leafText[.=\"" + fileName + "\"]";
	var node = XmlUtil.selectSingleNode( this.solutionDoc, xpath );
	
	return undefined != node && null != node;
};

/**
 * NOTE: caller should check the return doc using XmlUtil.getErrorMsg( xmlDoc ) to
 * see if the returned document contains an error msg.
 */
WaqrRepository.prototype.getIndexDoc = function( templateFolderPath, callback )
{
  templateFolderPath = templateFolderPath.replace( "/system/waqr", "" );
	var component = "getWaqrRepositoryIndexDoc";
	var params = { templateFolderPath: templateFolderPath };
	WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, 
		params, callback, 'text/xml' );
}

/**
 * NOTE: caller should check the return doc using XmlUtil.getErrorMsg( xmlDoc ) to
 * see if the returned document contains an error msg.
 */
WaqrRepository.prototype.getWaqrTemplate = function( templatePath )
{
	var component = "getTemplateReportSpec";
	var params = { reportSpecPath: templatePath };
	var templateDoc = WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, component, 
		params, undefined, 'text/xml' );
	
	return templateDoc;
}

/*private static*/WaqrRepository.getResourcePath = function( path )
{
  return "/system/waqr" + path;
};