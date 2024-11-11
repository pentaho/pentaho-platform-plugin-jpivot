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


GroupHeaderEditorCtrl = function()
{
	this.containerElem = document.getElementById("groupHeaderEditorContainer");
	this.containerElem.title = Messages.getString( "STEP3_GROUP_HEADER_EDITOR_TOOLTIP" );
	
	this.levelNameElem = document.getElementsByName( "levelName" )[0];
	this.levelNameElem.onfocus = function() { this.select();};
	
	// Options group
	this.repeatGroupHeaderCB = document.getElementById( "repeatGroupHeader" );
	this.showGroupSummaryCB = document.getElementById( "showGroupSummaryCB" );
	this.groupTotalLabelText = document.getElementById( "groupTotalLabelText" );
	this.groupTotalLabelText.disabled = true;
	
	// Alignment radio button group
	var groupHeaderAlignmentContainer = document.getElementById( "groupHeaderAlignmentContainer" );
	var ctrl = new RadioButtonsCtrl( undefined, "alignment" );
	ctrl.addButton( Messages.getString("alignGrpHdrDefaultBtnTxt"), WaqrWizard.NOT_SET_VALUE );
	ctrl.addButton( Messages.getString("alignGrpHdrTopBtnTxt"), "top" );
	ctrl.addButton( Messages.getString("alignGrpHdrMiddleBtnTxt"), "middle" );
	ctrl.addButton( Messages.getString("alignGrpHdrBottomBtnTxt"), "bottom" );
	groupHeaderAlignmentContainer.appendChild( ctrl.getRoot() );
	this.groupHeaderAlignmentContainer = ctrl;
	
	// Page Break radio button group
	var groupHeaderPageBreakContainer = document.getElementById( "groupHeaderPageBreakContainer" );
	var ctrl = new RadioButtonsCtrl( undefined, "pageBreak" );
	ctrl.addButton( Messages.getString("noGrpPgBrkBtnTxt"), "none" );
	ctrl.addButton( Messages.getString("pgBrkAfterGrpBtnTxt"), "afterGroup" );
	ctrl.addButton( Messages.getString("pgBrkBeforeGrpBtnTxt"), "beforeGroup" );
	groupHeaderPageBreakContainer.appendChild( ctrl.getRoot() );
	this.groupHeaderPageBreakContainer = ctrl;
}
GroupHeaderEditorCtrl.prototype.enableGroupTotalLabel = function( bEnabled )
{
  this.groupTotalLabelText.disabled = !bEnabled;
}

GroupHeaderEditorCtrl.prototype.getLevelName = function()
{
	return this.levelNameElem.value;
}
GroupHeaderEditorCtrl.prototype.setLevelName = function( levelName )
{
	this.levelNameElem.value = levelName;
}
GroupHeaderEditorCtrl.prototype.getRepeatGroupHeader = function()
{
	return this.repeatGroupHeaderCB.checked == true;
}
GroupHeaderEditorCtrl.prototype.setRepeatGroupHeader = function( isRepeatGroupHeader )
{
	this.repeatGroupHeaderCB.checked = isRepeatGroupHeader;
}
GroupHeaderEditorCtrl.prototype.getAlignment = function()
{
	return this.groupHeaderAlignmentContainer.getValue();
}
GroupHeaderEditorCtrl.prototype.setAlignment = function( alignment )
{
	this.groupHeaderAlignmentContainer.setValue( alignment );
}
GroupHeaderEditorCtrl.prototype.getPageBreak = function()
{
	return this.groupHeaderPageBreakContainer.getValue();
}
GroupHeaderEditorCtrl.prototype.setPageBreak = function( pageBreak )
{
	this.groupHeaderPageBreakContainer.setValue( pageBreak );
}

GroupHeaderEditorCtrl.prototype.getShowGroupSummary = function()
{
	return this.showGroupSummaryCB.checked == true;
}
GroupHeaderEditorCtrl.prototype.setShowGroupSummary = function( bShowGroupSummary )
{
	this.showGroupSummaryCB.checked = bShowGroupSummary;
	this.enableGroupTotalLabel( bShowGroupSummary );
}

GroupHeaderEditorCtrl.prototype.getGroupTotalLabel = function()
{
	return this.groupTotalLabelText.value;
}
GroupHeaderEditorCtrl.prototype.setGroupTotalLabel = function( groupTotalLabelText )
{
	this.groupTotalLabelText.value = groupTotalLabelText;
}

GroupHeaderEditorCtrl.prototype.show = function()
{
	this.containerElem.style.display = "block";
}
GroupHeaderEditorCtrl.prototype.hide = function()
{
	this.containerElem.style.display = "none";
}

GroupHeaderEditorCtrl.prototype.setOnShowGroupSummaryCheckedHandler = function( funk )
{
	this.showGroupSummaryCB.onclick = funk;
}
