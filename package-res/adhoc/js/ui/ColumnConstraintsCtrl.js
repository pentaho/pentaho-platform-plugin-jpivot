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
 * 
 * @param comparatorAr Array of String where each element is a comparator
 * (typically one of the values from BVItem.COMPARATOR_MAP)
 * @param constraintHelperClassObj one of CalendarAdapter, ColumnValuePickList,
 *  or DBSearcher
 */
ColumnConstraintsCtrl = function(  comparatorAr, constraintHelperClassObj  )
{
  HTMLCtrl.call( this, "table" );
  this.constructor = ColumnConstraintsCtrl;
  var table = this.getRoot();
  
  this.comparatorAr = comparatorAr;
  this.constraintHelperClassObj = constraintHelperClassObj;
  table.style.border = "1px solid #808080";
  table.style.marginTop = "1ex";
  table.cellspacing="0"; 
  table.cellpadding="0";
  
  this.tbody = document.createElement( "tbody" );
  table.appendChild( this.tbody );
  
  this.constraintList = new Array();
}
ColumnConstraintsCtrl.prototype = new HTMLCtrl();
/**
 * @param operator String (And,Or)
 * @param columnName String column name for comparison
 * @param comparator String condition (=,<>,>=, etc)
 * @param condition String operand for comparison
 * @param constraintHelperData Object with properties:  modelId, viewId, columnId
 */
ColumnConstraintsCtrl.prototype.addConstraintCtrl = function( operator, columnName, comparator, condition,
    constraintHelperClassObj, constraintHelperData, bTextReadOnly )
{
  var bAddSearch = this.constraintHelperClassObj != null;
  var cCtrl = new ConstraintCtrl( operator, columnName, comparator, condition, this.comparatorAr,
    bAddSearch, bTextReadOnly );
  this.tbody.appendChild( cCtrl.getRoot() );
  this.constraintList.push( cCtrl );
  
  if ( bAddSearch )
  {
    cCtrl.setConstraintHelper( this.constraintHelperClassObj, constraintHelperData );
  }
  
  var newRowNum = this.constraintList.length-1;
  this.showLogicalSelectForRow( newRowNum >= 1, 0 );
  this.showLogicalSelectForRow( false, newRowNum );
}

ColumnConstraintsCtrl.prototype.getConstraintCtrl = function( idx )
{
  return this.constraintList[ idx ];
}

ColumnConstraintsCtrl.prototype.deleteConstraint = function( idx )
{
  var cCtrl = this.constraintList[ idx ]; 
  var tr = cCtrl.getRoot();
  this.tbody.removeChild( tr );
  this.constraintList.splice( idx, 1 );
  
  if ( this.constraintList.length > 0 )
  {
   this.showLogicalSelectForRow( this.constraintList.length > 1, 0 );
  }
}

ColumnConstraintsCtrl.prototype.deleteCheckedConstraints = function()
{
  for (var idx=this.constraintList.length-1; idx>=0; --idx )
  {
    var cCtrl = this.constraintList[ idx ];
    if ( cCtrl.isChecked() )
    {
      this.deleteConstraint( idx );
    }
  }
}
ColumnConstraintsCtrl.prototype.getLength = function()
{
  return this.constraintList.length;
}

ColumnConstraintsCtrl.prototype.showLogicalSelectForRow = function( bShow, row )
{
  var cCtrl = this.constraintList[ row ];
  cCtrl.showLogicalSelect( bShow );
}

ColumnConstraintsCtrl.prototype.removeAll = function()
{
  for ( var idx=this.constraintList.length-1; idx>=0; --idx )
  {
    this.deleteConstraint( idx );
  }
}