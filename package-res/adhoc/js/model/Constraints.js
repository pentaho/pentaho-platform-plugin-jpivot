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
Constraints = function()
{
	this.constraints = new Array();
}
/**
 * @param operator String {And, Or}
 * @param comparator String {=,<>,>=,<=,<,>}
 * @param condition String the value being compared with the comparator
 */
Constraints.prototype.addConstraint = function( operator, comparator, condition )
{
	var constraint = new Constraint( operator, comparator, condition );
	this.constraints.push(constraint);
}

Constraints.prototype.removeAllConstraints = function()
{
	this.constraints = new Array();
}
Constraints.prototype.getConstraint = function( idx )
{
	return this.constraints[ idx ];
}
Constraints.prototype.getNumConstraints = function()
{
	return this.constraints.length;
}

/*static*/Constraints.RE_HAS_WILDCARD = /.*[\*\?].*/;
Constraints.prototype.buildMQLConstraintFormula = function( constraintIdx, bvItem )
{
	if ( constraintIdx < this.constraints.length )
	{	
		var constraint = this.constraints[ constraintIdx ];
		var condition = null;
		var leftOperand = null;
		switch ( bvItem.physicalType )
		{
			case BVItem.TYPE.UNKNOWN:
					//fall through into BVItem.TYPE.STRING
			case BVItem.TYPE.STRING:
				leftOperand = Constraints.makeStringOperand( bvItem.tableId, bvItem.columnId, constraint.comparator, constraint.condition );
				break;
			case BVItem.TYPE.DATE:
				leftOperand = Constraints.makeDateOperand( bvItem.tableId, bvItem.columnId, constraint.comparator, constraint.condition );
				break;
			case BVItem.TYPE.BOOLEAN:
				leftOperand = Constraints.makeBooleanOperand( bvItem.tableId, bvItem.columnId, constraint.comparator, constraint.condition );
				break;
			case BVItem.TYPE.NUMERIC:
				leftOperand = Constraints.makeNumericOperand( bvItem.tableId, bvItem.columnId, constraint.comparator, constraint.condition );
				break;
			default:
				throw new Error( Messages.getString( "unknownColumnType", bvItem.physicalType ) );
		}
		
		if ( constraintIdx == this.constraints.length-1 )
		{
			return leftOperand;	// this will become the right operand when it returns
		}
		else
		{
			var rightOperand = this.buildMQLConstraintFormula( constraintIdx+1, bvItem );
			return this.constraints[ constraintIdx+1].operator + "(" + leftOperand + ";" + rightOperand + ")";
		}
	}
	else
	{
		throw new Error( Messages.getString( "constraintIdxOutOfRange", constraintIdx ) );
	}
}
/**
 * @param String strMqlConstraintFormula MQL constraint forumla
 * @param String physicalType one of the values in BVItem.TYPE
 * 
 * @throws Error when strMqlConstraintFormula fails to parse.
 */
Constraints.prototype.setByMqlConstraintFormula = function( strMqlConstraintFormula, physicalType )
{
	var localThis = this;
	var parser = new MQLConstraintParser();
	parser.setOnConstraintFoundCallback( 
		function( logicalFunk, comparatorFunk, rightParam, bIsNot )
		{
			localThis.handleConstraintFound( logicalFunk, comparatorFunk, rightParam, bIsNot, physicalType );
		}
	);
	var strFailedMql = parser.parseMqlConstraintFormula( "", strMqlConstraintFormula );
	if ( null !== strFailedMql )
	{
	  throw new Error( Messages.getString( "MQL_PARSE_FAILED", strFailedMql ) );
	}
}

Constraints.prototype.handleConstraintFound = function( logicalFunk, comparatorFunk, rightParam, bIsNot, physicalType )
{
	switch ( physicalType ) {
		case BVItem.TYPE.STRING:
			var xformedParams = this.xformStringConstraintParams( comparatorFunk, 
				rightParam, bIsNot );
			comparatorFunk = xformedParams.comparatorFunkName;
			rightParam = xformedParams.rightParam;
			break;
		case BVItem.TYPE.DATE:
			var xformedParams = this.xformDateConstraintParams( comparatorFunk, 
				rightParam, bIsNot );
			comparatorFunk = xformedParams.comparatorFunkName;
			rightParam = xformedParams.rightParam;
			break;
		case BVItem.TYPE.NUMERIC:
		case BVItem.TYPE.BOOLEAN:
			// no need to do anything
			break;
		default:
			// no need to do anything
			break;
	}
	this.addConstraint( logicalFunk, comparatorFunk, Constraints.decode(rightParam) );
}


/*static*/Constraints.entityDecoder = document.createElement("div");

