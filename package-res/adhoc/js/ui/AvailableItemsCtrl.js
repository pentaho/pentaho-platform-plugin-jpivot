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
 * Note: this is an unfortunate attempt to wrap XSLT-ed html into a control
 */ 
AvailableItemsCtrl = function()
{
	HTMLCtrl.call( this, "div" );
	var div = this.getRoot();
	div.id = AvailableItemsCtrl.ID;
	div.className = "availableItemsContainerClass";
	div.ctrl = this;
	div.title = Messages.getString("availItemsTitle");
}
AvailableItemsCtrl.prototype = new HTMLCtrl();

/*class static final vars*/
AvailableItemsCtrl.ID = "availableItemsContainer";
AvailableItemsCtrl.CN_SELECTED = "selectedItem";
AvailableItemsCtrl.CN_UNSELECTED = "unselectedItem";
AvailableItemsCtrl.CN_CHOSEN = "chosenItem";

/**
 * 
 */
AvailableItemsCtrl.prototype.setHTML = function( strHTML )
{
	this.getRoot().innerHTML = strHTML;
	// MB
	// The following list is used as a container for all
	// the trs that contain the business columns. Before
	// This change, the list was read from the DOM every
	// time.
	this.trList = null;
	// MB
	// The following map is a columnId->Array map where the
	// array contains all the trs that are for the given
	// columnId. This is needed to treat all trs for a
	// given columnId as a single object.
	this.columnIdMap = null;
	// MB
	// This call reads through the DOM, and initializes
	// the trList and columnIdMap.
	this.getItemTrs();
}

/**
 * MB - This is an overridden function that allows existing
 * behavior.
 */
AvailableItemsCtrl.prototype.getSelectedItems = function() {
  return getSelectedItems( false );
}

/*
 * TODO sbarkdull
need to figure out what to do with col and table ids, create a list of selected items
and add a "get sel items", or something. controller needs to get called
when item is clicked, need onselect, onunselect, provided by controller, controller's implementation' +
will maintain the list of sel items, when user clicks add, controller has list of items to add,
use table and col id to get item meta data from business view
business view likely needs a getCol( table, colid)
*/
/**
 * MB - Function modified to optionally return a unique list of column Ids.
 *
 * @param bUniqueColumnIds boolean true or false to indicate whether the list returned
 *                   is a list of unique columnIds.
 * @return Array an array of the tr elements that are currently selected
 */
AvailableItemsCtrl.prototype.getSelectedItems = function( bUniqueColumnIds )
{
	var selectedItems = new Array();
	var trs = this.getItemTrs();
  var columnIdsSelected = new Object();
	
	for ( var idx=0; idx<trs.length; ++idx )
	{
		if ( AvailableItemsCtrl.isItemSelected( trs[idx] ) )
		{
		  if (bUniqueColumnIds) {
		    if ( columnIdsSelected[trs[idx].id] == null ) {
			    selectedItems.push( trs[idx] );
			    columnIdsSelected[trs[idx].id] = true;
		    }
			} else {
				selectedItems.push( trs[idx] );
			}
		}
	}
	
	return selectedItems;
}
/**
 * @return integer the number of selected items in the list
 */
