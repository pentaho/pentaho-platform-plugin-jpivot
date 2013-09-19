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

BusyCtrl = function()
{
	HTMLCtrl.call( this, "span" );
	this.constructor = BusyCtrl;
	
	var rootSpan = this.getRoot();
	rootSpan.style.visibility = "hidden";
	rootSpan.style.verticalAlign = "middle";
	
	var workingSpan = document.createElement( "span" );
	rootSpan.appendChild( workingSpan );
	workingSpan.innerHTML = "Working ...";
	this.workingSpan = workingSpan;
	
	var img = document.createElement( "img" );
	rootSpan.appendChild( img );
	img.src = UIUtil.getImageFolderPath() + "pentaho_timer.gif";
}
BusyCtrl.prototype = new HTMLCtrl();

BusyCtrl.prototype.show = function()
{
	this.getRoot().style.visibility = "visible";
}
BusyCtrl.prototype.hide = function()
{
	this.getRoot().style.visibility = "hidden";
}
BusyCtrl.prototype.setText = function( msg )
{
	this.workingSpan.innerHTML = msg;
}
