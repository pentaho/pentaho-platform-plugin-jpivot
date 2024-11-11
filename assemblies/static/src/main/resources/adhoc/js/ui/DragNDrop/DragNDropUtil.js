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


/**
 * static class
 */ 

DragNDropUtil = function()
{
}

// given a string "xx_yy", match and return "xx" and "_yy" 
/*static*/DragNDropUtil.RE_CLASSNAME_PARTS = /([^_]*)(_.*)?/;
/*static*/DragNDropUtil.CAN_DROP = "_CanDrop";
/*static*/DragNDropUtil.CANNOT_DROP = "_CannotDrop";

/*static*/DragNDropUtil.setNormalStyle = function( el )
{
  var parts = el.className.match( DragNDropUtil.RE_CLASSNAME_PARTS );
  if ( null != parts )
  {
    el.className = parts[1];
  }
}

/*static*/DragNDropUtil.setCanDropStyle = function( el )
{
  var parts = el.className.match( DragNDropUtil.RE_CLASSNAME_PARTS );
  if ( null != parts )
  {
    el.className = parts[1] + DragNDropUtil.CAN_DROP;
  }
}

/*static*/DragNDropUtil.setCannotDropStyle = function( el )
{
  var parts = el.className.match( DragNDropUtil.RE_CLASSNAME_PARTS );
  if ( null != parts )
  {
    el.className = parts[1] + DragNDropUtil.CANNOT_DROP;
  }
}

/*static*/DragNDropUtil.isCanDrop = function( dragObjects )
{
  var dragObject = dragObjects[0];
  return dragObject.dragClass != "selectedItem_itemCannotDrag";
}

/**
 * Given a possible drop index, return the desired drop index, where the desired
 * drop index is determined by looking at the x,y coordinates and seeing if they
 * are in the top half of the html elements bounding box, or the bottom half. If in
 * the top half, return possibleDropIdx, else it must be in the bottom half, so return
 * possibleDropIdx + 1. The net result is that the item being dropped will be 
 * dropped above the item the mouse is currently over if the mouse cursor
 * is in the top half of the BBox, otherwise it will be dropped after the element.
 * 
 * @param possibleDropIdx integer
 * @param x integer x-coordinate in page space
 * @param y integer y-coordinate in page space
 * @param mouelseY HTML element
 */
/*static*/DragNDropUtil.getDropIdx = function( possibleDropIdx, x, y, el )
{ 
  var bBox = UIUtil.getBoundingBox( el );
  var bIsInTopHalf = UIUtil.isPointInTopHalfOfBoundingBox(
    {x:x, y:y }, bBox );
  return bIsInTopHalf ? possibleDropIdx : possibleDropIdx+1;
}
