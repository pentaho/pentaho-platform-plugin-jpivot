/*
* Copyright 2002 - 2013 Pentaho Corporation.  All rights reserved.
* 
* This software was developed by Pentaho Corporation and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

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
