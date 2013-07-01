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

/*
 * TODO: need to internationalize
 */
 
/**
 * Implements an ACL editing UI component.
 */
AclEditorCtrl = function( path )
{
	HTMLCtrl.call( this, "div" );
	this.constructor = AclEditorCtrl;
  var localThis = this;
	var rootDiv = this.getRoot();
	rootDiv.style.width = "100%";
	rootDiv.style.height = "100%";
	
	var table = document.createElement( "table" );
	table.cellSpacing = "0";
	table.cellPadding = "0";
	table.style.width = "100%";
	rootDiv.appendChild( table );
	var tbody = document.createElement( "tbody" );
	table.appendChild( tbody );
	
	// title row
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	var td = document.createElement( "td" );
	td.style.paddingBottom = "15px";
	tr.appendChild( td );
	this.titleTd = td;
	
	this.rolesList = new ListCtrl( undefined, "userRoleList", ListCtrl.NO_SELECT, 2 );
  this.rolesList.addHeaderItem( [AclEditorCtrl.NAME_HEADER_LABEL, AclEditorCtrl.SHARE_HEADER_LABEL ] );
	this.usersList = new ListCtrl( undefined, "userRoleList", ListCtrl.NO_SELECT, 2 );
  this.usersList.addHeaderItem( [AclEditorCtrl.NAME_HEADER_LABEL, AclEditorCtrl.SHARE_HEADER_LABEL ] );
	
	this.tabCtrl = new TabCtrl();
	
	// table control row
	var tr = document.createElement( "tr" );
	tbody.appendChild( tr );
	var td = document.createElement( "td" );
	tr.appendChild( td );
	td.appendChild( this.tabCtrl.getRoot() );

	this.tabCtrl.addTab( AclEditorCtrl.ROLES_LABEL, this.rolesList.getRoot() );
	this.tabCtrl.addTab( AclEditorCtrl.USERS_LABEL, this.usersList.getRoot() );
	  
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
	
  this.tabCtrl.setTab( AclEditorCtrl.ROLES_LABEL );
};

AclEditorCtrl.prototype = new HTMLCtrl();

// TODO sbarkdull, localize appropriate strings
/*private static*/AclEditorCtrl.USERS_LABEL = Messages.getString( "USERS_LABEL" );
/*private static*/AclEditorCtrl.ROLES_LABEL = Messages.getString( "ROLES_LABEL" );
/*private static*/AclEditorCtrl.NAME_HEADER_LABEL = Messages.getString( "NAME_HEADER_LABEL" );
/*private static*/AclEditorCtrl.SHARE_HEADER_LABEL = Messages.getString( "SHARE_HEADER_LABEL" );

// TODO mlowery ask the web service for the permission bits.
// see ISolutionRepository.java for bit values, execute=0x0001, subscribe=0x0002
/*private static*/AclEditorCtrl.SHARE_PERMISSIONS = 0x0003;
/*private static*/AclEditorCtrl.SHARE_PERMISSIONS_MASK = AclEditorCtrl.SHARE_PERMISSIONS ^ 0xFFFF;
/*private static*/AclEditorCtrl.NONE_PERMISSIONS = 0x0000;

AclEditorCtrl.prototype.handleTabShow = function( tabName )
{
  switch ( tabName )
  {
  case AclEditorCtrl.USERS_LABEL:
    if ( this.onUsersTabShowHandler )
    {
      this.onUsersTabShowHandler();
    }
    break;
  case AclEditorCtrl.ROLES_LABEL:
    if ( this.onRolesTabShowHandler )
    {
      this.onRolesTabShowHandler();
    }
    break;
  default:
    // do nothing
    break;
  }
  return true;
};

AclEditorCtrl.prototype.handleTabHide = function( tabName )
{
  switch ( tabName )
  {
  case AclEditorCtrl.USERS_LABEL:
    break;
  case AclEditorCtrl.ROLES_LABEL:
    break;
  default:
    // do nothing
    break;
  }
  return true;
};

