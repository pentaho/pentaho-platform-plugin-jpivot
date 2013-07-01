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
 * @param title String title placed in the title-bar of the repository browser
 * @param repository SolutionRepository
 */
RepositoryBrowser = function( title, repository, rootFolderPathData, onFolderChangeHandler )
{
	// TODO Dialog.call( this, title );
	if ( arguments.length == 0 )
	{
		// must be a call to set up an inheritance chain
		return;
	}
	var localThis = this;
	this.repository = repository;
	this.reRepositoryBrowserFilter = null;
	this.onFolderChangeHandler = onFolderChangeHandler;
	this.msgCtrl = new MessageCtrl();
	
	this.initText();
	
	this.modalDiv = document.getElementById( "browser.modalDiv" );
	this.dialogDiv = document.getElementById("browser.saveasDialog");
	this.titleBarDiv = document.getElementById("browser.titleBar");
	this.saveAsNameInputText = document.getElementById("browser.saveAsNameInputText");
	this.displayPath = RepositoryBrowser.ROOT_PATH;
	/*
	 * pathDataStack is used to maintain a list of folders between and including
	 * the root folder, and the current folder that has been "drilled" into.
	 */
	this.pathDataStack = [ rootFolderPathData ];
	
	var comboContainer = document.getElementById( "browser.comboContainer" );
	this.comboCtrl = new ComboCtrl();
	comboContainer.appendChild( this.comboCtrl.getRoot() );

	var solutionFolderListTd = document.getElementById( "browser.solutionFolderListTd" );
	this.solutionFolderList = new ListCtrl( undefined, "browserSolutionList", ListCtrl.SINGLE_SELECT );
	solutionFolderListTd.appendChild( this.solutionFolderList.getRoot() );
	this.solutionFolderList.setDefaultSelectedItemClassName( "selectedItem" );
	
	this.saveBtn = new ButtonCtrl( RepositoryBrowser.SAVE_LABEL, ButtonCtrl.LARGE );
	this.saveBtn.setOnClickCallback( this.handleSave, this );	
	this.saveBtn.setEnabled( false );
	var saveBtnContainer = document.getElementById( "browser.saveBtnContainer" );
	saveBtnContainer.appendChild( this.saveBtn.getRoot() );
	
	this.openBtn = new ButtonCtrl( RepositoryBrowser.OPEN_LABEL, ButtonCtrl.LARGE );
	this.openBtn.setOnClickCallback( this.handleOpen, this );	
	this.openBtn.setEnabled( true );
	saveBtnContainer.appendChild( this.openBtn.getRoot() );
	
	this.showOpen();
	
	this.cancelBtn = new ButtonCtrl( "Cancel", ButtonCtrl.LARGE );
	this.cancelBtn.setOnClickCallback( this.handleCancel, this );
	var cancelBtnContainer = document.getElementById( "browser.cancelBtnContainer" );
	cancelBtnContainer.appendChild( this.cancelBtn.getRoot() );
	
	this.solutionFolderList.setOnDblClickCallback(
		function( event )
		{
			var bInOpenMode = localThis.getMode() == RepositoryBrowser.OPEN_MODE;
			if ( bInOpenMode )
			{
				localThis.handleOpen();
			}
			else
			{
				localThis.handleSave();
			}
		}
	);
	this.solutionFolderList.setOnUnselectCallback(
		function( event )
		{
			localThis.tryToEnableSaveBtn();
		}
	);
	// use onmousedown instead of onselect since we want the event even
	// when the user clicks on an item in the list that is already selected
	this.solutionFolderList.setOnMouseDownCallback(
		function( event )
		{
			var itemData = event.selectTrElem.itemData;
			if ( !itemData.isDir )
			{
				localThis.setSaveAsName( itemData.displayName );
				localThis.showSave();
			}
			else
			{
				localThis.showOpen();
			}
			localThis.tryToEnableSaveBtn();
		}
	);
		
	UIUtil.addEvent( this.saveAsNameInputText, 'focus', 
	 function()
	 {
	    localThis.handleSaveAsTextFocus();
	 } );
	 
	UIUtil.addEvent( this.saveAsNameInputText, 'keyup', 
	 function()
	 {
	    localThis.handleSaveAsTextKeyUp();
	 } );
	 
	this.titleBarDiv.innerHTML = title;
	this.titleBarDiv.ctrl = this;
	
	var upImg = document.getElementById( "browser.upImg" );
	upImg.onclick = function()
	{
		localThis.goUpOneDir();		
	};
	upImg.onmouseover = function()
	{
		upImg.src = UIUtil.getImageFolderPath() + "up_rollover.png";	
	};
	upImg.onmouseout = function()
	{
		upImg.src = UIUtil.getImageFolderPath() + "up.png";
	};
	
	upImg.onmousedown = function()
	{
		upImg.src = UIUtil.getImageFolderPath() + "up.png";
	};
	upImg.onmouseup = function()
	{
		upImg.src = UIUtil.getImageFolderPath() + "up_rollover.png";
	};
}
/*static*/RepositoryBrowser.FOLDER_CLOSED_IMG_FILENAME = UIUtil.getImageFolderPath() + "folder_closed.png";
/*static*/RepositoryBrowser.FILE_IMG_FILENAME = UIUtil.getImageFolderPath() + "file.png";
/*static*/RepositoryBrowser.IMG_PADDING_RIGHT = ".3em;"
/*static*/RepositoryBrowser.TREE_INDENT_EM = 0.4;
/*static*/RepositoryBrowser.SAVE_LABEL = Messages.getString( "saveLabel" );
/*static*/RepositoryBrowser.OPEN_LABEL = Messages.getString( "openLabel" );
/*static*/RepositoryBrowser.ROOT_PATH = "/";
/*static*/RepositoryBrowser.SAVE_MODE = 0;
/*static*/RepositoryBrowser.OPEN_MODE = 1;


