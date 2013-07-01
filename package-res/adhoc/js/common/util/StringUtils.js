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