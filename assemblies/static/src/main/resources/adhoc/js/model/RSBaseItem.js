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


RSBaseItem = function( bvItem )
{
	this.bvItem = bvItem;
}
RSBaseItem.prototype.asXml = function() {
	var mql = "<selection><view>"+this.bvItem.tableId+"</view><column>"+this.bvItem.columnId+"</column></selection>\n";
	return mql;
}

RSBaseItem.prototype.getBVItem = function()
{
	return this.bvItem;
}
/*static*/RSBaseItem.DEFAULT_FORMAT_BY_TYPE = new Object();
RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ BVItem.TYPE.NUMERIC ] = "default";
RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ BVItem.TYPE.STRING ] = "";
RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ BVItem.TYPE.DATE ] = "default";
RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ BVItem.TYPE.BOOLEAN ] = "";
RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ BVItem.TYPE.UNKNOWN ] = "";

/*static*/RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE = new Object();
RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ BVItem.TYPE.NUMERIC ] = "not-set";
RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ BVItem.TYPE.STRING ] = "not-set";
RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ BVItem.TYPE.DATE ] = "not-set";
RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ BVItem.TYPE.BOOLEAN ] = "not-set";
RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ BVItem.TYPE.UNKNOWN ] = "not-set";

/**
 * @param columnType String, one of the properties of the BVItem.TYPE Object.
 */
RSBaseItem.getDefaultFormat = function( columnType )
{
	return RSBaseItem.DEFAULT_FORMAT_BY_TYPE[ columnType ];
}
RSBaseItem.getDefaultAlignment = function( columnType )
{
	return RSBaseItem.DEFAULT_ALIGNMENT_BY_TYPE[ columnType ];
}