RepositoryBrowser.prototype.handleSaveAsTextFocus = function( evt )
{
  this.saveAsNameInputText.select();
  this.handleSaveAsTextKeyUp( evt );
};
RepositoryBrowser.prototype.handleSaveAsTextKeyUp = function( evt )
{
  if ( !StringUtils.isEmpty( this.saveAsNameInputText.value ) )
  {
    this.showSave();
  }
  this.tryToEnableSaveBtn();
};

RepositoryBrowser.prototype.initText = function()
{
	// element id, message key
	Messages.setElementText("saveDlgSaveAsPrompt", "saveDlgSaveAsPrompt");
	Messages.setElementText("saveDlgWherePrompt", "saveDlgWherePrompt");
	Messages.setElementText("saveDlgSelectSltnTitle", "saveDlgSelectSltnTitle");
	Messages.setElementText("saveDlgOutputTypeTitle", "saveDlgOutputTypeTitle");
}

RepositoryBrowser.prototype.pathDataInStack = function( pathData )
{
  for ( var ii=0; ii<this.pathDataStack.length; ++ii )
  {
    if ( this.pathDataStack[ ii ] == pathData )
    {
      return true;
    }
  }
  return false;
}
/**
 * NOTE: the algorithm used in this method takes advantage of the fact that
 * only one path element is added to the path at a time ( "/a" can only become "/a/b" )
 * or 0-n path elements can be removed at a time 
 * ( "/a/b/c" can become "/", "/a", "/a/b", or "/a/b/c"
 * 
 * @param pathData Object with properties: path, isDir, name
 * 		path String specifying full path to object
 * 		isDir boolean true if the path is a directory, else false
 * 		name String the right-most component of path
 */
RepositoryBrowser.prototype.setCurrDir = function( pathData )
{
  var bIsInStack = this.pathDataInStack( pathData );
  if ( bIsInStack )
  {
    while ( this.pathDataStack[ this.pathDataStack.length-1 ] != pathData )
    {
      this.pathDataStack.pop();
    }
  }
  else
  {
    this.pathDataStack.push( pathData );
  }
	this.setComboContent();	  
	this.showSave();
	
	this.onFolderChangeHandler( pathData.solution, pathData.path );
};

RepositoryBrowser.prototype.loadListCtrl = function( children )
{
	this.setListCtrlContent( children );
	if ( this.solutionFolderList.getLength() > 0 )
	{
	  this.solutionFolderList.getRoot().scrollTop = 0;
	}
}
/**
 * @param reRepositoryBrowserFilter RegularExpression a regular expression identifying
 * which folders to NOT show in the browsers list
 */
