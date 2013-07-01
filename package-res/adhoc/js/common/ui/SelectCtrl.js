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
 * @param listOfText Array of Strings, where each String will be the text
 * of an option element child of the select
 * @param listOfValues Array of Strings, where each String will be the value
 * of the value attribute of an option element child of the select
 */
 
// TODO sbarkdull, maybe add an optional "label" parameter to provide an label for the select
SelectCtrl = function( listOfText, listOfValues )
{
	HTMLCtrl.call( this, "div" );
	this.constructor = SelectCtrl;

  if ( undefined === listOfText && undefined === listOfValues )
  {
    return; // return early, ctor is being called for assignment to inheriting class's prototype 
  }
  this.selectElem = UIUtil.createSelectElem( listOfText, listOfValues );
  this.getRoot().appendChild( this.selectElem );
}

SelectCtrl.prototype = new HTMLCtrl();

SelectCtrl.prototype.setValue = function( value )
{
	this.selectElem.value = value;
}

SelectCtrl.prototype.getValue = function()
{
  return this.selectElem.value;
}

SelectCtrl.prototype.removeItemByIdx = function( idx )
{
  var item = this.selectElem.childNodes[ idx ];
  this.selectElem.removeChild( item );
}

SelectCtrl.prototype.addItem = function( text, value )
{
  var opt = document.createElement( "option" );
  opt.innerHTML= XmlUtil.escapeXml( text );
  opt.value = value;
  opt.title = value;
  this.selectElem.appendChild( opt );
}

SelectCtrl.prototype.addItems = function( listOfText, listOfValues )
{
  for ( var ii=0; ii<listOfText.length; ++ii )
  {
    this.addItem( listOfText[ii], listOfValues[ii] );
  }
}