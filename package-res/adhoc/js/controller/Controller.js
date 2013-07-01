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

/*
 * REFACTORING: break this class up into several classes, one class for each page in the wizard, one for the sort
 * table, one for the constraints table, one for the template list.
 * The name of the template is now stored in the reportSpec. the reportspec is passed to the server-side
 * code (AdhocWebService). when saving and previewing, we are sending the name of the template as a
 * request parameter. we no longer need to send it as a request param since it is now in the reportspec.
 * the server-side code can examine the reportspec to determine the name of the template. Remove the
 * code that sends the template name as a request param.
 * 
 */
 
dojo.require("dojo.dnd.*");
dojo.require("dojo.event.*");

/**
 * 
 * Note on when to save:
 * In this context, to "save" means to write the contents of the user interface to the
 * Controller's reportSpec property (which is an instance of the class ReportSpec).
 * When transitioning from one page to another, the page being left (the current page)
 * must be saved.
 * When Preview, Save, or Save As buttons are clicked, the current page must be saved.
 * 
 * Query String Parameters accepted by WAQR:
 * @param logging String if present, and it's value is "on", open a console and display 
 * logging information (see global variable gLogger).
 * @param reportSpecPath String solution relative path to a waqr generated xreportspec
 * document. For instance: reportSpecPath=/samples/waqr/myReport.waqr.xreportspec
 * 
 * Parameters to the ctor:
 * @param WaqrWizard
 * @param mdModels MDModels
 */

Controller = function( wiz, mdModels )
{
  /*WaqrWizard*/
  this.wiz = wiz;
  this.mdModels = mdModels;
  this.modelId = null;
  this.viewId = null;
  this.pg2CurrItem = null;  // set to the currently selected item on page 2, item is of type RSGroupItem, RSDetailItem, RSFilterItem
  this.reportSpecCache = new Object();
  this.reportSpec = null;
  this.reportSpecPath = undefined;
  this.viewsXsl = null;
  this.viewXsl = null;
  this.currTemplatePath = null;
  
  //this.pg2Ctrlr = new Pg2Controller( this );
  
  var localThis = this; // must understand javascript's closure, http://www.jibbering.com/faq/faq_notes/closures.html
  this.processQueryString();
  
  if ( this.bIsLoggingOn )
  {
    gLogger.open( "Logger" );
  }
  
  this.waqrRepository = new WaqrRepository();
  this.solutionRepository = new SolutionRepository();
  this.repositoryBrowserController = new RepositoryBrowserController( wiz, this.solutionRepository );
  this.repositoryBrowserController.setOnAfterSaveCallback( function()
    {
      localThis.enableReportSaveBtns();
    }
  );
  var templatesListCtrl = this.wiz.getPg( 0 ).getTemplatesListCtrl();
  //NOTE: runs asynchronously
  this.loadTemplateItemsIntoList( templatesListCtrl );
  
  if ( this.reportSpecPath )
  {
    // load existing report, NOTE: runs synchronously
    this.reportSpecDoc = this.solutionRepository.getWaqrReportSpecDoc( this.reportSpecPath.solution,
      this.reportSpecPath.path, this.reportSpecPath.filename );
    var msg = XmlUtil.getErrorMsg( this.reportSpecDoc );
    if ( msg )
    {
      this.wiz.msgCtrl.error( msg );
      this.reportSpecDoc = null;
    }
  }

  /* hookup Wizard btn callbacks */
  var btn = this.wiz.getPreviewBtn();
  btn.setOnClickCallback( this.handlePreview, this );
  btn.setEnabled( false );

  btn = this.wiz.getBackBtn();
  btn.setOnClickCallback( this.prevStep, this );
  btn.setEnabled( false );
  
  btn = this.wiz.getNextBtn();
  btn.setOnClickCallback( this.nextStep, this );
  btn.setEnabled( false );
  
  btn = this.wiz.getSaveBtn();
  btn.setOnClickCallback( this.handleSaveReportSpec, this );
  btn.setEnabled( false );
  
  btn = this.wiz.getSaveAsBtn();
  btn.setOnClickCallback( this.handleSaveAsReportSpec, this );
  btn.setEnabled( false );
  
  btn = this.wiz.getCancelBtn();
  btn.setOnClickCallback( this.handleCancel, this );
  
  if ( this.reportSpecDoc === undefined && paramModelName == null )
  {
    this.showStep0();
  }
  
  // ATTENTION: the order of the method calls to get data from the server is important!
  // next, back, save*, preview buttons all need to be disabled before we can load the model
  this.getModel();  // NOTE: runs asynchronously
  
  // PMD-663: Save the information about this report's location so "save" button doesn't prompt for location
  if (undefined != this.reportSpecPath){ 
    this.repositoryBrowserController.solution = this.reportSpecPath.solution; 
    this.repositoryBrowserController.path = this.reportSpecPath.path; 
    this.repositoryBrowserController.filename = this.reportSpecPath.filename; 
  }

  /* hookup PAGE 0 callbacks */
  
  /* hookup PAGE 1 callbacks */
  var groupsListEditorCtrl = this.wiz.getPg( 1 ).getGroupsListEditorCtrl();
  groupsListEditorCtrl.setOnUpClickCallback( this.pg1MoveItemsUpInGroups, this );
  groupsListEditorCtrl.setOnDownClickCallback( this.pg1MoveItemsDownInGroups, this );
  groupsListEditorCtrl.setOnDeleteClickCallback( this.pg1DeleteItemsFromGroups, this );
  
  var detailsListEditorCtrl = this.wiz.getPg( 1 ).getDetailsListEditorCtrl();
  detailsListEditorCtrl.setOnUpClickCallback( this.pg1MoveItemsUpInDetails, this );
  detailsListEditorCtrl.setOnDownClickCallback( this.pg1MoveItemsDownInDetails, this );
  detailsListEditorCtrl.setOnDeleteClickCallback( this.pg1DeleteItemsFromDetails, this );
  
  // hookup filters related UI to callbacks
  var addGroupsBtn = this.wiz.getPg( 1 ).getAddGroupsBtn();
  addGroupsBtn.setOnClickCallback( this.handleAddSelectedAvailItemsToGroups, this );
  addGroupsBtn.setEnabled( false );
  var addDetailsBtn = this.wiz.getPg( 1 ).getAddDetailsBtn();
  addDetailsBtn.setOnClickCallback( this.handleAddSelectedAvailItemsToDetails, this );
  addDetailsBtn.setEnabled( false );
  var addFiltersBtn = this.wiz.getPg( 1 ).getAddFiltersBtn();
  addFiltersBtn.setOnClickCallback( this.handleAddSelectedAvailItemsToFilters, this );
  addFiltersBtn.setEnabled( false );
  
  var filtersListDeleteBtn = this.wiz.getPg( 1 ).getFiltersListDeleteBtn();
  filtersListDeleteBtn.setOnClickCallback( this.pg1DeleteItemsFromFilters, this );
  
  var availableItems = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  availableItems.setOnSelectCallback( 
    function( event )
    {
      var numSelectedItems = availableItems.getNumSelectedItems();
      localThis.enableAddBtns( numSelectedItems > 0 );
      return true;
    }
  );
  availableItems.setOnUnselectCallback(
    function( event )
    {
      var numSelectedItems = availableItems.getNumSelectedItems();
      localThis.enableAddBtns( numSelectedItems > 0 );
      return true;
    }
  );
  var tmp;
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  for (var grpCtrlIdx = 0; grpCtrlIdx < WaqrWizard.NUM_GROUPS; grpCtrlIdx++) {
    var groupListCtrl = groupsCtrl.getGroupList( grpCtrlIdx );
    groupListCtrl.setOnSelectCallback( this.handlePg1GroupItemSelect, this );
    groupListCtrl.setOnUnselectCallback( this.handlePg1GroupItemUnselect, this );
    groupListCtrl.setOnAddItemCallback( this.handlePg1GroupItemAdded, this );
    groupListCtrl.setOnRemoveItemCallback( this.handlePg1GroupItemRemoved, this );
    tmp = new GroupsDropTarget( this, groupListCtrl.insertLabel, Controller.ALL_DROP_TARGETS );
  }
  
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  detailsCtrl.setOnSelectCallback( this.handlePg1DetailItemSelect, this );
  detailsCtrl.setOnUnselectCallback( this.handlePg1DetailItemUnselect, this );
  detailsCtrl.setOnAddItemCallback( this.handlePg1DetailItemAdded, this );
  detailsCtrl.setOnRemoveItemCallback( this.handlePg1DetailItemRemoved, this );
  tmp = new DetailsDropTarget( this, detailsCtrl.insertLabel, Controller.ALL_DROP_TARGETS );
  
  /* hookup PAGE 2 callbacks */
  // hookup groups related UI to callbacks
  /*ROGroupsCtrl*/
  groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  groupsCtrl.setOnSelectCallback( this.handlePg2GroupItemSelect, this );
  groupsCtrl.setOnUnselectCallback( this.handlePg2GroupItemUnselect, this );
  
  // hookup details related UI to callbacks
  detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
  detailsCtrl.setOnSelectCallback( this.handlePg2DetailItemSelect, this );
  detailsCtrl.setOnUnselectCallback( this.handlePg2DetailItemUnselect, this );
  
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  filtersCtrl.setOnSelectCallback( this.handlePg1FilterItemSelect, this );
  filtersCtrl.setOnUnselectCallback( this.handlePg1FilterItemUnselect, this );
  filtersCtrl.setOnRemoveItemCallback( this.handlePg1FilterItemRemoved, this );
  tmp = new FiltersDropTarget( this, filtersCtrl.insertLabel, Controller.ALL_DROP_TARGETS );
  
  // hookup filters related UI to callbacks
  filtersCtrl = this.wiz.getPg( 2 ).getFiltersCtrl();
  filtersCtrl.setOnSelectCallback( this.handlePg2FilterItemSelect, this );
  filtersCtrl.setOnUnselectCallback( this.handlePg2FilterItemUnselect, this );
  
  // hookup callbacks for GroupHeaderEditorCtrl
  var groupHeaderEditorCtrl = this.wiz.getPg( 2 ).getGroupHeaderEditorCtrl();
  groupHeaderEditorCtrl.setOnShowGroupSummaryCheckedHandler( function()
    {
      // 'this' refers to the <input type='checkbox'> element
      groupHeaderEditorCtrl.enableGroupTotalLabel( this.checked ); // this refers to the checkbox element
      if ( StringUtils.isEmpty( groupHeaderEditorCtrl.getGroupTotalLabel() ) && this.checked )
      {
        groupHeaderEditorCtrl.setGroupTotalLabel( RSGroupHeader.DEFAULT_GROUP_TOTAL_LABEL );
      }
    }
  );

  this.constraintsController = new ConstraintsController( this );
  
  var columnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getDetailColumnSorterCtrl();
  columnSorterCtrl.setOnAddCallback( 
    function()
    {
      localThis.pg2AddSelectedDetailItemToColumnSorterCtrl();
    }
  );
  
  columnSorterCtrl.setOnDeleteCallback(
    function()
    {
      localThis.enableDetailColumnSorterCtrlAddBtn();
    }
  );
  // hookup pg 3 callbacks (currently there are no callbacks for page 3)
  // var pg3 = this.wiz.getPg( 3 );
  
}; // end ctor

