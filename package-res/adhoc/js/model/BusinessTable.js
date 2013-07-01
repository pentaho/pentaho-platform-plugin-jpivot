/*
 * Copyright 2007 Pentaho Corporation.  All rights reserved. 
 * This software was developed by Pentaho Corporation and is provided under the terms 
 * of the Mozilla Public License, Version 1.1, or any later version. You may not use 
 * this file except in compliance with the license. If you need a copy of the license, 
 * please go to http://www.mozilla.org/MPL/MPL-1.1.txt. The Original Code is the Pentaho 
 * BI Platform.  The Initial Developer is Pentaho Corporation.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS" 
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to 
 * the license for the specific language governing your rights and limitations.
 *
 * Created  
 * @author James Dixon, Steven Barkdull
 */

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