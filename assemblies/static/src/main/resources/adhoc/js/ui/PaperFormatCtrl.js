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
