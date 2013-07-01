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
 * Consists of an "Add" button and and EditableListCtrl
 * 
 * TODO: maybe we dont expose the list control, but provide an addItem method to this class
 */
ColumnSorterCtrl = function( id, className )
{
	EditableListCtrl.call( this, id, className, true, 3 );
	this.constructor = ColumnSorterCtrl;
	var localThis = this;
	
	this.getListCtrl().setDefaultSelectedItemClassName( "selectedItem" );
	// TODO sbarkdull internationalize
	this.getListCtrl().addHeaderItem( [Messages.getString( "columnLabel" ), Messages.getString( "tableLabel" ), 
		Messages.getString( "ascLabelUpper" ) + "/" + Messages.getString( "descLabelUpper" ) ] );
	
	this.addBtn = new ButtonCtrl( "Add" );
	this.addExtraCtrl( this.addBtn );
	
	this.addBtn.setOnClickCallback( function()
		{
			if ( localThis.onAddCallback )
			{
				localThis.onAddCallback();
			}
		} );
}
ColumnSorterCtrl.prototype = new EditableListCtrl();

/*
ColumnSorterCtrl.prototype.getAddBtn = function()
{
	return this.addBtn;
}
*/

ColumnSorterCtrl.prototype.setOnAddCallback = function( onAddCallback )
{
	this.onAddCallback = onAddCallback;
}

ColumnSorterCtrl.prototype.addItem = function( itemAr )
{
	this.getListCtrl().addItem( itemAr );
}

ColumnSorterCtrl.prototype.setAddEnabled = function( bEnabled )
{
	this.addBtn.setEnabled( bEnabled );
}

/**
 * @return boolean
 */
ColumnSorterCtrl.prototype.hasColumn = function( tableId, columnId )
{
	var listCtrl = this.getListCtrl();
	var numItems = listCtrl.getLength();
	for (var ii=0; ii<numItems; ++ii )
	{
		var trElem = listCtrl.getItem( ii );
		var item = trElem.itemData;	/*item should be RSDetailItem or RSGroupItem*/
		if ( ( item.getBVItem().tableId == tableId ) && ( item.getBVItem().columnId == columnId ) )
		{
			return true;
		}
	}
	return false;
}

ColumnSorterCtrl.prototype.getColumnSortOrder = function( idx )
{
	var listCtrl = this.getListCtrl();
	var tr = listCtrl.getItem( idx );
	// select control is the first (0) child of the 3rd (2) td
	var select = tr.childNodes[ 2 ].childNodes[ 0 ];
	return select.value;
}