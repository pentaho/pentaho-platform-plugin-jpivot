/*
* Copyright 2002 - 2017 Hitachi Vantara.  All rights reserved.
* 
* This software was developed by Hitachi Vantara and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

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
