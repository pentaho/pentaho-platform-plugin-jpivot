/*
* Copyright 2002 - 2013 Pentaho Corporation.  All rights reserved.
* 
* This software was developed by Pentaho Corporation and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

// TODO cache picklist html??
/**
 * @param data Object containing properties: modelId, viewId, columnId
 */
ColumnValuePickList = function( imgId, inputId, data )
{
	var pickListCtrl = new PickListCtrl( inputId );
	var localThis = this;
	pickListCtrl.setOnShowCallback( 
		function()
		{
			localThis.createUI();
			ColumnValuePickList.currentPickList = localThis;
		}
	);
	this.pickListCtrl = pickListCtrl;
	
	this.inputElem = document.getElementById( inputId );
	this.data = data;

	document.body.appendChild( this.pickListCtrl.getRoot() );
	var imgElem = document.getElementById( imgId );
	imgElem.onclick = function()
	{
		localThis.pickListCtrl.show();
	};
	imgElem.pickList = this;
	this.imgElem = imgElem;
}
/*static*/ColumnValuePickList.currentPickList = null;
/*static*/ColumnValuePickList.xslDoc = null;
/*static*/ColumnValuePickList.setXslDoc = function( xslDoc )
{
	ColumnValuePickList.xslDoc = xslDoc;
}

ColumnValuePickList.prototype.createUI = function()
{
	var data = this.data;
	var params = { model:data.modelId, view:data.viewId, column:data.columnId };

	WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "lookupValues", params, { method:this.setPickListUI, obj:this } );
}

/**
 */
ColumnValuePickList.prototype.setPickListUI = function( pickListXmlDoc )
{
	if ( undefined != pickListXmlDoc )
	{
		var html = xsltProcess( pickListXmlDoc, ColumnValuePickList.xslDoc );
		this.pickListCtrl.setContentAsHtml( html );
	}
}

// this method is called by code/html generated by picklist.xls transform
/*static*/ColumnValuePickList.setValue = function( value )
{
	var thisPickList = ColumnValuePickList.currentPickList;
	thisPickList.inputElem.value = value;
	thisPickList.pickListCtrl.hide();
	ColumnValuePickList.currentPickList = null;
}
