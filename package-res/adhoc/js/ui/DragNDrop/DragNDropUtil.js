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