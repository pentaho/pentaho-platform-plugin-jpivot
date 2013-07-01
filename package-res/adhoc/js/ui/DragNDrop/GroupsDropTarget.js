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
dojo.require("dojo.dnd.*");
dojo.require("dojo.event.*");

GroupsDropTarget = function( controller, el, type )
{
	dojo.dnd.HtmlDropTarget.call(this, el, type);
	//gLogger.debug( "GroupsDropTarget ctor" );
	this.controller = controller;
	this.targetEl = el;
	this.targetEl.isVisible = function()
	{
	  return UIUtil.isElVisibleInDiv( this, controller.wiz.getPg( 1 ).getGroupsCtrl().getRoot() );
	};
}
dojo.inherits( GroupsDropTarget, dojo.dnd.HtmlDropTarget );
dojo.lang.extend( GroupsDropTarget, 
{
	onDrop: function(evt) {
		//gLogger.debug( "Groups onDrop" );
		
		this.onDragOut(evt);
		
		var dropSuccessful = false;
		var groupsCtrl = this.controller.wiz.getPg( 1 ).getGroupsCtrl();
		var detailsCtrl = this.controller.wiz.getPg( 1 ).getDetailsCtrl();
		var filtersCtrl = this.controller.wiz.getPg( 1 ).getFiltersCtrl();
		
		var dropIdx = this.getDropIdx( evt.clientX, evt.clientY, groupsCtrl );// dropIdx has properties: groupIdx and itemIdx
		
		var lastPopulatedGrp = groupsCtrl.getLastPopulatedGroupIdx();
		if ((lastPopulatedGrp + 1) >= dropIdx.groupIdx) {
			switch (evt.dragSource.type) {
				case Controller.AVAIL_COL_DRAG_ID:
					this.controller.addSelectedAvailItemsToGroups(dropIdx.groupIdx, dropIdx.itemIdx );
					break;
				case Controller.DETAIL_DRAG_ID:
					this.controller.addItemsToGroups(detailsCtrl.getSelectedItems(), dropIdx.groupIdx, dropIdx.itemIdx );
					this.controller.pg1DeleteItemsFromDetails();
					break;
				case Controller.FILTER_DRAG_ID:
					this.controller.addItemsToGroups(filtersCtrl.getSelectedItems(), dropIdx.groupIdx, dropIdx.itemIdx );
					this.controller.pg1DeleteItemsFromFilters();
					break;
				case Controller.GROUP_DRAG_ID:
					for (var groupListIdx = 0; groupListIdx < groupsCtrl.groupList.length; groupListIdx++) {
						var items = groupsCtrl.getGroupList(groupListIdx).getSelectedItems();
						this.controller.addItemsToGroups(items, dropIdx.groupIdx, dropIdx.itemIdx );
					}
					this.controller.pg1DeleteItemsFromGroups();
					break;
			}
			dropSuccessful = true;
		}
		// else don't allow the drop
		
		DragNDropUtil.setNormalStyle( this.targetEl );
		return dropSuccessful;
		//return dojo.dnd.HtmlDropTarget.prototype.onDrop.apply( this, arguments );
	},

  /**
   * @return Object with properties groupIdx and itemIdx
   */
  getDropIdx: function( mouseX, mouseY, groupsCtrl )
  {
		var dropIdx = groupsCtrl.getIdxOfItem( this.targetEl );	// dropIdx has properties: groupIdx and itemIdx
		if ( -1 == dropIdx.itemIdx )
		{
			dropIdx.groupIdx = 0;
			dropIdx.itemIdx = 0;
		}
		dropIdx.itemIdx = DragNDropUtil.getDropIdx( dropIdx.itemIdx, mouseX, mouseY, this.targetEl );
		return dropIdx;
  },

  /**
   * @param dropIdx Object with properties: groupIdx, itemIdx
   */
  isOkToDrop: function( dragObjects, dropIdx, groupsCtrl )
  {
		var bAllowDrop = true;
		var dragObject = dragObjects[0];
    bAllowDrop = DragNDropUtil.isCanDrop( dragObjects );
		
		if ( bAllowDrop )
		{
  		var lastPopulatedGroupIdx = groupsCtrl.getLastPopulatedGroupIdx();
  		if ( dragObject.type == Controller.GROUP_DRAG_ID ) {
  			var lastPopulatedGroupCtrl = groupsCtrl.getGroupList( lastPopulatedGroupIdx );
  			if ( lastPopulatedGroupCtrl.getNumSelectedItems() == lastPopulatedGroupCtrl.getLength() )
  			{
  				// all items in the last group are selected
  				lastPopulatedGroupIdx--;
  			}
  		}
  		bAllowDrop = dropIdx.groupIdx <= lastPopulatedGroupIdx+1;
		}
		return bAllowDrop;
  },
  
	onDragOver: function( evt ) {
		//gLogger.debug( "Groups onDragOver ");
			
		var dragObject = evt.dragObjects[0];
		var groupsCtrl = this.controller.wiz.getPg( 1 ).getGroupsCtrl();
		var dropIdx = groupsCtrl.getIdxOfItem( this.targetEl );	// dropIdx has properties: groupIdx and itemIdx
		if ( -1 == dropIdx.itemIdx )
		{
			dropIdx.groupIdx = 0;
			dropIdx.itemIdx = undefined;
		}
		
		var bAllowDrop = this.isOkToDrop( evt.dragObjects, dropIdx, groupsCtrl );
		if ( bAllowDrop )
		{
		  DragNDropUtil.setCanDropStyle( this.targetEl );
		  dragObject.dragClone.style.cursor = "move";
		}
		else
		{
		  DragNDropUtil.setCannotDropStyle( this.targetEl );
		}
		
		var canDrop = false;
		if ( bAllowDrop )
		{
      canDrop = dojo.dnd.HtmlDropTarget.prototype.onDragOver.apply( this, arguments );
		}
		//gLogger.debug( "Groups onDragOver, canDrop: " + canDrop + " className: " + this.targetEl.className );
		return canDrop;
	},

	onDragOut: function( evt ) {
		//gLogger.debug( "Groups onDragOut" );
		DragNDropUtil.setNormalStyle( this.targetEl );
		return dojo.dnd.HtmlDropTarget.prototype.onDragOut.apply( this, arguments );
	}
	
// NO need to override, except for debgging
/*
	,onDragMove: function( evt, dragObjects ) {
	  
		gLogger.debug( "Groups onDragMove ");
		var elPos = UIUtil.getElemOffset( this.targetEl );
		var x = UIUtil.getElemScrollOffset( this.targetEl );
		elPos.top -= x.top;
		elPos.left -= x.left;
		
		var mouseX = evt.clientX;
		var mouseY = evt.clientY;
		gLogger.debug( "el pos: " + elPos.left + "," + elPos.top + "mouse: " + mouseX + "," + mouseY );
		dojo.dnd.HtmlDropTarget.prototype.onDragMove.apply( this, arguments );
		return;
	}
*/
});