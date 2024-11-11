/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


BusinessTable = function( tableNd )
{
	this.tableId = XmlUtil.getNodeText( tableNd.getElementsByTagName( "view_id" ) );
	this.tableName = XmlUtil.getNodeText( tableNd.getElementsByTagName( "view_name" ) );
	this.tableDescription = XmlUtil.getNodeText( tableNd.getElementsByTagName( "view_description" ) );
	this.items = new Array();
}

BusinessTable.prototype.addItem = function( item )
{
	this.items.push( item );
}
BusinessTable.prototype.clear = function()
{
	this.items = new Array();
}
