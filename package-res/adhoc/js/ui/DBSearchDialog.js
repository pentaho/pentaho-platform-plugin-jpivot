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

DBSearchDialog = function( title )
{	
	this.initText();
	
	this.modalDiv = document.getElementById( "searchDialog.modalDiv" );
	this.dialogDiv = document.getElementById("searchDialog.searchDialog");
	this.titleBarDiv = document.getElementById("searchDialog.titleBar");
	this.titleBarDiv.innerHTML = title;
	this.titleBarDiv.ctrl = this;
	
	var busyCtrl = new BusyCtrl();
	var container = document.getElementById( "searchDialog.busyContainer" );
	container.appendChild( busyCtrl.getRoot() );
	this.busyCtrl = busyCtrl;
	
	this.searchBtn = new ButtonCtrl( Messages.getString("searchBtnTxt"), ButtonCtrl.LARGE );
	var searchBtnContainer = document.getElementById( "searchDialog.searchBtnContainer" );
	searchBtnContainer.appendChild( this.searchBtn.getRoot() );
	this.searchBtn.setOnClickCallback( this.handleSearch, this );	
	
	this.okBtn = new ButtonCtrl( Messages.getString("okBtnTxt"), ButtonCtrl.LARGE );
	var okBtnContainer = document.getElementById( "searchDialog.okBtnContainer" );
	okBtnContainer.appendChild( this.okBtn.getRoot() );
	this.okBtn.setOnClickCallback( this.handleOk, this );
	this.okBtn.setEnabled( false );
	
	this.cancelBtn = new ButtonCtrl( Messages.getString("cancelBtnTxt"), ButtonCtrl.LARGE );
	var cancelBtnContainer = document.getElementById( "searchDialog.cancelBtnContainer" );
	cancelBtnContainer.appendChild( this.cancelBtn.getRoot() );
	this.cancelBtn.setOnClickCallback( this.handleCancel, this );
	
	this.searchInputText = document.getElementById( "searchDialog.searchInputText" );
	this.searchInputText.title = Messages.getString("searchWildcardHelpMsg");
	this.searchInputText.onfocus = function() { this.select(); };
	var localThis = this;
	var resultListContainer = document.getElementById( "searchDialog.resultListContainer" );
	this.resultList = new ListCtrl( "", "resultList", ListCtrl.SINGLE_SELECT );
	resultListContainer.appendChild( this.resultList.getRoot() );
	this.resultList.setOnDblClickCallback( this.handleOk, this );
	this.resultList.setOnSelectCallback( 
		function()
		{
			localThis.okBtn.setEnabled( localThis.resultList.getNumSelectedItems() > 0 );
		}
	);
	this.resultList.setOnUnselectCallback( 
		function()
		{
			localThis.okBtn.setEnabled( localThis.resultList.getNumSelectedItems() > 0 );
		}
	);
	
	this.resultList.setDefaultSelectedItemClassName( "selectedItem" );
}
DBSearchDialog.prototype.initText = function()
{
	Messages.setElementText("srchDlgResultsTitle", "srchDlgResultsTitle");
}

DBSearchDialog.prototype.show = function()
{
	this.modalDiv.style.display = "block";
	this.modalDiv.style.width = "100%";
	this.modalDiv.style.height = "100%";
	
	this.dialogDiv.style.display = "block";
	this.searchInputText.focus();

	//hide all select tags for ie6 only
	// TODO sbarkdull
	if( document.body.style.maxHeight == undefined ) {
		// set the number of 'contentX' divs ex: content1 content2 content3 etc
		// TODO, may need to be smarter and remember the ones we hid vs ones that were already hiddenh
		var numContentDivs = "4";
		for(var d = 0; d < numContentDivs; ++d) {
			var contentDiv = document.getElementById("content" + (d));
			var selectElems = contentDiv.getElementsByTagName("select");
			for(var s = 0; s < selectElems.length; ++s) {
				var selectElem = selectElems[s];
				selectElem.style.visibility = "hidden";
			}
		}
	}
	this.modalDiv.focus();
}

DBSearchDialog.prototype.hide = function()
{
	this.modalDiv.style.display = "none";
	this.modalDiv.style.width = "0px";
	this.modalDiv.style.height = "0px";
	
	this.dialogDiv.style.display = "none";
	
	//show all select tags for ie6 only
	// TODO sbarkdull, needs work
	if ( false )
	{
		if(typeof document.body.style.maxHeight == "undefined") {
			// set the number of 'contentX' divs ex: content1 content2 content3 etc
			var numContentDivs = "4";
			for(var d = 0; d < numContentDivs; ++d) {
				var thisdiv = document.getElementById("content" + (d));
				var selecttags = thisdiv.getElementsByTagName("select");
				for(var s = 0; s < selecttags.length; ++s) {
					var thisSelect = selecttags[s];
					thisSelect.style.visibility = "visible";
				}
			}
		}
	}
}
DBSearchDialog.prototype.handleCancel = function()
{
	this.hide();
}
DBSearchDialog.prototype.handleOk = function()
{
	if ( undefined != this.onOkHandler )
	{
		this.onOkHandler.call( this.onOkHandlerObj );
	}
	this.hide();
}
DBSearchDialog.prototype.setOnOkHandler = function( handler, handlerObj )
{
	this.onOkHandler = handler;
	this.onOkHandlerObj = handlerObj;
}
DBSearchDialog.prototype.handleSearch = function()
{
	if ( undefined != this.onSearchHandler )
	{
		if ( undefined == this.onSearchHandlerObj )
		{
			this.onSearchHandler();
		}
		else
		{
			this.onSearchHandler.call( this.onSearchHandlerObj );
		}
	}
}
DBSearchDialog.prototype.setOnSearchHandler = function( handler, handlerObj )
{
	this.onSearchHandler = handler;
	this.onSearchHandlerObj = handlerObj;
}

DBSearchDialog.prototype.getSearchSelection = function()
{
	var trs = this.resultList.getSelectedItems();
	if ( trs.length > 0 )
	{
		return ListCtrl.getItemText( trs[ 0 ] );
	}
	else
	{
		return "";
	}
}
/**
 * @param data Object with properties: modelId, viewId, columnId
 */
DBSearchDialog.prototype.setSearchData = function( data )
{
	this.data = data;
}

DBSearchDialog.prototype.getSearchText = function()
{
	return this.searchInputText.value;
}

DBSearchDialog.prototype.addResultItem = function( strItem )
{
	this.resultList.addItem( strItem );
}

DBSearchDialog.prototype.clearResults = function()
{
	this.resultList.removeAll();
}
