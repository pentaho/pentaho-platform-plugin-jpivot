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
 
ComboCtrl = function()
{
	HTMLCtrl.call( this, "table" );
	this.constructor = ComboCtrl;
	var table = this.getRoot();

	table.cellSpacing = "0px";
	table.cellPadding = "0px";
	table.border = "0px";
	table.style.width = "100%";
	
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.style.width = "100%";
	td.style.paddingRight = "2px";
	
	this.valueElem = document.createElement( "div" );
	td.appendChild( this.valueElem );
	this.valueElem.style.backgroundColor = "#FFFFFF";
	this.valueElem.style.width = "100%";	// TODO get style in css?
	this.valueElem.style.border = "1px solid #818f49";
	this.valueElem.style.height = "1.2em";
	
	var localThis = this;
	
	this.valueElem.innerHTML = "";
	this.valueElem.id = "ComboCtrl.comboText" + ComboCtrl.counter;
	this.valueElem.onmousedown = function()
	{
		localThis.handleShowPickList.apply( localThis, arguments );
	}
	this.valueElem.onmouseup = function()
	{
		localThis.handleHidePickList.apply( localThis, arguments );
	}
	
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.style.paddingRight = "2px";
	
	var img = document.createElement( "img" );
	td.appendChild( img );
	img.src = UIUtil.getImageFolderPath() + "comboDownArrow.png";
	img.id = "ComboCtrl.comboBtn" + ComboCtrl.counter;
	this.comboBtnImgElem = img;
	
	this.pickListCtrl = new PickListCtrl( this.valueElem.id, img.id );
	document.body.appendChild( this.pickListCtrl.getRoot() );
	
	img.onmousedown = function()
	{
		localThis.handleShowPickList.apply( localThis, arguments );
	};
	img.onmouseup = function()
	{
		localThis.handleHidePickList.apply( localThis, arguments );
	};
	img.onmouseout = function()
	{
		img.src = UIUtil.getImageFolderPath() + "comboDownArrow.png";
	}
	
	ComboCtrl.counter++;
}
ComboCtrl.prototype = new HTMLCtrl();
ComboCtrl.counter = 0;

ComboCtrl.prototype.setOnListShowCallback = function( callback )
{
	this.pickListCtrl.setOnShowCallback( callback );
}

ComboCtrl.prototype.setOnPropertyChangeCallback = function( callback )
{
	this.onPropertyChangeCallback = callback;
}

ComboCtrl.prototype.setListContentAsCtrl = function( ctrl )
{
	this.pickListCtrl.setContentAsCtrl( ctrl );
}

ComboCtrl.prototype.setListContentAsHtml = function( html )
{
	this.pickListCtrl.setContentAsHtml( html );
}

ComboCtrl.prototype.setListContentAsElem = function( elem )
{
	this.pickListCtrl.setContentAsElem( elem );
}

/**
 * @param value Object with properties: text, data
 * text is the text in the combo, data is data associated with the value
 * @param imgFilename String the filename of an image file that will be displayed next to "text". imgFilename
 * is optional
 */
ComboCtrl.prototype.setValue = function( value, imgFilename )
{
	this.text = value.text;
	this.data = value.data;
	if ( imgFilename )
	{
		this.valueElem.innerHTML = "<span style='margin-left:0.3em;padding-right:0.3em;'><img style='vertical-align:middle;' src='" 
			+ imgFilename 
			+ "'/></span><span>" 
			+ value.text + "</span>";
	}
	else
	{
		this.valueElem.innerHTML = value.text;
	}

	if ( this.onPropertyChangeCallback )
	{
		this.onPropertyChangeCallback( this );
	}
}
/**
 * @return Object with properties: value, data
 * text is the text in the combo, data is data associated with the value
 */
ComboCtrl.prototype.getValue = function()
{
	return {
		text:this.text,
		data:this.data
	};
}
ComboCtrl.prototype.handleShowPickList = function()
{
	var myEvent = UIUtil.getEvent( arguments );
	var whichBtn = UIUtil.getMouseButton( myEvent );
	if ( whichBtn == UIUtil.LEFT_MOUSE )
	{
		this.showPickList();
	}
}

ComboCtrl.prototype.showPickList = function()
{
	this.comboBtnImgElem.src = UIUtil.getImageFolderPath() + "comboDownArrowPressed.png";
	if ( this.pickListCtrl.isOpen() )
	{
		this.pickListCtrl.hide();
	}
	else
	{
		this.pickListCtrl.show();
	}
}

ComboCtrl.prototype.handleHidePickList = function()
{
	var myEvent = UIUtil.getEvent( arguments );
	var whichBtn = UIUtil.getMouseButton( myEvent );
	if ( whichBtn == UIUtil.LEFT_MOUSE )
	{
		this.hidePickList();
	}
}

ComboCtrl.prototype.hidePickList = function()
{
	this.comboBtnImgElem.src = UIUtil.getImageFolderPath() + "comboDownArrow.png";
	if ( this.pickListCtrl.isOpen() )
	{
		this.pickListCtrl.focus();
	}
}