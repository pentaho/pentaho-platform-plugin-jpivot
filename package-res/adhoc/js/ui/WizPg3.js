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
 * 
 */
WizPg3 = function()
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
	
	var orientationTd = document.getElementById( "orientation_cell" );
	var ctrl = new RadioButtonsCtrl( undefined, "orientation" );
	var img = document.createElement( "img" );
	img.src = "images/img_portrait.png";
	ctrl.addButton( Messages.getString("portraitBtnTxt"), "portrait", img );
	var img = document.createElement( "img" );
	img.src = "images/img_landscape.png";
	ctrl.addButton( Messages.getString("landscapeBtnTxt"), "landscape", img );
	orientationTd.appendChild( ctrl.getRoot() );
	this.orientationCtrl = ctrl;
	
	var paperTypeRadioContainer = document.getElementById( "paperTypeRadioContainer" );
	ctrl = new PaperFormatCtrl();
	paperTypeRadioContainer.appendChild( ctrl.getRoot() );
	this.paperTypeCtrl = ctrl;
	
	// get a reference to each of the textareas
	this.reportDescription = document.getElementById( "reportDescription" );
	this.reportDescription.onfocus = function() { this.select();};
	
	this.reportHeader = document.getElementById( "reportHeader" );
	this.reportHeader.onfocus = function() { this.select();};
	
	this.reportFooter = document.getElementById( "reportFooter" );
	this.reportFooter.onfocus = function() { this.select();};
	
	this.pageHeader = document.getElementById( "pageHeader" );
	this.pageHeader.onfocus = function() { this.select();};
	
	this.pageFooter = document.getElementById( "pageFooter" );
	this.pageFooter.onfocus = function() { this.select();};
}
	
WizPg3.prototype.initText = function()
{
	Messages.setElementText("step4GeneralTitle", "step4GeneralTitle");
	Messages.setElementText("step4OrientationTitle", "step4OrientationTitle");
	Messages.setElementText("step4PaperTitle", "step4PaperTitle");
	Messages.setElementText("step4ReportDescTitle", "step4ReportDescTitle");
	Messages.setElementText("step4HdrTitle", "step4HdrTitle");
	Messages.setElementText("step4ReportTitle", "step4ReportTitle");
	Messages.setElementText("step4PgTitle", "step4PgTitle");
	Messages.setElementText("step4FooterTitle", "step4FooterTitle");
	Messages.setElementText("step4FooterRptTitle", "step4FooterRptTitle");
	Messages.setElementText("step4FooterPgTitle", "step4FooterPgTitle");
}
WizPg3.prototype.showPg = function()
{
	var title = Messages.getString("step4Title");

	document.getElementById('content3').style.display='block';
	
	this.step1Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_1_2.src = "images/steps_middle_active.gif";
	this.step2Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_2_3.src = "images/steps_middle_active.gif";
	this.step3Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_3_4.src = "images/steps_middle_active.gif";
	this.step4Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.after_4.src = "images/steps_middle_mixed.gif";
    
    setHeights_step3();
}
WizPg3.prototype.hidePg = function()
{
	document.getElementById('content3').style.display='none';
}
WizPg3.prototype.getOrientationCtrl = function()
{
	return this.orientationCtrl;
}
WizPg3.prototype.getPaperTypeCtrl = function()
{
	return this.paperTypeCtrl;
}

WizPg3.prototype.setReportDescription = function( value )
{
	this.reportDescription.value = value;
}
WizPg3.prototype.getReportDescription = function()
{
	return this.reportDescription.value;
}
WizPg3.prototype.setReportHeader = function( value )
{
	this.reportHeader.value = value;
}
WizPg3.prototype.getReportHeader = function()
{
	return this.reportHeader.value;
}
WizPg3.prototype.setReportFooter = function( value )
{
	this.reportFooter.value = value;
}
WizPg3.prototype.getReportFooter = function()
{
	return this.reportFooter.value;
}
WizPg3.prototype.setPageHeader = function( value )
{
	this.pageHeader.value = value;
}
WizPg3.prototype.getPageHeader = function()
{
	return this.pageHeader.value;
}
WizPg3.prototype.setPageFooter = function( value )
{
	this.pageFooter.value = value;
}
WizPg3.prototype.getPageFooter = function()
{
	return this.pageFooter.value;
}