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
 * @param id String optional, if present, the id of the table containing the radio
 * button group.
 * @param name String the name that ties the radio button group together. The name
 * attribute of each radio button in the group.
 */
RadioButtonsCtrl = function( id, name )
{
	HTMLCtrl.call( this, "table" );
	var table = this.getRoot();
	table.cellPadding = "0";
	table.cellSpacing = "0";
	table.className = "radioButtons"
	//table.border = "1px";
	
	this.tbody = document.createElement( "tbody" );
	table.appendChild( this.tbody );
	
	if ( undefined != id ) table.id = id;
	this.name = name;
	
}

RadioButtonsCtrl.prototype = new HTMLCtrl();

/*static*/RadioButtonsCtrl.handleOnBlur = function( inputElem )
{
	var ctr = inputElem.ctrl;
	if ( undefined != ctr.onBlurCallback )
	{
		ctr.onBlurCallback.call( ctr.onBlurCallbackObj );
	}
}
/**
 * @param labelTxt String containing the label for the radio button
 * @param value String containing value attribute for radio button
 * @param htmlElem HTML element, optional, if present, adds this HTML
 * element between the radio button and the label. Commonly used to 
 * insert an image element.
 */
RadioButtonsCtrl.prototype.addButton = function( labelTxt, value, htmlElem )
{
	var tr = document.createElement( "tr" );
	this.tbody.appendChild( tr );
	
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.style.verticalAlign = "middle";
	/* this commented code works fine in Mozilla, doesn't work in IE 7
	 * in IE7, user is unable to actually check buttons
	var input = document.createElement( "input" );
	input.type="radio";
	input.value = value;
	input.name = this.name;
	input.id = this.name + "Id";
	td.appendChild( input );
	 */
	/* inline HTML instead of DHTML code is a hack to get IE7 to work */
	td.innerHTML = "<input type='radio' value='" + value + "' name='" + this.name + "' onblur='RadioButtonsCtrl.handleOnBlur(this);'/>";
	//td.ctrl = this;	//magic
	td.childNodes[0].ctrl = this;	// magic
	
	if ( undefined != htmlElem )
	{
		td = document.createElement( "td" );
		tr.appendChild( td );
		td.style.verticalAlign = "middle";
		td.appendChild( htmlElem );
		td.style.paddingRight = "10px";
		td.style.paddingTop = "10px";
		td.style.paddingBottom = "10px";
	}
	
	td = document.createElement( "td" );
	tr.appendChild( td );
	td.className = "rightColumn";
	td.style.verticalAlign = "middle";
	td.innerHTML = labelTxt;	
}
RadioButtonsCtrl.prototype.setValue = function( value )
{
	var radios = this.tbody.getElementsByTagName( "input" );
	for ( var idx=0; idx<radios.length; ++idx )
	{
		var radio = radios[ idx ];
		radio.checked = ( radio.value == value );
	}
}
RadioButtonsCtrl.prototype.getValue = function()
{
	var radios = this.tbody.getElementsByTagName( "input" );
	for ( var idx=0; idx<radios.length; ++idx )
	{
		var radio = radios[ idx ];
		if ( radio.checked == true )
		{
			return radio.value;
		}
	}
	return null;	// apparently not initialized
}

RadioButtonsCtrl.prototype.setOnBlur = function( callback, callbackObj )
{
	this.onBlurCallback = callback;
	this.onBlurCallbackObj = callbackObj;
}