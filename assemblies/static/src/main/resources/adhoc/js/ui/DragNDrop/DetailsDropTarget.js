/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


dojo.require("dojo.dnd.*");
dojo.require("dojo.event.*");

DetailsDropTarget = function( controller, el, type )
{
	dojo.dnd.HtmlDropTarget.call(this, el, type);
	//gLogger.debug( "DetailsDropTarget ctor" );
	this.controller = controller;
	this.targetEl = el;
	this.targetEl.isVisible = function()
	{
	  return UIUtil.isElVisibleInDiv( this, controller.wiz.getPg( 1 ).getDetailsCtrl().getRoot() );
	};
}
dojo.inherits( DetailsDropTarget, dojo.dnd.HtmlDropTarget );
dojo.lang.extend( DetailsDropTarget, 
{
	// override methods here
	onDrop: function(evt) {
		//gLogger.debug( "Details onDrop" );
		
		this.onDragOut(evt);
		
		var groupsCtrl = this.controller.wiz.getPg( 1 ).getGroupsCtrl();
		var detailsCtrl = this.controller.wiz.getPg( 1 ).getDetailsCtrl();
		var filtersCtrl = this.controller.wiz.getPg( 1 ).getFiltersCtrl();
		
		var dropIdx = this.getDropIdx( evt.clientX, evt.clientY, detailsCtrl );
		switch (evt.dragSource.type) {
			case Controller.AVAIL_COL_DRAG_ID:
				this.controller.addSelectedAvailItemsToDetails( dropIdx );
				break;
			case Controller.GROUP_DRAG_ID:
				var items = new Array();
				for (var groupListIdx = 0; groupListIdx < groupsCtrl.groupList.length; groupListIdx++) {
					items = items.concat(groupsCtrl.getGroupList(groupListIdx).getSelectedItems());				
				}
				this.controller.addItemsToDetails( items, dropIdx );
				UIUtil.removeListCtrlsItemsFromListCtrl( detailsCtrl, filtersCtrl );
				this.controller.pg1DeleteItemsFromGroups();
				break;
			case Controller.DETAIL_DRAG_ID:
				this.controller.addItemsToDetails(detailsCtrl.getSelectedItems(), dropIdx );
				this.controller.pg1DeleteItemsFromDetails();
				break;
			case Controller.FILTER_DRAG_ID:
				this.controller.addItemsToDetails( filtersCtrl.getSelectedItems(), dropIdx );
				this.controller.pg1DeleteItemsFromFilters();
				break;
		}

		DragNDropUtil.setNormalStyle( this.targetEl );
		// return a boolean indicating that the drop was or wasn't successful
		return true;
		
		//return dojo.dnd.HtmlDropTarget.prototype.onDrop.apply( this, arguments );
	},

  /**
   * @return integer containing the index of the item in the list to
   * drop before. 
   */
  getDropIdx: function( mouseX, mouseY, detailsCtrl )
  {
		var dropIdx = detailsCtrl.getIdxOfItem( this.targetEl );
		dropIdx = ( -1 == dropIdx ) ? 0 : dropIdx;
		return DragNDropUtil.getDropIdx( dropIdx, mouseX, mouseY, this.targetEl );
  },
  
// NO need to override, except for debugging

	onDragOver: function( evt ) {
		//gLogger.debug( "Details onDragOver ");
    var canDrop = dojo.dnd.HtmlDropTarget.prototype.onDragOver.apply( this, arguments );
    if ( canDrop )
    {
      canDrop = DragNDropUtil.isCanDrop( evt.dragObjects );
    }
    if ( canDrop )
    {
		  DragNDropUtil.setCanDropStyle( this.targetEl );
    }
    else
    {
		  DragNDropUtil.setCannotDropStyle( this.targetEl );
    }
    return canDrop;
	},

	onDragOut: function( evt ) {
		//gLogger.debug( "Details onDragOut" );
		DragNDropUtil.setNormalStyle( this.targetEl );
		return dojo.dnd.HtmlDropTarget.prototype.onDragOut.apply( this, arguments );
	}
/*
	onDragMove: function( evt, dragObjects ) {
		gLogger.debug( "Details onDragMove" );
		
		dojo.dnd.HtmlDropTarget.prototype.onDragMove.apply( this, arguments );
	}
*/
});