/**
 * NOTE: this method is asynchronous
 */
Controller.prototype.getModel = function() 
{
  this.wiz.getBusyCtrl().setText( Messages.getString( "loadingProgressMsg" ) );
  this.wiz.getBusyCtrl().show();
  UIUtil.setCursor( document.getElementById( "content0" ), "wait" );
  var localThis = this;
  pentahoGet( "../GetResource", "resource=adhoc/businessviewlist.xsl", 
    function ( xmlStr )
    {
      localThis.viewsXsl = XmlUtil.load( xmlStr );
      pentahoGet( "../GetResource", "resource=adhoc/businessview.xsl", 
        function( xmlStr )
        {
          localThis.viewXsl = XmlUtil.load( xmlStr );
          WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "listbusinessmodels", undefined, 
            function( businessModelsXmlDoc )
            {
              localThis.wiz.getBusyCtrl().hide();
              UIUtil.setCursor( document.getElementById( "content0" ), "" );
              if ( undefined !== businessModelsXmlDoc )
              {
                var msg = XmlUtil.getErrorMsg( businessModelsXmlDoc );
                if ( msg )
                {
                  localThis.wiz.msgCtrl.error( msg );
                }
                var html = xsltProcess( businessModelsXmlDoc, localThis.viewsXsl );
                document.getElementById('viewsdiv').innerHTML = html;
  
                localThis.mdModels.addModelAsXml( businessModelsXmlDoc );

                // at this point, the metadata should all be loaded,and we should have sufficient metadata in the mdModels
                localThis.selectFirstModel( businessModelsXmlDoc );
                if( postInitFunc ) {
                  postInitFunc();
                }
              }
            });
        });
    });
};

// TODO sbarkdull: this has been upgraded to new MetaData names
/**
 * @param xmlDoc XDocument (see dom.js) the xml document with the model's metadata.
 * This document is typically retrieved by calling AdhocWebService with the component
 * set to "listbusinessmodels".
 * If we are loading a previous xreportspec to edit, find it's domain and view Id, and 
 * select them. Otherwise, we are not loading a previous xreportspec, so simply
 * select the first model in the metadata.
 * @throws Error if either the domain Id or model Id is missing from the XML document
 */
/*private*/Controller.prototype.selectFirstModel = function( xmlDoc ) 
{
  var domainNd = null;
  var modelNd = null;
  if ( this.reportSpecDoc )
  {
    // selecting the model identified in the reportspec that is being loaded/edited
    domainNd = XmlUtil.selectSingleNode( this.reportSpecDoc, "/report-spec/query/mql/domain_id" );
    modelNd = XmlUtil.selectSingleNode( this.reportSpecDoc, "/report-spec/query/mql/model_id" );
  }
  else
  {
    // selecting the first model in the returned list of models
    var modelNd = XmlUtil.selectSingleNode( xmlDoc, "/metadata/models/model" );
    if ( modelNd )
    {
      domainNd = XmlUtil.selectSingleNode( modelNd, "domain_id" );
      modelNd = XmlUtil.selectSingleNode( modelNd, "model_id" );
    }
  }
  if ( !domainNd || !modelNd )
  {
    var msg = Messages.getString("ERROR_NO_BUSINESS_MODELS");
    this.wiz.msgCtrl.error( msg );
  }
  else
  {
    var domainId = XmlUtil.getNodeText( domainNd );
    var modelId = XmlUtil.getNodeText( modelNd );
    this.handleSelectBusinessView( domainId, modelId );
  }
};

Controller.AVAIL_COL_DRAG_ID = "availColumn";
Controller.GROUP_DRAG_ID = "group";
Controller.FILTER_DRAG_ID = "filter";
Controller.DETAIL_DRAG_ID = "detail";

Controller.prototype.enableAddBtns = function( bIsEnable )
{
  var btn = this.wiz.getPg( 1 ).getAddGroupsBtn();
  btn.setEnabled( bIsEnable );
  btn = this.wiz.getPg( 1 ).getAddDetailsBtn();
  btn.setEnabled( bIsEnable );
  btn = this.wiz.getPg( 1 ).getAddFiltersBtn();
  btn.setEnabled( bIsEnable );
};

Controller.prototype.loadGroupItemEditor = function( item )
{
  var groupItemEditorCtrl = this.wiz.getPg( 2 ).getGroupItemEditorCtrl();
  groupItemEditorCtrl.setType( item.getBVItem().physicalType );
  groupItemEditorCtrl.setFormat( item.format );
  groupItemEditorCtrl.setAlignment( item.alignment );
};

Controller.prototype.loadMqlOptionsEditor = function()
{
  var bIsDisableDistinct = this.reportSpec.getDisableDistinct();
  var distinctSelectionsCbEl = this.wiz.getPg( 1 ).getDistinctSelectionsCbEl();
  distinctSelectionsCbEl.checked = !bIsDisableDistinct;
}

/**
 * Get the appropriate information from the item and initialize the group header
 * UI control. Item must be of type RSGroupHeader
 */
Controller.prototype.loadGroupHeaderEditor = function( item )
{
  if ( item.constructor != RSGroupHeader )
  {
    throw new Error( Messages.getString("invalidGrpHdr") );
  }
  var groupHeaderEditorCtrl = this.wiz.getPg( 2 ).getGroupHeaderEditorCtrl();
  groupHeaderEditorCtrl.setLevelName( item.levelName );
  groupHeaderEditorCtrl.setRepeatGroupHeader( item.isRepeatGroupHeader );
  groupHeaderEditorCtrl.setAlignment( item.alignment );
  groupHeaderEditorCtrl.setPageBreak( item.pageBreak );
  groupHeaderEditorCtrl.setShowGroupSummary( item.bShowGroupSummary );
  groupHeaderEditorCtrl.setGroupTotalLabel( item.groupTotalLabel );
};
/**
 * @param event
 * @throws Error if the object in the list-item's itemData property is not
 * of type RSGroupHeader or RSGroupItem.
 */
Controller.prototype.handlePg2GroupItemSelect = function( event )
{ 
  this.unselectDetailItem();
  this.unselectFilterItem();
  
  var selectTrElem = event.selectTrElem;  
  var item = selectTrElem.itemData;
  this.pg2CurrItem = item;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  
  if ( item.constructor == RSGroupHeader )
  {
    this.loadGroupHeaderEditor( item );
    
    var ctrl = this.wiz.getPg( 2 ).getGroupHeaderEditorCtrl();
    ctrl.show();
  }
  else if ( item.constructor == RSGroupItem )
  {
    this.loadGroupItemEditor( item );

    var columnSorterEditorCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
    columnSorterEditorCtrl.showGroupSorter();   
    
    var ctrl = this.wiz.getPg( 2 ).getGroupItemEditorCtrl();
    ctrl.show();
    ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
    ctrl.show();
    ctrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
    ctrl.show();    
  }
  else
  {
    throw new Error( Messages.getString("invalidGrpListItem") );
  }
  setHeights_step2();
  return true;
};
/**
 * @throws Error if the object in the list-item's itemData property is not
 * of type RSGroupHeader or RSGroupItem.
 */
Controller.prototype.handlePg2GroupItemUnselect = function( event )
{
  var ctrl;
  this.pg2CurrItem = null;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  
  var unselectTrElem = event.unselectTrElem;  
  var item = unselectTrElem.itemData;
  
  if ( item.constructor == RSGroupHeader )
  {
    this.saveGroupHeader( item );
    ctrl = this.wiz.getPg( 2 ).getGroupHeaderEditorCtrl();
    ctrl.hide();
  }
  else if ( item.constructor == RSGroupItem )
  {
    this.saveGroupItem( item );
    ctrl = this.wiz.getPg( 2 ).getGroupItemEditorCtrl();
    ctrl.hide();
    ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
    ctrl.hide();
    ctrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
    ctrl.hide();  
  }
  else
  {
    throw new Error( Messages.getString("invalidGrpListItem") );
  }
  return true;
};

/**
 * On pg2, get the item from the group items, details, and 
 * filters list that is currently selected.
 * 
 * @return Object the tr element of the currently selected item
 */
Controller.prototype.getPg2CurrentlySelectedItem = function()
{
  var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  var trs = groupsCtrl.getSelectedItems();
  if ( trs.length > 0 )
  {
    return trs[0];
  }
  var detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
  trs = detailsCtrl.getSelectedItems();
  if ( trs.length > 0 )
  {
    return trs[0];
  }
  var filtersCtrl = this.wiz.getPg( 2 ).getFiltersCtrl();
  trs = filtersCtrl.getSelectedItems()
  if ( trs.length > 0 )
  {
    return trs[0];
  }
  return null;
};

/**
 * @param item RSGroupHeader
 */
Controller.prototype.saveGroupHeader = function( item )
{
  if ( item.constructor != RSGroupHeader )
  {
    throw new Error( Messages.getString("invalidGrpHdr") );
  }
  var pg2 = this.wiz.getPg( 2 );
  var groupHeaderEditorCtrl = pg2.getGroupHeaderEditorCtrl();
  
  item.levelName = groupHeaderEditorCtrl.getLevelName();
  item.isRepeatGroupHeader = groupHeaderEditorCtrl.getRepeatGroupHeader();
  item.alignment = groupHeaderEditorCtrl.getAlignment();
  item.pageBreak = groupHeaderEditorCtrl.getPageBreak();
  item.bShowGroupSummary = groupHeaderEditorCtrl.getShowGroupSummary();
  item.groupTotalLabel = groupHeaderEditorCtrl.getGroupTotalLabel();
};

/**
 * @param item RSGroupHeader
 */
Controller.prototype.saveGroupItem = function( item )
{
  if ( item.constructor != RSGroupItem )
  {
    throw new Error( Messages.getString("invalidGrpItem") );
  }
  var pg2 = this.wiz.getPg( 2 );
  var groupItemEditorCtrl = pg2.getGroupItemEditorCtrl();
  item.format = groupItemEditorCtrl.getFormat();
  item.alignment = groupItemEditorCtrl.getAlignment();
};

Controller.prototype.unselectGroupItem = function()
{
  var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  var itemIdxs = groupsCtrl.getSelectedItemIdxs();

  if ( itemIdxs.length > 0 )
  {
    var itemIdx = itemIdxs[0];
    groupsCtrl.unselectItem( itemIdx );
  }
};

