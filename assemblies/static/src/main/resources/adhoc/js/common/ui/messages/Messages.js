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


dojo.require('dojo.i18n.common');
dojo.require('dojo.string.extras');

Messages = function()
{
};
/*private static*/Messages.init = function()
{
	if (Messages.messageBundle === undefined) {
	  Messages.messageBundle = new Array();
		
		Messages.addBundle("adhoc.common.ui.messages", "message_strings");
	}
};

/**
 * Add a resource bundle to the set of resource bundles.
 * 
 * @param packageName String the name of the package containing the javascript
 * file with the resource strings. 
 * @param fileName String name of the javascript file with the 
 * resource strings, without the extention.
 */
/*public static*/Messages.addBundle = function( packageName, fileName )
{
  dojo.requireLocalization(packageName, fileName);
  Messages.messageBundle.push( dojo.i18n.getLocalization(packageName, fileName) );
};


/*private static*/
Messages.entityDecoder=document.createElement('textarea');

/*public static*/
Messages.html_entity_decode = function(str)
{
    Messages.entityDecoder.innerHTML = str; 
    var value = Messages.entityDecoder.value;
    return value;
}

/**
 * Get the string from a message bundle referenced by <param>key</param>.
 * @param key String the key in the bundle which references the desired string
 * @param substitutionVars Array of String (optional) an array of strings
 * to substitute into the message string. 
 * @return String the string in the message bundle referenced by <param>key</param>.
 */
/*public static*/Messages.getString = function( key, substitutionVars )
{
	var msg = key; // if we don't find the msg, return the key as the msg
	// loop through each message bundle
	for ( var ii=0; ii<Messages.messageBundle.length; ++ii ) {
	  // does this bundle have the key we are looking for?
  	if (key in Messages.messageBundle[ii]) {
  	  // yes, it has the key
  		msg = Messages.messageBundle[ii][key];
  		if ( undefined != substitutionVars )
  		{
  			msg = dojo.string.substituteParams(msg, substitutionVars);
  		}
  		break;
  	}
	}
	return Messages.html_entity_decode(msg);
};
var cnt = 0;

/**
 * TODO sbarkdull: this method does not belong here, it belongs in UIUtils
 * 
 * @param elementOrId String or HTML element, if String, must be the id of an HTML element
 * @param msgKey String key into the message map
 */
/*public static*/Messages.setElementText = function( elementOrId, msgKey )
{
	var element;
	if (typeof elementOrId == "string") {
		element = document.getElementById(elementOrId);
	} else {
		element = elementOrId;
	}
	if (element) {
		element.innerHTML = Messages.getString(msgKey);
	}
};
/* static init */
Messages.init();
