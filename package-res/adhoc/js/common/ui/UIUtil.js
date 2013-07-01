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
 
UIUtil = function()
{
};
/*static*/UIUtil.ESC_KEY	= 27;
/*static*/UIUtil.ENTER_KEY	= 13;
/*static*/UIUtil.imageFolderPath = null;

/*static*/UIUtil.setImageFolderPath = function( path )
{
	UIUtil.imageFolderPath = path;
};
/*static*/UIUtil.getImageFolderPath = function()
{
	if ( null === UIUtil.imageFolderPath )
	{
		throw new Error( Messages.getString( "FOLDER_PATH_MUST_BE_SET" ) );
	}
	return UIUtil.imageFolderPath;
};
/**
 * NOTE: This function works in IE7 and FFox.
 * This function only works when called from a method that is an event handler.
 * 
 * @param args the arguments object of any method that is an event handler
 */
/*static*/UIUtil.getEvent = function( args )
{
	return (args.length > 0 ) ? args[0]: event;
};

/**
 * get the current mouse coordinates. This function works in IE7 and FFox
 * Coordinates are page relative (not viewport relative)
 * @return Object with properties x, y
 */
/*static*/UIUtil.getMouseCoords = function( evt )
{
  var x,y;
	if (evt.pageX || evt.pageY)
	{
	  // FFox
	  x = evt.pageX;
	  y = evt.pageY;
	}
	else
	{
	  // IE7
	  x = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
	  y = evt.clientY + document.body.scrollTop  - document.body.clientTop;
	}
	return { x:x, y:y };
};

/*static final*/UIUtil.LEFT_MOUSE = 0;
/*static final*/UIUtil.RIGHT_MOUSE = 1;
/**
 * NOTE: method works in IE7 and FFox
 * @return 0 for left mouse, 1 for right mouse
 */
/*static*/UIUtil.getMouseButton = function( event )
{
	if ( window.navigator.appName.toLowerCase().indexOf( "explorer") >= 0 )
	{
		if ( event.button == 1 ) {return UIUtil.LEFT_MOUSE;}
		if ( event.button == 2 ) {return UIUtil.RIGHT_MOUSE;}
	}
	else
	{
		if ( event.button == 0 ) {return UIUtil.LEFT_MOUSE;}
		if ( event.button == 2 ) {return UIUtil.RIGHT_MOUSE;}
	}
	return -1; // don't know
};
/**
 * @param listOfText Array of Strings, where each String will be the text
 * of an option element child of the select
 * @param listOfValues Array of Strings, where each String will be the value
 * of the value attribute of an option element child of the select
 * @return an HTML element whose tagName is "select"
 */
/*static*/UIUtil.createSelectElem = function( listOfText, listOfValues )
{
	var select = document.createElement( "select" );
	for (var ii=0; ii<listOfValues.length; ++ii )
	{
		var opt = document.createElement( "option" );
		opt.innerHTML= XmlUtil.escapeXml( listOfText[ii] );
		opt.value = listOfValues[ii];
		select.appendChild( opt );
	}
	return select;
};

/**
 * Add an event handler
 * 
 * @param el HTML element that will generate the event
 * @param evname String name of the event WITHOUT the "on" string. For instance, to
 * handle "onmouseleave", pass the String "mouseleave".
 * @param func function object that will be called when the event is fired.
 * 
 * NOTE: code borrowed from www.dynarch.com/projects/calendar project
 */
/*static*/UIUtil.addEvent = function(el, evname, func)
{
	if (el.attachEvent) { // IE
		el.attachEvent("on" + evname, func);
	} else if (el.addEventListener) { // Gecko / W3C
		el.addEventListener(evname, func, true);
	} else {
		el["on" + evname] = func;
	}
};
/**
 * Remove an event handler
 * 
 * @param el HTML element that will generate the event
 * @param evname String name of the event WITHOUT the "on" string. For instance, to
 * handle "onmouseleave", pass the String "mouseleave".
 * @param func function object that will be called when the event is fired.
 * 
 * NOTE: code borrowed from www.dynarch.com/projects/calendar project
 */
/*static*/UIUtil.removeEvent = function(el, evname, func) {
	if (el.detachEvent) { // IE
		el.detachEvent("on" + evname, func);
	} else if (el.removeEventListener) { // Gecko / W3C
		el.removeEventListener(evname, func, true);
	} else {
		el["on" + evname] = null;
	}
};