Controller.prototype.updatePg1FilterEditorBtns = function() {
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  var filtersListDeleteBtn = this.wiz.getPg( 1 ).getFiltersListDeleteBtn();
  filtersListDeleteBtn.setEnabled(filtersCtrl.getNumSelectedItems() > 0);
  return true;
};

Controller.prototype.updatePg1GroupEditorBtns = function() {
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var numSelectedGrps = groupsCtrl.getNumSelectedItems();
  var selectedIdxs = groupsCtrl.getSelectedItemIdxs();
  var groupsListEditorCtrl = this.wiz.getPg( 1 ).getGroupsListEditorCtrl();
  groupsListEditorCtrl.deleteBtnCtrl.setEnabled((numSelectedGrps > 0) && groupsCtrl.canRemoveSelectedItems(selectedIdxs));
  groupsListEditorCtrl.upBtnCtrl.setEnabled((numSelectedGrps > 0) && groupsCtrl.canMoveSelectedItemsUp(selectedIdxs));
  groupsListEditorCtrl.downBtnCtrl.setEnabled((numSelectedGrps > 0) && groupsCtrl.canMoveSelectedItemsDown(selectedIdxs));
  return true;
};

Controller.prototype.updatePg1DetailEditorBtns = function() {
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var itemsSelected = false;
  var firstItemSelected = false;
  var lastItemSelected = false;
  if (detailsCtrl.getLength() > 0) {
    itemsSelected = (detailsCtrl.getNumSelectedItems() > 0);
    firstItemSelected = detailsCtrl.isItemSelected(detailsCtrl.getItem(0));
    lastItemSelected = detailsCtrl.isItemSelected(detailsCtrl.getItem(detailsCtrl.getLength() - 1));
  }
  var detailsListEditorCtrl = this.wiz.getPg( 1 ).getDetailsListEditorCtrl();
  detailsListEditorCtrl.deleteBtnCtrl.setEnabled(itemsSelected);
  detailsListEditorCtrl.upBtnCtrl.setEnabled(itemsSelected && !firstItemSelected);
  detailsListEditorCtrl.downBtnCtrl.setEnabled(itemsSelected && !lastItemSelected);
  
  return true;
};

Controller.prototype.handlePg1GroupItemAdded = function( )
{
  this.updatePg1GroupEditorBtns();
};

Controller.prototype.handlePg1GroupItemRemoved = function( )
{
  this.updatePg1GroupEditorBtns();
};

Controller.prototype.handlePg1GroupItemSelect = function( event )
{
  this.updatePg1GroupEditorBtns();
};

Controller.prototype.handlePg1GroupItemUnselect = function( event )
{
  this.updatePg1GroupEditorBtns();
};

Controller.prototype.handlePg1DetailItemAdded = function( )
{
  this.updatePg1DetailEditorBtns();
};

Controller.prototype.handlePg1DetailItemRemoved = function( )
{
  this.updatePg1DetailEditorBtns();
};

Controller.prototype.handlePg1DetailItemSelect = function( event )
{
  this.updatePg1DetailEditorBtns();
};

Controller.prototype.handlePg1DetailItemUnselect = function( event )
{
  this.updatePg1DetailEditorBtns();
};

Controller.prototype.handlePg2DetailItemSelect = function( event )
{
  this.unselectGroupItem();
  this.unselectFilterItem();
  
  var selectTrElem = event.selectTrElem;  
  var item = selectTrElem.itemData;
  this.pg2CurrItem = item;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  
  var columnSorterEditorCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
  columnSorterEditorCtrl.showDetailSorter();    
  
  this.enableDetailColumnSorterCtrlAddBtn();
  this.loadDetailItemEditor( item );
  
  var ctrl = this.wiz.getPg( 2 ).getDetailItemEditorCtrl();
  ctrl.show();
  ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
  ctrl.show();
  ctrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
  ctrl.show();
  setHeights_step2();
  
  return true;
};

Controller.prototype.handlePg2DetailItemUnselect = function( event )
{ 
  this.pg2CurrItem = null;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  
  var unselectTrElem = event.unselectTrElem;  
  var item = unselectTrElem.itemData;  // RSDetailItem
  this.saveDetailItem( item );
  
  var ctrl = this.wiz.getPg( 2 ).getDetailItemEditorCtrl();
  ctrl.hide();
  ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
  ctrl.hide();
  ctrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl();
  ctrl.hide();
  
  return true;
};

Controller.prototype.saveDetailItem = function( item )
{
  if ( item.constructor != RSDetailItem )
  {
    throw new Error( Messages.getString("invalidDetailItem") );
  }
  var pg2 = this.wiz.getPg( 2 );
  
  var detailItemEditorCtrl = pg2.getDetailItemEditorCtrl();
  item.format = detailItemEditorCtrl.getFormat();
  item.alignment = detailItemEditorCtrl.getAlignment();
  item.aggregatorFunc = detailItemEditorCtrl.getAggregatorFunc();
};
Controller.prototype.loadDetailItemEditor = function( item )
{
  var detailItemEditorCtrl = this.wiz.getPg( 2 ).getDetailItemEditorCtrl();
  
  detailItemEditorCtrl.setType( item.getBVItem().physicalType );
  detailItemEditorCtrl.setFormat( item.format );
  detailItemEditorCtrl.setAlignment( item.alignment );
  detailItemEditorCtrl.setAggregatorFunc( item.aggregatorFunc );
};
Controller.prototype.unselectDetailItem = function()
{
  var detailsCtrl =  this.wiz.getPg( 2 ).getDetailsCtrl();
  var itemIdxs = detailsCtrl.getSelectedItemIdxs();
  if ( itemIdxs.length > 0 )
  {
    var itemIdx = itemIdxs[0];
    detailsCtrl.unselectItem( itemIdx );
  }
};

Controller.prototype.handlePg1FilterItemRemoved = function( event )
{
  this.updatePg1FilterEditorBtns();
  return true;
};

Controller.prototype.handlePg1FilterItemSelect = function( event )
{
  this.updatePg1FilterEditorBtns();
  return true;
};

Controller.prototype.handlePg1FilterItemUnselect = function( event )
{
  this.updatePg1FilterEditorBtns();
  return true;
};

Controller.prototype.handlePg2FilterItemSelect = function( event )
{
  this.unselectGroupItem(); 
  this.unselectDetailItem();
  
  var selectTrElem = event.selectTrElem;  
  var item = selectTrElem.itemData;
  this.pg2CurrItem = item;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  
  var ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
  ctrl.show();
  setHeights_step2();

  return true;
};

Controller.prototype.handlePg2FilterItemUnselect = function( event )
{
  this.pg2CurrItem = null;
  this.wiz.getPg( 2 ).getConstraintsEditorCtrl().getConstraintsCtrl().getAddBtn().setEnabled( null !== this.pg2CurrItem );
  var ctrl = this.wiz.getPg( 2 ).getConstraintsEditorCtrl();
  ctrl.hide();
  
  var unselectTrElem = event.unselectTrElem;  
  var item = unselectTrElem.itemData;
  this.saveFilterItem( item );

  return true;
};

Controller.prototype.pg2LoadGroupsCtrlHeadersFromReportSpec = function()
{
  var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  for ( var groupIdx=0; groupIdx<WaqrWizard.NUM_GROUPS; ++groupIdx )
  {
      var groupHeader = this.reportSpec.getGroupHeader( groupIdx );
      groupsCtrl.setGroupHeaderData( groupHeader, groupIdx );
  }
};
  
/**
 * @param pg WizPg1 or WizPg2
 */
Controller.prototype.loadGroupsCtrlFromReportSpec = function( pgNum )
{
  var pg = this.wiz.getPg( pgNum );
  /*groupsCtrl of type GroupsCtl if page 1, else ROGroupsCtrl if page 2*/
  var groupsCtrl = pg.getGroupsCtrl();
  groupsCtrl.removeAllItems();
  
  var numGroups = this.reportSpec.getNumGroups();
  var localThis = this;
  for (var groupIdx=0; groupIdx<numGroups; ++groupIdx )
  {
    var numItems = this.reportSpec.getNumGroupItems( groupIdx );
    for ( var itemIdx=0; itemIdx<numItems; ++itemIdx )
    {
      var rsItem = this.reportSpec.getGroupItem( groupIdx, itemIdx );
      var bvItem = rsItem.getBVItem();
      if ( rsItem.constructor != RSGroupItem )
      {
        throw new Error( Messages.getString("invalidGrpItem") );
      }
      var trElem = groupsCtrl.addGroupItem( groupIdx, itemIdx, bvItem.name, bvItem.columnId, rsItem );
      if ( pgNum == 1 )
      {
        var tmp = new DragSource( trElem, Controller.GROUP_DRAG_ID,
          function( dragType )
          {
            return localThis.isValidDragSource( dragType );
          }
         );
        tmp = new GroupsDropTarget( this, trElem, Controller.ALL_DROP_TARGETS );
      }
    }
  }
};

/**
 * @param pg WizPg1 or WizPg2
 */
Controller.prototype.loadDetailsCtrlFromReportSpec = function( pgNum )
{
  var pg = this.wiz.getPg( pgNum );
  var detailsCtrl = pg.getDetailsCtrl();
  detailsCtrl.removeAll();
  var numDetails = this.reportSpec.getNumDetails();
  var localThis = this;
  for (var itemIdx=0; itemIdx<numDetails; ++itemIdx )
  {
    var rsItem = this.reportSpec.getDetailItem( itemIdx );
    var bvItem = rsItem.getBVItem();
    if ( rsItem.constructor != RSDetailItem )
    {
      throw new Error( Messages.getString("invalidDetailItem") );
    }
    var trElem = detailsCtrl.addItem( bvItem.name, bvItem.columnId, itemIdx, rsItem );
    if ( pgNum == 1 )
    {
      var tmp = new DragSource( trElem, Controller.DETAIL_DRAG_ID,
        function( dragType )
        {
          return localThis.isValidDragSource( dragType );
        }
       );
      tmp = new DetailsDropTarget( this, trElem, Controller.ALL_DROP_TARGETS );
    }
  }
};

/**
 * @param pg WizPg1 or WizPg2
 */
Controller.prototype.loadFiltersCtrlFromReportSpec = function( pgNum )
{
  var pg = this.wiz.getPg( pgNum );
  var filtersCtrl = pg.getFiltersCtrl();
  filtersCtrl.removeAll();
  var numFilters = this.reportSpec.getNumFilters();
  var localThis = this;
  for (var itemIdx=0; itemIdx<numFilters; ++itemIdx )
  {
    var rsItem = this.reportSpec.getFilterItem( itemIdx );
    var bvItem = rsItem.getBVItem();
    if ( rsItem.constructor != RSFilterItem )
    {
      throw new Error( Messages.getString("invalidFilterItem") );
    }
    var trElem = filtersCtrl.addItem( bvItem.name, bvItem.columnId, itemIdx, rsItem );
    if ( pgNum == 1 )
    {
      var tmp = new DragSource( trElem, Controller.FILTER_DRAG_ID,
        function( dragType )
        {
          return localThis.isValidDragSource( dragType );
        }
       );
      tmp = new FiltersDropTarget( this, trElem, Controller.ALL_DROP_TARGETS );
    }
  }
};

