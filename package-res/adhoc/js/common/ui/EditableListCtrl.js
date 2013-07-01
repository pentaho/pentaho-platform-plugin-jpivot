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
 * EditableListCtrl aggregates a list control with an up,down, and delete button
 * (aka ListEditorButtonsCtrl).
 */
EditableListCtrl = function( id, className, isSingleSelect, numColumns )
{
	HTMLCtrl.call( this, "table" );
	this.constructor = EditableListCtrl;
	this.table = this.getRoot();
	var localThis = this;
	
	this.table.cellSpacing = "0px";
	this.table.cellPadding = "0px";
	this.table.border = "0px";
	this.table.style.borderColor = "red";
	
	var tbody = document.createElement( "tbody" );
	this.table.appendChild( tbody );
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	this.btnsContainerElem = tr;
	
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.align = "left";
	this.extraCtrlTd = td;
	td = document.createElement( "td" );
	tr.appendChild( td );
	td.align = "right";
	
	this.btnsCtrl = new ListEditorButtonsCtrl();
	td.appendChild( this.btnsCtrl.getRoot() );
	
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.colSpan = "2";
	
	this.listCtrl = new ListCtrl( id + EditableListCtrl.LIST_DIV_ID_SUFFIX, className, ListCtrl.MULTI_SELECT, numColumns );
	this.listCtrl.setDefaultSelectedItemClassName( "selectedItem" );
	//TODO sbarkdull, don't hard code!!
	//this.listCtrl.getRoot().style.height = "200px";

	this.btnsCtrl.setOnUpClickCallback( 
		function()
		{
			localThis.handleMoveUp();
		} );
	this.btnsCtrl.setOnDownClickCallback(
		function()
		{
			localThis.handleMoveDown();
		} );
	this.btnsCtrl.setOnDeleteClickCallback(
		function()
		{
			localThis.handleDelete();
		} );

	td.appendChild( this.listCtrl.getRoot() );
}
EditableListCtrl.prototype = new HTMLCtrl();

/*static*/EditableListCtrl.LIST_DIV_ID_SUFFIX = "ListDiv";
/*private*/EditableListCtrl.prototype.handleMoveUp = function()
{
	this.listCtrl.moveSelectedItemsUp();
}

/*private*/EditableListCtrl.prototype.handleMoveDown = function()
{
	this.listCtrl.moveSelectedItemsDown();
}

/*private*/EditableListCtrl.prototype.handleDelete = function()
{
	this.listCtrl.removeSelectedItems();
	if ( this.onDeleteCallback )
	{
		this.onDeleteCallback();
	}
}

EditableListCtrl.prototype.addExtraCtrl = function( ctrl )
{
	this.extraCtrlTd.appendChild( ctrl.getRoot() );
}

EditableListCtrl.prototype.getListCtrl = function()
{
	return this.listCtrl;
}

EditableListCtrl.prototype.setOnDeleteCallback = function( onDeleteCallback )
{
	this.onDeleteCallback = onDeleteCallback;
}

EditableListCtrl.prototype.setEditBtnsEnabled = function( bEnable )
{
	this.btnsCtrl.upBtnCtrl.setEnabled( bEnable );
	this.btnsCtrl.downBtnCtrl.setEnabled( bEnable );
	this.btnsCtrl.deleteBtnCtrl.setEnabled( bEnable );
}
EditableListCtrl.prototype.setMoveUpBtnEnabled = function( bEnable )
{
	this.btnsCtrl.upBtnCtrl.setEnabled( bEnable );
}
EditableListCtrl.prototype.setMoveDownBtnEnabled = function( bEnable )
{
	this.btnsCtrl.downBtnCtrl.setEnabled( bEnable );
}
EditableListCtrl.prototype.setDeleteBtnEnabled = function( bEnable )
{
	this.btnsCtrl.deleteBtnCtrl.setEnabled( bEnable );
}

