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