Controller.prototype.unselectFilterItem = function()
{
  var filtersCtrl =  this.wiz.getPg( 2 ).getFiltersCtrl();
  var itemIdxs = filtersCtrl.getSelectedItemIdxs();
  if ( itemIdxs.length > 0 )
  {
    var itemIdx = itemIdxs[0];
    filtersCtrl.unselectItem( itemIdx );
  }
};

Controller.prototype.saveFilterItem = function( item )
{
  if ( item.constructor != RSFilterItem )
  {
    throw new Error( Messages.getString("invalidFilterItem") );
  }
  var pg = this.wiz.getPg( 2 );
};

Controller.prototype.nextStep = function()
{
  if ( this.wiz.currPgNum < WaqrWizard.NUM_PGS-1 )
  {
    eval( "this.showStep" + ( this.wiz.currPgNum + 1 ).toString() + "();" );
  }
};
Controller.prototype.prevStep = function()
{
  if ( this.wiz.currPgNum > 0 )
  {
    eval( "this.showStep" + ( this.wiz.currPgNum - 1 ).toString() + "();" );
  }
};

Controller.prototype.validateCurrStep = function()
{
  return this.validateStep( this.wiz.currPgNum );
};

Controller.prototype.validateStep = function( stepNum )
{
  var isValid = true;
  if ( this.wiz.currPgNum >= 0 )
  {
    var str = "isValid = this.validateStep" + stepNum.toString() + "();";
    eval( str );
  }
  return isValid;
};
Controller.prototype.validateStep0 = function()
{ 
  // TODO sbarkdull, improve validation checking, put in method? do it for other steps too
  var businessView = this.mdModels.getBView( this.modelId, this.viewId );
  if( businessView === null ) {
    this.wiz.msgCtrl.warn( Messages.getString("selectBusinessModelWarn") );
    return false;
  }
  else
  {
    return true;
  }
};
Controller.prototype.validateStep1 = function()
{
  return true;
};

Controller.prototype.validateStep2 = function()
{
  var bIsConstraintsValid = this.constraintsController.validateConstraintsCtrls();
  if ( !bIsConstraintsValid )
  {
    var msg = Messages.getString("CONSTRAINTS_INVALID");
    this.wiz.msgCtrl.error( msg );
  }
  return bIsConstraintsValid;
};
Controller.prototype.validateStep3 = function()
{
  return true;
};

Controller.prototype.endCurrStep = function()
{
  var currPg = this.wiz.currPgNum;
  if ( currPg >= 0 )
  {
    this.endStep( currPg );
  }
};

Controller.prototype.endStep = function( stepNum )
{
  eval( "this.endStep" + stepNum + "();" );
};
Controller.prototype.endStep0 = function()
{
  this.savePg0();
  this.wiz.hidePg( 0 );
};
Controller.prototype.endStep1 = function()
{
  this.savePg1();
  this.wiz.hidePg( 1 );
};
Controller.prototype.endStep2 = function()
{
  this.savePg2();
  this.unselectGroupItem(); 
  this.unselectDetailItem();
  this.unselectFilterItem();
  this.wiz.hidePg( 2 );
};
Controller.prototype.endStep3 = function()
{
  this.savePg3();
  this.wiz.hidePg( 3 );
};
Controller.prototype.beginStep = function( stepNum )
{ 
  eval( "this.beginStep" + stepNum + "();" );
};
Controller.prototype.beginStep0 = function()
{
  this.wiz.getBackBtn().setEnabled( false );
  this.wiz.showPg( 0 );
};
// TODO sbarkdull, refreshing the pg 1 group control is likely not necessary since
// pg 2 doesn't allow addding or removing columns
Controller.prototype.beginStep1 = function()
{
  this.loadGroupsCtrlFromReportSpec( 1 );
  this.loadDetailsCtrlFromReportSpec( 1 );
  this.loadFiltersCtrlFromReportSpec( 1 );
  this.loadMqlOptionsEditor();
  // MB
  // Synchronize the chosen status with the state of what's in the
  // selected boxes on the right.
  this.refreshAllChosenAvailItems();
  
  // enable buttons as appropriate
  this.wiz.getNextBtn().setEnabled( true );
  this.wiz.getBackBtn().setEnabled( true );
  this.enableReportSaveBtns();
    
  this.wiz.showPg( 1 );
};
Controller.prototype.beginStep2 = function()
{
  this.wiz.getNextBtn().setEnabled( true );
  this.wiz.getBackBtn().setEnabled( true );
  
  this.enableReportSaveBtns();
  
  this.pg2LoadGroupsCtrlHeadersFromReportSpec();
  this.loadGroupsCtrlFromReportSpec( 2 );
  this.loadDetailsCtrlFromReportSpec( 2 );
  this.loadFiltersCtrlFromReportSpec( 2 );
  this.constraintsController.setEditorTab();
  this.constraintsController.loadConstraintsUiFromModel();
  this.pg2LoadDetailColumnSorterCtrlFromReportSpec();
  this.pg2LoadGroupColumnSorterCtrlFromReportSpec();

  this.wiz.showPg( 2 );
};
Controller.prototype.beginStep3 = function()
{ 
  this.wiz.getNextBtn().setEnabled( false );
  this.wiz.getBackBtn().setEnabled( true );
  
  this.enableReportSaveBtns();
  
  var pg3 = this.wiz.getPg( 3 );
  
  var orientationCtrl = pg3.getOrientationCtrl();
  orientationCtrl.setValue( this.reportSpec.pageOrientation );
  var paperTypeCtrl = pg3.getPaperTypeCtrl();
  paperTypeCtrl.setValue( this.reportSpec.paperType );
  
  pg3.setReportDescription( this.reportSpec.reportDescription );
  pg3.setReportHeader(this.reportSpec.reportHeader );
  pg3.setReportFooter( this.reportSpec.reportFooter );
  pg3.setPageHeader( this.reportSpec.pageHeader );
  pg3.setPageFooter( this.reportSpec.pageFooter );

  this.wiz.showPg( 3 );
};

Controller.prototype.saveCurrPg = function()
{
  eval( "this.savePg" + this.wiz.currPgNum + "();" );
};

Controller.prototype.savePg0 = function()
{
  this.saveTemplate();
};

/**
 * If the user has changed the template selection, merge the new template
 * with the reportspec, and save the new template name into this.reportSpec
 */
Controller.prototype.saveTemplate = function()
{
  // has the user changed the template in the UI?
  if ( this.hasTemplateChanged() )
  {
    var templateName = null;
    var listTemplateInfo = this.getTemplateInfoFromUI();
    // the user has changed the template in the UI, lets merge it and save the name
    if ( null != listTemplateInfo )
    {
      this.mergeTemplateWithReportSpec( listTemplateInfo.templateFolderPath,
        listTemplateInfo.xreportspecTemplate );
      var templateName = listTemplateInfo.templateName;
    }
    this.reportSpec.setTemplateName( templateName );
  }
};

/**
 * Has the user changed the template in the UI?
 * 
 * @return true if the user has changed the template in the UI, else false
 */
Controller.prototype.hasTemplateChanged = function()
{
  var listTemplateInfo = this.getTemplateInfoFromUI();
  var listTemplateName = ( listTemplateInfo != null ) ? listTemplateInfo.templateName : null;
  var rsTemplateName = this.reportSpec.getTemplateName();
  return listTemplateName != rsTemplateName;
};

/**
 * Get the template information associated with the currently selected item
 * in the template list on page 0. Return null if no item is selected.
 * 
 * @return Object with properties: templateName, templateDescription,
 * templateIcon, jfreeTemplate, xreportspecTemplate, templateFolderPath if
 * an item is selected in the template list, else return null.
 */
Controller.prototype.getTemplateInfoFromUI = function()
{
  var listTemplateInfo = null;
  var trElem = null;
  
  var templatesListCtrl = this.wiz.getPg( 0 ).getTemplatesListCtrl();
  var selectedTrElems = templatesListCtrl.getSelectedItems();
  if (selectedTrElems.length > 0 )
  {
    trElem = selectedTrElems[0];
    /*
     * trElem.itemData has properties: templateName, templateDescription,
     * templateIcon, jfreeTemplate, xreportspecTemplate, templateFolderPath
     */
    listTemplateInfo = trElem.itemData;
  }
  
  return listTemplateInfo;
};
  
  
/**
 * NOTE: only one item from the 3 lists can be selected at a time.
 */
Controller.prototype.savePg1 = function()
{
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  
  this.savePg1Groups( groupsCtrl );
  this.savePg1Details( detailsCtrl );
  this.savePg1Filters( filtersCtrl );
  this.saveMqlOptions();
};
/**
 * This method could have been called "saveCurrentPg2Editor".
 * 
 * NOTE: only one item from the 3 lists can be selected at a time.
 */
Controller.prototype.savePg2 = function()
{
  this.constraintsController.saveConstraintsUiToModel();
  var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  var trs = groupsCtrl.getSelectedItems();
  if ( trs.length > 0 )
  {
    if ( trs[0].itemData.constructor == RSGroupHeader )
    {
      this.saveGroupHeader( trs[0].itemData );
    }
    else if ( trs[0].itemData.constructor == RSGroupItem )
    {
      this.saveGroupItem( trs[0].itemData );
    }
    else
    { 
      throw new Error( Messages.getString("invalidGrpListItem") );  
    }
  }
  else
  {
    var detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
    trs = detailsCtrl.getSelectedItems();
    if ( trs.length > 0 )
    {
      this.saveDetailItem( trs[0].itemData );
    }
    else
    {
      var filtersCtrl = this.wiz.getPg( 2 ).getFiltersCtrl();
      trs = filtersCtrl.getSelectedItems();
      if ( trs.length > 0 )
      {
        this.saveFilterItem( trs[0].itemData );
      }
    }
  }
  
  this.pg2SaveDetailColumnSorterCtrl();
  this.pg2SaveGroupColumnSorterCtrl();
};
Controller.prototype.savePg3 = function()
{
  var pg3 = this.wiz.getPg( 3 );
  
  var orientationCtrl = pg3.getOrientationCtrl();
  this.reportSpec.pageOrientation = orientationCtrl.getValue();
  var paperTypeCtrl = pg3.getPaperTypeCtrl();
  this.reportSpec.paperType = paperTypeCtrl.getValue();
  
  this.reportSpec.reportDescription = pg3.getReportDescription();
  this.reportSpec.reportHeader = pg3.getReportHeader();
  this.reportSpec.reportFooter = pg3.getReportFooter();
  this.reportSpec.pageHeader = pg3.getPageHeader();
  this.reportSpec.pageFooter = pg3.getPageFooter( );
};

