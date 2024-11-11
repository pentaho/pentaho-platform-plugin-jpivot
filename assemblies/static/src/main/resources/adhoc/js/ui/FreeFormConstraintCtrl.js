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


FreeFormConstraintCtrl = function( id )
{
	HTMLCtrl.call( this, "textarea" );
	this.constructor = FreeFormConstraintCtrl;
	var t = this.getRoot();
	t.className = "constraintsValid";
	t.wrap = "soft"; //http://msdn2.microsoft.com/en-us/library/ms535152.aspx soft, hard, off
	if ( undefined !== id ) t.id = id;
	//t.rows = 10;
	this.textArea = t;
}

FreeFormConstraintCtrl.prototype = new HTMLCtrl();

FreeFormConstraintCtrl.prototype.setMql = function( strMql )
{
  this.textArea.value = strMql;
}
FreeFormConstraintCtrl.prototype.getMql = function()
{
  return this.textArea.value;
}
