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

package org.pentaho.jpivot.proxies;

import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;

public class ProxyServletConfig implements ServletConfig {
  ServletConfig c;
  public ProxyServletConfig(ServletConfig c) {
    this.c = c;
  }
  
  @Override
  public String getInitParameter(String arg0) {
    return c.getInitParameter(arg0);
  }

  @Override
  public Enumeration getInitParameterNames() {
    return c.getInitParameterNames();
  }

  @Override
  public ServletContext getServletContext() {
    return new ProxyServletContext(c.getServletContext());
  }

  @Override
  public String getServletName() {
    return c.getServletName();
  }

}
