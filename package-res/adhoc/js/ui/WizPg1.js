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
WizPg1 = function()
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
	
  // Distinct Control
  this.distinctSelectionsCbEl = document.getElementById('step2DistinctSelections');
	
	// available items ----------------
	this.availItemsCtrl = new AvailableItemsCtrl();
	var availableItemsTd = document.getElementById( WaqrWizard.ID_AVAILABLE_ITEMS_TD );
	availableItemsTd.appendChild( this.availItemsCtrl.getRoot() );

	// groups ----------------
	var addGroupsBtnTd = document.getElementById( "addGroupsBtnTd" );
	
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_arrow_right.png";
	img.alt = ">";
	img.title = Messages.getString("addColumnsToGrps");
	
	this.addGroupsBtn = new ButtonCtrl(img, ButtonCtrl.LARGE );
	this.addGroupsBtn.getRoot().title = Messages.getString("addColumnsToGrps");
	addGroupsBtnTd.appendChild( this.addGroupsBtn.getRoot());
	
	this.groupsCtrl = new GroupsCtrl( "groups_container", "container_content_scroll" );
	var groupsTd = document.getElementById( WaqrWizard.ID_GROUPS_TD );
	groupsTd.appendChild( this.groupsCtrl.getRoot() );

	var groupsListEditorTd = document.getElementById( "groupsListEditorTd" );
	this.groupsListEditorCtrl = new ListEditorButtonsCtrl();
	groupsListEditorTd.appendChild( this.groupsListEditorCtrl.getRoot() );
	this.groupsListEditorCtrl.deleteBtnCtrl.setEnabled(false);
	this.groupsListEditorCtrl.upBtnCtrl.setEnabled(false);
	this.groupsListEditorCtrl.downBtnCtrl.setEnabled(false);
	
	// details ----------------
	var addDetailsBtnTd = document.getElementById( "addDetailsBtnTd" );
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_arrow_right.png";
	img.alt = ">";
	img.title = Messages.getString("addColumnsToDetails");
	
	this.addDetailsBtn = new ButtonCtrl( img, ButtonCtrl.LARGE );
	this.addDetailsBtn.getRoot().title = Messages.getString("addColumnsToDetails");
	addDetailsBtnTd.appendChild( this.addDetailsBtn.getRoot());
	
	this.detailsCtrl = new DragItemHereListCtrl( "details_container", WaqrWizard.CN_DETAILS_LIST, ListCtrl.MULTI_SELECT );
	var detailsTd = document.getElementById( WaqrWizard.ID_DETAILS_TD );
	detailsTd.appendChild( this.detailsCtrl.getRoot());
	this.detailsCtrl.setDefaultSelectedItemClassName( "selectedItem" );

	var detailsListEditorTd = document.getElementById( "detailsListEditorTd" );
	this.detailsListEditorCtrl = new ListEditorButtonsCtrl();
	detailsListEditorTd.appendChild( this.detailsListEditorCtrl.getRoot() );
	this.detailsListEditorCtrl.deleteBtnCtrl.setEnabled(false);
	this.detailsListEditorCtrl.upBtnCtrl.setEnabled(false);
	this.detailsListEditorCtrl.downBtnCtrl.setEnabled(false);
	
	// filters ----------------
	var addFiltersBtnTd = document.getElementById( "addFiltersBtnTd" );
	
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_arrow_right.png";
	img.alt = ">";
	img.title = Messages.getString("addColumnsToFilters");
	
	this.addFiltersBtn = new ButtonCtrl( img, ButtonCtrl.LARGE );
	this.addFiltersBtn.getRoot().title = Messages.getString("addColumnsToFilters");
	addFiltersBtnTd.appendChild( this.addFiltersBtn.getRoot());
	
	this.filtersCtrl = new DragItemHereListCtrl( "filters_container", WaqrWizard.CN_FILTERS_LIST, ListCtrl.MULTI_SELECT );
	var filtersTd = document.getElementById( "filtersTd" );
	filtersTd.appendChild( this.filtersCtrl.getRoot());
	this.filtersCtrl.setDefaultSelectedItemClassName( "selectedItem" );

	var filtersListEditorTd = document.getElementById( "filtersListEditorTd" );
    
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + "icon_delete.png";
	img.alt = "X";
	img.title = Messages.getString("deleteFromFilters");
    
	this.filtersListDeleteBtn = new ButtonCtrl(img, ButtonCtrl.SMALL );
	this.filtersListDeleteBtn.getRoot().title = Messages.getString("deleteFromFilters");
	filtersListEditorTd.appendChild( this.filtersListDeleteBtn.getRoot() );
	this.filtersListDeleteBtn.setEnabled( false );
}
			
