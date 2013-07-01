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
 * Style sheet note: if you are going to pass in a className parameter, your style sheet
 * should have 2 style classes, one for this control's enclosing div tag, and one for the table
 * contained in the div tag. Since you can only pass in one class name, the 2 elements (table
 * and div) must share the class name. You should write your style sheet classes like this:
 * div.resultList
 * {
 * 	styles go here
 * }
 * div.resultList table
 * {
 * 	styles go here
 * }
 * 
 * NOTE: in order to make a ListCtrl scrollable, add "overflow:auto;" to its css class.
 * in order to make a ListCtrl unscrollable, add "overflow:visible;" to its css class.
 */
 
/**
 * @param id
 * @param className
 * @param selectStyle integer, one of: ListCtrl.NO_SELECT, ListCtrl.SINGLE_SELECT, ListCtrl.MULTI_SELECT
 * @param numColumns
 */
ListCtrl = function( id, className, selectStyle, numColumns )
{
	HTMLCtrl.call( this, "div" );
	this.constructor = ListCtrl;
	
	var div = this.getRoot();
	// TODO sbarkdull, should either/both of these be passed in?
	//div.id = "details_container";
	//div.className = "container_content_scroll";
	if ( id != undefined ) div.id = id;
	if ( className != undefined ) div.className = className;
	div.ctrl = this;
	
	this.table = document.createElement( "table" );
	div.appendChild( this.table );
	this.table.cellSpacing = "0px";
	this.table.cellPadding = "0px";
	this.table.border = "0px";
	
	this.tbody = document.createElement( "tbody" );
	this.table.appendChild( this.tbody );
	this.length = 0;
	this.selectStyle = undefined != selectStyle ? selectStyle : ListCtrl.SINGLE_SELECT;
	
	if ( numColumns != undefined )
	{
		this.numColumns = numColumns;
	}
	else
	{
		this.numColumns = 1;
	}
	
	this.defaultSelectedItemClassName = "";
  this.bBandingOn = false;
}
ListCtrl.prototype = new HTMLCtrl();
/*static*/ListCtrl.UNSELECTED_ITEM_PREFIX = "un";

/* begin select style */
/*static*/ListCtrl.NO_SELECT = 0;
/*static*/ListCtrl.SINGLE_SELECT = 1;
/*static*/ListCtrl.MULTI_SELECT = 2;
/* end select style */
/**
 * NOTE: this method, or the methods it calls, will add 2 properties to the event object:
 * selectTrElem
 * unselectTrElem
 */
/*static*/ListCtrl.onItemMouseDown = function()
{
	// Attention: in the context of this method, "this" is the td tag receiving the event
	// "listCtrl is the ListCtrl
	var listCtrl = this.ctrl;
	var tr = this;
	var event = UIUtil.getEvent( arguments );
	event.selectTrElem = tr;
	listCtrl.handleItemMouseDown( event );
}
/*private*/
ListCtrl.prototype.handleItemMouseDown = function( event )
{
	if ( !event.ctrlKey || this.selectStyle == ListCtrl.SINGLE_SELECT )
	{
		this.handleUnselectAll( event );
	}
	if ( this.selectStyle != ListCtrl.NO_SELECT )
	{
  	var tr = event.selectTrElem;
  	if ( !this.isItemSelected( tr ) )
  	{
  		this.handleSelectItem( tr, event );
  		tr.bIsBeingSelected = true;
  	}
	}
	this.onMouseDownCallback && this.onMouseDownCallback.call( this.onMouseDownCallbackObject, event );
}
/**
 * NOTE: this method, or the methods it calls, will add 2 properties to the event object:
 * selectTrElem
 * unselectTrElem
 */
/*static*/ListCtrl.onItemMouseUp = function()
{
	// Attention: in the context of this method, "this" is the td tag receiving the event
	// "listCtrl is the ListCtrl
	var listCtrl = this.ctrl;
	var tr = this;
	var event = UIUtil.getEvent( arguments );
	event.selectTrElem = tr;
	listCtrl.handleItemMouseUp( event );
}
/*private*/
ListCtrl.prototype.handleItemMouseUp = function( event )
{
	var tr = event.selectTrElem;
	if ( !tr.bIsBeingSelected && this.isItemSelected( tr ) && event.ctrlKey )
	{
		this.handleUnselectItem( tr, event );
	}
	else
	{
		tr.bIsBeingSelected = false;
	}
}
ListCtrl.prototype.handleAddItem = function() {
	if ( this.onAddItemCallback )
	{
		if ( this.onAddItemObject )
		{
			this.onAddItemCallback.call( this.onAddItemObject );
		}
		else
		{
			this.onAddItemCallback(  );
		}
	}
}

