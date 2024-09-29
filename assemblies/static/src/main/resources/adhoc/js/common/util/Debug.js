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


Debug = function()
{
}
/*static*/Debug.elemList = new Array();
Debug.on = true;

/*static*/Debug.getPropsAsString = function( obj )
{
	var str = "";
	for ( prop in obj )
	{
	  try
	  {
		  str += prop + ": " + obj[prop] + "\n";
	  }
	  catch( ignore )
	  {
	    // ignore
	    // property may be protected or private, in which case if we try to access it, it will throw an exception
	  }
	}
	return str;
}

/**
 * @parma coord Object with properties top and left
 * @param bAdjustDiv boolean, true if you want the marker moved so that
 * the marker's bottom right corner points to the coordinate.
 */
Debug.markCoord = function( coord, name, color, bAdjustDiv )
{
	var div = document.createElement( "div" );
	div.style.position = "absolute";
	div.style.top = coord.top + "px";
	div.style.left = coord.left + "px";
	div.style.fontSize = ".6em";
	div.style.backgroundColor = color;
	div.style.border = "1px black solid";
	document.body.appendChild( div );
	Debug.elemList.push( div );
	div.innerHTML = coord.left + ", " + coord.top + " " + name;
	if ( bAdjustDiv )
	{
		div.style.top = div.style.top.replace( "px", "" ) - div.offsetHeight + "px";
		div.style.left = div.style.left.replace( "px", "" ) - div.offsetWidth + "px";
	}
	
	return div;
}

Debug.markElemOrigin = function( elem )
{
	var coord = UIUtil.getElemOffset( elem );
	var name = "";
	if ( elem.id ) name = elem.id;
	Debug.markCoord( coord, name, "yellow", false );
}

Debug.markElemMax = function( elem )
{
	var coord = UIUtil.getElemOffset( elem );

	coord.left += elem.offsetWidth;
	coord.top += elem.offsetHeight;
	var name = "";
	if ( elem.id ) name = elem.id;
	var div = Debug.markCoord( coord, name, "red", true );
}

Debug.markElemScrollOrigin = function( elem )
{
	var coord = UIUtil.getElemOffset( elem );
	var scroll = UIUtil.getElemScrollOffset( elem );
	coord.left -= scroll.left;
	coord.top -= scroll.top;
	
	var name = "";
	if ( elem.id ) name = elem.id;
	Debug.markCoord( coord, name, "yellow", false );
}

Debug.markElemScrollMax = function( elem )
{
	var coord = UIUtil.getElemOffset( elem );
	var scroll = UIUtil.getElemScrollOffset( elem );
	coord.left -= scroll.left;
	coord.top -= scroll.top;

	coord.left += elem.offsetWidth;
	coord.top += elem.offsetHeight;
	var name = "";
	if ( elem.id ) name = elem.id;
	var div = Debug.markCoord( coord, name, "red", true );
}
Debug.clearMarkers = function()
{
		for ( var ii=0; ii<Debug.elemList.length; ++ii )
		{
			var elem = Debug.elemList[ii];
			elem.parentNode.removeChild( elem );
		}
		Debug.elemList.splice( 0, Debug.elemList.length );	// empty the array
}