WizPg1.prototype.initText = function()
{
	Messages.setElementText("step2AvailItemsTitle", "step2AvailItemsTitle");
	Messages.setElementText("step2SelectedItemsTitle", "selectedItemsTitle");
	Messages.setElementText("step2GroupsTitle", "step2GroupsTitle");
	Messages.setElementText("step2DetailsTitle", "step2DetailsTitle");
	Messages.setElementText("step2FiltersTitle", "step2FiltersTitle");
	Messages.setElementText("distinctSelectionsLabel", "DISTINCT_SELECTIONS_LABEL");
}
WizPg1.prototype.showPg = function()
{

	var title = Messages.getString("step2Title");

	document.getElementById('content1').style.display='block';
	
    
	this.step1Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_1_2.src = "images/steps_middle_active.gif";
	this.step2Div.style.backgroundImage="url('images/steps_active_slice.gif')";
    this.between_2_3.src = "images/steps_middle_mixed.gif";
	this.step3Div.style.backgroundImage="url('images/steps_inactive_slice.gif')";
    this.between_3_4.src = "images/steps_middle_inactive.gif";
	this.step4Div.style.backgroundImage="url('images/steps_inactive_slice.gif')";
    this.after_4.src = "images/steps_middle_inactive.gif";
    
	setHeights_step1();
}
WizPg1.prototype.hidePg = function()
{
	document.getElementById('content1').style.display='none';
}
/**
 * @return GroupsCtrl
 */
WizPg1.prototype.getGroupsCtrl = function()
{
	return this.groupsCtrl;
}
/**
 * @return ListEditorButtonsCtrl
 */
WizPg1.prototype.getGroupsListEditorCtrl = function()
{
	return this.groupsListEditorCtrl;
}
/**
 * @return AvailableItemsCtrl
 */
WizPg1.prototype.getAvailableItemsCtrl = function()
{
	return this.availItemsCtrl;
}
/**
 * @return DragItemHereListCtrl
 */
WizPg1.prototype.getDetailsCtrl = function()
{
	return this.detailsCtrl;
}
/**
 * @return ListEditorButtonsCtrl
 */
WizPg1.prototype.getDetailsListEditorCtrl = function()
{
	return this.detailsListEditorCtrl;
}
/**
 * @return DragHereItemListCtrl
 */
WizPg1.prototype.getFiltersCtrl = function()
{
	return this.filtersCtrl;
}
/**
 * @return DistinctSelectionsCtrl
 */
WizPg1.prototype.getDistinctSelectionsCbEl = function()
{
  return this.distinctSelectionsCbEl;
}
/**
 * @return ButtonCtrl
 */
WizPg1.prototype.getFiltersListDeleteBtn = function()
{
	return this.filtersListDeleteBtn;
}
/**
 * @return ButtonCtrl
 */
WizPg1.prototype.getAddGroupsBtn = function()
{
	return this.addGroupsBtn;
}
/**
 * @return ButtonCtrl
 */
WizPg1.prototype.getAddDetailsBtn = function()
{
	return this.addDetailsBtn;
}
/**
 * @return ButtonCtrl
 */
WizPg1.prototype.getAddFiltersBtn = function()
{
	return this.addFiltersBtn;
}