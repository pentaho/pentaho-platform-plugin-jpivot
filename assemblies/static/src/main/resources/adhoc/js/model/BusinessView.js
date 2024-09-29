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


// TODO sbarkdull, table -> category
// TODO sbarkdull, maybe?? convert items and tables arrays to associative arrays for performance increase

/**
 * BusinessViews consist of 0 or more BusinessTables
 */
BusinessView = function( xmlNd )
{
	var tableNds = xmlNd.getElementsByTagName( "view" );
	var tableNo;
	
	this.modelId = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "domain_id" ) );	// TODO sbarkdull, does the BV need to know what its model is?
	this.viewId = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "model_id" ) );
	this.viewName = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "model_name" ) );
	this.viewDescription = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "model_description" ) );
	this.tables = null;
	
	// check partial initialization
	if ( tableNds.length > 0 )
	{
		this.tables = new Array();
		this.itemsMap = new Object();
		for( tableNo=0; tableNo<tableNds.length; tableNo++ ) {
			
			var table = new BusinessTable( tableNds[tableNo] );
			this.addTable( table );
			
			var columnNds = tableNds[tableNo].getElementsByTagName( "column" );
			// TODO sbarkdull var columnArray = new Array();
			var columnNo;
			for( columnNo=0; columnNo<columnNds.length; columnNo++ ) {
				var item = new BVItem( table.tableId, columnNds[columnNo] );
				table.addItem( item );
				this.itemsMap[ item.columnId ] = item;
				// TODO sbarkdull columnArray.push( item );
			}
		}
	}
}

BusinessView.prototype.clear = function()
{
	this.tables = null;
	this.itemsMap = null;
}
BusinessView.prototype.addTable = function( table )
{
	this.tables.push( table );
}
/**
 * return true if the tables have been loaded, else false.
 */
BusinessView.prototype.isInitializationComplete = function()
{
	return this.tables != null;
}

/**
 * @param columnId String the metadata column id of the BVItem to be returned
 * Assuption: column Id's are unique across tables in a model.
 * 
 * @return BVItem an instance of a BVItem whose column id is columnId
 */
BusinessView.prototype.getItem = function( columnId )
{
	return this.itemsMap[ columnId ];
}

/**
 * This could be slow - can we get the tables into a pseudo-map?
 * 
 * @param tableId String the id of the table to be returned
 * @return BusinessTable the business table whose id is tableId
 */
BusinessView.prototype.findTable = function( tableId )
{
	// find selected items
	var idx;
	for( idx=0; idx<this.tables.length; idx++ ) {
		if( tableId == this.tables[idx].tableId ) {
			return this.tables[idx];
		}
	}
}

