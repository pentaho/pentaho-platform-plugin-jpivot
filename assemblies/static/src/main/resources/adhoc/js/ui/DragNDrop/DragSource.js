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
