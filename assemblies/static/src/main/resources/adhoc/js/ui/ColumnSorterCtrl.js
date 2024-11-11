/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2028-08-13
 ******************************************************************************/


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
