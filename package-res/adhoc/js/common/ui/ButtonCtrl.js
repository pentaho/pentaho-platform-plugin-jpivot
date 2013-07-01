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
// TODO sbarkdull, may play with getting rid of the img elements in favor of setting the background style on the tds.
/**
 * @param btnLabel String or HTML element. If a String, the String will be the
 * "label" for the button. If an HTML element, the element will be the "label" for the button
 * @param btnSize one of either ButtonCtrl.SMALL or ButtonCtrl.LARGE
 */
ButtonCtrl = function( btnLabel, btnSize, btnId )
{
	HTMLCtrl.call( this, "table" );

	if ( undefined != btnSize && btnSize == ButtonCtrl.SMALL )
	{
		this.btnSize = ButtonCtrl.SMALL
		this.btnImgBaseName = "btn_sm_";
		this.hoverClassName = "hoverSmallButtonTxt";
		this.normalClassName = "normalSmallButtonTxt";
		this.disabledClassName = "disabledSmallButtonTxt";
	}
	else
	{
		this.btnSize = ButtonCtrl.LARGE
		this.btnImgBaseName = "button_";
		this.hoverClassName = "hoverLargeButtonTxt";
		this.normalClassName = "normalLargeButtonTxt";
		this.disabledClassName = "disabledLargeButtonTxt";
	}
	this.bIsEnabled = true;
	
	var table = this.getRoot();
	table.className = "buttonCtrl";

	if (undefined != btnId) {
		table.id = btnId;
	}

	//table.background = UIUtil.getImageFolderPath() + this.btnImgBaseName + "middle_hover.png";	// TODO see if we can get this into the style/class
	table.cellSpacing = "0";
	table.cellPadding = "0";
	table.border = "0";
	table.onmouseover = ButtonCtrl.chgStateToHover;
	table.onmouseout = ButtonCtrl.chgStateToNormal;
	table.ctrl = this;
	table.onclick = ButtonCtrl.handleClick;
	// onmouseover=\"isOver(this.id);\" onmouseout=\"isOut(this.id);\
	
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );	
	
	// left td -----------------------------
	var td = document.createElement( "td" );
	tr.appendChild( td );	
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + this.btnImgBaseName + "left.png";
	td.appendChild( img );
	this.leftImg = img;

	// middle td -----------------------------
	td = document.createElement( "td" );
    div = document.createElement("div");
	if ( btnLabel.tagName != undefined )
	{
		div.appendChild( btnLabel );
	}
	else
	{
        div.innerHTML = btnLabel;
	}
    td.appendChild(div);
	td.noWrap = "true";
	div.className = this.normalClassName;
	if (this.btnSize == ButtonCtrl.SMALL) {
        td.className = "smallButtonCtrlCenterNormal";
    } else {
        td.className = "largeButtonCtrlCenterNormal";
    }


    td.style.backgroundRepeat = "repeat-x";
    td.style.verticalAlign = "top";
	this.labelTd = td;

	tr.appendChild( td );
	this.centerTd = td;	
	
	// right td -----------------------------
	td = document.createElement( "td" );
	tr.appendChild( td );	
	var img = document.createElement( "img" );
	img.src = UIUtil.getImageFolderPath() + this.btnImgBaseName + "right.png";
	td.appendChild( img );
	this.rightImg = img;
}
ButtonCtrl.prototype = new HTMLCtrl();

/* static final vars */
ButtonCtrl.SMALL = "small";
ButtonCtrl.LARGE = "large";

/*static*/ButtonCtrl.chgStateToHover = function( elem )
{
	var button = this.ctrl;
	button.setStateToHover();
}
/*static*/ButtonCtrl.chgStateToNormal = function()
{
	var button = this.ctrl;
	button.setStateToNormal();
}
/**
 * NOTE: in this method, "this" is the HTML element that is the origin of the event.
 */
/*private static*/ButtonCtrl.handleClick = function()
{
	var button = this.ctrl;
	var table = this;
	var event = UIUtil.getEvent( arguments );
	event.clickedElem = table;
	button.handleItemClick( event );
}

/*private*/
ButtonCtrl.prototype.handleItemClick = function( event )
{
	if ( this.bIsEnabled && undefined != this.onClickCallback )
	{
		this.onClickCallback.call( this.onClickObject, event );
	}
}
/**
 * NOTE: callback will be called as a member function of "object". The HTML event
 * object will be passed in as the single param to callback. In addition to the
 * normal properties in the event object, the event object will have
 * the property "clickedElem", which will be the HTML element that received
 * the click event.
 */
ButtonCtrl.prototype.setOnClickCallback = function( callback, object )
{
	this.onClickCallback = callback;
	this.onClickObject = object;
}
/*private*/
ButtonCtrl.prototype.setStateToHover = function()
{
	var base = UIUtil.getImageFolderPath()  + this.btnImgBaseName;
	this.leftImg.src = base + "left_over.png";

	if (this.btnSize == ButtonCtrl.SMALL) {
        this.centerTd.className = "smallButtonCtrlCenterHover";
    } else {
        this.centerTd.className = "largeButtonCtrlCenterHover";
    }

	this.rightImg.src = base + "right_over.png";

	this.centerTd.firstChild.className = this.hoverClassName;
}
/*private*/
ButtonCtrl.prototype.setStateToNormal = function()
{
	var base = UIUtil.getImageFolderPath() + this.btnImgBaseName;
	this.leftImg.src = base + "left.png";

	if (this.btnSize == ButtonCtrl.SMALL) {
        this.centerTd.className = "smallButtonCtrlCenterNormal";
    } else {
        this.centerTd.className = "largeButtonCtrlCenterNormal";
    }

	this.rightImg.src =  base + "right.png";
	
	this.centerTd.firstChild.className = this.normalClassName;
}
/*private*/
ButtonCtrl.prototype.setStateToDisabled = function()
{
	var base = UIUtil.getImageFolderPath() + this.btnImgBaseName;
	this.leftImg.src = base + "left_disabled.png";

	if (this.btnSize == ButtonCtrl.SMALL) {
        this.centerTd.className = "smallButtonCtrlCenterDisabled";
    } else {
        this.centerTd.className = "largeButtonCtrlCenterDisabled";
    }

	this.rightImg.src =  base + "right_disabled.png";
	
	this.centerTd.firstChild.className = this.disabledClassName;
}

ButtonCtrl.prototype.isEnabled = function()
{
	return this.bIsEnabled;
}
/**
 * @param bIsEnabled boolean true to enable button, else false to disable
 */
ButtonCtrl.prototype.setEnabled = function( bIsEnabled )
{
	if ( this.bIsEnabled != bIsEnabled )
	{
		var table = this.getRoot();
		this.bIsEnabled = bIsEnabled;
		if ( bIsEnabled )
		{
			this.setStateToNormal();
			table.onmouseover = ButtonCtrl.chgStateToHover;
			table.onmouseout = ButtonCtrl.chgStateToNormal;
		}
		else
		{
			this.setStateToDisabled();
			table.onmouseover = null;
			table.onmouseout = null;
		}
	}
}

ButtonCtrl.prototype.setLabel = function( newLabel )
{
	this.labelTd.innerHTML = newLabel;
}
ButtonCtrl.prototype.getLabel = function()
{
	return this.labelTd.innerHTML;
}
