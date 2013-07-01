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

ListEditorButtonsCtrl = function()
{
	HTMLCtrl.call( this, "table" );
	var table = this.getRoot();
	table.cellSpacing = "0";
	table.cellPadding = "0";
	table.border = "0";
	
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
		
	// left td -----------------------------
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.style.paddingLeft = "3px";
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_arrow_up.png";
	img.alt = "^";
	img.title = Messages.getString("moveColumnUp");
	var btn = new ButtonCtrl( img, ButtonCtrl.SMALL );
	td.appendChild( btn.getRoot() );
	btn.getRoot().title = Messages.getString("moveColumnUp");
	this.upBtnCtrl = btn;
	
	// middle td -----------------------------
	td = document.createElement( "td" );
	tr.appendChild( td );	
	td.style.paddingLeft = "4px";
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_arrow_down.png";
	img.alt = ">";
	img.title = Messages.getString("moveColumnDown");
	btn = new ButtonCtrl( img, ButtonCtrl.SMALL );
	td.appendChild( btn.getRoot() );
	btn.getRoot().title = Messages.getString("moveColumnDown");
	this.downBtnCtrl  = btn;
	
	// right td -----------------------------
	td = document.createElement( "td" );
	tr.appendChild( td );	
	td.style.paddingLeft = "4px";
    
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_delete.png";
	img.alt = "X";
	img.title = Messages.getString("deleteColumn");
    
	btn = new ButtonCtrl( img, ButtonCtrl.SMALL );
	td.appendChild( btn.getRoot() );
	btn.getRoot().title = Messages.getString("deleteColumn");
	this.deleteBtnCtrl = btn;
}
ListEditorButtonsCtrl.prototype = new HTMLCtrl();

ListEditorButtonsCtrl.prototype.setOnUpClickCallback = function( callback, object )
{
	this.upBtnCtrl.setOnClickCallback( callback, object );
}
ListEditorButtonsCtrl.prototype.setOnDownClickCallback = function( callback, object )
{
	this.downBtnCtrl.setOnClickCallback( callback, object );	
}
ListEditorButtonsCtrl.prototype.setOnDeleteClickCallback = function( callback, object )
{
	this.deleteBtnCtrl.setOnClickCallback( callback, object );	
}