UIUtil.getElemOffsetForAbsolutePosition = function( elem )
{
	var coord = UIUtil.getElemOffset( elem );
	coord.left += UIUtil.getScrollLeft();
	coord.top += UIUtil.getScrollTop();

	return coord;
};

/**
 * NOTE: see comment in getScrollTop
 */
UIUtil.getScrollLeft = function()
{
	return window.scrollX
		? window.scrollX
		: document.documentElement.scrollLeft + document.body.scrollLeft;
};
/**
 * NOTE: in Moz, window.pageYOffset, window.scrollY, and document.documentElement.scrollTop
 * are roughly equivalent. In some version of IE, you have to use document.body.scrollTop
 */
UIUtil.getScrollTop = function()
{
	return window.scrollY
		? window.scrollY
		: document.documentElement.scrollTop + document.body.scrollTop;
};

UIUtil.getScrollCoords = function( coords )
{
  return { left: coords.left + UIUtil.getScrollLeft(),
     top: coords.top + UIUtil.getScrollTop() };
}
// TODO sbarkdull clean up test code
/**
 * Get the (x,y) offset of the HTML element "elem" relative to the body element.
 * This method can be used to determine the (x,y) coordinates of an element that
 * is a decendant of the body element. This method does NOT consider window
 * or div scrolling.
 * 
 * @return Object an object with the properties "left" and "top", where
 * left is the left offset, and top is the top offset.
 */
/*static*/UIUtil.getElemOffset = function( elem )
{	
	var coord = { left: 0, top: 0 };
	UIUtil.internalGetOffset( elem, coord );
	return coord;
};
/*static*/UIUtil.internalGetOffset = function( elem, coords )
{
  while ( elem )
  {
  	coords.left += elem.offsetLeft;
  	coords.top += elem.offsetTop;	
  	
    elem = elem.offsetParent;
  }
  return;
};

// TODO sbarkdull clean up test code
/**
 * Get the scrollOffset of this item. The scrollOffset is the sum of all
 * scrollLeft and scrollTop for elem and its ancestors.
 * 
 * @return Object an object with the properties "left" and "top", where
 * left is the left offset, and top is the top offset.
 */
/*static*/UIUtil.getElemScrollOffset = function( elem )
{	
	var coord = { left: 0, top: 0 };
	UIUtil.internalGetScrollOffset( elem, coord );

	return coord;
};
/*static*/UIUtil.internalGetScrollOffset = function( elem, coords )
{
  while ( elem && elem.tagName && elem.tagName.toLowerCase() != "html"  )
  {
  	coords.left += elem.scrollLeft;
  	coords.top += elem.scrollTop;	
    elem = elem.parentNode;
  }
  return;
};

/**
 * @param bb0 Object with properties: left, top, right, bottom
 * @param bb1 Object with properties: left, top, right, bottom
 */
/*static*/UIUtil.doBBsIntersectX = function( bb0, bb1 )
{
  return ( bb0.left <= bb1.right && bb0.left >= bb1.left ) || ( bb0.right <= bb1.right && bb0.right >= bb1.left );
};
/**
 * @param bb0 Object with properties: left, top, right, bottom
 * @param bb1 Object with properties: left, top, right, bottom
 */
/*static*/UIUtil.doBBsIntersectY = function( bb0, bb1 )
{
  return ( bb0.top <= bb1.bottom && bb0.top >= bb1.top ) || ( bb0.bottom <= bb1.bottom && bb0.bottom >= bb1.top );
};
/**
 * @param bb0 Object with properties: left, top, right, bottom
 * @param bb1 Object with properties: left, top, right, bottom
 */
/*static*/UIUtil.doBBsIntersect = function( bb0, bb1 )
{
  return UIUtil.doBBsIntersectX( bb0, bb1 ) && UIUtil.doBBsIntersectY( bb0, bb1 );
};
/**
 * Find the bounding box that matches the location/dimensions of el.
 * 
 * @param el HTML element
 * 
 * @return Object with properties: left, top, right, bottom. These properties are
 * integers identifying the page relative coordinates of the bounding box that
 * matches the location/dimensions of the element el
 */
