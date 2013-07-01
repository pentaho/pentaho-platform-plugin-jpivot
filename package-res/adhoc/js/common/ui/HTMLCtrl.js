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