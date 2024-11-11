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


TemplatesListCtrl = function( id, className )
{
	ListCtrl.call( this, id, className, ListCtrl.SINGLE_SELECT );
	this.constructor = TemplatesListCtrl;
	
	this.thumbNailImgElem = document.getElementById( "thumbnailImg" );
	this.templateDescriptionElem = document.getElementById( "templateDescription" );
	
	var localThis = this;
	// explicitly call base class's method
	ListCtrl.prototype.setOnSelectCallback.call( this,
		function( event )
		{
			localThis.handleListSelection();
			if ( localThis.onTemplateSelectCallback )
			{
				localThis.onTemplateSelectCallback( event );
			}
		}
	);
	this.setOnUnselectCallback(
		function( event )
		{
			localThis.handleListUnselection( event );
		}
	);
}
TemplatesListCtrl.prototype = new ListCtrl();

/*static final*/TemplatesListCtrl.GET_IMAGE_URL="../GetResource?resource=";
//TODO sbarkdull, the value needs to be better than 10000, see http://www.faqs.org/rfcs/rfc822.html for date format
/*static final*/TemplatesListCtrl.EXPIRES="expires=1 Dec 2007";		

TemplatesListCtrl.prototype.handleListSelection = function()
{
	// update the thumbnail and description
	/*tr element*/var selectedItem = this.getSelectedItems()[0];
	var itemData = selectedItem.itemData;
	var iconName = itemData.templateIcon;
	
	// TODO, lets not hard code the name, but lets get the name from the repository.
	this.thumbNailImgElem.src = TemplatesListCtrl.GET_IMAGE_URL
		+ WaqrRepository.getResourcePath( itemData.templateFolderPath + "/" + iconName );
	this.thumbNailImgElem.style.display = "inline";
	this.templateDescriptionElem.innerHTML = itemData.templateDescription;
}

TemplatesListCtrl.prototype.handleListUnselection = function()
{
	// update the thumbnail and description
	this.thumbNailImgElem.style.display = "none";
	this.templateDescriptionElem.innerHTML = "";
}

/**
 * NOTE: override the base class's method
 */
TemplatesListCtrl.prototype.setOnSelectCallback = function( callback, object )
{
	this.onTemplateSelectCallback = callback;
	this.onTemplateSelectObject = object;
}