RepositoryBrowser.prototype.setRepositoryBrowserFilter = function( reRepositoryBrowserFilter )
{
	this.reRepositoryBrowserFilter = reRepositoryBrowserFilter;
}

RepositoryBrowser.prototype.goUpOneDir = function()
{
	if ( this.pathDataStack.length > 1 )
	{
	  var pathData = this.pathDataStack[ this.pathDataStack.length-2 ];
		this.setCurrDir( pathData );
	}
}

RepositoryBrowser.prototype.setListCtrlContent = function( children )
{
	this.solutionFolderList.removeAll();

	for ( var idx=0; idx<children.length; ++idx )
	{
		var child = children[ idx ];
		var iconFilename = child.isDir ? RepositoryBrowser.FOLDER_CLOSED_IMG_FILENAME : RepositoryBrowser.FILE_IMG_FILENAME;
		var html = RepositoryBrowser.createListHtml( child.displayName, child.description, iconFilename, "0em" );
		this.solutionFolderList.addItem( html,
			undefined, undefined, child );
	}
  this.setWaitCursor( false );
}
// TODO sbarkdull, some of this functionality ?? belongs in the RBController

// fullPath, pathSegmentName
RepositoryBrowser.prototype.createComboContentItem = function( pathData, idx/*itemNum*/ )
{
	var div = document.createElement( "div" );
	var paddingLeft = "" + ( idx * RepositoryBrowser.TREE_INDENT_EM ) + "em";
	div.style.paddingLeft = paddingLeft;
	div.className = 'itemNormal';
	var localThis = this;
	div.onmouseover = function() 
	{ 
		this.className = 'itemHilight';
	};
	div.onmouseout = function() 
	{ 
		this.className = 'itemNormal';
	};
	div.onclick = 
		function()
		{
  		this.className = 'itemNormal';
  		localThis.comboCtrl.pickListCtrl.hide();
  		localThis.setCurrDir( pathData );
		};

	div.innerHTML = RepositoryBrowser.createListHtml( pathData.displayName, pathData.description,
		RepositoryBrowser.FOLDER_CLOSED_IMG_FILENAME, paddingLeft );
	return div;
}

/**
 * Set the list of items in the combobox, and the current value in
 * the combobox. The values come from the data stored in this.pathDataStack
 */
/*private*/RepositoryBrowser.prototype.setComboContent = function()
{
	var outerDiv = document.createElement( "div" );

	for ( var idx=0; idx<this.pathDataStack.length; ++idx )
	{
	  var pathData = this.pathDataStack[ idx ];
    var div = this.createComboContentItem( pathData, idx );
    outerDiv.appendChild( div );
	}
	
	var pathData = this.pathDataStack[ this.pathDataStack.length-1 ];
	this.comboCtrl.setValue( { text: pathData.displayName, data: pathData },
    RepositoryBrowser.FOLDER_CLOSED_IMG_FILENAME );
	this.comboCtrl.setListContentAsElem( outerDiv );
}

/**
 * Get a string containing the xml for an item in the RepositoryBrowser's
 * list of folders/files.
 * 
 * @param text String text to display in the list item
 * @param hoverText String hover text for the list item
 * @param imgFilename String the image filename to display to the left of the text
 * @param paddingLeft String left padding specification consistent with requirements
 * for the left-padding style in css
 * @return String containing the xml for an item in the RepositoryBrowser's
 * list of folders/files
 */
/*static*/RepositoryBrowser.createListHtml = function( text, hoverText, imgFilename, paddingLeft )
{
  var hoverText = XmlUtil.escapeXmlAttr( hoverText );
	return "<span title='" + hoverText
    + "' style='padding-left:" + paddingLeft + ";'><img style='vertical-align:middle;padding-right:"
		+ RepositoryBrowser.IMG_PADDING_RIGHT 
		+ ";' src='" + XmlUtil.escapeXmlAttr( imgFilename ) + "'/></span><span title='" + hoverText + "'>" 
		+ text + "</span>";
}

/**
 * Force the SolutionRepository (this.repository) to reload the information it has
 * about the current directory (top item of this.pathDataStack). It is useful to call this method
 * when you know that the contents of the current directory have changed on the
 * server, for instance, when we have just written a new file to the 
 * directory, or deleted a file from the directory.
 */