/*static*/UIUtil.getBoundingBox = function( el )
{
  var elemCoords = UIUtil.getElemOffset( el );
  if ( ( el.tagName.toLowerCase() != "div") || (el.tagName.toLowerCase() == "div" && el.scrollTop == 0 && el.scrollLeft == 0 ) )
  {
    var scrollOffset = UIUtil.getElemScrollOffset( el );
    elemCoords.top -= scrollOffset.top;
    elemCoords.left -= scrollOffset.left;
  }
  
  return { left: elemCoords.left, top: elemCoords.top,
    right: elemCoords.left+el.offsetWidth, bottom: elemCoords.top + el.offsetHeight};
};

/**
 * @param pt Object with properties x,y
 * @param bBox Object with properties left, top, right, bottom
 */
/*static*/UIUtil.isPointInBoundingBox = function( pt, bBox )
{
  return ((pt.y >= bBox.top) && (pt.y <= bBox.bottom))
    && ((pt.x >= bBox.left) && (pt.x <= bBox.right) );
}

/**
 * @param pt Object with properties x,y
 * @param bBox Object with properties left, top, right, bottom
 */
/*static*/UIUtil.isPointInTopHalfOfBoundingBox = function( pt, bBox )
{
  bBox.bottom = bBox.top + Math.round(( bBox.bottom-bBox.top) / 2); 
  return UIUtil.isPointInBoundingBox( pt, bBox );
}
/**
 * Is el in the visible portion of the div (as opposed to being scrolled out of view)?
 * WARNING: the current implementation of this method implements a serious optimization
 * by only considering the Y coordinates. This method will fail if you need 
 * X intersection test. To make the method general and remove the optimization, 
 * change doBBsIntersectInY() to doBBsIntersect().
 * 
 * @param el HTML element, must be a decendant of div
 */
/*static*/UIUtil.isElVisibleInDiv = function( el, div )
{
  var divBB = UIUtil.getBoundingBox( div );
  var elBB = UIUtil.getBoundingBox( el );
  var bIsIntersect = UIUtil.doBBsIntersectY( elBB, divBB );
  return bIsIntersect;
};

/**
 * Given an event object, return the element that is associated
 * with the firing of the event.
 */
/*static*/UIUtil.getSourceElement = function( event )
{
	if ( undefined != event.target )
	{
		return event.target;
	}
	else
	{
		return event.srcElement;
	}
};

/**
 * Parse the URL and return the parameters in the query string. Decode
 * all URI encoded text.
 * 
 * @param url String the url to be parse
 * @return Object the returned object will have properties that match the parameters
 * names in the query string, and the values of those properties will match the
 * values of the parameters in the query string.
 */
/*static*/UIUtil.parseQueryStringParamsFromURL = function( url )
{
	var params = new Object();
	
	var tmpAr = url.split( "?" );
	if ( tmpAr.length >= 2 && !StringUtils.isEmpty( tmpAr[1] ) )
	{
		tmpAr = tmpAr[1].split( "&" );
		for ( var ii=0; ii<tmpAr.length; ++ii )
		{
			var param = tmpAr[ ii ].split( "=" );
			params[ param[0] ] = decodeURIComponent( param[1] );
		}
	}
	
	return params;
};

/*static*/UIUtil.elemIsChildOfElem = function( childElem, parentElem )
{
	for (; childElem !== null && childElem !== parentElem; childElem = childElem.parentNode );
	return childElem !== null;
};
/*static*/UIUtil.removeAllChildren = function( elem )
{
	var children = elem.childNodes;
	while (elem.childNodes.length != 0 )
	{
		var child = elem.childNodes[0];
		elem.removeChild( child );
	}
};
// not currently used, not tested, should get the x,y coordinates
// of an html element (elem)
UIUtil.getPlacement = function( elem )
{
	var results = [];
	results[0] = 0;
	results[1] = 0;
	
	var h = 0;
	var w = 0;
	var docX = 0;
	var docY = 0;
	if( elem ) {
		h = elem.offsetHeight;
		w = elem.offsetWidth;
		var o = elem;
		while( o && o != document ) {
			docY += o.offsetTop;
			if( o.scrollTop ) {
				docY -= o.scrollTop;
			}
			docX += o.offsetLeft;
			if( o.scrollLeft ) {
				docX -= o.scrollLeft;
			}
			o = o.offsetParent;
		}
		results[0] = docX;
		results[1] = docY + elem.offsetHeight;
	}
	return results;
};

