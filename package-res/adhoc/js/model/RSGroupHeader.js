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