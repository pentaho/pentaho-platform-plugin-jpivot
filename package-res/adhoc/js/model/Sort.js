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
 * @author Steven Barkdull
 */
Sort = function( direction )
{
	this.direction = direction;
}
// TODO sbarkdull next 2 need to be internationalized
Sort.SORT_ASCENDING_LABEL = Messages.getString( "ascLabel" );
Sort.SORT_DESCENDING_LABEL = Messages.getString( "descLabel" );
Sort.SORT_ASCENDING = "asc";
Sort.SORT_DESCENDING = "desc";

Sort.prototype.asXml = function( bvItem )
{
	return "<order><direction>"
		+ this.direction + "</direction><view_id>"
		+ bvItem.tableId + "</view_id><column_id>"
		+ bvItem.columnId + "</column_id></order>\n";
}