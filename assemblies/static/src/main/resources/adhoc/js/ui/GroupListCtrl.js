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
 * TODO sbarkdull, should this become a generic list of lists class?
 * 
 * @param id String containing id of the outter most element (containing element, a div in this case)
 * @param className String containing class name for the list control
 * @param groupLabelTxt String text of the group header (eg Level 1)
 * @param labelClassName String class name of group label
 */

GroupListCtrl = function( id, className, groupLabelTxt, labelClassName )
{
	DragItemHereListCtrl.call( this, id, className, ListCtrl.MULTI_SELECT );	
	
	var groupLabel = document.createElement( "div" );
	groupLabel.innerHTML = groupLabelTxt;
	groupLabel.className = labelClassName;
	
	this.getRoot().insertBefore( groupLabel, this.getRoot().childNodes[ 0 ] );
}
GroupListCtrl.prototype = new DragItemHereListCtrl();
