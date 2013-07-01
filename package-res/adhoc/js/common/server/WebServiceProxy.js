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
 * @author James Dixon, Steven Barkdull
 */

 document.write("<!-- webcontext.js is written by PentahoWebContextFilter. Content of this file contains values of CONTEXT_PATH and FULLY_QUALIFIED_SERVER_URL --> \n");
 document.write("<script type='text/javascript' src='webcontext.js'></script>"); 
/**
 * This class provides a mechanism for calling a Pentaho WebService using AJAX techniques.
 * This is a stateless, static class, you should never call the ctor
 */
WebServiceProxy = function()
{
	throw new Error( Messages.getString("CTOR_CALL_UNNEEDED") );
}
/*static*/WebServiceProxy.ADHOC_WEBSERVICE_URL = CONTEXT_PATH + "AdhocWebService";

/*static*/WebServiceProxy.msgCtrl = new MessageCtrl();

/**
 * Make a call to the WebService
 * 
 * @param String url base URL to the web service (eg "AdhocWebService")
 * @param component String referring to the string selector in the adhoc web service
 * that determines which "service" will be called.
 * @parm params Object containing properties, these properties and their values
 * will be placed in the query string of the web service call
 * @param funk callback function to be called when asynchronous call returns. If this
 * value is null or undefined, the call will be made synchronously. when the callback is
 * called, if the user session has expire, funk will be passed a parameter
 * set to undefined, otherwise it will be passed the XML document (XDocument, see dom.js)
 * return be the server.
 * @param mimeType String specifying the mime type, usually text/xml, text/text, tea/bag
 * @return returns null if called asynchronously. When called synchronously, if the user
 * session has expired, it returns undefined, else returns the xml document
 * (XDocument, see dom.js) which has been initialized by the xml
 * string returned by the server.
 */
/*public static*/WebServiceProxy.post = function( url, component, params, funk, mimeType ) {
	var query = "";
	
	if ( !params )
	{
		params = new Object();
	}
  params[ "ajax" ] = "true";
  if( component ) {
	  params[ "component" ] = component;
  }

  for ( paramName in params )
  {
    query += encodeURIComponent( paramName ) + "=" + encodeURIComponent( params[paramName] ) + "&";
  }
  if ( query.charAt( query.length-1 ) == "&" )
  {
  	query = query.substr( 0, query.length-1 );
  }
  var xmlDoc = null;
  if ( funk )
  {
  	pentahoPost( url, query, 
			function( xmlStr )
			{
				WebServiceProxy.handleResponse( xmlStr, funk ); // cool, funk is in scope
			},
			mimeType );
  }
  else
  {
  	var xmlStr = pentahoPost( url, query, undefined, mimeType );
		xmlDoc = WebServiceProxy.handleResponse( xmlStr, funk ); // funk should be undefined
  }

  return xmlDoc;
}

/**
 * @param xmlStr String containing the contents of the xml document
 * received from the server.
 * @param funk type can be one of:
 * 	Object with properties obj and method: obj must be an javascript Object, and method is the
 * 	method to be called on obj (obj.method()).
 * 	function Object a javascript function object
 * 	String the name of a javascript function object
 * funk will be called and passed an xml document (XDocument). The document will contain
 * the contents of the parameter xmlStr.
 * 
 * @return if the user is authenticated, and running synchronously, return 
 * the xml document received from the server, otherwise return null.
 * If the user is not authenticated, return undefined.
 */
/*private static*/WebServiceProxy.handleResponse = function( xmlStr, funk )
{
  if ( xmlStr )
  {
  	var xmlDoc = XmlUtil.load( xmlStr );
  	if ( XmlUtil.isUserAuthorized( xmlDoc ) )
  	{
  		if ( funk )
  		{
  			WebServiceProxy.executeFunk( funk, xmlDoc );
  			return null;
  		}
  		else
  		{
  			return xmlDoc;
  		}
  	}
  	else
  	{
  		WebServiceProxy.msgCtrl.error( Messages.getString("sessionExpiredMsg") );
  		WebServiceProxy.restoreSession(); // runs asynchronously
  		if ( funk )
  		{
  			// call the client's callback, and pass undefined as the xml document
  			WebServiceProxy.executeFunk( funk, undefined );
  		}
  		return undefined;
  	}
  }
  else
  {
    // no xml returned, must be some kind of server error
    return null;
  }
}

/**
 * Call the function or method identified by the parameter funk, and pass the
 * function the parameter xmlDoc.
 * 
 * @param funk type can be one of:
 * 	Object with properties obj and method: obj must be an javascript Object, and method is the
 * 	method to be called on obj (obj.method()).
 * 	function Object a javascript function object
 * 	String the name of a javascript function object
 * funk will be called and passed the parameter xmlDoc.
 * @param xmlDoc XDocument an xml document containing the xml returned from the server.
 * 
 * @return whatever value is returned by funk
 * 
 * @throws Error when funk is an unrecognized object
 */
/*private static*/WebServiceProxy.executeFunk = function( funk, xmlDoc )
{
	if ( typeof( funk ) == "function" )
	{
		return funk( xmlDoc );
	}
	else if ( typeof( funk ) == "object" && undefined != funk.obj )
	{
		return funk.method.call( funk.obj, xmlDoc );
	}
	else if ( typeof( funk ) == "string" )
	{
		// must be a string
		var retVal;
		eval( "retVal = " + funk + "( xmlDoc );" );
		return retVal;
	}
	else
	{
		//funk must be null, which means caller wanted to run async, which means we should never get here
		throw new Error( Messages.getString("invalidWebServiceCallback") );
	}
}

/**
 * Open a new browser and send it to the uRAuthenticated.html file. If the user
 * is not authenticated, they will be redirected to the login page. Once they
 * login, the will get to the uRAuthenticated.html.
 */
/*static*/WebServiceProxy.restoreSession = function()
{
	var url = "/" + UIUtil.getApplicationContextName() + "/adhoc/uRAuthenticated.html";
	var win = window.open( url, "_blank" );
};