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
 * @parm tagNameOrId String any HTML tag name (div, span, input, etc.) or
 * the id of an element in the DOM.
 */

HTMLCtrl = function( tagNameOrId )
{
  this.root = document.getElementById (tagNameOrId );
  if ( null == this.root )
  {
    this.root = document.createElement( tagNameOrId );
  }
}
HTMLCtrl.prototype.getRoot = function()
{
	return this.root;
}
HTMLCtrl.prototype.show = function()
{
	this.root.style.display = "block";
}
HTMLCtrl.prototype.hide = function()
{
	this.root.style.display = "none";
}

HTMLCtrl.prototype.isShown = function()
{
	return this.root.style.display != "none";
}
