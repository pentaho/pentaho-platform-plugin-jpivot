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
 * @param id String id attribute for list control (aka table)
 */
ROGroupsCtrl = function( id )
{
	ListCtrl.call( this, id, "columnsList", ListCtrl.SINGLE_SELECT );
	this.constructor = ROGroupsCtrl;
	this.groupHeaderTrElems = new Array( WaqrWizard.NUM_GROUPS );
	
	this.setDefaultSelectedItemClassName( ROGroupsCtrl.CN_GROUP_LIST_ITEM_SELECTED );
	for ( var ii=0; ii<WaqrWizard.NUM_GROUPS; ++ii )
	{
		var labelTxt = Messages.getString("levelTitle", ii+1);
		this.groupHeaderTrElems[ ii ] = this.addItem( labelTxt, ROGroupsCtrl.ID_BASE_LEVEL+ii, undefined,
		/*itemData*/undefined, "selectedGroupHeader", undefined );
	}
}
ROGroupsCtrl.prototype = new ListCtrl();
ROGroupsCtrl.ID_BASE_LEVEL = "levelId";
ROGroupsCtrl.CN_GROUP_LIST_ITEM_SELECTED = "selectedItem";

/**
 * @param groupHeader RSGroupHeader
 * @param groupIdx integer identifying the group to apply this header to.
 */
ROGroupsCtrl.prototype.setGroupHeaderData = function( groupHeader, groupIdx )
{
	var idx = this.findGroupHeaderIdx( groupIdx );
	this.setItemData( idx, groupHeader);
}

/**
 * @throws Error if there is not a group header corresponding to groupNum
 */
/*private*/
ROGroupsCtrl.prototype.findGroupHeaderIdx = function( groupNum )
{
	var headerIdx;
	var numItems = this.getLength();
	for ( headerIdx=0; headerIdx<numItems; ++headerIdx )
	{
		var currItem = this.getItem( headerIdx );
		if ( currItem == this.groupHeaderTrElems[ groupNum ] )
		{
			// found the group header
			return headerIdx;
		}
	}
	throw new Error( Messages.getString("invalidGroupNum", groupNum) );
}
/**
 * @param groupNum integer identifying which group the item is to be placed in
 * @param itemPos integer identifying position of item relative to group
 * @param itemText String to be displayed in the list
 * @param id String specifying the id of the tr element
 * @param itemData any type, data to be associated with the list item
 */
ROGroupsCtrl.prototype.addGroupItem = function( groupNum, itemPos, itemText, id, itemData )
{
	var headerIdx = this.findGroupHeaderIdx( groupNum );

	var trElem = this.addItem( itemText, id, headerIdx+itemPos+1, itemData );
}

/**
 * Removes all non-group header items
 */
ROGroupsCtrl.prototype.removeAllItems = function()
{
	this.removeAll();
	
	var numItems = this.groupHeaderTrElems.length;
	for ( var idx=0; idx<numItems; ++idx )
	{
		this.insertItem( this.groupHeaderTrElems[idx] );
	}
}

/**
 * Get an array of all of the list items that are NOT group header items.
 * The items are the same Object that is returned by ListCtrl.getItem().
 * In this case, it is a tr element with an itemData property that refers to
 * an RSGroupItem.
 * 
 * @return Array non-group-header items.
 */
ROGroupsCtrl.prototype.getGroupItems = function()
{
	var trElemAr = new Array();
	for (var ii=0; ii<this.getLength(); ++ii )
	{
		var tr = this.getItem( ii );
		var bIsHeaderItem = UIUtil.isInArray( this.groupHeaderTrElems, tr );
		
		if ( !bIsHeaderItem )	// its not a group header
		{
			trElemAr.push( tr );
		}
	}
	return trElemAr;
}
