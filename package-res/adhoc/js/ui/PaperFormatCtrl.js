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


PaperFormatCtrl = function()
{
  SelectCtrl.call( this, [Messages.getString( "loadingProgressMsg" )], [""] );
  this.loadPageFormatItems(); // runs async
};

PaperFormatCtrl.prototype = new SelectCtrl();

/**
 * NOTE: runs asynchronously
 */
PaperFormatCtrl.prototype.loadPageFormatItems = function()
{
  var localThis = this;
  WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "getJFreePaperSizes", undefined, 
    function( pageFormatDoc )
    {
      localThis.removeItemByIdx( 0 );  // remove the "Loading..." element
      var pageFormatNds = XmlUtil.selectNodes( pageFormatDoc, "/pageFormats/pageFormat" );
      for ( var ii=0; ii<pageFormatNds.length; ++ii )
      {
        var pageFormatNd = pageFormatNds[ ii ];
        var text = XmlUtil.getAttribute( pageFormatNd, "name" );
        var value = XmlUtil.getAttribute( pageFormatNd, "value" );
        localThis.addItem( text, value );
      }
    }
  );
};