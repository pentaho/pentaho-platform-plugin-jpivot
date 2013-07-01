/*
 * This program is free software; you can redistribute it and/or modify it under the 
 * terms of the GNU Lesser General Public License, version 2.1 as published by the Free Software 
 * Foundation.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this 
 * program; if not, you can obtain a copy at http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html 
 * or from the Free Software Foundation, Inc., 
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * Copyright 2013 Pentaho Corporation.  All rights reserved.
 */
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
