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

StringUtils = function()
{
}

/*static*/StringUtils.isEmpty = function( str )
{
	return str == undefined || str == null || str == "";
}
/*static*/StringUtils.ROOT_FOLDER = "/";
/**
 * @return String containing all path-elements of path,
 * except the right most element (aka the parent path).
 * Return null if path has no "/", or if the path is
 * exactly "/".
 */
/*static*/StringUtils.getParentPath = function( path )
{
	var idx = path.lastIndexOf( "/" );
	idx = ( idx == 0 ) ? 1 : idx;
	return ( idx >= 1 && path != StringUtils.ROOT_FOLDER ) ? path.substring( 0, idx ) : null;
}
/**
 * @return the right most component of path.
 */
/*static*/StringUtils.getLastPathElement = function( path )
{
	var idx = path.lastIndexOf( "/" );
	return ( idx >= 0 ) ? path.substring( idx+1, path.length ) : path;
}

/**
 * convert from "normal" wildcards (*) to SQL wildcards (%)
 */
/*static*/StringUtils.wildcardsToSQLWildcards = function( str )
{
	var newStr = str.replace( /%/g, "\\%");							// replace all % with \% (may only work on some databases)
	newStr = newStr.replace( /([^\\]|^)(\*)/g, "$1%");	// replace all * not proceeded by \ with %
	newStr = newStr.replace( /\\\*/g, "*");							// replace all \* with *

	return newStr;
}

/**
 * %B: month as text
 * %d: day as number
 * %y: year as number
 * %Y: year as 4 digit number
 * @param dateStr String representing the date in the format "mm dd, yyyy"
 * @return String date string in the format yyyy-mm-dd (preferred by most databases)
 */
/*static*/StringUtils.convertDateToServerFormat = function( dateStr )
{
	var date = Date.parseDate( dateStr, "%B %d, %Y");
	var str = date.print( "%Y-%m-%d" );
	return str;
}

/*static*/StringUtils.convertDateToClientFormat = function( dateStr )
{
	var date = Date.parseDate( dateStr, "%Y-%m-%d");
	var str = date.print( "%B %d, %Y" );
	return str;
}

// NOTE: RegExp handles numbers with: start with 0 or 1 "-", followed by 1-3 numbers,
// followed by zero or more (commas followed by 3 numbers) followed by 0 or 1
// (decimals followed by 0 or more numbers), or, a decimal followed by 1 or more numbers
/*static*/StringUtils.STR_RE_IS_NUMERIC = "^-?(\\d{1,3}(,?[\\d]{3})*(\\.\\d*)?|(\\.\\d+))$";
/*static*/StringUtils.RE_IS_NUMERIC = new RegExp( StringUtils.STR_RE_IS_NUMERIC );
/*static*/StringUtils.isNumeric = function( strNumber )
{
  var tst = StringUtils.RE_IS_NUMERIC.test( strNumber );
  return StringUtils.RE_IS_NUMERIC.test( strNumber );
}
