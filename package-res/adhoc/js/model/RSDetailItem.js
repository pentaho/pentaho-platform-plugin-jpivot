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