AvailableItemsCtrl.prototype.getNumSelectedItems = function()
{
	var numSelected = 0;
	var trs = this.getItemTrs();
	
	for ( var idx=0; idx<trs.length; ++idx )
	{
		if ( AvailableItemsCtrl.isItemSelected( trs[idx] ) )
		{
			numSelected++;
		}
	}
	
	return numSelected;
}
AvailableItemsCtrl.prototype.handleItemMouseUp = function( thisTr, event, tableId, columnId )
{
	if ( !thisTr.bIsBeingSelected && AvailableItemsCtrl.isItemSelected( thisTr ) && event.ctrlKey )
	{
	  // MB - Now, when an item is selected/deselected, we need to handle the same columnId being
	  // used in multiple TRs.
		// this.handleUnselectItem( event, thisTr );
		this.handleUnselectSameItems( event, thisTr, columnId ); // Handle the same column being in multiple views
	}
	else
	{
		thisTr.bIsBeingSelected = false;
	}
}
// TODO sbarkdull, probably don't need the tableId, if so, modify adhoc-businessview.xsl to rm param
AvailableItemsCtrl.prototype.handleItemMouseDown = function( thisTr, event, tableId, columnId )
{
	if ( !event.ctrlKey && !AvailableItemsCtrl.isItemSelected( thisTr ))
	{
		this.handleUnselectAll( event );
	}
	if ( !AvailableItemsCtrl.isItemSelected( thisTr ) )
	{
	  // MB - Now, when an item is selected/deselected, we need to handle the same columnId being
	  // used in multiple trs.
		// this.handleSelectItem( event, thisTd, tableId, columnId );
		thisTr.bIsBeingSelected = true;
		this.handleSelectSameItems( event, thisTr, columnId ); // Handle the same column being in multiple views
	}
}
AvailableItemsCtrl.prototype.setOnSelectCallback = function( callback )
{
	this.onSelectCallback = callback;
}
AvailableItemsCtrl.prototype.setOnUnselectCallback = function( callback )
{
	this.onUnselectCallback = callback;
}
// TODO sbarkdull, probably don't need the tableId, if so, modify adhoc-businessview.xsl to rm param
AvailableItemsCtrl.prototype.handleSelectItem = function( event, tr, tableId, columnId  )
{	
	if (!AvailableItemsCtrl.isItemChosen(tr)) {
		tr.className = AvailableItemsCtrl.CN_SELECTED;
	} else { 
		tr.className = AvailableItemsCtrl.CN_SELECTED + " " + AvailableItemsCtrl.CN_CHOSEN;
	}
	tr.selected = true;
	// MB
	// No need to do this upon select anymore because it gets
	// initialized upon setInnerHTML.
	// tr.columnId = columnId;
	if ( this.onSelectCallback && !this.onSelectCallback.call( event ) )
	{
		return;	// TODO sbarkdull, get rid of this feature
	}
}
// TODO sbarkdull, probably don't need the tableId, if so, modify adhoc-businessview.xsl to rm param
AvailableItemsCtrl.prototype.handleUnselectItem = function( event, tr )
{
	if (!AvailableItemsCtrl.isItemChosen(tr)) {
		tr.className = AvailableItemsCtrl.CN_UNSELECTED;
	} else { 
		tr.className = AvailableItemsCtrl.CN_UNSELECTED + " " + AvailableItemsCtrl.CN_CHOSEN;
	}
	tr.selected = false;
	
	this.onUnselectCallback && this.onUnselectCallback.call( event );
}

AvailableItemsCtrl.prototype.handleUnselectAll = function( event )
{
	var trs = this.getItemTrs();
	for ( var idx=0; idx<trs.length; ++idx )
	{
		if ( AvailableItemsCtrl.isItemSelected( trs[idx] ) )
		{
			this.handleUnselectItem( event, trs[idx] );
		}
	}
}


/**
 * MB - gets the full list of trs for the columnId, and then
 * unselects each one.
 */
AvailableItemsCtrl.prototype.handleUnselectSameItems = function( event, thisTr, columnId )
{
  var trArray = this.columnIdMap[ columnId ]; // Get the array of trs from the map
  var currTr = null; // the current tr
  if (trArray != null) { // More paranoid concerns
    for (ii=0; ii<trArray.length; ii++) {
      currTr = trArray[ ii ];
			this.handleUnselectItem( event, currTr ); // unselect the item
    }
  }
}

/**
 * MB - gets the full list of trs for the columnId, and then
 * selects each one.
 */
AvailableItemsCtrl.prototype.handleSelectSameItems = function( event, thisTr, columnId )
{
  var trArray = this.columnIdMap[ columnId ]; // Get the array of trs from the map
  var currTr = null; // The currentTr in the list
  if (trArray != null) { // More paranoid concerns
    for (i=0; i<trArray.length; i++) {
      currTr = trArray[ i ]; // Get the TD
      this.handleSelectItem( event, currTr, currTr.tableId, columnId ); // Select the item
    }
  }
  
}

AvailableItemsCtrl.prototype.unselectAll = function()
{
	var pseudoEvent = new Object();
	this.handleUnselectAll( pseudoEvent );
}
/*static*/AvailableItemsCtrl.isItemSelected = function( tr )
{
	// ya, hack it in
	if ( tr.selected == undefined )
	{
		tr.selected = false;
	}
	return tr.selected;
}
/**
 * @param tr HTML-element-object the tr element to test for "chosen"-ness
 * @return boolean true if the item is chosen, else false
 */
