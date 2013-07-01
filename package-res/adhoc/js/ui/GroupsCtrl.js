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
 * GroupsCtrl implements a list of lists, where each sub list represents a group
 */
GroupsCtrl = function( id, className )
{
	HTMLCtrl.call( this, "div" );
	var groupsDiv = this.getRoot();
	groupsDiv.className = className;
	groupsDiv.id = id;
	
	this.groupList = new Array();	// contains GroupListCtrl
	for ( var ii=0; ii<WaqrWizard.NUM_GROUPS; ++ii )
	{
		this.groupList[ii] = new GroupListCtrl( WaqrWizard.ID_BASE_GROUP + ii, "groupsCtrl",
			Messages.getString("levelTitle", ii+1), "unselectedGroupHeader" );
		this.groupList[ii].setDefaultSelectedItemClassName( GroupsCtrl.CN_GROUP_LIST_ITEM_SELECTED );
		this.groupList[ii].setOnMouseDownCallback( this.handleMouseDown, this );
		
		groupsDiv.appendChild( this.groupList[ii].getRoot() );
	}
}
GroupsCtrl.prototype = new HTMLCtrl();
GroupsCtrl.CN_GROUP_LIST_ITEM_SELECTED = "selectedItem";

/**
 * @return Array of GroupListCtrl
 */
GroupsCtrl.prototype.getGroupList = function( whichGroup )
{
	return this.groupList[ whichGroup ];
}

/**
 * @return tr element the tr element that was just added to the list control
 */
GroupsCtrl.prototype.addGroupItem = function( groupIdx, itemIdx, itemLabel, itemId, itemData ) 
{
	if ( itemData.constructor != RSGroupItem )
	{
		throw new Error( Messages.getString("invalidGrpItem") );
	}
	var groupList = this.groupList[ groupIdx ];
	var trElem = groupList.addItem( itemLabel, itemId, itemIdx, itemData );
	return trElem;
}

GroupsCtrl.prototype.removeAllItems = function()
{
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		var list = this.groupList[ ii ];
		list.removeAll();
	}
}

/**
 * @return 2 dimensional array of int, where the first (left) dimension
 * represents each group and the second dimension is a list of int,
 * where each int is the index of a selected item in the group.
 */
GroupsCtrl.prototype.getSelectedItemIdxs = function()
{
	var selGroupItems = new Array();
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		var selItemIdxs = this.groupList[ii].getSelectedItemIdxs();
		selGroupItems.push( selItemIdxs );
	}
	return selGroupItems;
}

// TODO sbarkdull is this method used?
GroupsCtrl.prototype.getSelectedItems = function()
{
	debugger;
	// am i getting a list of items, or an array of arrays of items
	var selGroupItems = new Array();
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		var selItems = this.groupList[ii].getSelectedItems();
		selGroupItems.push( selItems );
	}
	return selGroupItems;
}

/**
 * @param trItem in most cases, this will be a tr element, but it
 * could be the [drag item here] div element in the DragHereListCtrl
 * @return Object with properties groupIdx and itemIdx. groupIdx
 * is the index of the group that trItem is in, itemIdx is the
 * index of trItem in it's group
 */
GroupsCtrl.prototype.getIdxOfItem = function( trItem )
{
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		var idx = this.groupList[ii].getIdxOfItem( trItem );
		if ( idx != -1 )
		{
			return { groupIdx: ii, itemIdx: idx };
		}
	}
	// didn't find it, maybe it's the [drag item here] div element
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		var list = this.groupList[ii];
		if ( list.insertLabel == trItem )	// if these match, trItem is in fact a div tag
		{
			return { groupIdx: ii, itemIdx: 0 };
		}
	}
	return { groupIdx: -1, itemIdx: -1 };
}

/**
 * @return integer the number of selected items
 */
