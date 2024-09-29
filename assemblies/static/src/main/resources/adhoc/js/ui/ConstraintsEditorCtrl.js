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


ConstraintsEditorCtrl = function()
{
	this.containerElem = document.getElementById("constraintsEditorContainer");

  this.tabCtrl = new TabCtrl();
  
	this.constraintsCtrl = new ConstraintsCtrl( "constraintsCtrlDiv" );
  var constraintCtrlEl = this.constraintsCtrl.getRoot();
  this.tabCtrl.addTab( ConstraintsEditorCtrl.BUILDER, constraintCtrlEl );
  constraintCtrlEl.title = Messages.getString( "STEP3_ADD_CONSTRAINT_TOOLTIP" );
  
  this.freeFormConstraintsCtrl = new FreeFormConstraintCtrl( "freeFormConstraintTextArea" );
  freeFormConstraintsCtrlEl = this.freeFormConstraintsCtrl.getRoot();
  this.tabCtrl.addTab( ConstraintsEditorCtrl.FREE_FORM, freeFormConstraintsCtrlEl );
  
  var localThis = this;
  this.tabCtrl.setOnTabShow( function( tabName )
    {
      localThis.handleTabShow( tabName );
    }
  );
  this.tabCtrl.setOnTabHide( function( tabName )
    {
      return localThis.handleTabHide( tabName );
    }
  );
  
	var constraintsTd = document.getElementById( "constraintsTd" );
	constraintsTd.appendChild( this.tabCtrl.getRoot() );
}

/*static*/ConstraintsEditorCtrl.BUILDER = Messages.getString( "BUILDER" );
/*static*/ConstraintsEditorCtrl.FREE_FORM = Messages.getString( "FREE_FORM" );

ConstraintsEditorCtrl.prototype.getConstraintsCtrl = function()
{
	return this.constraintsCtrl;
}
ConstraintsEditorCtrl.prototype.getFreeFormConstraintsCtrl = function()
{
	return this.freeFormConstraintsCtrl;
}
ConstraintsEditorCtrl.prototype.show = function()
{
	this.containerElem.style.display = "block";
}
ConstraintsEditorCtrl.prototype.hide = function()
{
	this.containerElem.style.display = "none";
}

ConstraintsEditorCtrl.prototype.handleTabHide = function( tabName )
{
  if ( this.onTabHideHandler )
  {
    return this.onTabHideHandler( tabName );
  }
}

ConstraintsEditorCtrl.prototype.handleTabShow = function( tabName )
{
  if ( this.onTabShowHandler )
  {
    this.onTabShowHandler( tabName );
  }
}

ConstraintsEditorCtrl.prototype.setOnTabShowHandler = function( onTabShowHandler )
{
  this.onTabShowHandler = onTabShowHandler;
}
ConstraintsEditorCtrl.prototype.setOnTabHideHandler = function( onTabHideHandler )
{
  this.onTabHideHandler = onTabHideHandler;
}
ConstraintsEditorCtrl.prototype.getCurrentTabName = function()
{
  return this.tabCtrl.getCurrentTabName();
}

ConstraintsEditorCtrl.prototype.setConstraintTab = function( tabName )
{
  this.tabCtrl.setTab( tabName );
}
