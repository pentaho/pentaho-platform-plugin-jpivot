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


/**
 * 
 */

WizPg0 = function()
{
	this.between_1_2 = document.getElementById('img_between_1_2');
	this.between_2_3 = document.getElementById('img_between_2_3');
	this.between_3_4 = document.getElementById('img_between_3_4');
	this.after_4 = document.getElementById('img_after_4');
    
    this.step1Div = document.getElementById('step1_div');
    this.step2Div = document.getElementById('step2_div');
    this.step3Div = document.getElementById('step3_div');
    this.step4Div = document.getElementById('step4_div');
    
	this.initText();
	
	var availableTemplatesContainer = document.getElementById( "availableTemplatesContainer" );
	this.templatesListCtrl = new TemplatesListCtrl( "availableTemplatesDiv", WizPg0.CN_TEMPLATES_LIST, /*isSingleSelect*/true );
	availableTemplatesContainer.appendChild( this.templatesListCtrl.getRoot());
	this.templatesListCtrl.setDefaultSelectedItemClassName( "selectedItem" );
}
/*static*/WizPg0.CN_TEMPLATES_LIST = "columnsList";

WizPg0.prototype.initText = function()
{
	Messages.setElementText("selectModelTitle", "selectModelTitle");
	Messages.setElementText("step1DetailsTitle", "step1DetailsTitle");
	Messages.setElementText("availModelsTitle", "availModelsTitle");
	Messages.setElementText("viewsdiv", "loadingViewsProgressMsg");
	Messages.setElementText("businessViewTitle", "businessViewTitle");
	Messages.setElementText("step1Desc", "descTitle");
	Messages.setElementText("defineTmpltTitle", "defineTmpltTitle");
	Messages.setElementText("tmpltDetailsTitle", "tmpltDetailsTitle");
	Messages.setElementText("availTmpltsTitle", "availTmpltsTitle");
	Messages.setElementText("thumbnailTitle", "thumbnailTitle");
	Messages.setElementText("step1Desc2", "descTitle");
}
WizPg0.prototype.showPg = function()
{

	
	var title = Messages.getString("step1Title");
	document.getElementById('content0').style.display='block';
    
    
	this.step1Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_1_2.src = "images/steps_middle_mixed.gif";
	this.step2Div.style.backgroundImage="url('images/steps_inactive_slice.gif')";
    this.between_2_3.src = "images/steps_middle_inactive.gif";
	this.step3Div.style.backgroundImage="url('images/steps_inactive_slice.gif')";
    this.between_3_4.src = "images/steps_middle_inactive.gif";
	this.step4Div.style.backgroundImage="url('images/steps_inactive_slice.gif')";
    this.after_4.src = "images/steps_middle_inactive.gif";
    
    setHeights_step0();
}
WizPg0.prototype.hidePg = function()
{
	document.getElementById('content0').style.display='none';
}

/**
 * @param tableNames array of Strings, where each string is
 * the name of a business view in a model
 */
WizPg0.prototype.setCategories = function( tableNames )
{
	var html = "<table class='categories'>";
	for (var ii=0; ii<tableNames.length; ++ii )
	{
		html += "<tr><td>" + tableNames[ii] + "</td></tr>";
	}
	html += "</table>";
	document.getElementById('categoriesContainer').innerHTML = html;
}
/**
 * @param description String description for the current business model
 */
WizPg0.prototype.setDescription = function( description )
{
	document.getElementById('modelDescription').innerHTML = description;
}
WizPg0.prototype.updateBusinessViewSelection = function( modelId, viewId )
{
	var tblElem = document.getElementById( "businessViewList" );
	
	var elems = tblElem.getElementsByTagName( "tr" );
	for ( var ii=0; ii<elems.length; ++ii )
	{
		var elem = elems[ii];
		elem.className = "unselectedItem";
	}
	var targ = document.getElementById( modelId + "_" + viewId );
	targ.className = "selectedItem";
}
/**
 * @return TemplatesListCtrl the list control that displays the list of templates
 */
WizPg0.prototype.getTemplatesListCtrl = function()
{
	return this.templatesListCtrl;
}
 
