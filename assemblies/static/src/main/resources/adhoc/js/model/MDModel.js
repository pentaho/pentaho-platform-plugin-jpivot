/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 - 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/



MDModel = function()
{
	this.bViews = new Object();	// this is actually an associative array
}
MDModel.prototype.addBView = function( xmlNd )
{
	var viewId = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "model_id" ) );
	var bIsComplete = this.bViews[ viewId ] ? this.bViews[ viewId ].isInitializationComplete() : false;

	if ( !this.bViews[ viewId ] || !bIsComplete )	
	{
		this.bViews[ viewId ] = new BusinessView( xmlNd );
	}
}

MDModel.prototype.removeBView = function (viewId)
{
	if (this.bViews[viewId]) 
	{
		delete this.bViews[viewId];
	}
}

/**
 * @return BusinessView
 */
MDModel.prototype.getBView = function( viewId )
{
	return this.bViews[ viewId ];
}
