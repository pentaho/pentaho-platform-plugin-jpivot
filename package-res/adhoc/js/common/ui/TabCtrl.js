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

TabCtrl = function()
{
	HTMLCtrl.call( this, "div" );
	this.constructor = TabCtrl;
	var localThis = this;
	
	var table = document.createElement( "table" );
	this.table = table;	
	
	table.cellSpacing = "0px";
	table.cellPadding = "0px";
	table.border = "0px";
	table.style.width = "100%";
	
	this.getRoot().appendChild( table );
	var tbody = document.createElement( "tbody" );
	this.table.appendChild( tbody );
	
	this.tabLabelTr = document.createElement( "tr" );
	tbody.appendChild( this.tabLabelTr );
	var td = document.createElement( "td" );
	this.tabLabelTr.appendChild( td );
	td.className = "blankTab";
	td.innerHTML = "&nbsp;"  //hack so the IE 7 will draw the border bottom
	this.blankTabTd = td;
	
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	
	this.clientTd = document.createElement( "td" );
	tr.appendChild( this.clientTd );
	
	this.tabList = new Object();
	this.tabTdList = new Object();
	this.currTabEl = null;
	this.numTabs = 1;
	this.tabName = null;

  /*
   * this callback is ONLY made on IE7, not Firefox
   */
  this.table.onresize = function()
  {
    localThis.sizeTab();
  };
}

TabCtrl.prototype = new HTMLCtrl();

TabCtrl.prototype.addTab = function( tabName, tabHtmlEl )
{
  if ( undefined !== this.tabList[ tabName ] )
  {
    throw new Error( Messages.getString( "ERROR_TAB_EXISTS", tabName ) );
  }
  
  this.numTabs++;
  /* create client area of the tab panel */
  var div = document.createElement( "div" );
  this.clientTd.appendChild( div );
  div.appendChild( tabHtmlEl );
  
  /* create the tab itself */
  var tabTd = document.createElement( "td" );
  var spanLeft = document.createElement( "span" );  
  var spanRight = document.createElement( "span" );
  
  var a = document.createElement( "a" );
  a.href = "javascript: void(0);";
  spanRight.appendChild( a );
  a.innerHTML = tabName;

  tabTd.appendChild( spanLeft );
  spanLeft.appendChild( spanRight );
  this.tabTdList[ tabName ] = tabTd;
  
  this.setInactiveAppearance( tabTd );  

  this.tabLabelTr.insertBefore( tabTd, this.blankTabTd );
  
  var localThis = this;
  tabTd.onclick = function()
  {
    localThis.showTab( tabName );
  };
  
  this.tabList[ tabName ] = div;
  div.style.display = "none";
  div.className = "tabPanel";
  
  this.clientTd.colSpan = this.numTabs;  
  
  if ( this.numTabs == 2 )
  {
    this.setTab( tabName );
  }
};

TabCtrl.prototype.getCurrentTabName = function()
{
  return this.tabName;
}

/**
 * Make the tab with <param>tabName</param> the active tab.
 * Do NOT call show/hide handlers.
 */
TabCtrl.prototype.setTab = function( tabName )
{
  if ( this.currTabEl != null )
  {
    this.currTabEl.style.display = "none";
    
    var td = this.getTabTdByName( this.tabName );
    this.setInactiveAppearance( td );
  }
  
  this.tabName = tabName;
  if ( tabName != null )
  {
    this.currTabEl = this.tabList[ tabName ];
    this.currTabEl.style.display = "block";
    
    var td = this.getTabTdByName( this.tabName );
    this.setActiveAppearance( td );
  }
}

/**
 * Make the tab with <param>tabName</param> the active tab.
 * Call show/hide handlers.
 */
TabCtrl.prototype.showTab = function( tabName )
{
  if ( undefined !== this.onTabHideHandler )
  {
    var bContinue = this.onTabHideHandler( this.tabName );  // pass in the old tab name
    if ( !bContinue ) { return; }
  }
  if ( undefined !== this.onTabShowHandler )
  {
    this.onTabShowHandler( tabName ); // pass in the new tab name
  }
  this.setTab( tabName );
}
/*private*/TabCtrl.prototype.getTabTdByName = function( tabName )
{
  return this.tabTdList[ tabName ];
}

TabCtrl.prototype.setOnTabShow = function( onTabShowHandler )
{
  this.onTabShowHandler = onTabShowHandler;
}

TabCtrl.prototype.setOnTabHide = function( onTabHideHandler )
{
  this.onTabHideHandler = onTabHideHandler;
}

TabCtrl.prototype.setInactiveAppearance = function( tdEl )
{
  tdEl.className = "tabInactive";
}

TabCtrl.prototype.setActiveAppearance = function( tdEl )
{
  tdEl.className = "tabActive";
};

/**
 * Dynamically calculate the size for each of the tabs, and the empty space.
 * This method is unneeded and unused in Firefox. It is required for IE7, 
 * otherwise the tabs don't size themselves properly.
 */
/*private*/TabCtrl.prototype.sizeTab = function()
{ 
  var totalWidth = this.table.offsetWidth;
 
  for ( var tabName in this.tabTdList )
  {
    var td = this.tabTdList[ tabName ];
    var width = td.childNodes[0].offsetWidth; // this is the outter span
    totalWidth -= width;
  }
  this.blankTabTd.style.width = totalWidth + "px";
};