Controller.prototype.saveMqlOptions = function()
{
  var distinctSelectionsCbEl = this.wiz.getPg( 1 ).getDistinctSelectionsCbEl();
  this.reportSpec.setDisableDistinct( !distinctSelectionsCbEl.checked );
};

/**
 * "ReportSaveBtns" are Save, Save as, and Go
 */
Controller.prototype.enableReportSaveBtns = function()
{
  var bEnable = this.wiz.getPg( 1 ).getDetailsCtrl().getLength() > 0;
  var bIsSaving = this.repositoryBrowserController.bIsSaving;

  if(window.parent && window.parent.mantle_initialized == true){
      window.parent.enableAdhocSave( bEnable && !bIsSaving );
  }
  this.wiz.getPreviewBtn().setEnabled( bEnable );
  this.wiz.getSaveBtn().setEnabled( bEnable && !bIsSaving );
  this.wiz.getSaveAsBtn().setEnabled( bEnable && !bIsSaving  );
};
Controller.prototype.setBView = function( modelId, viewId )
{
  this.modelId = modelId;
  this.viewId = viewId;
  
  // if there is a data access edit button defined, enable it if it's a new model
  if (dataAccessEditBtn) {
  dataAccessEditBtn.setEnabled(true);
	  if (viewId == 'MODEL_1') {
		  dataAccessEditBtn.setEnabled(true);
	  } else {
		  dataAccessEditBtn.setEnabled(false);
	  }
  }
  
};

// TODO sbarkdull any item being added to the group ctrl needs to be removed
// from the ColumnSorterCtrl
Controller.prototype.addItemsToGroups = function( items, groupIdx, itemIdx ) {
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var groupListCtrl = groupsCtrl.getGroupList( groupIdx );
  this.addItemsToListCtrl( items, groupListCtrl, RSGroupItem, itemIdx, 
    GroupsDropTarget, Controller.GROUP_DRAG_ID );
  this.setAvailableItemsChosen( items );
};
Controller.prototype.handleAddSelectedAvailItemsToGroups = function( event )
{
  this.addSelectedAvailItemsToGroups( 0, 0 );
};

Controller.prototype.addSelectedAvailItemsToGroups = function( groupIdx, itemIdx )
{
  var availableItems = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  this.addItemsToGroups(this.wiz.getPg( 1 ).getAvailableItemsCtrl().getSelectedItems(true), groupIdx, itemIdx );
  availableItems.unselectAll();
};

/**
 * @param items Array of tr elements representing items in a list
 */
Controller.prototype.addItemsToDetails = function( items, addBeforeIdx ) {
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  this.addItemsToListCtrl(items, detailsCtrl, RSDetailItem, addBeforeIdx, 
    DetailsDropTarget, Controller.DETAIL_DRAG_ID );
  
  this.setAvailableItemsChosen(items);
  
  // TODO sbarkdull, maybe next should always be enabled?
  this.wiz.getNextBtn().setEnabled( detailsCtrl.getLength() > 0 );
  this.enableReportSaveBtns();
};
Controller.prototype.handleAddSelectedAvailItemsToDetails = function( event )
{
  this.addSelectedAvailItemsToDetails();
};
/**
 * @param addBeforeIdx int the index of the item to add the new
 * items before. Optional, can be undefined.
 */
Controller.prototype.addSelectedAvailItemsToDetails = function( addBeforeIdx )
{
  var availableItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  var selectedAvailItems = availableItemsCtrl.getSelectedItems(true);
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();

  this.addItemsToDetails( selectedAvailItems, addBeforeIdx );
  // UIUtil.removeListCtrlsItemsFromListCtrl( detailsCtrl, filtersCtrl );
  availableItemsCtrl.unselectAll();
};

Controller.prototype.addItemsToFilters = function( items, addBeforeIdx )
{
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  this.addItemsToListCtrl(items, filtersCtrl, RSFilterItem, addBeforeIdx, 
    FiltersDropTarget, Controller.FILTER_DRAG_ID);
  this.setAvailableItemsChosen(items);
};
Controller.prototype.handleAddSelectedAvailItemsToFilters = function( event )
{
  this.addSelectedAvailItemsToFilters();
};
/**
 * @param addBeforeIdx int the index of the item to add the new
 * items before. Optional, can be undefined.
 */
Controller.prototype.addSelectedAvailItemsToFilters = function( addBeforeIdx )
{
  var availableItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  var selectedAvailItems = availableItemsCtrl.getSelectedItems(true);
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();

  this.addItemsToFilters( selectedAvailItems, addBeforeIdx );
  // UIUtil.removeListCtrlsItemsFromListCtrl( detailsCtrl, filtersCtrl );
  availableItemsCtrl.unselectAll();
};

/**
 * Add items to a list control, and configure them as drop sources and drop targets.
 * 
 * @param items Array of td elements from the AvailableItemsCtrl, or
 * an array of tr elements from a ListCtrl
 * @param listCtrl ListCtrl or derivative the listCtrl to add items to
 * @param classFunc (one of: RSGroupItem, RSDetailItem, RSFilterItem ) reference
 * to the class function
 * @param addBeforeIdx int the index of an item in the list to add the new items
 * in front of
 * @param DropTargetClass (one of [Groups|Details|Filters]DropTarget) a ctor
 * reference that will configure the items as drop targets
 * @param dragId String the drag id that identifies the drag-type of this item. the drag-type
 * specifies which drop targets will accept the item on a drop
 */
Controller.prototype.addItemsToListCtrl = function( items, listCtrl, classFunc, addBeforeIdx, 
  DropTargetClass, dragId ) 
{
  var bView = this.mdModels.getBView( this.modelId, this.viewId );
  var localThis = this;
  for ( var idx=items.length-1; idx>=0; --idx )
  {
    var item = items[idx];
    var columnId = UIUtil.getColumnId( item );
    var bvItem = bView.getItem( columnId );
    var newItem = new classFunc( bvItem );  // classFunc === one of RSGroupItem, RSDetailItem, RSFilterItem
    var trElem = listCtrl.addItem( bvItem.name, bvItem.columnId, addBeforeIdx, newItem );
    var tmp = new DragSource( trElem, dragId,
      function( dragType )
      {
        return localThis.isValidDragSource( dragType );
      }
     );
    var tmp = new DropTargetClass( this, trElem, Controller.ALL_DROP_TARGETS );
  }
};
Controller.prototype.pg1MoveItemsUpInGroups = function()
{
  /*GroupsCtrl*/
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  groupsCtrl.moveSelectedItemsUp();
};

Controller.prototype.pg1MoveItemsDownInGroups = function()
{
  /*GroupsCtrl*/
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  groupsCtrl.moveSelectedItemsDown();
};
Controller.prototype.pg1DeleteItemsFromGroups = function()
{
  /*GroupsCtrl*/
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var itemsToRemove = [];
  
  // TODO sbarkdull, rework so that we are calling a method in GroupsCtrl to get all selected items
  for (var grpCtrlIdx = 0; grpCtrlIdx < WaqrWizard.NUM_GROUPS; grpCtrlIdx++) {
    var selectedRows = groupsCtrl.getGroupList( grpCtrlIdx ).getSelectedItems();
    for (var idx in selectedRows) {
      itemsToRemove.push(selectedRows[idx]);
      var item = selectedRows[idx].itemData;  // should be an RSGroupItem
    }
  }
  groupsCtrl.removeSelectedItems();
  this.refreshChosenAvailableItems(itemsToRemove);
  this.pg1RefreshQueryInfo( itemsToRemove );
};
Controller.prototype.pg1MoveItemsUpInDetails = function()
{
  /*DragItemHereListCtrl*/
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  detailsCtrl.moveSelectedItemsUp();
};

Controller.prototype.pg1MoveItemsDownInDetails = function()
{
  /*DragItemHereListCtrl*/
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  detailsCtrl.moveSelectedItemsDown();
};
Controller.prototype.pg1DeleteItemsFromDetails = function()
{
  /*DragItemHereListCtrl*/
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var selectedTrs = detailsCtrl.getSelectedItems();
  detailsCtrl.removeSelectedItems();
  this.refreshChosenAvailableItems(selectedTrs);
  this.pg1RefreshQueryInfo( selectedTrs );
  this.pg1DetailsSortTable( selectedTrs );
  
  this.wiz.getNextBtn().setEnabled( detailsCtrl.getLength() > 0 );
  this.enableReportSaveBtns();
};
Controller.prototype.isItemInAnyList = function( tr )
{
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  
  var bHasItem = UIUtil.hasItem( detailsCtrl, tr );
  if ( !bHasItem )
  {
    bHasItem = UIUtil.hasItem( filtersCtrl, tr );
    if ( !bHasItem )
    {
      for ( var grpIdx=0; grpIdx<WaqrWizard.NUM_GROUPS; ++grpIdx )
      {
        var grpCtrl = groupsCtrl.getGroupList( grpIdx );
        if ( UIUtil.hasItem( grpCtrl, tr ) )
        {
          bHasItem = true;
          break;
        }
      }
    }
  }
  return bHasItem;
}

Controller.prototype.pg1RefreshQueryInfo = function( deletedTrs )
{
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  for ( var ii=0; ii<deletedTrs.length; ++ii )
  {
    var tr = deletedTrs[ ii ];
    var bHasItem = this.isItemInAnyList( tr );
    if ( !bHasItem )
    {
      var bvItem = tr.itemData.getBVItem();
      bvItem.removeConstraints();
      bvItem.clearSortDirection();
    }
  }
};
Controller.prototype.pg1DetailsSortTable = function( deletedTrs )
{
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  for ( var ii=0; ii<deletedTrs.length; ++ii )
  {
    var tr = deletedTrs[ ii ];
    var bHasItem = UIUtil.hasItem( detailsCtrl, tr );
    if ( !bHasItem )
    {
      //remove from sort table if present
      /*RSDetailItem*/var item = tr.itemData;
      this.reportSpec.removeDetailsSortListItem( item );
    }
  }
};
/**
 * MB - This method is used to synchronize the state of the TDs chosen
 * status relative to their existence in the selection boxes on the
 * right. This is called when the page is shown.
*/
Controller.prototype.refreshAllChosenAvailItems = function() {
  // Get all the item IDs (Business Column Ids)
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  var availItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  // For each item that exists on the right, set the chosen status
  // in the TD in the available items
  
  // Do the detail selections
  var i;
  for (i=0; i<detailsCtrl.getLength(); i++) {
    availItemsCtrl.setItemChosen( detailsCtrl.getItem(i), true ) ;
  }

  // Do the filters selections  
  for (i=0; i<filtersCtrl.length; i++) {
    availItemsCtrl.setItemChosen( filtersCtrl.getItem(i), true ) ;
  }
  
  // Groups are a list of lists. So, for each section in the group...
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  for (var grpCtrlIdx = 0; grpCtrlIdx < WaqrWizard.NUM_GROUPS; grpCtrlIdx++) {
    // Get the appropriate list control
    var groupListCtrl = groupsCtrl.getGroupList( grpCtrlIdx );
     // For each of these...
    for (i=0; i<groupListCtrl.getLength(); i++) {
      // Update the chosen status.
      availItemsCtrl.setItemChosen( groupListCtrl.getItem( i ), true ) ;
    }
  }
};

