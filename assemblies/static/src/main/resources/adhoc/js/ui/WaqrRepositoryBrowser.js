/*
* Copyright 2002 - 2017 Hitachi Vantara.  All rights reserved.
* 
* This software was developed by Hitachi Vantara and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

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