/*private*/RepositoryBrowser.prototype.forceCurrDirReload = function()
{
	var pathData = this.pathDataStack[ this.pathDataStack.length-1 ];
	this.setCurrDir( pathData );
};

RepositoryBrowser.prototype.show = function()
{
	this.forceCurrDirReload();
	
	this.modalDiv.style.display = "block";
	this.modalDiv.style.width = "100%";
	this.modalDiv.style.height = "100%";
	
	this.dialogDiv.style.display = "block";
	this.saveAsNameInputText.focus();

	//hide all select tags for ie6 only
	// TODO sbarkdull, this code (the if statement) is likely obsolete since we don't support IE6
	if( document.body.style.maxHeight == undefined ) {
		// set the number of 'contentX' divs ex: content1 content2 content3 etc
		// TODO, may need to be smarter and remember the ones we hid vs ones that were already hiddenh
		var numContentDivs = "4";
		for(var d = 0; d < numContentDivs; ++d) {
			var contentDiv = document.getElementById("content" + (d));
			var selectElems = contentDiv.getElementsByTagName("select");
			for(var s = 0; s < selectElems.length; ++s) {
				var selectElem = selectElems[s];
				selectElem.style.visibility = "hidden";
			}
		}
	}
}

RepositoryBrowser.prototype.hide = function()
{
	this.modalDiv.style.display = "none";
	this.modalDiv.style.width = "0px";
	this.modalDiv.style.height = "0px";
	
	this.dialogDiv.style.display = "none";
	
	
	//show all select tags for ie6 only
	// TODO sbarkdull, needs work
	if ( false )
	{
		if(typeof document.body.style.maxHeight == "undefined") {
			// set the number of 'contentX' divs ex: content1 content2 content3 etc
			var numContentDivs = "4";
			for(var d = 0; d < numContentDivs; ++d) {
				var thisdiv = document.getElementById("content" + (d));
				var selecttags = thisdiv.getElementsByTagName("select");
				for(var s = 0; s < selecttags.length; ++s) {
					var thisSelect = selecttags[s];
					thisSelect.style.visibility = "visible";
				}
			}
		}
	}
}
RepositoryBrowser.LOADING_ID = "loadingId";
RepositoryBrowser.prototype.handleOpen = function()
{
	var items = this.solutionFolderList.getSelectedItems();
	var item = items[0];
	
	if ( item.id == RepositoryBrowser.LOADING_ID )
	{
		// if the user double clicked or clicked "open" on the "Loading..."
		// message, there is nothing to do, return early.
		return;
	}
  this.setWaitCursor( true );
	this.solutionFolderList.removeAll();
	this.solutionFolderList.addItem( Messages.getString("loadingProgressMsg"),
			RepositoryBrowser.LOADING_ID, undefined, undefined );
			
	this.setCurrDir( item.itemData );
}

RepositoryBrowser.prototype.setWaitCursor = function( on )
{
	//skip if embedded
	if(this.modalDiv == null)
		return;
		
  var cursor = on ? "wait" : "";
  UIUtil.setCursor( this.modalDiv, cursor );
}

RepositoryBrowser.prototype.handleSave = function()
{
	if ( undefined != this.onSaveHandler )
	{
		var success;
		if ( this.onSaveHandlerObj )
		{
			success = this.onSaveHandler.call( this.onSaveHandlerObj );
		}
		else
		{
			success = this.onSaveHandler( this );
		}
	}
	if ( success )
	{
		this.hide();
	}
}
RepositoryBrowser.prototype.handleCancel = function()
{
	if ( undefined != this.onCancelHandler )
	{
		if ( this.onCancelHandlerObj )
		{
			this.onCancelHandler.call( this.onCancelHandlerObj );
		}
		else
		{
			this.onCancelHandler( this );
		}
	}
	this.hide();
}

/**
 * @return String the name of the string in the "Save as..." text box
 */
RepositoryBrowser.prototype.getSaveAsName = function()
{
	return this.saveAsNameInputText.value;
};

/**
 * Returns the the display name of the item currently 
 * selected in the control.
 * 
 * NOTE: getSelectedDisplayName and getSaveAsName will return
 * the same string when the user has not modified the contents
 * of the file name text field.
 */
