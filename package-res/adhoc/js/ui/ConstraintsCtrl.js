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
 * Consists of 0 or more ColumnConstraintsCtrl-s, and add and delete buttons
 */
ConstraintsCtrl = function( id )
{
	HTMLCtrl.call( this, "div" );
	this.constructor = ConstraintsCtrl;
	var div = this.getRoot();
	if ( id ) div.id = id;
	//div.style.backgroundColor = "orange";
	
	var table = document.createElement( "table" );
	table.border="0px"; 
	table.cellspacing="0"; 
	table.cellpadding="0";
	this.root.appendChild( table );
	
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	// first row ----------------------------------
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	var td = document.createElement( "td" );
	tr.appendChild( td );
	var btn = new ButtonCtrl( Messages.getString("addConstraintBtnTxt") );
	td.appendChild( btn.getRoot() );
	btn.getRoot().title = Messages.getString( "addConstraintsBtnHoverTxt" );
	btn.setOnClickCallback( this.handleAddBtnClick, this );
	this.addBtn = btn;
	
	td = document.createElement( "td" );
	td.align = "right";
	tr.appendChild( td );
    
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_delete.png";
	img.alt = "X";
	img.title = Messages.getString("deleteFromFilters");
    
	var ctrl = new ButtonCtrl( img, ButtonCtrl.SMALL );
	ctrl.getRoot().title = Messages.getString( "deleteConstraintsBtnHoverTxt" );
	td.appendChild( ctrl.getRoot() );
	
	ctrl.setOnClickCallback( this.handleDeleteCheckedConstraints, this );
	
	// second row ----------------------------------
	tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	
	td = document.createElement( "td" );
	tr.appendChild( td );
	td.colSpan = "2";
	
	// div will contain the table with list of constraint items
	var div = document.createElement( "div" );
	td.appendChild( div );
	div.id = id + "Inner";
	div.style.overflowX = "auto";
	div.style.overflowY = "auto";
	//div.style.backgroundColor = "purple";
	
	// constraints table
	table = document.createElement( "table" );
	table.border="0px"; 
	table.cellspacing="0"; 
	table.cellpadding="0";
	div.appendChild( table );
	
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	this.constraintsTBody = tbody;
	
	this.columnConstraintsMap = new Object();
}
ConstraintsCtrl.prototype = new HTMLCtrl();

ConstraintsCtrl.prototype.handleAddBtnClick = function( event )
{
	if ( this.onAddCallback )
	{
		this.onAddCallback();
	}
}

/**
 * 
 * @param modelId
 * @param viewId
 * @param tableId
 * @param item RSDetailItem, RSGroupItem, RSFilterItem
 * @param operator String (And,Or)
 * @param comparator String condition (=,<>,>=, etc)
 * @param condition String operand for comparison
 * @param comparatorAr Array of String where each element is a comparator
 * (typically one of the values from BVItem.COMPARATOR_MAP)
 * @param constraintHelperClassObj one of CalendarAdapter, ColumnValuePickList,
 * 	or DBSearcher
 * @param bTextReadOnly boolean if true, set the text sub-control to readonly mode
 */
ConstraintsCtrl.prototype.addConstraint = function( modelId, viewId, tableId, columnId, columnName, 
	operator, comparator, condition, comparatorAr, constraintHelperClassObj, bTextReadOnly )
{
	var columnConstraints = this.columnConstraintsMap[ columnId ];
	if ( !columnConstraints )
	{
		var tr = document.createElement( "tr" );
		this.constraintsTBody.appendChild( tr );
		
		var td = document.createElement( "td" );
		tr.appendChild( td );
		
		columnConstraints = new ColumnConstraintsCtrl( comparatorAr, constraintHelperClassObj );
		td.appendChild( columnConstraints.getRoot() );
		
		this.columnConstraintsMap[ columnId ] = columnConstraints;
	}
	// TODO sbarkdull, check for type of ColumnValuePickList, it is the only one that really needs the data, the other types can use null
	var constraintHelperData = {
		modelId: modelId,
		viewId: viewId,
		tableId: tableId,
		columnId: columnId,
		columnName: columnName
	};
	columnConstraints.addConstraintCtrl( operator, columnName, comparator, condition,
		constraintHelperClassObj, constraintHelperData, bTextReadOnly );
}
ConstraintsCtrl.prototype.handleDeleteCheckedConstraints = function( event )
{
	this.deleteCheckedConstraints();
}
ConstraintsCtrl.prototype.deleteCheckedConstraints = function()
{
	for ( var columnId in this.columnConstraintsMap )
	{
		var columnConstraints = this.columnConstraintsMap[ columnId ];
		columnConstraints.deleteCheckedConstraints();
		
		if ( columnConstraints.getLength() == 0 )
		{
			this.deleteColumnConstraintsCtrl( columnId );
		}
	}
}
/**
 * @param columnId String id of the column whose columnConstraintCtrl is to be deleted
 * 	it must be a valid key in the columnConstraintsMap
 */
ConstraintsCtrl.prototype.deleteColumnConstraintsCtrl = function( columnId )
{
	var columnConstraints = this.columnConstraintsMap[ columnId ];
	var tr = columnConstraints.getRoot().parentNode.parentNode;
	var tbody = tr.parentNode;
	tbody.removeChild( tr );
	
	delete this.columnConstraintsMap[ columnId ];
}
ConstraintsCtrl.prototype.removeAllConstraints = function()
{	
	for ( var columnId in this.columnConstraintsMap )
	{
		this.deleteColumnConstraintsCtrl( columnId );
	}
}

/**
 * return an array of columnIds, which are the columnIds of the columns in the control.
 */
ConstraintsCtrl.prototype.getColumnIdList = function()
{
	var columnIdList = new Array();
	
	for ( var columnId in this.columnConstraintsMap )
	{
		columnIdList.push( columnId );
	}
	
	return columnIdList;
}
/**
 * @return ColumnConstraintCtrl associated with columnId
 */
ConstraintsCtrl.prototype.getColumnConstraintCtrl = function( columnId )
{
	return this.columnConstraintsMap[ columnId ];
}
/**
 * Set a callback function that will get called when the user clicks on the "add" button control
 * 
 * @param function a callback function
 */
ConstraintsCtrl.prototype.setOnAddCallback = function( callback )
{
	this.onAddCallback = callback;
}
ConstraintsCtrl.prototype.getAddBtn = function()
{
	return this.addBtn;
}