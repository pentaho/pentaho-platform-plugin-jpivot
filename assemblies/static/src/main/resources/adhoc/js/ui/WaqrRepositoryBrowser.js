/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


WaqrRepositoryBrowser = function( title, repository, rootFolderPathData, 
  fileFilterRegexp, folderFilterRegexp, onFolderChangeHandler )
{
	RepositoryBrowser.apply( this, arguments );
	this.constructor = WaqrRepositoryBrowser;
	
	var htmlCb = document.getElementById( RepositoryBrowser.CHECKBOX_ID_LIST[0] );	//get HTML checkbox
	htmlCb.checked = true;
}
WaqrRepositoryBrowser.prototype = new RepositoryBrowser();

/*static final*/RepositoryBrowser.CHECKBOX_ID_LIST = [ "browser.typeHtmlCB", "browser.typeXlsCB", "browser.typePdfCB", "browser.typeCsvCB" ];
// TODO sbarkdull, need to really get the values for next 3
WaqrRepositoryBrowser.prototype.getOutputType = function()
{
	var ans = "";
	
	var strComma = "";
	for (var ii=0; ii<RepositoryBrowser.CHECKBOX_ID_LIST.length; ++ii )
	{
		var cb = document.getElementById( RepositoryBrowser.CHECKBOX_ID_LIST[ii] );
		if (cb.checked )
		{
			ans += strComma  + cb.value;
			if ( "" == strComma )
			{
				strComma = ",";
			}
		}
	}
	return ans;
}