GroupsCtrl.prototype.getNumSelectedItems = function()
{
	var numSel = 0;
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		numSel += this.groupList[ ii ].getNumSelectedItems();
	}
	return numSel;
}
/*private*/
GroupsCtrl.prototype.handleUnselectAll = function( event )
{
	for ( var ii=0; ii<this.groupList.length; ++ii )
	{
		this.groupList[ ii ].handleUnselectAll( event );
	}
}
/**
 * TODO sbarkdull
 * @deprecated this appears to not be used, or implemented correctly, delete it.
 */
GroupsCtrl.prototype.moveItem = function( whichGroup, itemPosition, newPosition )
{
	// TODO sbarkdull, is this method used, and is it correct?
	debugger;
	
	// if item is last item in non-last list, move it to first item in next list
	// if item is first item in non-first list, move it to last item in previous list
	// 
	var list = this.groupList[ whichGroup ];
	list.moveItem( itemPosition, newPosition );
}

GroupsCtrl.prototype.removeSelectedItems = function()
{
	var selectedIdxs = this.findSelectedIdxs();
	if ( this.canRemoveSelectedItems( selectedIdxs ) )
	{
		for ( var ii=0; ii<this.groupList.length; ++ii )
		{
			this.groupList[ ii ].removeSelectedItems();
		}
	}
}
/**
 * @return the index of the last group with at least one unselected item
 */
GroupsCtrl.prototype.getLastGroupWithAtLeastOneUnselectedItemIdx = function( selectedIdxs )
{
	var lastPopulatedGroupIdx = this.getLastPopulatedGroupIdx();
	for ( var groupIdx=lastPopulatedGroupIdx; groupIdx>=0; --groupIdx )
	{
		if ( this.hasAtLeastOneItemInGroupUnselected( selectedIdxs, groupIdx ) )
		{
			return groupIdx;
		}
	}
}
/**
 * ok to delete when:
 * the selected item is not the only item in its group, or it is in the last group.
 */
GroupsCtrl.prototype.canRemoveSelectedItems = function( selectedIdxs )
{
	var lastGroupWithAtLeastOneUnselectedItemIdx = this.getLastGroupWithAtLeastOneUnselectedItemIdx( selectedIdxs );
	
	for ( var groupIdx=lastGroupWithAtLeastOneUnselectedItemIdx-1; groupIdx>=0; --groupIdx )
	{
		if ( !this.hasAtLeastOneItemInGroupUnselected( selectedIdxs, groupIdx ) )
		{
			return false;
		}
	}
	return true;
}
/**
 * @return boolean true if the last item in the group is selected
 */
GroupsCtrl.prototype.hasLastItemInGroupSelected = function( selectedIdxs, groupIdx )
{
	var selectedGroupIdxs = selectedIdxs[ groupIdx ];
	if ( selectedGroupIdxs.length == 0 )
	{
		return false;	// no items in group selected
	}
	var lastSelectedIdx = selectedGroupIdxs[ selectedGroupIdxs.length-1 ];
	var lastIdx = this.groupList[ groupIdx ].length;
	return lastSelectedIdx < lastIdx;
}
/**
 * @return boolean true if the first item in the group is selected
 */
GroupsCtrl.prototype.hasFirstItemInGroupSelected = function( selectedIdxs, groupIdx )
{
	var selectedGroupIdxs = selectedIdxs[ groupIdx ];
	if ( selectedGroupIdxs.length == 0 )
	{
		return false;	// no items in group selected
	}
	var firstSelectedIdx = selectedGroupIdxs[ 0 ];
	return firstSelectedIdx == 0;
}
/**
 * 
 * @return boolean true if the group identified by groupIdx has at least
 * one unselected item.
 */
GroupsCtrl.prototype.hasAtLeastOneItemInGroupUnselected = function( selectedIdxs, groupIdx )
{
		var numItems = this.groupList[ groupIdx ].getLength();
		var numSelectedItems = selectedIdxs[ groupIdx ].length;
		return numSelectedItems < numItems;
}
/**
 * Find the index of the last group that has at least one item.
 * @return integer identifying the last group that has at least one item,
 * if no groups are populated, return -1.
 */
