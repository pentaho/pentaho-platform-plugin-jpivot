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
 
FormatListCtrl = function()
{
	HTMLCtrl.call( this, "div" );
	var div = this.getRoot();

	this.dateList = UIUtil.createSelectElem( FormatListCtrl.DATE_LIST_OF_TEXT, FormatListCtrl.DATE_LIST_OF_VALUES );
	this.dateList.size = 8;
	this.dateList.style.width = "15em";
	this.dateList.style.display = "none";
	div.appendChild( this.dateList );
	this.formatList = UIUtil.createSelectElem( FormatListCtrl.NUMERIC_LIST_OF_TEXT, FormatListCtrl.NUMERIC_LIST_OF_VALUES );
	this.formatList.size = 8;
	this.formatList.style.width = "15em";
	this.formatList.style.display = "none";
	div.appendChild( this.formatList );
	this.currentList = null;
}
FormatListCtrl.prototype = new HTMLCtrl();
/* static final members*/
FormatListCtrl.NUMERIC_LIST_OF_TEXT = [
	RSBaseItem.getDefaultFormat( BVItem.TYPE.NUMERIC ),
	"1234; -1234",
	"1,234; -1,234",
	"1,234; (1,234)",
	"1,234.56; -1,234.56",
	"1,234.56; (1,234.56)",
	Messages.getString( "NUMBER_FORMAT_NEG_MONEY_LABEL" ), // $ 1,234; -$ 1,234
	Messages.getString( "NUMBER_FORMAT_PAREN_MONEY_LABEL" ), // $ 1,234; ($ 1,234)
	Messages.getString( "NUMBER_FORMAT_NEG_DECIMAL_MONEY_LABEL" ), // $ 1,234.56; -$ 1,234.56
	"123 %; (123 %)",
	"123.45 %; (123.45 %)" ];
FormatListCtrl.NUMERIC_LIST_OF_VALUES = [
	"",
	"####;-####",
	"#,###;-#,###",
	"#,###;(#,###)",
	"#,###.##;-#,###.##",
	"#,###.##;(#,###.##)",
	Messages.getString( "NUMBER_FORMAT_NEG_MONEY" ), // $ #,###;-$ #,###
	Messages.getString( "NUMBER_FORMAT_PAREN_MONEY" ), // $ #,###;($ #,###)
	Messages.getString( "NUMBER_FORMAT_NEG_DECIMAL_MONEY" ), // $ #,###.##;-$ #,###.##
	"#,### %;(#,### %)",
	"#,###.## %;(#,###.## %)" ];
FormatListCtrl.DATE_LIST_OF_TEXT = [
	RSBaseItem.getDefaultFormat( BVItem.TYPE.DATE ),
	"02/21/2007",
	"Feb 21, 2007",
	"21/02/2007 ",
	"21 Feb 2007" ];
FormatListCtrl.DATE_LIST_OF_VALUES = [
	"",
	"MM/dd/yyyy",
	"MMM dd, yyyy",
	"dd/MM/yyyy",
	"dd MMM yyyy" ];

/**
 * @param type String valid values are available in: BVItem.TYPE.*
 */
FormatListCtrl.prototype.setListType = function( type )
{
	this.type = type;
	switch (type)
	{
	case BVItem.TYPE.UNKNOWN:
		/*UNKNOWN falls into String*/
	case BVItem.TYPE.STRING:
		this.dateList.style.display="none";
		this.formatList.style.display="block";
		this.formatList.disabled = true;
		this.currentList = null;
		break;
	case BVItem.TYPE.DATE:
		this.dateList.style.display="block";
		this.formatList.style.display="none";
		this.currentList = this.dateList;
		break;
	case BVItem.TYPE.BOOLEAN:
		this.dateList.style.display="none";
		this.formatList.style.display="block";
		this.formatList.disabled = true;
		this.currentList = null;
		break;
	case BVItem.TYPE.NUMERIC:
		this.dateList.style.display="none";
		this.formatList.style.display="block";
		this.formatList.disabled = false;
		this.currentList = this.formatList;
		break;
	default:
		throw new Error( Messages.getString("unknownColumnType", type) );
		break;
	}
}

FormatListCtrl.prototype.setValue = function( value )
{
	if ( this.currentList != null )
	{
		this.currentList.value = value;
	}
}

FormatListCtrl.prototype.getValue = function()
{
	if ( this.currentList != null )
	{
		return this.currentList.value;
	}
	else
	{
		return null;
	}
}