ListCtrl.prototype.handleRemoveItem = function() {
	if ( this.onRemoveItemCallback )
	{
		if ( this.onRemoveItemObject )
		{
			this.onRemoveItemCallback.call( this.onRemoveItemObject );
		}
		else
		{
			this.onRemoveItemCallback(  );
		}
	}
}

/**
 * NOTE: the event object will have a property called "selectTrElem" which is the 
 * tr element that was selected
 */
/*private*/
ListCtrl.prototype.handleSelectItem = function( tr, event )
{	
	tr.className = tr.selectedItemClassName ? tr.selectedItemClassName : this.defaultSelectedItemClassName;
	tr.selected = true;
	if ( this.onSelectCallback )
	{
		if ( this.onSelectObject )
		{
			this.onSelectCallback.call( this.onSelectObject, event );
		}
		else
		{
			this.onSelectCallback( event );
		}
	}
}
/*static*/ListCtrl.onItemDblClick = function()
{
	// Attention: in the context of this method, "this" is the tr tag receiving the event
	// "listCtrl is the ListCtrl
	var listCtrl = this.ctrl;
	var tr = this;
	var event = UIUtil.getEvent( arguments );
	event.selectTrElem = tr;
	listCtrl.handleItemDblClick( event );
}
ListCtrl.prototype.handleItemDblClick = function( event )
{
	if ( this.onDblClickCallback )
	{
		if ( this.onDblClickCallbackObject )
		{
			this.onDblClickCallback.call( this.onDblClickCallbackObject, event );
		}
		else
		{
			this.onDblClickCallback( event );
		}
	}
}

/*private*/
ListCtrl.prototype.handleUnselectItem = function( tr, event  )
{
	event.unselectTrElem = tr;
	
	tr.className = ListCtrl.UNSELECTED_ITEM_PREFIX + ( tr.selectedItemClassName ? tr.selectedItemClassName : this.defaultSelectedItemClassName );
	tr.selected = false;

	this.onUnselectCallback && !this.onUnselectCallback.call( this.onUnselectObject, event );
}

ListCtrl.prototype.isItemSelected = function( tr )
{
	return tr.selected;
}

ListCtrl.prototype.setOnAddItemCallback = function( callback, object )
{
	this.onAddItemCallback = callback;
	this.onAddItemObject = object;
}

ListCtrl.prototype.setOnRemoveItemCallback = function( callback, object )
{
	this.onRemoveItemCallback = callback;
	this.onRemoveItemObject = object;
}

/**
 * @param callback method to be called when an item in the list is selected. This method
 * should take one parameter, which is the browser's event object. The event object
 * will include a property called "selectTrElem", which will be the tr element representing
 * the row that was clicked on. The associated td element can be discovered by accessing the property
 * tr.childNodes[0]. The application data associated with the item in the list can be
 * accessed by via the property tr.childNodes[0].itemData.
 * @param object instance of a class that implements the method specified in the callback param.
 * The callback method will be called like this:
 * callback.call( object, event );
 */
ListCtrl.prototype.setOnSelectCallback = function( callback, object )
{
	this.onSelectCallback = callback;
	this.onSelectObject = object;
}
/**
 * see comments for setOnSelectCallback.
 */
ListCtrl.prototype.setOnUnselectCallback = function( callback, object )
{
	this.onUnselectCallback = callback;
	this.onUnselectObject = object;
}

/**
 * callback will be passed an event object, the event object will
 * have a "selectTrElem" property, which is the tr element that was 
 * double clicked on. it is often useful to access event.selectTrElem.itemData
 * to get access to the application data associated with the list item. This
 * data is generally associated with the list item when addItem was called w/
 * an itemData parameter.
 */
ListCtrl.prototype.setOnDblClickCallback = function( callback, object )
{
	this.onDblClickCallback = callback;
	this.onDblClickCallbackObject = object;
}

ListCtrl.prototype.setOnMouseDownCallback = function( callback, object )
{
	this.onMouseDownCallback = callback;
	this.onMouseDownCallbackObject = object;
};

/**
 * @param itemText the "stuff" to display for this item in the list. This parameter
 * can be:
 * a string, an array of strings (1 for each colummn), 
 * an HTML element, an array of HTML elements (1 for each colummn), 
 * a Ctrl, an array of Ctrls (1 for each colummn).
 */