/*private*/ GroupsCtrl.prototype.getLastPopulatedGroupIdx = function()
{
	for ( var groupIdx=this.groupList.length-1; groupIdx >= 0; --groupIdx )
	{
		if ( this.groupList[ groupIdx ].getLength() > 0 )
		{
			return groupIdx;
		}
	}
	return -1;
}
/**
 * ok to move down when:
 * each group that has one or more selected items also has at least one unselected item
 * or the last item of the previous group is selected
 *
 * left index is by group, right index is an array of integers, where
 * each integer is the index of a selected item in a group
 * 
 * @param selectedIdxs Array of Arrays, i.e. list of lists of indexes of selected items
 * left index is by group, right index is an index of a selected item in a group
 * @return boolean true if it is ok to move the item, else false
 */
GroupsCtrl.prototype.canMoveSelectedItemsDown = function( selectedIdxs )
{
	var lastPopulatedGroupIdx = this.getLastPopulatedGroupIdx();
	var selectedIdxsLastPopulatedGroup = selectedIdxs[ lastPopulatedGroupIdx ];

	var lastPopulatedGroupIdx = this.getLastPopulatedGroupIdx();
	for ( var groupIdx=0; groupIdx<=lastPopulatedGroupIdx; ++groupIdx )
	{
		if ( !( this.hasAtLeastOneItemInGroupUnselected( selectedIdxs, groupIdx ) 
			|| ( groupIdx != 0 && this.hasLastItemInGroupSelected( selectedIdxs, groupIdx-1 ) ) ) )
		{
			return false;
		}
	}
	return true;
}

/**
 * ok to move up when:
 * the first item in the first list is not selected
 * each group that has one or more selected items also has at least one unselected item,
 * except for the last populated group, where any number of items can be selected
 * 
 * left index is by group, right index is an array of integers, where
 * each integer is the index of a selected item in a group
 * 
 * @param selectedIdxs Array of Arrays, i.e. a list of lists of indexes of selected items
 * @return boolean true if it is ok to move the item, else false
 */
GroupsCtrl.prototype.canMoveSelectedItemsUp = function( selectedIdxs )
{
	var groupSelectedIdxs = selectedIdxs[ 0 ];
	if ( groupSelectedIdxs[ 0 ] == 0 )
	{
		return false;
	}
	var lastPopulatedGroupIdx = this.getLastPopulatedGroupIdx();
	for ( var groupIdx=0; groupIdx<lastPopulatedGroupIdx; ++groupIdx )
	{
		if ( !(this.hasAtLeastOneItemInGroupUnselected( selectedIdxs, groupIdx ) ||
		( (groupIdx < lastPopulatedGroupIdx) && this.hasFirstItemInGroupSelected( selectedIdxs, groupIdx+1 ) )) )
		{
			return false;
		}
	}
	return true;
}

/**
 * 
 */
GroupsCtrl.prototype.moveSelectedItemsUp = function()
{
	var selectedIdxs = this.findSelectedIdxs();
	if ( !this.canMoveSelectedItemsUp( selectedIdxs ) )
	{
		return;
	}
	
	for ( var groupIdx=0; groupIdx<selectedIdxs.length; ++groupIdx )
	{
		var selectedGroupIdxs = selectedIdxs[ groupIdx ];
		for ( var itemIdx=0; itemIdx<selectedGroupIdxs.length; ++itemIdx )
		{
			// we have a selection
			var firstSelItemIdx = selectedGroupIdxs[ itemIdx ];
			var firstGroupIdx = 0;
			var firstItemIdx = 0;
			
			if ( !( (groupIdx == firstGroupIdx ) && (firstSelItemIdx == firstItemIdx) ) )
			{
				// is first item selected?
				if ( firstSelItemIdx == firstItemIdx )
				{
					// move item to end prev group
					var item = this.groupList[groupIdx].removeItem( firstSelItemIdx );
					this.groupList[groupIdx-1].insertItem( item, this.groupList[groupIdx-1].length );
					selectedGroupIdxs.shift();	//	remove 1st element
					for ( var idx=0; idx<selectedGroupIdxs.length; ++ idx )
					{
						selectedGroupIdxs[ idx ]--;
					}
					itemIdx = -1; // start the loop over
				}
				else
				{
					// move item up in same group
					this.groupList[groupIdx].moveItem( firstSelItemIdx, firstSelItemIdx-1 );
				}
			}
		}
	}
}

