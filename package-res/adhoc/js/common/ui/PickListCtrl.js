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
 * @param inputId String id of element that the pick list is supposed to be
 * displayed below
 * @param btnId String (optional) id of element whose mousedown event causes
 * PickListCtrl.show() to be called.
 */
PickListCtrl = function( inputId, btnId )
{
	HTMLCtrl.call( this, "div" );
	this.inputId = inputId;
	if ( btnId ) this.btnId = btnId;
	
	var div = this.getRoot();
	div.id = "PickListDiv";
	div.className = "pickList";
	div.style.display = "none";
	
	var localThis = this;
	div.onkeypress = function()
	{
		var event = UIUtil.getEvent( arguments );
		var keyCode = event.keyCode;
		switch ( keyCode )
		{
			case UIUtil.ESC_KEY:
				localThis.hide();
				break;
		}
	};
	div.onclick = function()
	{
		localThis.hide();
	};
	
	div.innerHTML = PickListCtrl.LOADING_MESSAGE;
}
PickListCtrl.prototype = new HTMLCtrl();

PickListCtrl.LOADING_MESSAGE = Messages.getString("loadingProgressMsg");
PickListCtrl.MAX_NUM_ROWS = 8;
PickListCtrl.prototype.show = function()
{
	//window.status = "pre show";
	var pickListRootElem = this.root;
	var localThis = this;
	this.myHandleHide =
		function()
		{
			var event = UIUtil.getEvent( arguments );
			localThis.handleHide( event );
		};

	var inputElem = document.getElementById( this.inputId );
	var coord = UIUtil.getElemOffset( inputElem );
	coord.top += inputElem.offsetHeight;
	pickListRootElem.style.left = "" + coord.left + "px";
	pickListRootElem.style.top = "" + coord.top + "px";
	pickListRootElem.style.width = "" + inputElem.clientWidth + "px";
	var numRows = Math.min( PickListCtrl.MAX_NUM_ROWS, this.getNumItems());
	pickListRootElem.style.height = ( numRows * 1.25) + "em";
	
	if ( this.onShowCallback )
	{
		this.onShowCallback.call( this );
	}
	pickListRootElem.style.display = "block";
	pickListRootElem.focus();
	
	//window.status = "finish show";
	UIUtil.addEvent( document, "mousedown", this.myHandleHide	);
}
PickListCtrl.prototype.getNumItems = function()
{
  return this.getRoot().childNodes[ 0 ].childNodes.length;
}

PickListCtrl.prototype.setOnShowCallback = function( callback )
{
	this.onShowCallback = callback;
}

PickListCtrl.prototype.hide = function()
{
	var div = this.root;
	div.style.display = "none";
	UIUtil.removeEvent(document, "mousedown", this.myHandleHide	);
}

PickListCtrl.prototype.setContentAsCtrl = function( ctrl )
{
	UIUtil.removeAllChildren( this.root );
	this.root.appendChild( ctrl.getRoot() );
}

PickListCtrl.prototype.setContentAsHtml = function( html )
{
	this.root.innerHTML = html;
}

PickListCtrl.prototype.setContentAsElem = function( elem )
{
	UIUtil.removeAllChildren( this.root );
	this.root.appendChild( elem );
}











PickListCtrl.prototype.handleHide = function( event )
{
	var srcElem = UIUtil.getSourceElement( event );

/*
TODO sbarkdull clean

	var btn = document.getElementById( this.inputId );
	var childOfPickList = this.isChildElemOfPickList( srcElem );
	var childOfBtn = UIUtil.elemIsChildOfElem( srcElem, btn );
	var clickedInPickListOrBtn = childOfPickList || childOfBtn;

	if ( !clickedInPickListOrBtn )
*/
	var isChildOfBtn = false;
	if (this.btnId)
	{
		var btn = document.getElementById( this.btnId );
		isChildOfBtn = UIUtil.elemIsChildOfElem( srcElem, btn );
	}
	if ( !this.isChildElemOfPickList( srcElem ) && !isChildOfBtn )
	{
		// click was outside the picklist
		this.hide();
	}
	//window.status = "hiding";
}
PickListCtrl.prototype.isChildElemOfPickList = function( elem )
{
	window.status = "is child " + UIUtil.elemIsChildOfElem( elem, this.getRoot() );
	return UIUtil.elemIsChildOfElem( elem, this.getRoot() );
}
PickListCtrl.prototype.isOpen = function()
{
	return this.root.style.display != "none";
}
// TODO sbarkdull, these 2 methods may belong in HTMLCtrl
PickListCtrl.prototype.focus = function()
{
	this.root.focus();
}
PickListCtrl.prototype.blur = function()
{
	this.root.blur();
}