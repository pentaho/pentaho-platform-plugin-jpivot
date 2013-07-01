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
 * @param operator String (And,Or)
 * @param columnName String column name for comparison
 * @param comparator String comparison operator (=,<>,>=, etc)
 * @param condition String operand for comparison * 
 * @param comparatorAr Array of String where each element is a comparator
 * (typically one of the values from BVItem.COMPARATOR_MAP)
 * @param showSearchIcon boolean set to true to show the search icon, else false
 * @param bTextReadOnly boolean if true the text control should be read only, 
 * otherwise it is editable
 */
ConstraintCtrl = function( operator, columnName, comparator, condition, 
	comparatorAr, showSearchIcon, bTextReadOnly )
{
	HTMLCtrl.call( this, "tr" );
	var tr = this.getRoot();
	
	// ctrl 1 logicalOperator select
	var td = document.createElement( "td" );
	tr.appendChild( td );
	var select = this.createLogicalElem();
	if ( operator != undefined )
	{
		select.value = operator;		// -------------------------
	}
	td.appendChild( select );
	tr.logicalSelect = select;
	
	// ctrl 2 column namme
	td = document.createElement( "td" );
	tr.appendChild( td );
	td.innerHTML = columnName;
	td.style.width = "25ex";
	td.style.align = "right";
	
	// ctrl 3 comparator select
	td = document.createElement( "td" );
	tr.appendChild( td );
	select = this.createComparisonElem( comparatorAr );
  
	td.appendChild( select );
	
	// ctrl 4 user value
	td = document.createElement( "td" );
	tr.appendChild( td );
	textInput = document.createElement( "input" );
	textInput.onfocus = function() { this.select();};
	td.appendChild( textInput );

  //Hook up check for comparators that don't need a right-hand value
  select.onchange = function(){
    if(BVItem.SINGLE_COMPARATORS[this.value]){
      //no right-hand value needed
      textInput.disabled = true;
    } else {
      textInput.disabled = false;
    }
  };
  
	if ( comparator != undefined )
	{
		select.value = comparator;		// -------------------------
    //Check to see if the comparator doesn't need a right-hand value
    if(BVItem.SINGLE_COMPARATORS[select.value]){
      //no right-hand value needed
      textInput.disabled = true;
    } else {
      textInput.disabled = false;
    }
	}
	
	textInput.type = "text";
	textInput.readOnly = bTextReadOnly;
	if ( bTextReadOnly )
	{
		textInput.style.backgroundColor = "#EEEEEE";
	}
	if ( condition != undefined )
	{
		textInput.value = condition;
	}
	textInput.id = "INPUT_TEXT_ID" + ConstraintCtrl.uniqueNum;
	this.textInput = textInput;	// magic
	
	// ctrl 5 search
	td = document.createElement( "td" );
	td.align = "right";
	tr.appendChild( td );

	if ( showSearchIcon )
	{
		var img = document.createElement( "img" );
		td.appendChild( img );
		img.className = "searchImg";
		img.src = UIUtil.getImageFolderPath() + "btn_search_active.png";
		img.title = Messages.getString("searchTooltip");
		
		img.id = "IMG_ID" + ConstraintCtrl.uniqueNum;
		
		img.ctrl = this;		// magic
		this.imgElem = img;	// magic
	}
	else
	{
		td.style.height = "20px";
		td.style.width = "20px";
	}
	
	// ctrl 6 checkbox
	var td = document.createElement( "td" );
	tr.appendChild( td );
	var inputCb = document.createElement( "input" );
	inputCb.type="checkbox";
	tr.inputCb = inputCb;
	td.appendChild( inputCb );
	
	ConstraintCtrl.uniqueNum++;
}
ConstraintCtrl.prototype = new HTMLCtrl();
ConstraintCtrl.uniqueNum = 69;

/**
 * NOTE: columnName is likely already known by the client, and never used, consider removing it from the interface
 * @return Object with properties:
 * 	logicalOperator: and/or
 * 	columnName: the column's name
 * 	comparator: <,>,=,>=, etc
 * 	compareValue: value in the text box to compare the column with
 */
ConstraintCtrl.prototype.getValue = function()
{
	var tr = this.getRoot();
	var val = new Object();
	var tds = tr.cells;
	
	val.logicalOperator = tds[0].childNodes.item(0).value;	//and, or
	val.columnName = tds[1].innerText;
	val.comparator = tds[2].childNodes.item(0).value;	//=,<>,>=, etc
	val.compareValue = tds[3].childNodes.item(0).value;	//value in text box
	
	return val;
}
	
/**
 * @param constraintHelperClassObj one of CalendarAdapter, ColumnValuePickList,
 * 	or DBSearcher
 * @param constraintHelperData Object with properties:  modelId, viewId, columnId
 */
ConstraintCtrl.prototype.setConstraintHelper = function( constraintHelperClassObj, constraintHelperData )
{
	var obj = new constraintHelperClassObj( this.imgElem.id, this.textInput.id, constraintHelperData );
}

ConstraintCtrl.prototype.isChecked = function()
{
	return this.getRoot().inputCb.checked;
}

/**
 * @param comparatorAr Array of String where each element is a comparator
 * (typically one of the values from BVItem.COMPARATOR_MAP)
 */
/*private*/ConstraintCtrl.prototype.createComparisonElem = function( comparatorAr )
{
	return UIUtil.createSelectElem( comparatorAr, comparatorAr );
}

/*private*/
ConstraintCtrl.prototype.createLogicalElem = function()
{
	var values = [ "AND", "OR", "AND_NOT", "OR_NOT" ];
	return UIUtil.createSelectElem( values, values );
}

ConstraintCtrl.prototype.showLogicalSelect = function( bShow )
{
	var tr = this.getRoot();
	var select = tr.logicalSelect;
	select.style.visibility = bShow ? "visible" : "hidden";
}

ConstraintCtrl.prototype.setValidStatus = function( bIsValid, reason )
{
	if ( bIsValid )
	{
		this.getRoot().className = "constraintValid";
		this.getRoot().title = "";
	}
	else
	{
		this.getRoot().className = "constraintInvalid";
		this.getRoot().title = reason;
	}
}
