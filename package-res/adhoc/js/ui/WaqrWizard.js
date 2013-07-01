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


WaqrWizard = function( msgCtrl )
{
  this.msgCtrl = msgCtrl;
  this.currPgNum = WaqrWizard.UNDEFINED_PAGE;
  this.pgs = [ new WizPg0(), new WizPg1(), new WizPg2(), new WizPg3() ];
  
  Messages.setElementText("previewFormatPrompt", "previewFormatPrompt");

    
    Messages.setElementText("step1_div", "step1_div");
    Messages.setElementText("step2_div", "step2_div");
    Messages.setElementText("step3_div", "step3_div");
    Messages.setElementText("step4_div", "step4_div");
    
  var container = null;
  var busyCtrl = new BusyCtrl();
  container = document.getElementById( "busyContainer" );
  container.appendChild( busyCtrl.getRoot() );
  this.busyCtrl = busyCtrl;
  
  container = document.getElementById( "previewTypeContainer" );
  var text = [ "HTML", "PDF", "Excel", "CSV" ];
  var values = [ "html", "pdf", "xls", "csv" ];
  var select = UIUtil.createSelectElem( text, values );
  select.style.border = "1px solid #808080";
  container.appendChild( select );
  this.previewTypeSelect = select;
  
  container = document.getElementById( "previewContainer" );
  var btn = new ButtonCtrl( Messages.getString("goBtnTxt"), ButtonCtrl.LARGE );
  container.appendChild( btn.getRoot() );
  this.previewBtn = btn;
  
  container = document.getElementById( "backContainer" );
  btn = new ButtonCtrl( "&lt; " + Messages.getString("backBtnTxt"), ButtonCtrl.LARGE );
  container.appendChild( btn.getRoot() );
  this.backBtn = btn;
  
  container = document.getElementById( "nextContainer" );
  btn = new ButtonCtrl( Messages.getString("nextBtnTxt") + " &gt;", ButtonCtrl.LARGE );
  container.appendChild( btn.getRoot() );
  this.nextBtn = btn;
  
    var mantle_enabled = window.parent != null && window.parent.mantle_initialized == true;

    container = document.getElementById( "saveContainer" );
    btn = new ButtonCtrl( Messages.getString("saveBtnTxt"), ButtonCtrl.LARGE );
     if(!mantle_enabled ){
        container.appendChild( btn.getRoot() );
    }
    this.saveBtn = btn;
    
    container = document.getElementById( "saveAsContainer" );
    btn = new ButtonCtrl( Messages.getString("saveAsBtnTxt"), ButtonCtrl.LARGE );
     if(!mantle_enabled ){
        container.appendChild( btn.getRoot() );
    }
    this.saveAsBtn = btn;

  container = document.getElementById( "cancelContainer" );
  btn = new ButtonCtrl( Messages.getString("cancelBtnTxt"), ButtonCtrl.LARGE );
    if(!mantle_enabled ){
    container.appendChild( btn.getRoot() );
  }
  this.cancelBtn = btn;
  
  var bEnable = false;
  this.getNextBtn().setEnabled( bEnable );
  this.getBackBtn().setEnabled( bEnable );
  
  this.getPreviewBtn().setEnabled( bEnable );
  this.getSaveBtn().setEnabled( bEnable );
  this.getSaveAsBtn().setEnabled( bEnable );
};
/*static*/WaqrWizard.UNDEFINED_PAGE = -1;
// see AdhocWebService.NOT_SET_VALUE for server side instance of this value
/*static*/WaqrWizard.NOT_SET_VALUE = "not-set";

WaqrWizard.prototype.getPg = function( whichPg )
{
  return this.pgs[ whichPg ];
}
WaqrWizard.prototype.showPg = function( pgNum )
{
  if ( (pgNum >= 0 ) && ( pgNum<WaqrWizard.NUM_PGS ) )
  {
    this.currPgNum = pgNum;
    this.pgs[ pgNum ].showPg();
  }
  else
  {
    throw new Error( Messages.getString("invalidPageNum", pgNum));
  }
}
WaqrWizard.prototype.hidePg = function( pgNum )
{
  if ( (pgNum >= 0 ) && ( pgNum<WaqrWizard.NUM_PGS ) )
  {
    this.pgs[ pgNum ].hidePg();
  }
  else
  {
    throw new Error( Messages.getString("invalidPageNum", pgNum) );
  }
}

WaqrWizard.prototype.getBusyCtrl = function()
{
  return this.busyCtrl;
}
WaqrWizard.prototype.getPreviewTypeSelect = function()
{
  return this.previewTypeSelect;
}
WaqrWizard.prototype.getPreviewBtn = function()
{
  return this.previewBtn;
}
WaqrWizard.prototype.getBackBtn = function()
{
  return this.backBtn;
}
WaqrWizard.prototype.getNextBtn = function()
{
  return this.nextBtn;
}
WaqrWizard.prototype.getSaveBtn = function()
{
  return this.saveBtn;
}
WaqrWizard.prototype.getSaveAsBtn = function()
{
  return this.saveAsBtn;
}
WaqrWizard.prototype.getCancelBtn = function()
{
  return this.cancelBtn;
}
/* class static members: CN = className */
WaqrWizard.NUM_PGS = 4;
WaqrWizard.NUM_GROUPS = 5;
WaqrWizard.ID_BASE_GROUP = "groupTbl";
WaqrWizard.ID_GROUPS_TD = "groupsTd";
WaqrWizard.ID_DETAILS_TD = "detailsTd";
WaqrWizard.ID_AVAILABLE_ITEMS_TD = "availableItemsTd";
WaqrWizard.CN_DETAILS_LIST = "columnsList";
WaqrWizard.CN_FILTERS_LIST = "columnsList";

