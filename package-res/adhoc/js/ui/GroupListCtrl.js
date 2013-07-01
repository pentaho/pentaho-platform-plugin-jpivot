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