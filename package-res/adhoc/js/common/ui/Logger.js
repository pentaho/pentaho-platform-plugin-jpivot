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

Logger = function()
{
	this.win = null;
}

Logger.prototype.open = function( winName )
{
	this.win = window.open( "about:blank", winName,
		'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1024,height=768' );
	if ( this.win )
	{
		this.win.document.write( "<html><header><title>Logger</title></header><body></body></html>" );
		this.counter = 1;
	}
}
Logger.prototype.log = function( msg )
{
	this.debug( msg );
}
Logger.prototype.debug = function( msg )
{
	if ( this.win && this.win.document )
	{
		var div = this.win.document.createElement( "div" );
		div.innerHTML = this.counter + ": " + msg;
		this.win.document.body.appendChild( div );
		div.scrollIntoView(false);
		this.counter++;
	}
}
