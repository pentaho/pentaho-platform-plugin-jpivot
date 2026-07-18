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



/**
 * @param item BVItem
 */

RSGroupItem = function( bvItem )
{
	RSBaseItem.call( this, bvItem );
	this.constructor = RSGroupItem;
	
	this.format = RSBaseItem.getDefaultFormat( bvItem.physicalType );
	this.alignment = RSBaseItem.getDefaultAlignment( bvItem.physicalType );
}
RSGroupItem.prototype = new RSBaseItem();
