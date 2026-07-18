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
