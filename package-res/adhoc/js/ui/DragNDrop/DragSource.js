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

/**
 * @param node HTML element
 * @param type String a string identifying the drag/drop type of this object
 * @param funkDragSourceValidator function, can be null or undefined, I'll 
 * write more later about what it needs to do if present, but in general,
 * it must return a boolean.
 */
DragSource = function( node, type, funkDragSourceValidator )
{
	//gLogger.debug( "create drag source " + node.innerHTML );
	dojo.dnd.HtmlDragSource.call(this, node, type);
	this.dragType = type;
	this.funkDragSourceValidator = funkDragSourceValidator;
}
dojo.inherits( DragSource, dojo.dnd.HtmlDragSource );
dojo.lang.extend( DragSource, 
{
	onDragStart:function () {
		//gLogger.debug( "drag start" );

		var dragObject = null;
		var bIsValid = this.funkDragSourceValidator
		  ? this.funkDragSourceValidator( this.dragType )
		  : true;
		  
		// dojo.dnd.HtmlDragObject
		dragObject = dojo.dnd.HtmlDragSource.prototype.onDragStart.apply(this, arguments);
		// TODO sbarkdull, let the base className be passed to ctor as param, we can tack
		// on suffix for base className as needed.
		dragObject.dragClass = bIsValid
		  ? "selectedItem_itemDrag" 
      : "selectedItem_itemCannotDrag";
		
		return dragObject;
	}
	/*
	,
	// Not necessary, useful for debugging
	setDragHandle:function (node) {
		var val= dojo.dnd.HtmlDragSource.prototype.setDragHandle.apply(this, arguments);
		return val;
	},
	setDragTarget:function (node) {
		var val= dojo.dnd.HtmlDragSource.prototype.setDragTarget.apply(this, arguments);
		return val;
	},
	constrainTo:function (container) {
		var val= dojo.dnd.HtmlDragSource.prototype.constrainTo.apply(this, arguments);
		return val;
	},
	onSelected:function () {
		var val= dojo.dnd.HtmlDragSource.prototype.onSelected.apply(this, arguments);
		return val;
	},
	addDragObjects:function (el) {
		var val= dojo.dnd.HtmlDragSource.prototype.addDragObjects.apply(this, arguments);
		return val;
	}
*/
});