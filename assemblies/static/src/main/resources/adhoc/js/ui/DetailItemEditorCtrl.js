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

DetailItemEditorCtrl = function()
{
	this.containerElem = document.getElementById("detailEditorContainer");
	this.containerElem.title = Messages.getString( "STEP3_DETAIL_EDITOR_TOOLTIP" );
	
	this.aggrFuncListCont = document.getElementById( "aggrFuncListCont" );
	
	this.aggrFuncList = new ListCtrl( "aggrFuncList", "aggrFuncList", ListCtrl.SINGLE_SELECT );
	this.aggrFuncList.setDefaultSelectedItemClassName( "selectedItem" );
	this.aggrFuncListCont.appendChild( this.aggrFuncList.getRoot() );
	
	var ctrl = new RadioButtonsCtrl( undefined, "detailAlignment" );
	ctrl.addButton( Messages.getString("alignDetailItemDefaultBtnTxt"), WaqrWizard.NOT_SET_VALUE );
	ctrl.addButton( Messages.getString("alignDetailItemLeftBtnTxt"), "left" );
	ctrl.addButton( Messages.getString("alignDetailItemCenterBtnTxt"), "center" );
	ctrl.addButton( Messages.getString("alignDetailItemRightBtnTxt"), "right" );
	var detailsAlignmentContainer = document.getElementById( "detailsAlignmentContainer" );
	detailsAlignmentContainer.appendChild( ctrl.getRoot() );
	this.alignmentCtrl = ctrl;

	var cont = document.getElementById( DetailItemEditorCtrl.FORMAT_LIST_CONTAINER_ID );
	this.formatList = new FormatListCtrl();
	cont.appendChild( this.formatList.getRoot() );
	
	this.formatListLabel = document.getElementById( "" );
}
/*static*/DetailItemEditorCtrl.FORMAT_LIST_CONTAINER_ID = "detailItemEditorFormatListContainer";

/**
 * Set the editor up to edit a column of type <param>type</param>
 * @param type String must be one of the values in BVItem.physicalType
 */
DetailItemEditorCtrl.prototype.setType = function( type )
{
  this.setListType( type );
  var labelKey = null;
  switch ( type )
  {
  case BVItem.TYPE.NUMERIC:
    labelKey = "step3FormatListNumericLabel";
    break;
  case BVItem.TYPE.DATE:
    labelKey = "step3FormatListDateLabel";
    break;
  default: // String and Boolean
    labelKey = "step3FormatListEmptyLabel";
    break;
  }
  if ( null != labelKey )
  {
	 Messages.setElementText( "detailsItemEditorFormatListLabel", labelKey );
  }
	this.formatList.setListType( type );
}
/**
 * @return String must be one of the values in BVItem.physicalType
 */
DetailItemEditorCtrl.prototype.setFormat = function( format )
{
	this.formatList.setValue( format );
}

/**
 * @param type String one of the values in BVItem.TYPE
 */
DetailItemEditorCtrl.prototype.setListType = function( type )
{
  var aggrFuncNames = RSDetailItem.getAggrFuncNamesByType( type );
  this.aggrFuncList.removeAll();
  for ( var ii=0; ii<aggrFuncNames.length; ++ii )
  {
    var name = aggrFuncNames[ ii ];
  	var tr = this.aggrFuncList.addItem( name );
  	tr.itemData = RSDetailItem.getAggrFuncValueByName( name );
  }
}

DetailItemEditorCtrl.prototype.getFormat = function()
{
	return this.formatList.getValue();
}
DetailItemEditorCtrl.prototype.setAlignment = function( alignment )
{
	this.alignmentCtrl.setValue( alignment );
}
DetailItemEditorCtrl.prototype.getAlignment = function()
{
	return this.alignmentCtrl.getValue();
}
DetailItemEditorCtrl.prototype.setAggregatorFunc = function( aggrFuncValue )
{
  var listCtrl = this.aggrFuncList;
  for ( var ii=0; ii<listCtrl.getLength(); ++ii )
  {
    var name = listCtrl.getItem( ii ).itemData; //aggr func value
    if ( name == aggrFuncValue )
    {
      listCtrl.selectItem( ii );
      return;
    }
  }
}
/**
 * @return String one of the values in: RSDetailItem.aggrFuncNameToValue
 */
DetailItemEditorCtrl.prototype.getAggregatorFunc = function()
{
  var items = this.aggrFuncList.getSelectedItems();
  var aggrFuncValue = ( items.length > 0 )
    ? items[0].itemData // itemData contains one of the values in: RSDetailItem.aggrFuncNameToValue
    : null;
  
  return aggrFuncValue;
}
DetailItemEditorCtrl.prototype.show = function()
{
	this.containerElem.style.display = "block";
}
DetailItemEditorCtrl.prototype.hide = function()
{
	this.containerElem.style.display = "none";
}
