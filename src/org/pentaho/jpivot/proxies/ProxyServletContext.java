/*!
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
* Copyright (c) 2002-2017 Hitachi Vantara..  All rights reserved.
*/

package org.pentaho.jpivot.proxies;

import java.io.File;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.pentaho.jpivot.AnalysisViewService;
import org.pentaho.platform.engine.core.system.PentahoSystem;

@SuppressWarnings({"rawtypes", "deprecation" })
public class ProxyServletContext implements ServletContext {
  ServletContext c;

  public ProxyServletContext(ServletContext c) {
    this.c = c;
  }

  @Override
  public Object getAttribute(String arg0) {
    return c.getAttribute(arg0);
  }

  @Override
  public Enumeration getAttributeNames() {
    return c.getAttributeNames();
  }

  @Override
  public ServletContext getContext(String arg0) {
    return c.getContext(arg0);
  }

  @Override
  public String getInitParameter(String arg0) {
    if (arg0.equals("chartServlet")) {
      return "/../../plugin/jpivot/DisplayChart";
    }
    return c.getInitParameter(arg0);
  }

  @Override
  public Enumeration getInitParameterNames() {
    return c.getInitParameterNames();
  }

  @Override
  public int getMajorVersion() {
    return c.getMajorVersion();
  }

  @Override
  public String getMimeType(String arg0) {
    return c.getMimeType(arg0);
  }

  @Override
  public int getMinorVersion() {
    return c.getMinorVersion();
  }

  @Override
  public RequestDispatcher getNamedDispatcher(String arg0) {
    return c.getNamedDispatcher(arg0);
  }

  @Override
  public String getRealPath(String arg0) {
    return c.getRealPath(arg0);
  }

  @Override
  public RequestDispatcher getRequestDispatcher(String arg0) {
    return c.getRequestDispatcher(arg0);
  }

  @Override
  public URL getResource(String arg0) throws MalformedURLException {
    if (!arg0.startsWith("/")) {
      arg0 = "/" + arg0;
    }
    // get path to the system folder
    File f = new File(PentahoSystem.getApplicationContext().getSolutionPath("system/"
            + AnalysisViewService.jpivotPluginDir + arg0));

    // the spec says to return null if the item isn't present
    if (!f.exists()) {
      return null;
    }

    return f.toURI().toURL();
  }

  @Override
  public InputStream getResourceAsStream(String arg0) {
    return c.getResourceAsStream(arg0);
  }

  @Override
  public Set getResourcePaths(String arg0) {
    return c.getResourcePaths(arg0);
  }

  @Override
  public String getServerInfo() {
    return c.getServerInfo();
  }

  @Override
  public Servlet getServlet(String arg0) throws ServletException {
    return c.getServlet(arg0);
  }

  @Override
  public String getServletContextName() {
    return c.getServletContextName();
  }

  @Override
  public Enumeration getServletNames() {
    return c.getServletNames();
  }

  @Override
  public Enumeration getServlets() {
    return c.getServlets();
  }

  @Override
  public void log(String arg0) {
    c.log(arg0);
  }

  @Override
  public void log(Exception arg0, String arg1) {
    c.log(arg0, arg1);
  }

  @Override
  public void log(String arg0, Throwable arg1) {
    c.log(arg0, arg1);
  }

  @Override
  public void removeAttribute(String arg0) {
    c.removeAttribute(arg0);
  }

  @Override
  public void setAttribute(String arg0, Object arg1) {
    c.setAttribute(arg0, arg1);
  }

}
