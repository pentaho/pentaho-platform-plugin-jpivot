/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


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
