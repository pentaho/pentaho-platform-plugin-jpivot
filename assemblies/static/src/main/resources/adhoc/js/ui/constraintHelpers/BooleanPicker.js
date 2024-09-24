/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2028-08-13
 ******************************************************************************/

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
