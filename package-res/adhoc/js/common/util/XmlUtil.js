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
 
/**
 * Code in this class operates on objects that come from dom.js
 */
XmlUtil = function()
{
}

XmlUtil.getNodeTextOrEmptyString = function( node )
{
  var txt = XmlUtil.getNodeText( node );
  return txt ? txt : "";
};

/**
 * get the node's text, or if node is an array, get node[0]'s text
 * NOTE: take a look at util.js:xmlText()
 * 
 * @param node XNode or Array of XNode
 * @return 
 */
XmlUtil.getNodeText = function ( node )
{
	// TODO sbarkdull, why do we have to check for node.length? why doesn't
	// the caller be more careful to pass in the right thing? maybe this
	// is the best we can do
	var txt = null;
	try
	{
		if ( node.length && node.length > 0 )
		{
			node = node[0];
		}
//		txt = node.firstChild.nodeValue;
		txt = xmlValue( node );
	}
	catch( e )
	{
		// the above code is expected to throw an exception
		// when node.length == 0, or there is no firstChild
	}
	return txt;
}

XmlUtil.selectSingleNode = function( xmlNode, strXpath )
{
  var ns = XmlUtil.selectNodes(xmlNode, strXpath);
  return ns[0];
}
XmlUtil.selectNodes = function( xmlNode, strXpath  )
{
  var ctx = new ExprContext( xmlNode );
//  var ns = evalNodeSet(strXpath, ctx);
//	return ns;
  var expr1 = xpathParse(strXpath);
  var result = expr1.evaluate(ctx);
  return result.nodeSetValue();
}
/* TODO sbarkdull clean up
function evalNodeSet(expr, ctx) {
  var expr1 = xpathParse(expr);
  var e = expr1.evaluate(ctx);
  return e.nodeSetValue();
}
*/

XmlUtil.appendChild = function( nd, child )
{
  return domAppendChild( nd, child );
};

XmlUtil.createTextNode = function( doc, txt )
{
  return domCreateTextNode( doc, txt );
};

XmlUtil.createElement = function( doc, name )
{
  return domCreateElement( doc, name );
};

/**
 * Sets the value of the attribute in <param>node</param>,
 * whose name is <param>name</param> to <param>value</param>.
 */
XmlUtil.setAttribute = function( node, name, value )
{
  return domSetAttribute( node, name, value );
};

/**
 * @returns String the value of the attribute in <param>node</param>,
 * whose name is <param>name</param>.
 */
XmlUtil.getAttribute = function( node, name )
{
  return domGetAttribute( node, name );
};

/**
 * @return the copied and imported node
 */
XmlUtil.importNode = function( xmlDoc, node )
{
	return xmlImportNode(xmlDoc, node );
}

XmlUtil.removeChild = function( node )
{
	if ( node.parentNode )
	{
		return node.parentNode.removeChild( node );
	}
	else
	{
		return null;
	}
}

XmlUtil.replaceNode = function( xmlDoc, newNode, oldNode )
{
	var parent = oldNode.parentNode;
	XmlUtil.importNode( xmlDoc, newNode );
	parent.replaceChild( newNode, oldNode );
}
/**
 * Convert node and all decendents to a string of xml.
 */
XmlUtil.asXml = function( node )
{
	return xmlText( node );
}

/**
 * convert the strXml to a XDocument (a DOM document)
 * 
 * @return XDocument
 */
XmlUtil.load = function( strXml )
{
  return xmlParse( strXml );
}

/**
 * Escape XML special markup chracters: tag delimiter < > and 
 * entity reference start delimiter &. The escaped string can 
 * be used in XML text portions (i.e. between tags).
 */
XmlUtil.escapeXml = function( xmlStr )
{
	return xmlEscapeText( xmlStr );
}
/**
 * escape text in an xml attribute (<>&"')
 */
XmlUtil.escapeXmlAttr = function( xmlStr )
{
	return xmlEscapeAttr( xmlStr ).replace(  /'/g, '&apos;'  );
}

// ya, i know, doesn't belong here, but it's here for now
/**
 * Check the xml for an attribute node at /adhoc/error[@msg]. If found,
 * the server returned an error msg. Extract the error message and
 * return it. If the node does not exist, it must be a normal message,
 * return null, indicating no error found.
 * 
 * @return String error message if present in the xml document, else null.
 */
XmlUtil.getErrorMsg = function( xmlDoc )
{
	var msgAttrNd = XmlUtil.selectSingleNode( xmlDoc, "/web-service/error/@msg" );
	if ( null == msgAttrNd )
	{
		return null;	// no problems here
	}
	return msgAttrNd.nodeValue;
};

XmlUtil.getStatusMsg = function( xmlDoc )
{
	var msgAttrNd = XmlUtil.selectSingleNode( xmlDoc, "/web-service/status/@msg" );
	if ( null == msgAttrNd )
	{
		return null;	// no status msg in the doc
	}
	return msgAttrNd.nodeValue;
}
// ya, i know, doesn't belong here, but it's here for now
XmlUtil.isUserAuthorized = function( xmlDoc )
{
	var expiredNd = XmlUtil.selectSingleNode( xmlDoc, "/web-service/unauthorized" );
	return !expiredNd;	// will fail on null and undefined
}

/*static*/XmlUtil.createXmlProcessingInstruction = function( version, encoding )
{
  return "<?xml version=\"" + version + "\" encoding=\"" + encoding + "\" ?>";
}