/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 - 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/



/*
 * TODO sbarkdull
 * NOTE: needs work
 */

MessageCtrl = function()
{
}

MessageCtrl.prototype.debug = function( message )
{
	alert( message );
}
MessageCtrl.prototype.info = function( message )
{
	alert( message );
}
MessageCtrl.prototype.warn = function( message )
{
	alert( message );
}
MessageCtrl.prototype.error = function( message )
{
	alert( message );
}
MessageCtrl.prototype.fatal = function( message )
{
	alert( message );
}
MessageCtrl.prototype.confirm = function( message )
{
	return window.confirm( message );
}