/**
 * TODO sbarkdull, this is a n-squared algorithm with a big constant, it can easily be sped up if necessary
 * @param item Array array of td elements from the available items control
 */
Controller.prototype.refreshChosenAvailableItems = function( items ) 
{
  var detailsCtrl = this.wiz.getPg( 1 ).getDetailsCtrl();
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
  var availItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();

  for (var idx=0; idx<items.length; ++idx ) {
    
    var item = items[ idx ];
    var isChosen = UIUtil.hasItem( detailsCtrl, item ) || UIUtil.hasItem( filtersCtrl, item );
    if (!isChosen) {
      for (var grpCtrlIdx = 0; (grpCtrlIdx < WaqrWizard.NUM_GROUPS) && !isChosen; grpCtrlIdx++) {
        var groupListCtrl = groupsCtrl.getGroupList( grpCtrlIdx );
        isChosen = UIUtil.hasItem( groupListCtrl, item ) ;
      }
    }
    availItemsCtrl.setItemChosen(item, isChosen );
  }
};

/**
 * @param items Array array of td elements from a AvailableItemsCtrl
 */
Controller.prototype.setAvailableItemsChosen = function( items ) 
{
  var availItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  for (var idx=0; idx<items.length; ++idx ) {
    availItemsCtrl.setItemChosen( items[ idx ], true );
  }
};

Controller.prototype.pg1DeleteItemsFromFilters = function()
{
  /*DragItemHereListCtrl*/
  var filtersCtrl = this.wiz.getPg( 1 ).getFiltersCtrl();
  var selectedRows = filtersCtrl.getSelectedItems();
  filtersCtrl.removeSelectedItems();
  this.refreshChosenAvailableItems(selectedRows);
  this.pg1RefreshQueryInfo( selectedRows );
};
/**
 * @param groups GroupsCtrl
 */
/*private*/Controller.prototype.savePg1Groups = function( groupsCtrl )
{
  this.reportSpec.removeAllFromGroups();
  
  /*list of GroupListCtrl*/
  for ( var groupIdx=0; groupIdx<WaqrWizard.NUM_GROUPS; ++groupIdx )
  {
    /*GroupListCtrl*/
    var groupListCtrl = groupsCtrl.getGroupList( groupIdx );
    for ( var itemIdx=0; itemIdx<groupListCtrl.length; ++itemIdx )
    {
      // add items to reportSpec
      var listItem = groupListCtrl.getItem( itemIdx );
      this.reportSpec.addToGroups( listItem.itemData, itemIdx, groupIdx );
    }
  }
};
/**
 * @param DragItemHereListCtrl detailsCtrl
 */
/*private*/Controller.prototype.savePg1Details = function( detailsCtrl )
{
  this.reportSpec.removeAllFromDetails();

  for ( var itemIdx=0; itemIdx<detailsCtrl.getLength(); ++itemIdx )
  {
    // add items to reportSpec
    var item = detailsCtrl.getItem( itemIdx );
    this.reportSpec.addToDetails( item.itemData, itemIdx );
  }
};
/**
 * @param DragItemHereListCtrl filtersCtrl
 */
/*private*/Controller.prototype.savePg1Filters = function( filtersCtrl )
{
  this.reportSpec.removeAllFromFilters();

  for ( var itemIdx=0; itemIdx<filtersCtrl.getLength(); ++itemIdx )
  {
    // add items to reportSpec
    var item = filtersCtrl.getItem( itemIdx );
    this.reportSpec.addToFilters( item.itemData, itemIdx );
  }
};

Controller.prototype.handleSaveReportSpec = function()
{
  this.saveCurrPg();  // all other pages should already be saved
  var rsStatus = this.validateReportSpec();
  if ( rsStatus.status == Status.OK )
  {
    this.wiz.getSaveBtn().setEnabled( false );
    this.wiz.getSaveAsBtn().setEnabled( false );
    this.repositoryBrowserController.saveReportSpec();
  }
  else
  {
    this.wiz.msgCtrl.warn( rsStatus.message );
  }
};
Controller.prototype.handleSaveAsReportSpec = function()
{
  this.saveCurrPg();  // all other pages should already be saved
  var rsStatus = this.validateReportSpec();
  if ( rsStatus.status == Status.OK )
  {
    this.wiz.getSaveBtn().setEnabled( false );
    this.wiz.getSaveAsBtn().setEnabled( false );
    this.repositoryBrowserController.openSaveAsDialog();
  }
  else
  {
    this.wiz.msgCtrl.warn( rsStatus.message );
  }
};
/**
 * Handle request to execute the "preview" operation
 */
Controller.prototype.handlePreview = function()
{
  this.saveCurrPg();
  var rsStatus = this.validateReportSpec();
  if ( rsStatus.status == Status.OK )
  {
    this.reportSpec.reportName = "preview";
    var xml = this.reportSpec.asXml();
    var outputType = this.wiz.getPreviewTypeSelect().value;
    var templatesListCtrl = this.wiz.getPg( 0 ).getTemplatesListCtrl();
    var items = templatesListCtrl.getSelectedItems();
    /*
     * items[0].itemData has properties: templateName, templateDescription,
     * templateIcon, jfreeTemplate, xreportspecTemplate, templateFolderPath
     */
    var templatePath = items.length > 0
      ? items[0].itemData.templateFolderPath + "/" + items[0].itemData.jfreeTemplate
      : "";

    var form = document.forms['previewForm'];
    form.acceptCharset = "UTF-8";

    // open a new mantle tab with empty named iframe
    // submission target is the iframe name
    form.elements['reportXml'].value = xml;
    form.elements['outputType'].value = outputType;
    form.elements['forceAttachment'].value = "false";
    form.elements['templatePath'].value = templatePath;


    if (window.parent != null && window.parent.mantle_initialized == true) {
      // open preview tab for waqr
          var url = "";
          if(form.action.indexOf('http') == -1){
                //IE does not have the hostname
            url += window.location.protocol+"//"+window.location.host;
        
            if (form.action.match("^/")) { 	// form action is not relative
              url += form.action;
            } else {
              // Split out the existing directories and the relative action url to compute
              var existingPathArray = window.location.pathname.split( "/" );
              var formPathArray = form.action.split("/");

              if(window.location.pathname.match("/$") == null){		// does not end with a slash
              existingPathArray.pop(); 	// Remove current filename from array
              }

              // Remove directories from list as prescribed by relative navigation.
              while (formPathArray[0] == "..") {
              existingPathArray.pop();
              formPathArray.shift();
              }

              // Re-assemble the remaining directories
              url += existingPathArray.concat(formPathArray).join("/");

            }
          } else {
                //Mozilla
                url = form.action;
          }
          
          url += '?ajax=true&component=generatePreview';
          url += '&outputType=' + outputType;
          url += '&forceAttachment=' + false;
          url += '&templatePath=' + templatePath;
		  window.parent.mantle_waqr_preview(url, xml);
	} else {
	  form.elements['reportXml'].value = encodeURIComponent(form.elements['reportXml'].value);
	  form.submit();
    }
  }	else {
	this.wiz.msgCtrl.warn( rsStatus.message );
  }
};

Controller.prototype.handleCancel = function()
{
  window.close();
};

/**
 * The cache is a simple map of maps (map implemented by javascript Object class).
 * this.reportSpecCache is a map of modelId's to model-caches. The model-cache
 * is a map of viewIds to reportSpecs, where the reportSpec corresponds to the view.
 * 
 * @param modelId String
 * @param viewId String
 * @return ReportSpec the reportSpec corresponding to the model and view Ids.
 */
Controller.prototype.getModelsReportSpecFromCache = function( modelId, viewId )
{
  var modelCache = this.reportSpecCache[ modelId ];
  if ( !modelCache )
  {
    modelCache = new Object();
    this.reportSpecCache[ modelId ] = modelCache;
  }
  
  var reportSpec = modelCache[ viewId ];
  if ( !reportSpec )
  {
    // I guess it hasn't been created and cached yet, lets do that
    var businessView = this.mdModels.getBView( modelId, viewId );
    reportSpec = new ReportSpec( businessView );
    
    if ( this.reportSpecDoc )
    {
      // initialize the reportspec from the existing xreportspec the user has previously created and wants to edit
      try {
       reportSpec.loadWaqrReportSpecDoc( this.reportSpecDoc );
      } catch ( e ) {
        this.wiz.msgCtrl.error( Messages.getString( "REPORT_FILE_FAILED_TO_LOAD", e.message ) );
        // let's keep running, but with an uninitialized ReportSpec
        reportSpec = new ReportSpec( businessView );
      }
      this.reportSpecDoc = undefined;
    }
    else
    {
      reportSpec.setViewId( viewId )
      reportSpec.setModelId( modelId );
    }
        
    var startIdx = reportSpec.getNumGroups();
    for ( var groupIdx=startIdx; groupIdx<WaqrWizard.NUM_GROUPS; ++groupIdx )
    {
      var groupHeader = new RSGroupHeader();
      reportSpec.addGroupHeader( groupHeader, groupIdx );
    }
    modelCache[ viewId ] = reportSpec;
  }
  return reportSpec;
};

/**
 * handle when the user selects one of the business models on page 0
 * 
 * @param modelId String the id of the model being selected
 * @param viewId String the id of the view in the model being selected
 * 
 */
Controller.prototype.handleSelectBusinessView = function( modelId, viewId )
{ 
  this.setBView( modelId, viewId );
  this.getBusinessView( viewId, modelId );  
};

/**
 * NOTE: you need to understand JavaScript's "closure" concept in order to understand
 * how the anonomous inner function of this function has access to the outter function's
 * local variables.
 */