// TODO sbarkdull
/*
AclEditorCtrl.prototype.setOnUsersTabShowHandler = function( handler )
{
  this.onUsersTabShowHandler = handler;
};

AclEditorCtrl.prototype.setOnRolesTabShowHandler = function( handler )
{
  this.onRolesTabShowHandler = handler;
};
*/

AclEditorCtrl.prototype.setUsers = function( xmlDoc )
{
  var userNds = XmlUtil.selectNodes( xmlDoc, "/SOAP-ENV:Envelope/SOAP-ENV:Body/ExecuteActivityResponse/content/users/user" );
  this.fillList( this.usersList, userNds );
};

AclEditorCtrl.prototype.setRoles = function( xmlDoc )
{
  var roleNds = XmlUtil.selectNodes( xmlDoc, "/SOAP-ENV:Envelope/SOAP-ENV:Body/ExecuteActivityResponse/content/roles/role" );
  this.fillList( this.rolesList, roleNds );
};

/**
 * File the list control (which is either the users or roles list control
 * with the contents of the XML Nodes (entry nodes).
 */
/*private*/AclEditorCtrl.prototype.fillList = function( listCtrl, nds )
{
  listCtrl.removeAll();

  var localThis = this;
  var columnWidth = [ "75%", "25%" ];
  for ( var ii=0; ii<nds.length; ++ii )
  {
    var nd = nds[ ii ];
    var name = XmlUtil.getNodeText( nd );
    var cb = document.createElement( "input" );
    cb.type = "checkbox";
    cb.name = name;
    cb.onclick = function()
    {
      var event = UIUtil.getEvent( arguments );
      localThis.itemChecked( event );
    }
    listCtrl.addItem( [ name, cb ], undefined, undefined, undefined, "userRoleListItem", columnWidth  );
  }
  listCtrl.setBanding( true, "#E9E9E9");
};

// TODO sbarkdull, move to controller, and let control call "addUser"?

// NOTE: this is a n-squared algorithm, where n is the number of items
// in the list. If the size of the lists gets large, we may want
// to optimize this, likely in ListCtrl.getItem()

/**
 * When this gets called, the user and roles lists must already be
 * populated. This method will merge the ACL information in the
 * arriving XML document with the users and roles in the
 * lists controls.
 * @param xmlDoc Document document containing acl entries.
 */
AclEditorCtrl.prototype.setAcl = function( xmlDoc )
{
  var aclEntryNds = XmlUtil.selectNodes( xmlDoc, "/acl/entry" );
  for ( var ii=0; ii<aclEntryNds.length; ++ii )
  {
    var nd = aclEntryNds[ ii ];
    var permissions = XmlUtil.getAttribute( nd, "permissions" );
    var name = XmlUtil.getAttribute( nd, "user" );
    if ( null != name )
    {
      var trElem = AclEditorCtrl.getItem( this.usersList, name );
      trElem.itemData = permissions;
      var cbElem = AclEditorCtrl.getCheckBoxFromTrElem( trElem );
      if( cbElem )
      {
        cbElem.checked = AclEditorCtrl.isShare( permissions );
      }
    }
    else
    {
      var role = XmlUtil.getAttribute( nd, "role" );
      var trElem = AclEditorCtrl.getItem( this.rolesList, role );
      trElem.itemData = permissions;
      var cbElem = AclEditorCtrl.getCheckBoxFromTrElem( trElem );
      if( cbElem )
      {
        cbElem.checked = AclEditorCtrl.isShare( permissions );
      }
    }
  }  
};

/**
 * @return Boolean does the permissions mask have both the execute and subscribe bits set?
 * (execute + subscribe) == share
 */
/*static*/AclEditorCtrl.isShare = function( permissions )
{
  return ( AclEditorCtrl.SHARE_PERMISSIONS & permissions ) == AclEditorCtrl.SHARE_PERMISSIONS;
};

