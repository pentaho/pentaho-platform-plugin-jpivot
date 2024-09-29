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


RSDetailItem = function( bvItem )
{
	RSBaseItem.call( this, bvItem );
	this.constructor = RSDetailItem;
	
	this.format = RSBaseItem.getDefaultFormat( bvItem.physicalType );
	this.alignment = RSBaseItem.getDefaultAlignment( bvItem.physicalType );
	this.aggregatorFunc = RSDetailItem.DEFAULT_AGGREGATOR_FUNC_VALUE;
}
RSDetailItem.prototype = new RSBaseItem();

// valid values defined in ReportSpecUtility.getExpressionChoices() -->
RSDetailItem.DEFAULT_AGGREGATOR_FUNC_VALUE = "none";
RSDetailItem.typeToValidAggrFuncName = new Object;
RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.NUMERIC ] = 
[
  Messages.getString( "aggrFuncNone" ),
  Messages.getString( "aggrFuncCount" ),
  Messages.getString( "aggrFuncSum" ),
  Messages.getString( "aggrFuncAverage" ),
  Messages.getString( "aggrFuncMin" ),
  Messages.getString( "aggrFuncMax" )
];
RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.STRING ] = 
[
  Messages.getString("aggrFuncNone" ),
  Messages.getString("aggrFuncCount" )
];
RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.DATE ] = 
[
  Messages.getString("aggrFuncNone" ),
  Messages.getString("aggrFuncCount" )
];
RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.BOOLEAN ] = 
[
  Messages.getString("aggrFuncNone" ),
  Messages.getString("aggrFuncCount" )
];
RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.UNKNOWN ] = 
  RSDetailItem.typeToValidAggrFuncName[ BVItem.TYPE.STRING ];

/*private static*/RSDetailItem.aggrFuncNameToValue = new Object();
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncNone") ] = "none";
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncSum") ] = "sum";
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncAverage") ] = "average";
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncMin") ] = "min";
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncMax") ] = "max";
RSDetailItem.aggrFuncNameToValue[ Messages.getString( "aggrFuncCount") ] = "item-count";

/*static*/RSDetailItem.getAggrFuncValueByName = function( name )
{
  return RSDetailItem.aggrFuncNameToValue[ name ];
}
/*static*/RSDetailItem.getAggrFuncNamesByType = function( type )
{
  return RSDetailItem.typeToValidAggrFuncName[ type ];
}