ListCtrl.prototype.addHeaderItem = function( itemText )
{
	var tr = document.createElement( "tr" );
	
	if ( this.numColumns == 1 && !( undefined == itemText.length ) )
	{
		itemText = [ itemText ];
	}

	for ( var ii=0; ii<this.numColumns; ++ii )
	{
		th = document.createElement( "th" );
		tr.appendChild( th );
		if ( typeof( itemText[ii] ) == "string" )
		{
			th.innerHTML = itemText[ii];
		}
		else if ( undefined != itemText[ii].tagName)
		{
			th.appendChild( itemText[ii] );
		}
		else if ( undefined != itemText[ii].root )
		{
			th.appendChild( itemText[ii].getRoot() );
		}
		else
		{
			throw new Error( Messages.getString( "invalidListType" ) );
		}
	}
	
	var child = this.internalGetChildNode( 0 );
	if ( undefined != child )
	{
		this.tbody.insertBefore( tr, child );
	}
	else
	{
		this.tbody.appendChild( tr );
	}
}
// TODO sbarkdull, maybe add a parameter for hover txt
/**
 * 
 * @param itemText the "stuff" to display for this item in the list. This parameter
 * can be:
 * a string, 
 * an HTML element,
 * a Ctrl,
 * an array of strings, HTML elements and/or Ctrls (1 for each colummn)(can be a mix of
 * strings, HTML elements, Ctrls).
 * @param id optional
 * @param position int specifying the location in the list to insert the
 * item. If position is undefined, or greater than the list length, the
 * item will be appended to the end of the list. optional
 * @param itemData optional, any piece of data you want to associate with this list item
 * @param selectedItemClassName optional
 * @param columnWidth optional integer or array of integer, must have the same number
 * of items as the itemText parameter. Can be any valid value for style.width, for instance:
 * 25%, 10px, etc.
 * 
 * @return the tr element that was added to the table
 */
ListCtrl.prototype.addItem = function( itemText, id, position, itemData, selectedItemClassName,
  columnWidth )
{
	var tr = document.createElement( "tr" );
	tr.onmousedown = ListCtrl.onItemMouseDown;
	tr.onmouseup = ListCtrl.onItemMouseUp;
	tr.ondblclick = ListCtrl.onItemDblClick;
	
	tr.ctrl = this;
	tr.selected = false;
	
	if ( this.numColumns == 1 && !( undefined == itemText.length ) )
	{
		itemText = [ itemText ];
	}

	for ( var ii=0; ii<this.numColumns; ++ii )
	{
		var td = document.createElement( "td" );
		if ( undefined != columnWidth )
		{
		  td.style.width = columnWidth[ii];
		}
		tr.appendChild( td );
		if ( typeof( itemText[ii] ) == "string" )
		{
		  // we have plain text
			td.innerHTML = itemText[ii];
		}
		else if ( undefined != itemText[ii].tagName)
		{
		  // we have an HTML element
			td.appendChild( itemText[ii] );
		}
		else if ( undefined != itemText[ii].root )
		{
		  // we have one of this framework's controls
			td.appendChild( itemText[ii].getRoot() );
		}
		else
		{
			throw new Error( Messages.getString( "invalidListType" ) );
		}
	}
	
	if ( undefined != selectedItemClassName )
	{
		tr.selectedItemClassName = selectedItemClassName;
		tr.className = ListCtrl.UNSELECTED_ITEM_PREFIX + tr.selectedItemClassName;
	}
	else
	{
		tr.className = ListCtrl.UNSELECTED_ITEM_PREFIX + this.defaultSelectedItemClassName;
	}
	if ( id != undefined ) tr.id = id;
	if ( itemData != undefined ) tr.itemData = itemData;

	this.insertItem( tr, position ); //NOTE: this method will call handleAddItem()
	
	return tr;
}

/**
 * Insert an existing row (<tr>) into the table at the position
 * specified by position. 
 * 
 * @param trElem the tr element to insert into the list
 * 
 * @param position int specifying the location in the list to insert the
 * item. If position is undefined, or greater than the list length, the
 * item will be appended to the end of the list.
 */
ListCtrl.prototype.insertItem = function( trElem, position )
{
	this.internalInsertItem( trElem, position );
	/*
	if ( !UIUtil.isElVisibleInDiv( trElem, this.getRoot() ) )
	{
	 trElem.scrollIntoView(true);
	}
	*/
	this.handleAddItem();
}

