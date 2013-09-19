/*
* ====================================================================
* This software is subject to the terms of the Common Public License
* Agreement, available at the following URL:
*   http://www.opensource.org/licenses/cpl.html .
* Copyright (C) 2003-2004 TONBELLER AG.
* All Rights Reserved.
* You must accept the terms of that agreement to use this software.
* ====================================================================
*
*
*/

package com.tonbeller.wcf.utils;

import java.io.IOException;
import java.net.URL;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.xmlrules.DigesterLoader;
import org.xml.sax.SAXException;

/**
 * Creates Object instances via Digester xml rules. For more info
 * see <a href="http://jakarta.apache.org/commons/digester.html">Commons Digester</a>.
 * @author av
 */
public class ObjectFactory {

  /**
   * not for external use. Has to be public for the commons digester
   * to access it.
   */
  public static class ObjectHolder {
    private Object object;
    public void setObject(Object object) {
      this.object = object;
    }
    public Object getObject() {
      return object;
    }
  }

  private ObjectFactory() {
  }

  public static Object instance(URL rulesXml, URL configXml) throws SAXException, IOException {

    Digester digester = DigesterLoader.createDigester(rulesXml);
    digester.setClassLoader(ObjectFactory.class.getClassLoader());  
    digester.setValidating(false);

    ObjectHolder root = new ObjectHolder();
    digester.push(root);

    digester.parse(configXml.openStream());
    return root.getObject();
  }

}
