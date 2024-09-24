/*
* Copyright 2002 - 2017 Hitachi Vantara.  All rights reserved.
* 
* This software was developed by Hitachi Vantara and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

/**
 * This javascript include file is required for <wcf:scroller/>.
 * include this script once into your jsp and add <wcf:scroller/> to any
 * form on that page.
 */

/**
 * Listens to user interaction and stores the current scroll position
 * in hidden fields in any form on the page that contains a <wcf:scroller/> tag.
 */

function xScrollerGetCoords()
{
  var scrollX, scrollY;
  var i;

  if (document.all)
  {
     if (document.documentElement.scrollLeft) {
        scrollX = document.documentElement.scrollLeft;
     }
     else {
        scrollX = document.body.scrollLeft;
     }

     if (document.documentElement.scrollTop) {
        scrollY = document.documentElement.scrollTop;
     }
     else {
        scrollY = document.body.scrollTop;
     }
  }
  else
  {
     scrollX = window.pageXOffset;
     scrollY = window.pageYOffset;
  }

  for(i=0; i<document.forms.length; i++) {
    if(document.forms[i].wcfXCoord && document.forms[i].wcfYCoord) {
      document.forms[i].wcfXCoord.value = scrollX;
      document.forms[i].wcfYCoord.value = scrollY;
    }
  }
}

/**
 * Scrolls the browser window to the position that is stored in the hidden fields
 */
function xScrollerScroll()
{
  var i;

  for(i=0; i<document.forms.length; i++) {
    if(document.forms[i].wcfXCoord && document.forms[i].wcfYCoord) {
      var x = document.forms[i].wcfXCoord.value;
      var y = document.forms[i].wcfYCoord.value;
      window.scrollTo(x, y);
    }
  }
}

/**
 * Registers browser window event listeners
 */
window.onload = xScrollerScroll;
window.onscroll = xScrollerGetCoords;
window.onkeypress = xScrollerGetCoords;
window.onclick = xScrollerGetCoords;
