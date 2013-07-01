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