Controller.prototype.getBusinessView = function() {
  /*type is BusinessView*/
  var businessView = this.mdModels.getBView( this.modelId, this.viewId );
  if( !businessView || !businessView.isInitializationComplete() ) {
    UIUtil.setCursor( document.getElementById( "content0" ), "wait" );
    this.wiz.getBusyCtrl().setText( Messages.getString( "loadingProgressMsg" ) );
    this.wiz.getBusyCtrl().show();
    var localThis = this;
    var loadingDescriptionAr = [ Messages.getString( "loadingDescription" ) ];  
    this.wiz.getPg( 0 ).setDescription( loadingDescriptionAr );
    var loadingViewAr = [ Messages.getString( "loadingView" ) ];  
    this.wiz.getPg( 0 ).setCategories( loadingViewAr );
    
    WebServiceProxy.post( WebServiceProxy.ADHOC_WEBSERVICE_URL, "getbusinessmodel",
      { domain:this.modelId, model:this.viewId },
      function( businessModelXmlDoc )
      {
        localThis.wiz.getBusyCtrl().hide();
        UIUtil.setCursor( document.getElementById( "content0" ), "" );
        if ( undefined !== businessModelXmlDoc )
        {
          var msg = XmlUtil.getErrorMsg( businessModelXmlDoc );
          if ( msg )
          {
            localThis.wiz.msgCtrl.error( msg );
          }
          else
          {
            var businessView = localThis.mdModels.addBView( businessModelXmlDoc );
            var html = xsltProcess( businessModelXmlDoc, localThis.viewXsl );
            if ( undefined !== html && null !== html )
            {
              Controller.businessViewsHtmlCache[ Controller.getBViewKey( businessView ) ] = html;
              localThis.updatePg1Ctrls( businessView, html );
            }
          }
        }
        // else session has likely expired
      } );
  } else {
    var html = Controller.businessViewsHtmlCache[ Controller.getBViewKey( businessView ) ];
    this.updatePg1Ctrls( businessView, html );
  }
};
    
/**
 * @param businessView BusinessView the business view whose data is used to populate
 * the Business View and Description controls on page 0
 * @param availableItemsHtml String html used to construct the available items 
 * list on pg 1 of wizard.
 */
Controller.prototype.updatePg1Ctrls = function( businessView, availableItemsHtml )
{
  var availableItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
  availableItemsCtrl.setHTML( availableItemsHtml );
  
  this.setCategories( businessView );
  this.setDescription( businessView );
  this.selectBusinessView();
  // set up the DnD, does this belong here or in AvailableItemCtrl.setHTML, or maybe somewhere related to pg1?
  var availItemElems = this.wiz.getPg( 1 ).getAvailableItemsCtrl().getItemDNDElems();
  var localThis = this;
  for ( var idx=0; idx<availItemElems.length; idx++ ){
    var tmp = new DragSource( availItemElems[idx], Controller.AVAIL_COL_DRAG_ID,
      function( dragType )
      {
        return localThis.isValidDragSource( dragType );
      }
    );
  }
};
// debug code
/*
Controller.testWinXstl = null;
Controller.testWinDoc = null;
Controller.prototype.debugSetBView = function( html )
{
  if ( !Controller.testWinXstl )
  {   
    Controller.testWinXstl = window.open( "about:blank", "XSLT",
      'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1024,height=768' );
    Controller.testWinXstl.document.write( "<html><header><title>XSLT</title></header><body><textarea id='testAreaXslt' style='width:100%;height:100%'></textarea></body></html>" );
    Controller.testWinDoc = window.open( "about:blank", "DOC",
      'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1024,height=768' );
    Controller.testWinDoc.document.write( "<html><header><title>DOC</title></header><body><textarea id='testAreaDoc' style='width:100%;height:100%'></textarea></body></html>" );
  }
  else
  {
    var xslt = Controller.testWinXstl.document.getElementById( "testAreaXslt" ).value;
    var xsltDoc = XmlUtil.load( xslt )
    var xml =  Controller.testWinDoc.document.getElementById( "testAreaDoc" ).value;
    var doc = XmlUtil.load( xml );
    var html = xsltProcess( doc, xsltDoc );
    var availableItemsCtrl = this.wiz.getPg( 1 ).getAvailableItemsCtrl();
    availableItemsCtrl.setHTML( html );
  }
}
*/
Controller.prototype.selectBusinessView = function()
{
  var bIsEditExistingReport = this.reportSpecDoc !== undefined;
  this.reportSpec = this.getModelsReportSpecFromCache( this.modelId, this.viewId );
  this.repositoryBrowserController.setReportSpec( this.reportSpec );
  
  this.wiz.getPg( 0 ).updateBusinessViewSelection( this.modelId, this.viewId ); // hilight the item in the list
  this.selectTemplate( this.reportSpec.getTemplateName() );
  this.wiz.getNextBtn().setEnabled( true );
  this.enableReportSaveBtns();
  
  if ( bIsEditExistingReport )
  {
    this.showStep1();
  }
};

Controller.prototype.selectTemplate = function( templateName )
{
  var templatesListCtrl = this.wiz.getPg( 0 ).getTemplatesListCtrl();
  
  // Select first template by default
  if(!templateName){
    templatesListCtrl.selectItem(0);
    return;
  }
    
  // unselect any selected item in the templates list ctrl
  var idxAr = templatesListCtrl.getSelectedItemIdxs();
  if ( idxAr.length > 0 )
  {
    templatesListCtrl.unselectItem( idxAr[0] );
    this.currTemplatePath = null;
  }
  if ( templateName )
  {
    var length = templatesListCtrl.getLength();
    for ( var ii=0; ii<length; ++ii )
    {
      var item = templatesListCtrl.getItem( ii );
      var name = item.itemData.templateName;
      if ( name == templateName )
      {
        templatesListCtrl.selectItem( ii ); // NOTE: will cause list ctrl's OnSelectCallback to be called
        return;
      }
    }
  }
};

/*static*/Controller.businessViewsHtmlCache = new Object(); 
/*static*/Controller.getBViewKey = function( bView )
{
  return bView.modelId + "_" + bView.viewId;
} 
/**
 * @param businessView BusinessView
 * 
 * Display the description of the catetories in the
 * wizard's 0th page's Categories box.
 */
Controller.prototype.setCategories = function( businessView )
{
  var tableNames = new Array();
  var categories = businessView.tables;
  if ( categories )
  {
    for (var ii=0; ii<categories.length; ++ii )
    {
      tableNames.push( categories[ii].tableName );
    }
  }
  this.wiz.getPg( 0 ).setCategories( tableNames );
};
/**
 * @param BusinessView
 * 
 * Display the description of the businessview in the
 * wizard's 0th page's Description box.
 */
Controller.prototype.setDescription = function( businessView )
{
  this.wiz.getPg( 0 ).setDescription( businessView.viewDescription );
};

Controller.prototype.showStep0 = function()
{
  if ( 0 != this.wiz.currPgNum )
  {
    if ( this.validateCurrStep() )
    {
      this.endCurrStep();
      this.beginStep( 0 );
    }
  }
};
// TODO sbarkdull, if we get disabled buttons for the 1,2,3,4 butttons
// i can delete the 3 below checks for businessview === null
Controller.prototype.showStep1 = function()
{
  if ( 1 != this.wiz.currPgNum )
  {
    if ( this.validateCurrStep() )
    {
      this.endCurrStep();
      this.beginStep( 1 );
    }
  }
};
Controller.prototype.showStep2 = function()
{
  if ( 2 != this.wiz.currPgNum )
  {
    if ( this.validateCurrStep() )
    {
      this.endCurrStep();
      this.beginStep( 2 );
    }
  }
};
Controller.prototype.showStep3 = function()
{
  if ( 3 != this.wiz.currPgNum )
  {
    if ( this.validateCurrStep() )
    {
      this.endCurrStep();
      this.beginStep( 3 );
    }
  }
};
  
/**
 * @return Status
 * @throws Error when the ReportSpec's model or view Id are null, or
 * if no details are selected
 */
Controller.prototype.validateReportSpec = function()
{
  var rsStatus = new Status( Status.OK, "" );
  
  var bIsConstraintsValid = this.constraintsController.validateConstraintsCtrls();
  if ( !bIsConstraintsValid )
  {
    rsStatus.message += Messages.getString("CONSTRAINTS_INVALID") + "\n";
    rsStatus.status = Status.FAIL;
  }
  if ( this.reportSpec.getModelId() === null || this.reportSpec.getViewId() === null )
  {
    // the UI should NEVER allow the app to get in this state, this can only result from programmer error
    throw new Error( Messages.getString("selectBusinessModelMsg") );
  }
  if ( this.reportSpec.details.length == 0 )
  {
    // the UI should NEVER allow the app to get in this state, this can only result from programmer error
    throw new Error( Messages.getString("addDetailsMsg") );
  }

  return rsStatus;
};

/**
 * what is available in the query string?
 * logging=on
 * The following 3 query string params must all be present together, or absent
 * solution=solutionName
 * path=path in solution (can be "")
 * name=document in solution repository
 */
Controller.prototype.processQueryString = function()
{
  var url = window.location;
  var queryStringParams = UIUtil.parseQueryStringParamsFromURL( url.toString() );
  if ( undefined != queryStringParams.solution 
    && undefined != queryStringParams.path 
    && undefined != queryStringParams.filename )
  {
    this.reportSpecPath = {
      solution: queryStringParams.solution,
      path: queryStringParams.path,
      filename: queryStringParams.filename
    };
  }
  // TODO sbarkdull, check if 1 or 2 of (solution, path, and filename),
  // but not 0 or 3 are defined
  // indicates syntax error on query string
  this.bIsLoggingOn = queryStringParams.logging && queryStringParams.logging == "on";
};

Controller.typeToClass = new Object();
Controller.typeToClass[BVItem.TYPE.STRING] = DBSearcher;
Controller.typeToClass[BVItem.TYPE.DATE] = CalendarAdapter;
Controller.typeToClass[BVItem.TYPE.NUMERIC] = null;
Controller.typeToClass[BVItem.TYPE.BOOLEAN] = BooleanPicker;
Controller.typeToClass[BVItem.TYPE.UNKNOWN] = DBSearcher;

/*static final*/Controller.TEMPLATES_BASE_PATH = "/templates";
/*static final*/Controller.TEMPLATES_FILENAME = "report.xreportspec";
/*static final*/Controller.TEMPLATES_FILTER = /^(?!\.svn).*$/;
/**
 * NOTE: runs asynchronously
 * 
 * @param templatesListCtrl TemplatesListCtrl
 */
Controller.prototype.loadTemplateItemsIntoList = function( templatesListCtrl )
{
  var localThis = this;
  var children = this.waqrRepository.getFolderChildren( Controller.TEMPLATES_BASE_PATH, null, null, false,
    function( children )
    {
	  // MB - Sort the templates
      children.sort(
              // Sort by the name attribute.
              function(a,b){  try { return ( (a.name<b.name) ? -1 : ( (b.name < a.name) ? 1 : 0)  );} catch (e) {return 0;} } 
       );	  
      for ( var ii=0; ii<children.length; ++ii )
      {
        var child = children[ ii ];
        var templateFolderName = child.name;
        if ( templateFolderName.match( Controller.TEMPLATES_FILTER ) )
        {
          localThis.loadTemplateItemIntoList( templatesListCtrl, child.path );
        }
      }
    }
  );
};

