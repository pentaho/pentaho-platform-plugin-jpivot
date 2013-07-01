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

MQLConstraintParser = function()
{
}

// match LIKE, followed by a param list, where the param list look like ( param ; param ), return the function LIKE, and the 2 params, be reluctant on matching ";"
/*static*/MQLConstraintParser.RE_PREFIX_COMPARATOR_FUNCTION_PARTS = /^\s*(LIKE)\(\s*\[(.+)\];(.+)\s*\)\s*$/;
// match ISNA, followed by a param list, where the param list look like ( param  ), return the function ISNA, and the param
/*static*/MQLConstraintParser.RE_PREFIX_COMPARATOR_ISNA_FUNCTION_PARTS = /^\s*(ISNA)\(\s*\[(.+)\]\s*\)\s*$/;

// match "[tableId.columnId] operator value". value may be in double quotes. return tableId.columnId, the operator, and the value (unquoted)
/*static*/MQLConstraintParser.RE_INFIX_COMPARATOR_FUNCTION_PARTS = /^\s*\[([^\]]+)\]\s*([<>=]{1,2})\s*(DATEVALUE\()?"?([^"]*)"?(\))?\s*$/;
// /*static*/MQLConstraintParser.RE_INFIX_COMPARATOR_FUNCTION_PARTS = /^\s*\[([^\]]+)\]\s*([<>=]{1,2})\s*"?([^"]*)"?\s*$/;

// match NOT, followed by a param list, where the param list look like ( param ; param ), return the function NOT, and the 2 params
/*static*/MQLConstraintParser.RE_NOT_FUNCTION_PARTS = /^\s*(NOT)\((.+)\)\s*$/;

// break strFunction into the logical func (AND|OR) and the param list, drop the parenthesis. if strFunction is "AND( x; y ), return "And" and "x; y".
MQLConstraintParser.RE_LOGICAL_FUNCTION_PARTS = /^\s*(AND_NOT|OR_NOT|AND|OR)\((.+)\)\s*$/;

/**
 * break strFunction into the logical func (AND|OR) and the param list, drop the parenthesis
 * if strFunction is "AND( x, y ), return "And" and "x, y".
 */
/*private*/MQLConstraintParser.prototype.getLogicalFunkParts = function( strFunction )
{
	var parts = strFunction.match( MQLConstraintParser.RE_LOGICAL_FUNCTION_PARTS );
	if ( parts )
	{
		return { funkName:parts[1], parameters:parts[2] };
	}
	else
	{
		return null;
	}
}

/**
 * I couldnt figure out how to do this one with a regular expression. So,
 * the parsing is done by looking for the first ")" and first ";". If there is no
 * parenthesis, or the semicolon is before the first parenthesis, then we are working
 * with a parameter list from an infix function. Break strParameter in 
 * 2 parts at the semicolon. Otherwise we are working with a prefix 
 * function's parameter list. Scan strParameter for the first semicolon
 * that comes after an equal number of opening and closing parenthesis. 
 * This semicolon is where we want to break strParameter in half.
 * 
 * @return Object with properties leftParam and rightParam, both of which are Strings
 */
/*private*/MQLConstraintParser.prototype.getParameters = function( strParameter )
{
	var parts = new Array(3);
	
	var parenthesisIdx = strParameter.indexOf( "(" );
	var semiIdx = strParameter.indexOf( ";" );
	if ( -1 == parenthesisIdx || semiIdx < parenthesisIdx )
	{
		parts[1] = strParameter.substr( 0, semiIdx );
		parts[2] = strParameter.substr( semiIdx+1, strParameter.length );
	}
	else
	{
		var parenthesisCnt = 1;
		var ii;
		var idx = strParameter.indexOf( "(" );
		for ( ii=idx+1; ii<strParameter.length; ++ii )
		{
			var currCh = strParameter.charAt( ii );
			if ( currCh == '(' )
			{
				++parenthesisCnt
			}
			else if ( currCh == ')' )
			{
				--parenthesisCnt
			}
			if ( parenthesisCnt == 0 )
			{
				break;
			}
		}
		parts[1] = strParameter.substr( 0, ii+1 );
		parts[2] = strParameter.substr( ii+2, strParameter.length );
	}
		
	return { leftParam:parts[1], rightParam:parts[2] };
}

/**
 * A comparator function can be either infix (=,<>,<=,>=,<,>) or
 * prefix (like(x,y)) or unaryPrefix (not(x)). Break the function
 * into 4 parts: the function name, the left and right parameters,
 * and a boolean indicating whether the formula is negated (bIsNot).
 * 
 * @return Object with properties: bIsNot, funkName, leftParam, rightParam
 * bIsNot: true if a NOT() function is specified, else false
 * funkName: name of the function, typically: <,>,>=, etc. and Like()
 * leftParam: function's left param
 * rightParam: function's right param
 */