/*static*/AclEditorCtrl.setShare = function( permissions )
{
  return permissions | AclEditorCtrl.SHARE_PERMISSIONS;
};

/*static*/AclEditorCtrl.clearShare = function( permissions )
{
  return permissions & AclEditorCtrl.SHARE_PERMISSIONS_MASK;
};

/*private static*/AclEditorCtrl.getCheckBoxFromTrElem = function( trElem )
{
  return trElem
    ? trElem.childNodes[1].childNodes[0]
    : null;
};

/*private static*/AclEditorCtrl.getNameFromTrElem = function( trElem )
{
  return trElem
    ? trElem.childNodes[0].innerHTML
    : null;
};

/**
 * @return Element the tr Element in the list ctrl
 */
/*static*/AclEditorCtrl.getItem = function( listCtrl, name )
{
  for ( var ii=0; ii<listCtrl.getLength(); ++ii )
  {
    var trElem = listCtrl.getItem( ii );
    var text = ListCtrl.getItemText( trElem );
    if ( text == name )
    {
      return trElem;
    } 
  }
  return null;
};

/**
 * NOTES:
 * if trElem.itemData is defined, and the checkbox is checked:
 *   the user/role is in the ACL, and needs to have the share permission bits
 *   set.
 * if trElem.itemData is defined, and the checkbox is NOT checked:
 *   the user/role is in the ACL, and needs to have the share permission bits
 *   removed.
 * if trElem.itemData is undefined, and the checkbox is checked:
 *   the user/role was not in the ACL, but needs to be added to the ACL with 
 *   share permissions.
 * if trElem.itemData is undefined, and the checkbox is NOT checked:
 *   the user/role was not in the ACL, and should not be added to the ACL.
 */
/* static private*/AclEditorCtrl.getItemPermissions = function( trElem )
{
  var checkBox = AclEditorCtrl.getCheckBoxFromTrElem( trElem );
  var permissions = trElem.itemData;
  // See NOTES above
  if ( undefined != permissions )
  {
    permissions = checkBox.checked
      ? AclEditorCtrl.setShare( permissions )
      : AclEditorCtrl.clearShare( permissions );
  }
  else
  {
    permissions = checkBox.checked
      ? AclEditorCtrl.setShare( AclEditorCtrl.NONE_PERMISSIONS )
      : null;
  }
  return permissions;
};

AclEditorCtrl.prototype.getValue = function()
{
  var strXml = "<?xml version='1.0' encoding='UTF-8' ?><acl>";
  //users
  for ( var ii=0; ii<this.usersList.getLength(); ++ii )
  {
    var trElem = this.usersList.getItem( ii );
    var name = AclEditorCtrl.getNameFromTrElem( trElem );
    var permissions = AclEditorCtrl.getItemPermissions( trElem );
    if ( null != permissions )
    {
      strXml += "<entry user='" + name + "' permissions='" + permissions + "'/>";
    }
  }
  // roles
  for ( var ii=0; ii<this.rolesList.getLength(); ++ii )
  {
    var trElem = this.rolesList.getItem( ii );
    var role = AclEditorCtrl.getNameFromTrElem( trElem );
    var permissions = AclEditorCtrl.getItemPermissions( trElem );
    if ( null != permissions )
    {
      strXml += "<entry role='" + role + "' permissions='" + permissions + "'/>";
    }
  }
  strXml += "</acl>";
  return strXml;
};

AclEditorCtrl.prototype.setTitle = function( title )
{
  this.titleTd.innerHTML = title;
}

AclEditorCtrl.prototype.setOnItemCheckHandler = function( handler )
{
  this.onItemCheckHandler = handler;
};

/*private*/AclEditorCtrl.prototype.itemChecked = function( event )
{
  if ( this.onItemCheckHandler )
  {
    this.onItemCheckHandler( event );
  }
}

