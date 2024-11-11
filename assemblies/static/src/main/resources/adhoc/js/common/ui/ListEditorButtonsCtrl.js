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
