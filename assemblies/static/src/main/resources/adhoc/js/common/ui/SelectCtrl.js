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