/*static*/Constraints.decode = function(str)
{
  var hex, index;
  if (str == null) 
  {
    return str;
  }
  while (str.indexOf('\\u') != -1) 
  {
    index = str.indexOf('\\u');
    hex = str.substr(index + 2, index + 6 - (index + 2));
    str = str.substr(0, index - 0) + '&#x' + hex + ';' + str.substr(index + 6, str.length - (index + 6));
    Constraints.entityDecoder.innerHTML = str || '';
    str = Constraints.entityDecoder.innerHTML;
  }
  return str;
}

/*static*/Constraints.RE_CONTAINS = /"%(.+)%"/;
/*static*/Constraints.RE_ENDS_WITH = /"%(.+)"/;
/*static*/Constraints.RE_BEGINS_WITH = /"(.+)%"/;
/**
 * @param String comparatorFunkName one of the values in the arrays: BVItem.COMPARATOR.STRING
 * @param String rightParam
 * @param boolean bIsNot
 * 
 * @return Object with properties: comparatorFunkName, rightParam
 */
Constraints.prototype.xformStringConstraintParams = function( comparatorFunkName, rightParam, bIsNot )
{
	if ( comparatorFunkName == "=" )
	{
		return { comparatorFunkName:Messages.getString( "EXACTLY_MATCHES" ), rightParam: rightParam };
	}
	else if ( comparatorFunkName == "LIKE" )
	{
		var param = null;
		if ( param = rightParam.match( Constraints.RE_CONTAINS ) )
		{
			var funkName = bIsNot ? Messages.getString( "DOES_NOT_CONTAIN" ): Messages.getString( "CONTAINS" );
			return { comparatorFunkName: funkName, rightParam: param[1] };
		}
		else if ( param = rightParam.match( Constraints.RE_ENDS_WITH ) )
		{
			return { comparatorFunkName: Messages.getString( "ENDS_WITH" ), rightParam: param[1] };
		}
		else if ( param = rightParam.match( Constraints.RE_BEGINS_WITH ) )
		{
			return { comparatorFunkName: Messages.getString( "BEGINS_WITH" ), rightParam: param[1] };
		}
	}
  else if( comparatorFunkName == "ISNA" )
  {
     var funkName =  bIsNot ? Messages.getString( "IS_NOT_NULL" ) : Messages.getString( "IS_NULL" );
     return { comparatorFunkName: funkName, rightParam: null };
     
  }
	throw new Error( Messages.getString( "INVALID_COMPARATOR_NAME", comparatorFunkName ) );
}

/*static*/Constraints.operatorMap = new Object();
Constraints.operatorMap[ "=" ] = Messages.getString( "ON" );
Constraints.operatorMap[ "<>" ] = Messages.getString( "NOT_ON" );
Constraints.operatorMap[ ">=" ] = Messages.getString( "ON_OR_AFTER" );
Constraints.operatorMap[ "<=" ] = Messages.getString( "ON_OR_BEFORE" );
Constraints.operatorMap[ ">" ] = Messages.getString( "AFTER" );
Constraints.operatorMap[ "<" ] = Messages.getString( "BEFORE" );
Constraints.operatorMap[ "isNull" ] = Messages.getString( "IS_NULL" );
Constraints.operatorMap[ "isNotNull" ] = Messages.getString( "IS_NOT_NULL" );


/**
 * @param String comparatorFunkName one of the values in the arrays: BVItem.COMPARATOR.STRING
 * @param String rightParam
 * @param boolean bIsNot
 * 
 * @return Object with properties: comparatorFunkName, rightParam
 */
Constraints.prototype.xformDateConstraintParams = function( comparatorFunkName, rightParam, bIsNot )
{
	if ( undefined == comparatorFunkName )
	{
		throw new Error( Messages.getString( "INVALID_COMPARATOR_NAME", comparatorFunkName ) );
	}
	var newName = Constraints.operatorMap[ comparatorFunkName ];
	return { comparatorFunkName:newName, rightParam: rightParam };
}

