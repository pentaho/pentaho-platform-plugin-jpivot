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