/*private*/ListCtrl.prototype.internalInsertItem = function( trElem, position )
{
	trElem.ctrl = this;
	if ( undefined == position || position > this.length-1 )
	{
		this.tbody.appendChild( trElem );
	}
	else
	{
		var child = this.internalGetChildNode( position );
		this.tbody.insertBefore( trElem, child );
	}
	this.length += 1;
}
/**
 * move an item to a new location in the list.
 * move item at index itemPosition to newPosition
 * 
 * @param integer itemPosition the position (index) if the item to be moved
 * @param integer newPosition the position (index) to move the item to
 * 
 * @throws Error when either itemPosition or newPosition refer to an invalid
 * (out of range) index.
 */
ListCtrl.prototype.moveItem = function( itemPosition, newPosition )
{
	if ( newPosition >= this.length )
	{
		throw new Error( Messages.getString( "MOVE_TO_POSITION_OUT_OF_BOUNDS" ) );
	}
	if ( itemPosition >= this.length )
	{
		throw new Error( Messages.getString( "MOVE_FROM_POSITION_OUT_OF_BOUNDS" ) );
	}
	
	var child = this.removeItem( itemPosition );
	this.insertItem( child, newPosition );
}

/**
 * @return removed item, item is a tr element
 */
ListCtrl.prototype.removeItem = function( position )
{
	var tr = this.internalRemoveItem( position );
	this.handleRemoveItem();
	return tr;
}
/**
 * @return removed item, item is a tr element
 */
/*protected*/ListCtrl.prototype.internalRemoveItem = function( position )
{
	var tr;
	if ( position < this.length )
	{
		tr = this.internalGetChildNode( position );
		this.tbody.removeChild( tr );
		this.length -= 1;
	}
	else
	{
		throw new Error( Messages.getString("indexOutOfRange") );
	}

	return tr;
}

/**
 *
 */
ListCtrl.prototype.removeAll = function()
{
	if (this.length > 0) {
		for ( var ii=this.length-1; ii >=0; --ii )
		{
			this.internalRemoveItem( ii );
		}
		this.handleRemoveItem();
	}
}
/**
 * @return boolean true if the item is in the list, else false
 */
ListCtrl.prototype.hasItem = function( trElem )
{
	for ( var ii=0; ii<this.length; ++ii )
	{
		var currElem = this.getItem( ii );
		if ( currElem === trElem ) return true;
	}
	return false;
}
/**
 * @return tr element
 */
ListCtrl.prototype.getItem = function( itemIdx )
{
	return this.internalGetChildNode(  itemIdx );
}

/**
 * @param itemIdx integer specifying the index of the item in the list to set the itemData property for
 * @param itemData any type, the list item's data
 */
ListCtrl.prototype.setItemData = function( itemIdx, itemData )
{
	this.internalGetChildNode( itemIdx ).itemData = itemData;
}

ListCtrl.prototype.removeSelectedItems = function()
{
	var itemsRemoved = false;
	for ( var ii=this.length-1; ii >=0; --ii )
	{
		var tr = this.internalGetChildNode( ii );
		if ( this.isItemSelected( tr ) )
		{
			this.internalRemoveItem( ii );
			itemsRemoved = true;
		}
	}
	if (itemsRemoved) {
		this.handleRemoveItem();
	}
}

// TODO sbarkdull, should we throw exception or return error if fail to move?
ListCtrl.prototype.moveSelectedItemsUp = function()
{
	// if the 1st item is not selected
	if ( this.length > 1 && !this.isItemSelected( this.internalGetChildNode( 0 ) ) )
	{
		for ( var ii=1; ii<this.length; ++ii )
		{
			var tr = this.internalGetChildNode( ii );
			if ( this.isItemSelected( tr ) )
			{
				this.moveItem( ii, ii-1 );
			}
		}
	}
}
// TODO sbarkdull, should we throw exception or return error if fail to move?
ListCtrl.prototype.moveSelectedItemsDown = function()
{
	// if the 1st item is not selected
	if ( this.length > 1 && !this.isItemSelected(this.internalGetChildNode( this.length-1 ) ) )
	{
		for ( var ii=this.length-2; ii>=0; --ii )
		{
			var tr = this.internalGetChildNode( ii );
			if ( this.isItemSelected( tr ) )
			{
				this.moveItem( ii, ii+1 );
			}
		}
	}
}