/**
 * Only works on arrays of Strings or numbers
 * NOTE: this is a 0(n) algorithm, lets keep it that way.
 */
 // TODO sbarkdull clean up
/*static*/UIUtil.getArrayIntersection = function( ar0, ar1 )
{
	var intersection = [];
	var map = new Object();
	for ( var ii=0;ii<ar0.length; ++ii )
	{
		map[ar0[ii]] = ar0[ii];
	}
	for ( var ii=0;ii<ar1.length; ++ii )
	{
		var tmp = map[ar1[ii]];
		if ( map[ar1[ii]] != undefined )
		{
			intersection.push(ar1[ii]);
		}
	}
	return intersection;
};
/**
 * Determines if obj is an element of the Array ar
 * @param ar Array array of stuff
 * @param obj any type
 * @return true of obj is in ar, else false;
 */
/*static*/UIUtil.isInArray = function( ar, obj )
{
	for ( var ii=0; ii<ar.length; ++ii )
	{
		if ( ar[ii] == obj ) return true;
	}
	return false;
};
/**
 * remove any item in targetListCtrl that is in listCtrl. The comparison for equallity
 * is done by comparing the id of the tr elements that represent the list items
 */
/*static*/UIUtil.removeListCtrlsItemsFromListCtrl = function( listCtrl, targetListCtrl )
{
	var length = listCtrl.getLength();
	for ( var ii=0; ii<length; ++ii )
	{
		UIUtil.removeListItem( targetListCtrl, listCtrl.getItem( ii ) );
	}
};

/**
 * Remove an item in listCtrl that matches trElem.itemData.getBVItem()
 */
/*static*/UIUtil.removeListItem = function( listCtrl, trElem ) {
	var bvItem = trElem.itemData.getBVItem();
	var length = listCtrl.getLength();
	for ( var ii=length-1; ii>=0; --ii )
	{
		//if ( listCtrl.getItem( ii ).id == itemId )
		if ( listCtrl.getItem( ii ).itemData.getBVItem() == bvItem )
		{
			listCtrl.removeItem( ii );
		}
	}
};

/**
 * @param item HTML element, either a tr or td
 */
/*static*/UIUtil.getColumnId = function( item )
{
	// TODO sbarkdull, do we still need this method?
	return item.id;
};

/**
 * @param listCtrl ListCtrl
 * @param item HTML tr element
 */
/*static*/UIUtil.hasItem = function( listCtrl, item )
{
	var id = UIUtil.getColumnId( item );
	for ( var ii=0; ii<listCtrl.getLength(); ++ii )
	{
		var item = listCtrl.getItem( ii );
		if ( UIUtil.getColumnId( item ) == id ) return true;
	}
	return false;
};

/*
 * one of the possible values for the nodeType attribute of a DOM node
 * See the definition of "interface Node" at http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html
 * for other node-type values.
 */
/*static*/UIUtil.ELEMENT_NODE = 1;

/**
 * Visit the node el and all of its decendents (recursively). If the node-type
 * is ELEMENT_NODE, call funk on the node. 
 * 
 */
/*static*/UIUtil.visitDomElementNodes = function( el, funk )
{
  funk( el );
  var length = el.childNodes.length;
  for ( var ii=0; ii<length; ++ii )
  {
    var childEl = el.childNodes[ii];
    if ( childEl.nodeType == UIUtil.ELEMENT_NODE )
    {
      UIUtil.visitDomElementNodes( childEl, funk );
    }
  }
}

/**
 * @param rootEl HTML node
 * @param cursorName String the name of the cursor, for instance, "wait".
 * See http://developer.mozilla.org/en/docs/CSS:cursor (Firefox) and
 * http://msdn2.microsoft.com/en-us/library/aa358795.aspx (IE) for supported cursors.
 */
/*static*/UIUtil.setCursor = function( rootEl, cursorName )
{
  UIUtil.visitDomElementNodes( rootEl, function( el )
    {
      el.style.cursor = cursorName;
    }
  );
}

/*static*/UIUtil.RE_GET_CTX_PATHNAME = /^\/([^\/]+)(\/.*)*$/;
/*static*/UIUtil.getApplicationContextName = function()
{
	var pathname = window.location.pathname;
	var parts = pathname.match( UIUtil.RE_GET_CTX_PATHNAME );
	
	return parts ? parts[1] : "error";
}