/**
 * currently only handles ONE selected item
 */
GroupsCtrl.prototype.moveSelectedItemsDown = function()
{
	var selectedIdxs = this.findSelectedIdxs();
	if ( !this.canMoveSelectedItemsDown( selectedIdxs ) )
	{
		return;
	}	
	for ( var groupIdx=selectedIdxs.length-1; groupIdx >= 0; --groupIdx )
	{
		var selectedGroupIdxs = selectedIdxs[ groupIdx ];
		for ( var itemIdx=selectedGroupIdxs.length-1; itemIdx>=0; --itemIdx )
		{
			// we have a selection
			var lastSelGroupIdx = groupIdx;
			var lastSelItemIdx = selectedGroupIdxs[ itemIdx ];
			var lastGroupIdx = this.groupList.length-1;
			var lastItemIdx = this.groupList[lastGroupIdx].length-1;
			
			if ( !( (lastSelGroupIdx == lastGroupIdx ) && (lastSelItemIdx == lastItemIdx) ) )
			{
				// non-last item is selected
				if ( lastSelItemIdx == this.groupList[lastSelGroupIdx].length-1)
				{
					// move item to beginning next group
					var item = this.groupList[lastSelGroupIdx].removeItem( lastSelItemIdx );
					this.groupList[lastSelGroupIdx+1].insertItem( item, 0 );
				}
				else
				{
					// move item down in same group
					this.groupList[lastSelGroupIdx].moveItem( lastSelItemIdx, lastSelItemIdx+1 );
				}
			}
		}
	}
}

/**
 * @param selIdxs 2D array, first D is the group, second D is the set of indexes of selected items in the group
 * @return an Object with the group property containing containing the index of the group
 * with the last selected item, and the item property containing the group-relative index of the last
 * selected item.
 */
/*private*/ GroupsCtrl.prototype.findLastSelectedIdx = function( selIdxs )
{
	var selItemIdxs;
	for ( var groupIdx=this.groupList.length-1; groupIdx>=0; --groupIdx )
	{
		selItemIdxs = this.groupList[groupIdx].getSelectedItemIdxs();
		if ( selItemIdxs.length > 0 ) break;
	}
	return (selItemIdxs.length > 0) ? { group:groupIdx, item:selItemIdxs[selItemIdxs.length-1] } : null;
}
/**
 * @param selIdxs 2D array, first D is the group, second D is the set of indexes of selected items in the group
 */
/*private*/ GroupsCtrl.prototype.findSelectedIdxs = function()
{
	var selectedIdxs = new Array();
	var selectedItemIdxs;
	for ( var groupIdx=0; groupIdx<this.groupList.length; ++groupIdx )
	{
		selectedItemIdxs = this.groupList[groupIdx].getSelectedItemIdxs();
		selectedIdxs.push( selectedItemIdxs );
	}
	return selectedIdxs;
}

/**
 * if ctrl key is not down, unselect all items in all the group lists
 * 
 * @param targetObj GroupsCtrl instance that registered this callback
 */
GroupsCtrl.prototype.handleMouseDown = function( event )
{
	if ( !event.ctrlKey )
	{
		this.handleUnselectAll( event );
	}
}