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