Controller.prototype.loadTemplateItemIntoList = function( templatesListCtrl, templateFolderPath )
{
  var localThis = this;
  this.waqrRepository.getIndexDoc( templateFolderPath,
    function( indexDoc )
    { 
      var errorMsg = XmlUtil.getErrorMsg( indexDoc );
      if ( null !== errorMsg )
      {
        // errorMsg contains more detail than we need to show the user
        localThis.wiz.msgCtrl.error( Messages.getString("reportTemplateLoadFailed", templateFolderPath ) );
      }
      else
      {
        var indexNd = XmlUtil.selectSingleNode( indexDoc, "/index" );
        var nd = XmlUtil.selectSingleNode( indexNd, "name" );
        var name = XmlUtil.getNodeText( nd );
        nd = XmlUtil.selectSingleNode( indexNd, "description" );
        var description = XmlUtil.getNodeText( nd );
        nd = XmlUtil.selectSingleNode( indexNd, "icon" );
        var icon = XmlUtil.getNodeText( nd );
        nd = XmlUtil.selectSingleNode( indexNd, "visible" );
        var visible = XmlUtil.getNodeText( nd );
        nd = XmlUtil.selectSingleNode( indexNd, "jfree-template" );
        var jfreeTemplate = XmlUtil.getNodeText( nd );
        nd = XmlUtil.selectSingleNode( indexNd, "xreportspec-template" );
        var xreportspecTemplate = XmlUtil.getNodeText( nd );
  
        if ( visible.toLowerCase() == "true" )
        {
          templatesListCtrl.addItem( name, undefined, undefined, 
            {
              templateName: name,
              templateDescription: description,
              templateIcon: icon,
              jfreeTemplate: jfreeTemplate,
              xreportspecTemplate: xreportspecTemplate,
              templateFolderPath: templateFolderPath
            }
          );
        }
      }
    }
  );
};
/**
 * @param templatePath String
 * @param templateName String
 * @param templateFilename String
 */
Controller.prototype.mergeTemplateWithReportSpec = function( templatePath, templateFilename )
{
  var templatePath = templatePath + "/" + templateFilename;
  if ( this.currTemplatePath != templatePath )
  {
    var templateDoc = this.waqrRepository.getWaqrTemplate( templatePath );
    
    var errorMsg = XmlUtil.getErrorMsg( templateDoc );
    if ( null !== errorMsg )
    {
      // errorMsg contains more detail than we need to show the user
      this.wiz.msgCtrl.error( Messages.getString("reportTemplateLoadFailed", templatePath ) );
    }
    else
    {
      this.reportSpec.loadTemplateReportSpecDoc( templateDoc );
      this.currTemplatePath = templatePath;
    }
  }
};

/*static*/Controller.SORT_ITEMS_LABEL_AR = [ Sort.SORT_ASCENDING_LABEL, Sort.SORT_DESCENDING_LABEL ];
/*static*/Controller.SORT_ITEMS_AR = [ Sort.SORT_ASCENDING, Sort.SORT_DESCENDING ]; 
/*static private*/Controller.createSortSelectElem = function()
{
  var selectElem = UIUtil.createSelectElem( Controller.SORT_ITEMS_LABEL_AR, Controller.SORT_ITEMS_AR );
  selectElem.onmousedown = function(){ 
    var event = UIUtil.getEvent( arguments );
    event.cancelBubble = true;
  };
  return selectElem;
};
/**
 * Add the item that is currently selected in one of the 3 list controls
 * on pg2 to the sort table. Since when a group header item or filter
 * item is selected, the UI doesn't display the sort table, this effectively
 * prevents group headers and filters from being added to the sort table.
 */
Controller.prototype.pg2AddSelectedDetailItemToColumnSorterCtrl = function()
{
  var detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
  var trs = detailsCtrl.getSelectedItems();
  var tr = trs[0];
  var item = tr.itemData;
  
  var detailColumnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getDetailColumnSorterCtrl();
  this.addItemToColumnSorterCtrl( item, detailColumnSorterCtrl );
  this.enableDetailColumnSorterCtrlAddBtn();
};

/**
 * @param RSGroupItem or RSDetailItem
 * @param columnSorterCtrl ColumnSorterCtrl
 */
Controller.prototype.addItemToColumnSorterCtrl = function( item, columnSorterCtrl )
{
  var bvItem = item.getBVItem();
  var sortDirection = bvItem.getSortDirection(); //sortDirection must be either "asc" or "desc", should never be undefined
  var selectElem = Controller.createSortSelectElem();
  if ( sortDirection )
  {
    selectElem.value = sortDirection;
  }
  var businessView = this.mdModels.getBView( this.modelId, this.viewId );
  var table = businessView.findTable( bvItem.tableId );
  columnSorterCtrl.getListCtrl().addItem( [ bvItem.name, table.tableName, selectElem],
    /*id*/undefined, /*position*/undefined, item );
};

/**
 * If the currently selected column in filters or group items
 * is in the sort table, disable the sort table's add button,
 * otherwise enabled it.
 */
Controller.prototype.enableDetailColumnSorterCtrlAddBtn = function()
{
  var columnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getDetailColumnSorterCtrl();
  var bSelectedDetailItemInColumnSorterCtrl = this.isPg2SelectedDetailItemInColumnSorterCtrl( columnSorterCtrl );
  var bSelectedDetailItemInGroupsCtrl = this.isPg2SelectedDetailItemInGroupsCtrl( columnSorterCtrl );
  columnSorterCtrl.setAddEnabled( !bSelectedDetailItemInColumnSorterCtrl && !bSelectedDetailItemInGroupsCtrl );
};

Controller.prototype.isPg2SelectedDetailItemInGroupsCtrl = function( columnSorterCtrl )
{
  var bDetailsListHasSelectedItem = false;
  var detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
  var detailTrs = detailsCtrl.getSelectedItems();
  var bDetailsListHasSelectedItem = detailTrs.length > 0;
  if ( bDetailsListHasSelectedItem )
  {
    var detailItem = detailTrs[0].itemData;
    /*ROGroupsCtrl*/var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
    var trAr = groupsCtrl.getGroupItems();
    for ( var ii=0; ii<trAr.length; ++ii )
    {
      var tr = trAr[ ii ];
      var groupItem = tr.itemData;  // should be RSGroupItem
      if ( groupItem.getBVItem() == detailItem.getBVItem() )
      {
        return true;
      }
    }
  }
  return false;
};

Controller.prototype.isPg2SelectedDetailItemInColumnSorterCtrl = function( columnSorterCtrl )
{
  var bColumnSorterCtrlHasColumn = false;
  var detailsCtrl = this.wiz.getPg( 2 ).getDetailsCtrl();
  var trs = detailsCtrl.getSelectedItems();
  var bDetailsListHasSelectedItem = trs.length > 0;
  if ( bDetailsListHasSelectedItem )
  {
    var tr = trs[0];
    if ( tr )
    {
      var item = tr.itemData; /*item should be RSDetailItem or RSGroupItem*/
      var bvItem = item.getBVItem();
      bColumnSorterCtrlHasColumn = columnSorterCtrl.hasColumn( bvItem.tableId, bvItem.columnId );
    }
  }
  return bColumnSorterCtrlHasColumn;
};
Controller.prototype.pg2LoadGroupColumnSorterCtrlFromReportSpec = function()
{
  var columnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getGroupColumnSorterCtrl();
  columnSorterCtrl.getListCtrl().removeAll();
  /*ROGroupsCtrl*/
  var groupsCtrl = this.wiz.getPg( 2 ).getGroupsCtrl();
  var groupTrAr = groupsCtrl.getGroupItems();
  for ( var ii=0; ii<groupTrAr.length; ++ii )
  {
    var tr = groupTrAr[ ii ];
    var item = tr.itemData;
    this.addItemToColumnSorterCtrl( item, columnSorterCtrl );
  }
};
Controller.prototype.pg2LoadDetailColumnSorterCtrlFromReportSpec = function()
{
  var detailColumnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getDetailColumnSorterCtrl();
  
  // remove sort information from the sort table
  detailColumnSorterCtrl.getListCtrl().removeAll();

  // add items in ReportSpec to sort table
  var length = this.reportSpec.getNumDetailsSortListItems();
  for ( var ii=0; ii<length; ++ii )
  {
    var item = this.reportSpec.getDetailsSortListItem( ii );  // RSDetailItem
    this.addItemToColumnSorterCtrl( item, detailColumnSorterCtrl );
  }
};

Controller.prototype.pg2SaveGroupColumnSorterCtrl = function()
{
  var columnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getGroupColumnSorterCtrl();
  /*ListCtrl*/var listCtrl = columnSorterCtrl.getListCtrl();
  for ( var ii=0; ii<listCtrl.getLength(); ++ii )
  {
    var tr = listCtrl.getItem( ii );
    var item = tr.itemData; /*item is RSGroupItem*/
    var sortOrder = columnSorterCtrl.getColumnSortOrder( ii );
    item.getBVItem().setSortDirection( sortOrder );
  }
};
Controller.prototype.pg2SaveDetailColumnSorterCtrl = function()
{
  this.reportSpec.removeAllFromDetailsSortList();
  var columnSorterCtrl = this.wiz.getPg( 2 ).getColumnSorterEditorCtrl().getDetailColumnSorterCtrl();
  /*ListCtrl*/var listCtrl = columnSorterCtrl.getListCtrl();
  for ( var ii=0; ii<listCtrl.getLength(); ++ii )
  {
    var tr = listCtrl.getItem( ii );
    var item = tr.itemData; /*item is RSDetailItem*/
    var sortOrder = columnSorterCtrl.getColumnSortOrder( ii );
    item.getBVItem().setSortDirection( sortOrder );
    this.reportSpec.addToDetailsSortList( item );
  }
};
Controller.prototype.isValidDragSource = function( dragType )
{
  if (dragType == Controller.GROUP_DRAG_ID) {
    var groupsCtrl = this.wiz.getPg( 1 ).getGroupsCtrl();
    var selectedGrpIdx = -1;
    var lastPopulatedGrpIdx = groupsCtrl.getLastPopulatedGroupIdx();
    for ( var grpCtrlIdx = 0; grpCtrlIdx < lastPopulatedGrpIdx; grpCtrlIdx++ )
    {
      var groupListCtrl = groupsCtrl.getGroupList( grpCtrlIdx );
      // number of selected items equals the total number of items in the list ctrl
      if ( groupListCtrl.getSelectedItems().length == groupListCtrl.getLength() )
      {
        return false;
      }
    }
  }
  return true;
};
    
/*static*/Controller.ALL_DROP_TARGETS = [Controller.AVAIL_COL_DRAG_ID, Controller.DETAIL_DRAG_ID, Controller.FILTER_DRAG_ID, Controller.GROUP_DRAG_ID];


