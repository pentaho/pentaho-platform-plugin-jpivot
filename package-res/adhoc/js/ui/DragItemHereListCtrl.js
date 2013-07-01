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

DragItemHereListCtrl = function( id, className, selectStyle )
{
	ListCtrl.apply( this, arguments );
	this.constructor = DragItemHereListCtrl;
	
	this.insertLabel = document.createElement( "div" );
	this.insertLabel.className = "dragHereItem";
	this.insertLabel.innerHTML = DragItemHereListCtrl.INSERT_LABEL;
	//this.insertLabel.id = DragItemHereListCtrl.counter + "Id";
	//DragItemHereListCtrl.counter++;
	this.getRoot().appendChild( this.insertLabel );
	this.showInsertLabel( true );
}
DragItemHereListCtrl.prototype = new ListCtrl();

//DragItemHereListCtrl.counter = 0; // currently only used in debugging

DragItemHereListCtrl.INSERT_LABEL = Messages.getString("dragHereMsg");

/*DragItemHereListCtrl.prototype.addItem = function( itemText, id, position, itemData, unselectedClassName, selectedClassName )
{
	if ( this.getLength() == 0 )
	{
		this.showInsertLabel( false );
	}
	ListCtrl.prototype.addItem.apply( this, arguments );
}*/

DragItemHereListCtrl.prototype.internalInsertItem = function( trElem, position )
{	
	if ( this.getLength() == 0 )
	{
		this.showInsertLabel( false );
	}
	ListCtrl.prototype.internalInsertItem.apply( this, arguments );
}
DragItemHereListCtrl.prototype.internalRemoveItem = function( position )
{
	var trElem = ListCtrl.prototype.internalRemoveItem.apply( this, arguments );
	if ( this.getLength() == 0 )
	{
		this.showInsertLabel( true );
	}
	return trElem;
}
/*private*/
DragItemHereListCtrl.prototype.showInsertLabel = function( bShow )
{
	this.insertLabel.style.display = bShow ? "inline" : "none";
}