Constraints.prototype.asConstraintXml = function( bvItem, isFirst )
{
	var xmlStr = "";
	if ( this.constraints.length > 0 )
	{
		xmlStr += '<constraint><operator>';
		if( !isFirst ) {
			xmlStr += "<![CDATA[AND]]>";
		}
		xmlStr += "</operator><condition><![CDATA[";
		
		var strFormula = this.buildMQLConstraintFormula( 0, bvItem );
		xmlStr += strFormula;
		xmlStr += "]]></condition></constraint>\n";
	}
	return xmlStr;
}
/*static*/Constraints.makeNumericOperand = function( tableId, columnId, comparator, condition )
{
  switch( comparator )
  {
    case Messages.getString( "IS_NULL" ):
      return "ISNA([" + tableId + "." + columnId + "])";
    case Messages.getString( "IS_NOT_NULL" ):
      return "NOT(ISNA([" + tableId + "." + columnId + "]))";
    default:
	return "[" + tableId + "." + columnId + "] "
		+ comparator + " "
		+ condition;
}
}
/*static*/Constraints.makeDateOperand = function( tableId, columnId, comparator, condition )
{
  switch( comparator )
  {
    case Messages.getString( "IS_NULL" ):
      return "ISNA([" + tableId + "." + columnId + "])";
    case Messages.getString( "IS_NOT_NULL" ):
      return "NOT(ISNA([" + tableId + "." + columnId + "]))";
    default:
	comparator = Constraints.mapDateComparatorToNumericComparator( comparator );
	return "[" + tableId + "." + columnId + "] "
		+ comparator + " "
		+ condition;
}
}
/*static*/Constraints.makeBooleanOperand = function( tableId, columnId, comparator, condition )
{
  switch( comparator )
  {
    case Messages.getString( "IS_NULL" ):
      return "ISNA([" + tableId + "." + columnId + "])";
    case Messages.getString( "IS_NOT_NULL" ):
      return "NOT(ISNA([" + tableId + "." + columnId + "]))";
    default:
		return "[" + tableId + "." + columnId + "] "
			+ comparator + " "
			+ condition;
  }
}


/*static*/Constraints.conditionToUnicode = function( condition )
{
  var uniStr = "", hexVal, uniChar;
  for(var i = 0; i < condition.length; ++i)
  { 
    hexVal = Number(condition.charCodeAt(i)).toString(16);
    uniChar = "\\u" + ("000" + hexVal).match(/.{4}$/)[0];
    uniStr += uniChar;
  }
  return uniStr;
}

/*
Marc Batchelor: JDBC provides an escape mechanism that looks like this: {escape '/'}
Marc Batchelor: For fully compliant drivers, you can do something like this:
Marc Batchelor: SELECT FOO FROM BAR WHERE ID LIKE '\_%' {escape '\'}
Marc Batchelor: or
Marc Batchelor: SELECT FOO FROM BAR WHERE ID = '100\%' {escape '\'}
Marc Batchelor: Now, from Java, you'll have to java-escape the back-slash
Marc Batchelor: So, it would look like:
Marc Batchelor: ResultSet rs = stmt.executeQuery("SELECT FOO FROM BAR WHERE ID = '100\\%' {escape '\\'}");
Marc Batchelor: For more info, try checking out the JDBC spec, somewhere around section 11.5
*/

/*static*/Constraints.makeStringOperand = function( tableId, columnId, comparator, condition )
{

	condition = Constraints.conditionToUnicode(condition);

	switch( comparator )
	{
		case Messages.getString( "EXACTLY_MATCHES" ):
			return "[" + tableId + "." + columnId + "] = \"" + condition + "\"";
		case Messages.getString( "CONTAINS" ):
			return "LIKE( [" + tableId + "." + columnId + "];" + "\"%" + condition + "%\"" + ")";
		case Messages.getString( "ENDS_WITH" ):
			return "LIKE( [" + tableId + "." + columnId + "];" + "\"%" + condition + "\"" + ")";
		case Messages.getString( "BEGINS_WITH" ):
			return "LIKE( [" + tableId + "." + columnId + "];" + "\"" + condition + "%\"" + ")";
		case Messages.getString( "DOES_NOT_CONTAIN" ):
			return "NOT( LIKE( [" + tableId + "." + columnId + "];" + "\"%" + condition + "%\"" + ") )";
    case Messages.getString( "IS_NULL" ):
      return "ISNA([" + tableId + "." + columnId + "])";
    case Messages.getString( "IS_NOT_NULL" ):
      return "NOT(ISNA([" + tableId + "." + columnId + "]))";
		default:
			throw new Error( Messages.getString( "unknownComparator", comparator ) );
	}
}

/**
 * see mapDateComparatorToNumericComparator for use of this pseudo-map
 */
Constraints.DATE_TYPE_TO_NUMERIC_TYPE_COMPARATOR = new Object();
for ( var ii=0; ii<BVItem.COMPARATOR.NUMERIC.length; ++ii )
{
	Constraints.DATE_TYPE_TO_NUMERIC_TYPE_COMPARATOR[ BVItem.COMPARATOR.DATE[ ii ] ] = BVItem.COMPARATOR.NUMERIC[ ii ];
}
/**
 * map the date operators to the numeric operators
 * @return String a numeric operator
 */
/*static*/Constraints.mapDateComparatorToNumericComparator = function( dateComparator )
{
	return Constraints.DATE_TYPE_TO_NUMERIC_TYPE_COMPARATOR[dateComparator];
}
