/*
* Copyright 2002 - 2013 Pentaho Corporation.  All rights reserved.
* 
* This software was developed by Pentaho Corporation and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

CalendarAdapter = function( imgId, inputId, data )
{
	Calendar.setup({
	        inputField     :    inputId,     // id of the input field
	        ifFormat       :    "%B %e, %Y",      // format of the input field
	        button         :    imgId,  // trigger for the calendar (button ID)
	        align          :    "Bl",           // alignment (defaults to "Bl")
	        singleClick    :    true,
	        weekNumbers    : true
	    });
}
