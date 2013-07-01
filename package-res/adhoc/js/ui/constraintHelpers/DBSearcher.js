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
 * @param data Object with properties: modelId, viewId, columnId
 */
DBSearcher = function( imgId, inputId, data  )
{
	var btn = document.getElementById( imgId );
	btn.onclick = DBSearcher.handleShow;
	btn.ctrl = this;
	this.data = data;
	
	this.inputElem = document.getElementById( inputId );
	
	if ( null == DBSearcher.searchDialog )
	{
		DBSearcher.searchDialog = new DBSearchDialog( Messages.getString("searchDlgTitle") );
		DBSearcher.searchDialog.setOnOkHandler( DBSearcher.getSearchResult );
		DBSearcher.searchDialog.setOnSearchHandler( DBSearcher.searchHandler );
	}
}
/*static*/DBSearcher.searchDialog = null;
/*static*/DBSearcher.currentDBSearcher = null;	// instance of DBSearcher

/**
 * @param Object with properties: modelId, viewId, columnId
 */
/*private static*/DBSearcher.isSameData = function( data0, data1 )
{
	return ( ( null != data0 ) && ( null != data1 ) && ( data0.modelId == data1.modelId )
		&& ( data0.viewId == data1.viewId ) && ( data0.columnId == data1.columnId ) );
}
DBSearcher.handleShow = function()
{
	var event = UIUtil.getEvent( arguments );
	var btn = UIUtil.getSourceElement( event );
	DBSearcher.currentDBSearcher = btn.ctrl;
	
	if ( !DBSearcher.isSameData( DBSearcher.searchDialog.data, DBSearcher.currentDBSearcher.data ) )
	{
		DBSearcher.searchDialog.clearResults();
	}
	DBSearcher.searchDialog.setSearchData( DBSearcher.currentDBSearcher.data );
	DBSearcher.searchDialog.show();
}
DBSearcher.getSearchResult = function()
{
	var searchItem = DBSearcher.searchDialog.getSearchSelection();
	DBSearcher.currentDBSearcher.inputElem.value = searchItem;
	DBSearcher.currentDBSearcher = null;
}

DBSearcher.searchHandler = function()
{
	DBSearcher.searchDialog.okBtn.setEnabled( false );
	DBSearcher.searchDialog.clearResults();
	DBSearcher.searchDialog.addResultItem( Messages.getString("searching") );
	var data = DBSearcher.currentDBSearcher.data;
	var strSearch = DBSearcher.searchDialog.getSearchText();
	if ( StringUtils.isEmpty( strSearch ) )
	{
		DBSearcher.searchDialog.clearResults();
		return;
	}
	DBSearcher.searchDialog.busyCtrl.setText( Messages.getString("searching") );
	DBSearcher.searchDialog.busyCtrl.show();
	// convert from "normal" wildcards to SQL wildcards
	var searchStr =  StringUtils.wildcardsToSQLWildcards( strSearch );
	searchStr = 'LIKE ( [' + data.tableId + '.' + data.columnId + '];"' + searchStr + '")';
	
	var params = { 
		modelId:data.modelId, 
		viewId:data.viewId, 
		columnId:data.columnId,
		tableId:data.tableId,
		searchStr:searchStr
	};
	WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "searchTable", params, 
		function( searchResultsXmlDoc )
		{
			DBSearcher.searchDialog.busyCtrl.hide();
			DBSearcher.searchDialog.clearResults();
			if ( undefined != searchResultsXmlDoc )
			{
				var msg = XmlUtil.getErrorMsg( searchResultsXmlDoc );
				if ( msg )
				{
					alert( msg );	// TODO sbarkdull, don't use alert
				}
				else
				{
					var elems = searchResultsXmlDoc.getElementsByTagName( "row" );
					for ( var idx=0; idx<elems.length; ++idx )
					{
						var elem = elems[ idx ];
						var text = XmlUtil.getNodeText( elem );
						DBSearcher.searchDialog.addResultItem( text );
					}
				}
			}
		}
	);
}