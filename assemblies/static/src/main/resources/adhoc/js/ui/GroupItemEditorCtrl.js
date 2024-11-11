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


GroupItemEditorCtrl = function()
{	
	this.containerElem = document.getElementById("groupItemEditorContainer");
	this.containerElem.title = Messages.getString( "STEP3_GROUP_ITEM_EDITOR_TOOLTIP" );
	
	var cont = document.getElementById( GroupItemEditorCtrl.FORMAT_LIST_CONTAINER_ID );
	this.formatList = new FormatListCtrl();
	cont.appendChild( this.formatList.getRoot() );
	
	var ctrl = new RadioButtonsCtrl( undefined, "groupItemAlignment" );
	ctrl.addButton( Messages.getString("alignGrpItemDefaultBtnTxt"), WaqrWizard.NOT_SET_VALUE );
	ctrl.addButton( Messages.getString("alignGrpItemLeftBtnTxt"), "left" );
	ctrl.addButton( Messages.getString("alignGrpItemCenterBtnTxt"), "center" );
	ctrl.addButton( Messages.getString("alignGrpItemRightBtnTxt"), "right" );
	var groupItemAlignmentContainer = document.getElementById( "groupItemAlignmentContainer" );
	groupItemAlignmentContainer.appendChild( ctrl.getRoot() );
	this.alignmentCtrl = ctrl;
}

GroupItemEditorCtrl.FORMAT_LIST_CONTAINER_ID = "groupsItemEditorNumericListContainer";

// TODO sbarkdull change name , init?
GroupItemEditorCtrl.prototype.setType = function( type )
{
	this.formatList.setListType( type );
  var labelKey = null;
  switch ( type )
  {
  case BVItem.TYPE.NUMERIC:
    labelKey = "step3FormatListNumericLabel";
    break;
  case BVItem.TYPE.DATE:
    labelKey = "step3FormatListDateLabel";
    break;
  default:
    labelKey = "step3FormatListEmptyLabel";
    break;
  }
  if ( null != labelKey )
  {
	 Messages.setElementText( "groupsItemEditorFormatListLabel", labelKey );
  }
}
GroupItemEditorCtrl.prototype.getAlignment = function()
{
	return this.alignmentCtrl.getValue();
}
GroupItemEditorCtrl.prototype.setAlignment = function( alignment )
{
	this.alignmentCtrl.setValue( alignment );
}
GroupItemEditorCtrl.prototype.getFormat = function()
{
	return this.formatList.getValue();
}
GroupItemEditorCtrl.prototype.setFormat = function( format )
{
	this.formatList.setValue( format );
}
GroupItemEditorCtrl.prototype.show = function()
{
	this.containerElem.style.display = "block";
}
GroupItemEditorCtrl.prototype.hide = function()
{
	this.containerElem.style.display = "none";
}
