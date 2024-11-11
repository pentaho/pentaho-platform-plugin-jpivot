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
