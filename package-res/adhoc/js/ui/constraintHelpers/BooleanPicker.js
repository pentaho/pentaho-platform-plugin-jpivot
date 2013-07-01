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
 * @param data Object with properties: modelId, viewId, columnId
 */
BooleanPicker = function( imgId, inputId, data  )
{
	var pickListCtrl = new PickListCtrl( inputId );
	var localThis = this;
	pickListCtrl.setOnShowCallback( 
		function()
		{
		}
	);
	this.pickListCtrl = pickListCtrl;
	this.createUI();
	
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
};

BooleanPicker.prototype.createUI = function() {
	var values = [ "true", "false" ];
	var outerDiv = document.createElement( "div" );
	
	for ( var ii=0; ii<values.length; ++ii ) {
		var innerDiv = document.createElement( "div" );
		innerDiv.className = 'itemNormal';
		var localThis = this;
		innerDiv.onmouseover = function() 
		{ 
			this.className = 'itemHilight';
		};
		innerDiv.onmouseout = function() 
		{ 
			this.className = 'itemNormal';
		};
		innerDiv.innerHTML = values[ ii ];
		innerDiv.onclick =  function()
			{
		  		this.className = 'itemNormal';
		  		localThis.pickListCtrl.hide();
		  		localThis.inputElem.value = this.innerHTML;
			};
		outerDiv.appendChild( innerDiv );
	}
	
	this.pickListCtrl.setContentAsElem( outerDiv );
}