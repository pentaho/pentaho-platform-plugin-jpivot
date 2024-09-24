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

SimpleDialog = function( id, modalDivId )
{
  var a = arguments;
  if ( arguments.length == 0 )
  {
    // must be the call to extend this class, return
    return;
  }
	HTMLCtrl.call( this, id );
	SimpleDialog.constructor = SimpleDialog;
	this.modalDiv = document.getElementById( modalDivId );
	
	this.titleBarEl = document.getElementById( "dialog.titleBarId" ); // TODO sbarkdull, don't hard code
	this.titleBarEl.ctrl = this;
	this.dialogDiv = this.getRoot();
	this.clientDiv = document.getElementById( "dialog.clientDiv" );
	this.btnDiv = document.getElementById( "dialog.btnDiv" );
}

SimpleDialog.prototype = new HTMLCtrl();


SimpleDialog.prototype.show = function()
{
  this.modalDiv.style.display = "block";
  HTMLCtrl.prototype.show.apply( this, arguments );
};

SimpleDialog.prototype.hide = function()
{
  HTMLCtrl.prototype.hide.apply( this, arguments );
  this.modalDiv.style.display = "none";
};

SimpleDialog.prototype.setClientContent = function( ctrl )
{
  var clientDiv = this.clientDiv;
  while ( clientDiv.childNodes.length > 0 )
  {
    clientDiv.removeChild( clientDiv.childNodes[0] );
  }
  clientDiv.appendChild( ctrl.getRoot() );
}

SimpleDialog.prototype.setBtnContent = function( elem )
{
  var btnDiv = this.btnDiv;
  while ( btnDiv.childNodes.length > 0 )
  {
    btnDiv.removeChild( btnDiv.childNodes[0] );
  }
  btnDiv.appendChild( elem );
};

SimpleDialog.prototype.setTitle = function( title )
{
  this.titleBarEl.innerHTML = title;
};


/**
 * @param position Object with String properties top and left
 * for instance: { top:"10px", left:"10px" }
 */
SimpleDialog.prototype.setPosition = function( position )
{
  this.dialogDiv.style.top = position.top;
  this.dialogDiv.style.left = position.left;
}