/*private*/
ListCtrl.prototype.handleUnselectAll = function( event )
{
	// the item that was just clicked on
	var currentTr = event.selectTrElem;
	for ( var ii=0; ii<this.length; ++ii )
	{
		var tr = this.internalGetChildNode( ii );
		// if the item is currently selected, and it is not 
		// the one that was just clicked on, unselect it
		// TODO sbarkdull clean up
		if ( this.isItemSelected( tr ) && currentTr != tr )
		{
			this.handleUnselectItem( tr, event );
		}
	}
}
ListCtrl.prototype.getNumSelectedItems = function()
{
	return this.getSelectedItemIdxs().length;
}
/**
 * @return an array of the indexes of the items that are selected
 */
ListCtrl.prototype.getSelectedItemIdxs = function()
{
	var selectedItems = new Array();
	for ( var ii=0; ii<this.length; ++ii )
	{
		var tr = this.internalGetChildNode( ii );
		if ( this.isItemSelected( tr ) )
		{
			selectedItems.push( ii );
		}
	}
	return selectedItems;
}

/**
 * @return an array of the tr elements that are selected. Always returns a non-null
 * Array. However Array may be empty.
 */
ListCtrl.prototype.getSelectedItems = function()
{
	var selectedItems = new Array();
	for ( var ii=0; ii<this.length; ++ii )
	{
		var tr = this.internalGetChildNode( ii );
		if ( this.isItemSelected( tr ) )
		{
			selectedItems.push( tr );
		}
	}
	return selectedItems;
}

/**
 * @return the index of the item trItem in the list. If trItem is not
 * found, return -1
 */
ListCtrl.prototype.getIdxOfItem = function( trItem )
{
	for (var idx = 0; idx < this.length; idx++) {
		if ( trItem == this.getItem( idx ) )
		{
			return idx;
		}
	}
	return -1;
}

ListCtrl.prototype.getLength = function()
{
	return this.length;
}
// TODO sbarkdull, get rid of this method, and set this value with a ctor param
/**
 * Set the default className for the td that represents the list row being selected. When the
 * row is in the unselected state, the className for the td that represents the
 * row will have the prefix "un" prepended to it.
 */
ListCtrl.prototype.setDefaultSelectedItemClassName = function( className )
{
	this.defaultSelectedItemClassName = className;
}

ListCtrl.prototype.selectItem = function( itemIdx )
{
	var tr = this.getItem( itemIdx );
	var pseudoEvent = new Object();
	pseudoEvent.selectTrElem = tr;
	pseudoEvent.ctrlKey = false;
	this.handleSelectItem( tr, pseudoEvent );
}
ListCtrl.prototype.unselectItem = function( itemIdx )
{
	var tr = this.getItem( itemIdx );
	var pseudoEvent = new Object();
	pseudoEvent.ctrlKey = false;
	this.handleUnselectItem( tr, pseudoEvent );
}
/*static*/ListCtrl.getItemText = function( trElem )
{
	return trElem.childNodes.item( 0 ).innerHTML;
}

/*private*/ListCtrl.prototype.normalizeIdx = function( idx )
{
	return idx + this.getHeaderLength();
}
/*private*/ListCtrl.prototype.getHeaderLength= function()
{
	return this.tbody.childNodes.length - this.length;
}

/*private*/ListCtrl.prototype.internalGetChildNode = function( idx )
{
	idx = this.normalizeIdx( idx );
	return this.tbody.childNodes[ idx ];
};

/**
 * Turn row banding on/off.
 * 
 * Performance note: it is best to add all of your items to the list, and then call
 * setBanding().
 * 
 * @param on boolean turn banding on or off
 * @param color String any valid HTML color spec, e.g. #FF00DD, red, etc.
 */
ListCtrl.prototype.setBanding = function( on, color )
{
  this.bBandingOn = on;
  this.bandingColor = color;
  this.reinitBanding();
};

/**
 * TODO sbarkdull: this may not work properly for lists that are
 * multi or single select, and have row banding on. Feature is
 * not necessary at the moment.
 */
/*private*/ListCtrl.prototype.reinitBanding = function()
{
  if ( this.bBandingOn )
  {
    for ( var ii=0; ii<this.getLength(); ++ii )
    {
      var trElem = this.getItem( ii );
      var color = ( (ii % 2 ) == 1 ) ? this.bandingColor : "";
      trElem.style.backgroundColor = color;
    }
  }
  else
  {
    for ( var ii=0; ii<this.getLength(); ++ii )
    {
      var trElem = this.getItem( ii );
      trElem.style.backgroundColor = "";
    }
  }
}