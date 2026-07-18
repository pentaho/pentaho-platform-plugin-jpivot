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



Status = function( status, message )
{
	this.status = status != undefined ? status : Status.OK;
	this.message = message != undefined ? message : "";
}

Status.OK = 0;
Status.FAIL = 1;

Status.prototype.toString = function()
{
	return this.message;
}