/*static*/AvailableItemsCtrl.isItemChosen = function( tr )
{
	return tr.isChosen == true;
}

/**
 * MB - This method returns an array of trs containing the
 * business columns.
 */
AvailableItemsCtrl.prototype.getItemTrs = function()
{
  if (this.trList == null) { // If it doesn't exist, create it and populate it
		this.trList = new Array(); // Tracking list for the tr objects
		this.columnIdMap = new Array(); // Map of columnId->Array of trs
	
		// TODO sbarkdull, don't like that they all share the same name and we are keying off name, better way?
		var tbls = document.getElementsByName( "columnsContainer" );
		for ( var ii=0; ii<tbls.length; ++ii )
		{
			var currCells = tbls[ii].getElementsByTagName( "tr" );
			for ( var jj=0; jj<currCells.length; ++jj )
			{
		    // Add the tr to the trList
				this.trList.push( currCells[jj] );
				// Also make sure the columnId is in the map.
				this.addColumnIdToMap( currCells[jj] );
			}
		}
	}
	return this.trList;
}
/**
 * MB - This adds a columnId to the map and makes sure that
 * the tr gets associated with the correct columnId.
 */
AvailableItemsCtrl.prototype.addColumnIdToMap = function(currTr)
{
	var columnId = currTr.id;
	var trArrayForColumnId = this.columnIdMap[columnId]; // Find it in the map
	if (trArrayForColumnId == null) {
	  // No array yet - create it and put it in the map
	  trArrayForColumnId = new Array();
	  this.columnIdMap[columnId] = trArrayForColumnId;
	}
	// Put the tr into the tr array that's in the map for the column
	trArrayForColumnId.push( currTr );
}

/**
 * TODO sbarkdull, we can likely execute this once and cache it per model
 * 
 * @return Array returns an array of all of the tr elements associated with
 * each item in the AvailableItemsCtrl
 */
AvailableItemsCtrl.prototype.getItemDNDElems = function()
{	
	var trElems = [];
	
	// TODO sbarkdull, don't like that they all share the same name and we are keying off name, better way?
	var tbls = document.getElementsByName( "columnsContainer" );
	for ( var ii=0; ii<tbls.length; ++ii )
	{
    var currCells = tbls[ii].getElementsByTagName( "tr" );
		for ( var jj=0; jj<currCells.length; ++jj )
		{
			trElems.push( currCells[jj] );
		}
	}
	return trElems;
}

/**
 * MB - The preferred way to get the trs that are associated to
 * a columnId.
 * NOTE: if you pass in an invalid columnId, this method will return null
 */
AvailableItemsCtrl.prototype.getAllTrsByColumnId = function( columnId )
{	
  return this.columnIdMap[ columnId ]; // Get the array of TDs from the map
}

/*private static*/AvailableItemsCtrl.markItemChosen = function(tr, isChosen)
{
	if (AvailableItemsCtrl.isItemSelected(tr)) {
		if (isChosen) {
			tr.className = AvailableItemsCtrl.CN_SELECTED + " " + AvailableItemsCtrl.CN_CHOSEN;
		} else {
			tr.className = AvailableItemsCtrl.CN_SELECTED;
		}
	} else {
		if (isChosen) {
			tr.className = AvailableItemsCtrl.CN_UNSELECTED + " " + AvailableItemsCtrl.CN_CHOSEN;
		} else {
			tr.className = AvailableItemsCtrl.CN_UNSELECTED;
		}
	}
	tr.isChosen = isChosen;
}
/**
 * MB - This iterates through all the trs for the given columnId, and sets
 * the chosen status
 * @param item trElem element in the AvailableItemsCtrl whose choosen status is to be set
 */
AvailableItemsCtrl.prototype.setItemChosen = function( trElem, isChosen ) {
	var columnId = UIUtil.getColumnId( trElem );
	var trArray = this.getAllTrsByColumnId( columnId );
	if ( undefined != trArray )
	{
		for (i=0; i<trArray.length; i++) {
		  AvailableItemsCtrl.markItemChosen(trArray[i], isChosen);
		}
	}
}