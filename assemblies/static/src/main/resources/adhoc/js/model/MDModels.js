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

MDModels = function()
{
	this.models = new Object();		// associative array aka map
	this.modelId = null;
	this.viewId = null;
}
MDModels.prototype.addBView = function( xmlNd )
{
	var modelId = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "domain_id" ) );

	if ( StringUtils.isEmpty( modelId ))
	{
		var msg = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "message" ) );
		throw new Error( Messages.getString( "unableToLoadEmptyDomainId" ) + " " + msg );
	}
	var viewId = XmlUtil.getNodeText( xmlNd.getElementsByTagName( "model_id" ) );

	if ( StringUtils.isEmpty( viewId ))
	{
		throw new Error( Messages.getString( "unableToLoadEmptyViewId" ) );
	}
	
	if ( !this.models[ modelId ] )
	{
		this.models[ modelId ] = new MDModel();
	}
	this.models[ modelId ].addBView( xmlNd );
	
	return this.models[ modelId ].getBView( viewId );
}
MDModels.prototype.addModelAsXml = function( xmlNd )
{
	var viewNds = xmlNd.getElementsByTagName( "model" );
	for( var viewNo=0; viewNo < viewNds.length; viewNo++ )
	{
		this.addBView( viewNds[ viewNo ] );
	}
}

MDModels.prototype.getBView = function( modelId, viewId )
{
	var model = this.models[ modelId ];
	return ( model ) ? model.getBView( viewId ) : null;
}

MDModels.prototype.removeBView = function( modelId, viewId ) 
{
	var model = this.models[ modelId ];
	if (model) 
	{
		model.removeBView(viewId);
	}
}

MDModels.prototype.modelsLoaded = function () {};

MDModels.prototype.modelLoaded = function () {};

MDModels.prototype.handleSelectBusinessView = function( modelId, viewId )
{	
	this.modelId = modelId;
	this.viewId = viewId;
	var businessView = this.getBView( this.modelId, this.viewId );
	if( !businessView || !businessView.isInitializationComplete() ) {
		var localThis = this;
		var loadingDescriptionAr = [ Messages.getString( "loadingDescription" ) ];	
		
		WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "getbusinessmodel",
			{ domain:this.modelId, model:this.viewId },
			function( businessModelXmlDoc )
			{
				if ( undefined !== businessModelXmlDoc )
				{
					var msg = XmlUtil.getErrorMsg( businessModelXmlDoc );
					if ( msg )
					{
						alert( msg );
					}
					else
					{
						var businessView = localThis.addBView( businessModelXmlDoc );
						if( localThis.modelLoaded ) {
							localThis.modelLoaded();
						}
					}
				}
				// else session has likely expired
			} );
	} else {
		if( localThis.modelLoaded ) {
			localThis.modelLoaded();
		}
	}
};

MDModels.prototype.loadModels = function() 
{
	var localThis = this;
	WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "listbusinessmodels", undefined, 
		function( businessModelsXmlDoc )
		{
			if ( undefined != businessModelsXmlDoc )
			{
				var msg = XmlUtil.getErrorMsg( businessModelsXmlDoc );
				if ( msg )
				{
					alert( msg );
				}

				localThis.addModelAsXml( businessModelsXmlDoc );

				if( localThis.modelsLoaded ) {
					localThis.modelsLoaded();
				}
			}
		}
	);
};