/*private*/MQLConstraintParser.prototype.getComparatorFunkParts = function( strComparatorFunk )
{
	var bIsNot = false;
	var notParts = strComparatorFunk.match( MQLConstraintParser.RE_NOT_FUNCTION_PARTS );
	if ( null != notParts )
	{
		bIsNot = true;
		strComparatorFunk = notParts[2];
	}
	var parts = strComparatorFunk.match( MQLConstraintParser.RE_INFIX_COMPARATOR_FUNCTION_PARTS );
	if ( parts )
	{
	  // parts[3] will be either "DATEVALUE(" or ""
	  var rightParam = parts[3] ? parts[3] + "\"" : "";
	  // parts[4] will be the value
	  rightParam += parts[4] ? parts[4] : "";
	  // parts[5] will be either ")" or ""
	  rightParam += parts[5] ? "\"" + parts[5] : "";

		return { bIsNot: false, funkName:parts[2], leftParam:parts[1], rightParam:rightParam };
	}
	else
	{
		// look for LIKE
		parts = strComparatorFunk.match( MQLConstraintParser.RE_PREFIX_COMPARATOR_FUNCTION_PARTS );
		if ( parts )
		{
			return { bIsNot: bIsNot, funkName:parts[1], leftParam:parts[2], rightParam:parts[3] };
		}
		else
		{
			// look for ISNA
			parts = strComparatorFunk.match( MQLConstraintParser.RE_PREFIX_COMPARATOR_ISNA_FUNCTION_PARTS );
			if ( parts ) {
				return {bIsNot: bIsNot, funkName:parts[1], leftParam:parts[2]};
			}
			return null;
		}
	}
}
/**
 * Parse the MQL constraint forumula. When the parser finds a single MQL constraint in the 
 * larger forumula, it calls the onConstraintFoundCallback. See comments for
 * setOnConstraintFoundCallback() for details of the callback.
 * 
 * @param logicalFunk String (AND|OR)
 * @param strMqlConstraintFormula String a valid MQL Constraint formula
 * see: http://wiki.pentaho.org/confluence/display/studio/02.+Pentaho+Metadata+Formulas
 * 
 * @return String null if constraint parsed correctly, else the constraint formula
 * that failed to parse.
 */
MQLConstraintParser.prototype.parseMqlConstraintFormula = function( logicalFunk, strMqlConstraintFormula )
{
	var logicalFunkParts = this.getLogicalFunkParts( strMqlConstraintFormula )
	if ( logicalFunkParts )
	{
		var parameters = logicalFunkParts.parameters;
		var parameterParts = this.getParameters( parameters );
		
		var comparatorFunkParts = this.getComparatorFunkParts( parameterParts.leftParam );
		if ( null !== comparatorFunkParts )
		{
  		if ( this.onConstraintFoundCallback )
  		{
  			this.onConstraintFoundCallback( logicalFunk, comparatorFunkParts.funkName, 
  				comparatorFunkParts.rightParam, comparatorFunkParts.bIsNot );
  		}
		  return this.parseMqlConstraintFormula( logicalFunkParts.funkName, parameterParts.rightParam );
		}
		else
		{
		  // the parse failed, return the formula piece that failed to parse
		  return parameterParts.leftParam;
		}
	}
	else
	{
		var comparatorFunkParts = this.getComparatorFunkParts( strMqlConstraintFormula );
		if ( null !== comparatorFunkParts )
		{
  		if ( this.onConstraintFoundCallback )
  		{
  			this.onConstraintFoundCallback( logicalFunk, comparatorFunkParts.funkName, 
  				comparatorFunkParts.rightParam, comparatorFunkParts.bIsNot );
  		}
		}
		else
		{
		  // the parse failed, return the formula piece that failed to parse
		  return strMqlConstraintFormula;
		}
	}
	return null; // everything parsed ok
}

/**
 * Set a callback that will be called when the parser finds a single
 * MQL constraint in the larger aggregated MQL constraint forumula.
 * Setting a callback function using setOnConstraintFoundCallback is how the parser's
 * client gets its work done. The callback's signature must look like:
 * callback( logicalFunction, comparatorFunction, rightParam, isNot ), where:
 * logicalFunction: (And | OR )
 * comparatorFunction: (<,>,=,<=,>=,<>, LIKE )
 * rightParam: the right parameter in the constraint. The left parameter is always
 * the column name, and should be known by the parser client.
 * isNot: boolean indicating that the current constraint is surrounded by a NOT expression.
 * For instance, if the current constraint is NOT( x < y ), then isNot will be true. If
 * the current constraint is simply x < y, isNot will be false.
 */
MQLConstraintParser.prototype.setOnConstraintFoundCallback = function( callback )
{
	this.onConstraintFoundCallback = callback;
}
	
