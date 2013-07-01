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
 * NOTE: this class never amounted to much. It could have been taken MUCH further, but
 * this implementation was sufficient to keep things going. Really we need a dialog
 * class, that could be used to implement the DBSearchDialog and RepositoryBrowser. 
 * The class would handle everything outside of the client area. Users of the class
 * would manage the client area (ya, just like in a traditional UI toolkit.
 * 
 * Currently this class has some simple static methods for handling Dialog movement
 * when the mouse drags on the Dialog's title bar.
 * 
 * @param size object with properties left, top, width, height, any of which may be undefined
 * in which case a default will be used.
 */
Dialog = function( title, size )
{
}


/*static*/Dialog.dragIsDown = function(e) {
	var event = UIUtil.getEvent( arguments );
	var titleBarDiv = UIUtil.getSourceElement( event );
	var thisCtrl = titleBarDiv.ctrl;
	
	//make note of starting positions and detect mouse movements
	if( ( e && ( e.which > 1 || e.button > 1 ) ) || ( window.event && ( window.event.which > 1 || window.event.button > 1 ) ) ) { return false; }
	if( document.onmouseup == Dialog.dragIsMove ) { document.onmousemove = storeMOUSEMOVE; document.onmouseup = window.storeMOUSEUP; } //mouseup was over chrome
	window.msStartCoord = Dialog.dragMousePos(e); window.lyStartCoord = thisCtrl.dialogDiv.style?[parseInt(thisCtrl.dialogDiv.style.left),parseInt(thisCtrl.dialogDiv.style.top)]:[parseInt(thisCtrl.dialogDiv.left),parseInt(thisCtrl.dialogDiv.top)];
	if( document.captureEvents && Event.MOUSEMOVE ) { document.captureEvents(Event.MOUSEMOVE); document.captureEvents(Event.MOUSEUP); }
	window.storeMOUSEMOVE = document.onmousemove; window.storeMOUSEUP = document.onmouseup; window.storeLayer = thisCtrl.dialogDiv;
	document.onmousemove = Dialog.dragIsMove; document.onmouseup = Dialog.dragIsMove; return false;
}

/*static*/Dialog.dragIsMove = function(e) {

	var msMvCo = Dialog.dragMousePos(e); if( !e ) { e = window.event ? window.event : ( new Object() ); }
	var newX = Math.max( 0, window.lyStartCoord[0] + ( msMvCo[0] - window.msStartCoord[0] ) );
	var newY = Math.max( 0 , window.lyStartCoord[1] + ( msMvCo[1] - window.msStartCoord[1] ) );
	
		//move the layer to its newest position
	//reset the mouse monitoring as before - delay needed by Gecko to stop jerky response (hence two functions instead of one)
	//as long as the Gecko user does not release one layer then click on another within 1ms (!) this will cause no problems
	if( e.type && e.type.toLowerCase() == 'mouseup' ) { document.onmousemove = storeMOUSEMOVE; document.onmouseup = window.storeMOUSEUP; }
	if( navigator.product == 'Gecko' ) { window.setTimeout('Dialog.dragIsMove2('+newX+','+newY+');',1); } else { Dialog.dragIsMove2(newX,newY); }
}

/*static*/Dialog.dragIsMove2 = function(x,y) { 
	var oPix = ( document.childNodes ? 'px' : 0 ), theLayer = ( window.storeLayer.style ? window.storeLayer.style : window.storeLayer );
	theLayer.left = x + oPix; theLayer.top = y + oPix;
}

// ===============================================================================================
// popup drag code ---- in ie6 we hide the select boxes because they stay above all other elements
// ===============================================================================================
/*static*/Dialog.dragMousePos = function(e) {
	//get the position of the mouse
	if( !e ) { e = window.event; } if( !e || ( typeof( e.pageX ) != 'number' && typeof( e.clientX ) != 'number' ) ) { return [0,0]; }
	if( typeof( e.pageX ) == 'number' ) { var xcoord = e.pageX; var ycoord = e.pageY; } else {
		var xcoord = e.clientX; var ycoord = e.clientY;
		if( !( ( window.navigator.userAgent.indexOf( 'Opera' ) + 1 ) || ( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || window.navigator.vendor == 'KDE' ) ) {
			if( document.documentElement && ( document.documentElement.scrollTop || document.documentElement.scrollLeft ) ) {
				xcoord += document.documentElement.scrollLeft; ycoord += document.documentElement.scrollTop;
			} else if( document.body && ( document.body.scrollTop || document.body.scrollLeft ) ) {
				xcoord += document.body.scrollLeft; ycoord += document.body.scrollTop; } } }
	return [xcoord,ycoord];
}


