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

// may want to remove tableId as prop of an item? Need to ensure that it is not used.
function BVItem( tableId, columnNd )
{
	this.tableId = tableId;
	this.columnId = XmlUtil.getNodeText( XmlUtil.selectSingleNode( columnNd, "column_id" ) );
	this.name = XmlUtil.getNodeText( XmlUtil.selectSingleNode( columnNd, "column_name" ) );
	this.description = XmlUtil.getNodeText( XmlUtil.selectSingleNode( columnNd, "column_description" ) );
	this.physicalType = XmlUtil.getNodeText( XmlUtil.selectSingleNode( columnNd, "column_type" ) );
	this.fieldType = XmlUtil.getNodeText( XmlUtil.selectSingleNode( columnNd, "column_field_type" ) );
	this.sort = undefined;
	this.constraints = new Constraints();
}
/**
 * @return Constraints the set of constraints associated with this item
 */
BVItem.prototype.getConstraints = function()
{
	return this.constraints;
}
/**
 * @param constraints Constraints the set of constraints to apply to this column
 */
BVItem.prototype.setConstraints = function( constraints )
{
	this.constraints = constraints;
}
BVItem.prototype.removeConstraints = function()
{
	this.constraints = new Constraints();
}
BVItem.prototype.getConstraintXml = function( bIsFirst )
{
	return this.constraints.asConstraintXml( this, bIsFirst );
}
/**
 * @param direction String should be one of Sort.SORT_ASCENDING or Sort.SORT_DESCENDING
 */
BVItem.prototype.setSortDirection = function( direction )
{
	this.sort = new Sort( direction );
}
/**
 * @return String identifies the sort direction, should be
 * one of Sort.SORT_ASCENDING or Sort.SORT_DESCENDING or undefined.
 * Value of undefined indicates that no sorting has been specified
 * on the column
 */
BVItem.prototype.getSortDirection = function()
{
	if ( this.sort )
	{
		return this.sort.direction;
	}
	else
	{
		return undefined;
	}
}
/**
 * set the sort direction to undefined, indicating that no sorting has been specified
 * on the column
 */
BVItem.prototype.clearSortDirection = function()
{
	this.sort = undefined;
}
BVItem.prototype.getSortXml = function()
{
	return ( undefined != this.sort ) ? this.sort.asXml( this ) : "";
}
/**
 * represents the 3 valid data types for metadata columns, plus unknown
 */
BVItem.TYPE = new Object();
BVItem.TYPE.NUMERIC = "Numeric";
BVItem.TYPE.STRING = "String";
BVItem.TYPE.DATE = "Date";
BVItem.TYPE.BOOLEAN = "Boolean";
BVItem.TYPE.UNKNOWN = "Unknown";

BVItem.FIELD_TYPE = new Object();
BVItem.FIELD_TYPE.DIMENSION = "Dimension";
BVItem.FIELD_TYPE.FACT = "Fact";
BVItem.FIELD_TYPE.ATTRIBUTE = "Attribute";

// values are from java.sql.Types
BVItem.JAVA_SQL_TYPES = new Object();
BVItem.JAVA_SQL_TYPES.NUMERIC = 2;
BVItem.JAVA_SQL_TYPES.VARCHAR = 12;
BVItem.JAVA_SQL_TYPES.BOOLEAN = 16;
BVItem.JAVA_SQL_TYPES.DATE = 91;

BVItem.TYPE_TO_JAVA_SQL_TYPE = new Object();
BVItem.TYPE_TO_JAVA_SQL_TYPE[ BVItem.TYPE.NUMERIC ] = BVItem.JAVA_SQL_TYPES.NUMERIC;
BVItem.TYPE_TO_JAVA_SQL_TYPE[ BVItem.TYPE.STRING ] = BVItem.JAVA_SQL_TYPES.VARCHAR;
BVItem.TYPE_TO_JAVA_SQL_TYPE[ BVItem.TYPE.DATE ] = BVItem.JAVA_SQL_TYPES.DATE;
BVItem.TYPE_TO_JAVA_SQL_TYPE[ BVItem.TYPE.BOOLEAN ] = BVItem.JAVA_SQL_TYPES.BOOLEAN;
BVItem.TYPE_TO_JAVA_SQL_TYPE[ BVItem.TYPE.UNKNOWN ] = BVItem.JAVA_SQL_TYPES.VARCHAR;	// assume unknown will be a string

BVItem.JAVA_SQL_TYPE_TO_TYPE = new Object();
BVItem.JAVA_SQL_TYPE_TO_TYPE[ BVItem.JAVA_SQL_TYPES.NUMERIC ] = BVItem.TYPE.NUMERIC;
BVItem.JAVA_SQL_TYPE_TO_TYPE[ BVItem.JAVA_SQL_TYPES.VARCHAR ] = BVItem.TYPE.STRING;
BVItem.JAVA_SQL_TYPE_TO_TYPE[ BVItem.JAVA_SQL_TYPES.DATE ] = BVItem.TYPE.DATE;
BVItem.JAVA_SQL_TYPE_TO_TYPE[ BVItem.JAVA_SQL_TYPES.BOOLEAN ] = BVItem.TYPE.BOOLEAN;

BVItem.COMPARATOR = new Object();
BVItem.COMPARATOR.STRING = [ 
	Messages.getString( "EXACTLY_MATCHES" ), 
	Messages.getString( "CONTAINS" ), 
	Messages.getString( "ENDS_WITH" ), 
	Messages.getString( "BEGINS_WITH" ), 
  Messages.getString( "DOES_NOT_CONTAIN" ),
  Messages.getString( "IS_NULL" ),
  Messages.getString( "IS_NOT_NULL" ) ];
BVItem.COMPARATOR.NUMERIC = [ "=", "<>", ">=", "<=", ">", "<",
  Messages.getString( "IS_NULL" ),
  Messages.getString( "IS_NOT_NULL" ) ];
BVItem.COMPARATOR.BOOLEAN = [ "=", "<>",
  Messages.getString( "IS_NULL" ),
  Messages.getString( "IS_NOT_NULL" ) ];
BVItem.COMPARATOR.DATE = [ 
	Messages.getString( "ON" ), 
	Messages.getString( "NOT_ON" ), 
	Messages.getString( "ON_OR_AFTER" ), 
	Messages.getString( "ON_OR_BEFORE" ), 
	Messages.getString( "AFTER" ), 
  Messages.getString( "BEFORE" ),
  Messages.getString( "IS_NULL" ),
  Messages.getString( "IS_NOT_NULL" )];
  
//Comparators with no right-hand parameters (is null, etc).
BVItem.SINGLE_COMPARATORS = {};
BVItem.SINGLE_COMPARATORS[Messages.getString( "IS_NULL" )] = {};
BVItem.SINGLE_COMPARATORS[Messages.getString( "IS_NOT_NULL" )] = {};
  
	
BVItem.COMPARATOR_MAP = new Object();
BVItem.COMPARATOR_MAP[ BVItem.TYPE.NUMERIC ] = BVItem.COMPARATOR.NUMERIC;
BVItem.COMPARATOR_MAP[ BVItem.TYPE.STRING ] = BVItem.COMPARATOR.STRING;
BVItem.COMPARATOR_MAP[ BVItem.TYPE.DATE ] = BVItem.COMPARATOR.DATE;
BVItem.COMPARATOR_MAP[ BVItem.TYPE.BOOLEAN ] = BVItem.COMPARATOR.BOOLEAN;
BVItem.COMPARATOR_MAP[ BVItem.TYPE.UNKNOWN ] = BVItem.COMPARATOR.STRING;
