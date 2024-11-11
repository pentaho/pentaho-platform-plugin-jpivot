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
 * @param levelName String the name of the group
 * @param isRepeatGroupHeader boolean not sure what it means
 * @param alignment String vertical alignment
 * @param pageBreak String 
 * @param bShowGroupSummary boolean 
 * @param groupTotalLabel String 
 */

RSGroupHeader = function( levelName, isRepeatGroupHeader,
	alignment, pageBreak, bShowGroupSummary, groupTotalLabel )
{
	this.levelName = levelName != undefined                      ? levelName : "";
	this.isRepeatGroupHeader = isRepeatGroupHeader != undefined  ? isRepeatGroupHeader : false;
	this.alignment = alignment != undefined                      ? alignment : "top";
	this.pageBreak = pageBreak != undefined                      ? pageBreak : "none";
	this.bShowGroupSummary = bShowGroupSummary != undefined      ? bShowGroupSummary : true;
	this.groupTotalLabel = groupTotalLabel != undefined          ? groupTotalLabel : RSGroupHeader.DEFAULT_GROUP_TOTAL_LABEL;
}


/*static*/RSGroupHeader.DEFAULT_GROUP_TOTAL_LABEL =
  Messages.getString( "DEFAULT_GROUP_TOTAL_LABEL" ) + " $(group-label)";