RepositoryBrowser.prototype.getSelectedDisplayName = function()
{
  var fileInfo = this.getSelectedFileInfo();
  return fileInfo != null ? fileInfo.displayName : null;
};

/**
 * Returns the filename of the item currently selected in the 
 * list. This may or may not be the same as selectedDisplayName
 */
RepositoryBrowser.prototype.getSelectedFilename = function()
{
  var fileInfo = this.getSelectedFileInfo();
  return fileInfo != null ? fileInfo.name : null;
};

/**
 * returns information about the currently selected item. For a folder
 * it returns an object with these properties:
 * { solution, path, isDir,
    name, description, displayName }
    * 
 * for a file it returns an object with these properties:
 * { solution, path, isDir,
      name, description, displayName }
 */
RepositoryBrowser.prototype.getSelectedFileInfo = function()
{
  if ( this.solutionFolderList.getNumSelectedItems() > 0 )
  {
    var items = this.solutionFolderList.getSelectedItems();
    return items[0].itemData;
  }
  else
  {
    return null;
  }
};

/**
 * @param Object with properties:
 * path, isDir, name, description, displayName
 */
/*private*/RepositoryBrowser.prototype.setSaveAsName = function( saveAsName )
{
	this.saveAsNameInputText.value = saveAsName;
}

/**
 * @returns String the solution name (eg samples)
 */
RepositoryBrowser.prototype.getSolutionName = function()
{
	var solutionName = null;
	if ( this.pathDataStack.length > 0 )
	{
    var pathData = this.pathDataStack[ this.pathDataStack.length-1 ];
		return pathData.solution;
	}
	else
	{
		throw new Error( Messages.getString( "INVALID_REPOSITORY_BROWSER_STATE" ) );
	}
}

/**
 * get the solution repository relative path: if pathData on the
 * top of the pathDataStack is:
 * /Samples/subSolution, return "/subSolution".
 * /a/b/c, return /b/c
 */
RepositoryBrowser.prototype.getPath = function()
{
	var path = null;
	if ( this.pathDataStack.length > 0 )
	{
    var currPathData = this.pathDataStack[ this.pathDataStack.length-1 ];
		return currPathData.path;
	}
	else
	{
		throw new Error( Messages.getString( "INVALID_REPOSITORY_BROWSER_STATE" ) );
	}
}
/*
RepositoryBrowser.selectPath = function( solution, path ) 
{
	document.getElementById('browser.solutionPath').value =  solution + "/" + path ;	
}
*/
RepositoryBrowser.prototype.setOnSaveHandler = function( handler, handlerObj )
{
	this.onSaveHandler = handler;
	this.onSaveHandlerObj = handlerObj;
}
RepositoryBrowser.prototype.setOnCancelHandler = function( handler, handlerObj )
{
	this.onCancelHandler = handler;
	this.onCancelHandlerObj = handlerObj;
};

RepositoryBrowser.prototype.tryToEnableSaveBtn = function()
{
	var bInOpenMode = this.getMode() == RepositoryBrowser.OPEN_MODE;
	if ( bInOpenMode )
	{
		this.openBtn.setEnabled( this.solutionFolderList.getNumSelectedItems() > 0 );
	}
	else
	{
		var bIsEmpty = StringUtils.isEmpty( this.saveAsNameInputText.value );
		var pathData = this.pathDataStack[ this.pathDataStack.length-1 ];
		var bInRootFolder = StringUtils.isEmpty( pathData.solution );
		this.saveBtn.setEnabled( !bIsEmpty && !bInRootFolder );
	}
};

RepositoryBrowser.prototype.getMode = function()
{
	return this.saveBtn.getRoot().style.display == "block"
		? RepositoryBrowser.SAVE_MODE
		: RepositoryBrowser.OPEN_MODE;
}

/*private*/RepositoryBrowser.prototype.showSave = function()
{
	this.saveBtn.getRoot().style.display = "block";
	this.openBtn.getRoot().style.display = "none";
}
/*private*/RepositoryBrowser.prototype.showOpen = function()
{
	this.saveBtn.getRoot().style.display = "none";
	this.openBtn.getRoot().style.display = "block";
};

RepositoryBrowser.prototype.enableSaveAsNameTextCtrl = function( enabled )
{
  this.saveAsNameInputText.disabled = !enabled;
};