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
* Copyright (c) 2002-2013 Pentaho Corporation..  All rights reserved.
*/

package org.pentaho.jpivot.proxies;

import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;

@SuppressWarnings({ "deprecation", "rawtypes" })
public class ProxyingHttpSession implements HttpSession {
  HttpSession s;

  public ProxyingHttpSession(HttpSession s) {
    this.s = s;
  }

  @Override
  public Object getAttribute(String arg0) {

    return s.getAttribute(arg0);
  }

  @Override
  public Enumeration getAttributeNames() {
    return s.getAttributeNames();
  }

  @Override
  public long getCreationTime() {
    return s.getCreationTime();
  }

  @Override
  public String getId() {
    return s.getId();
  }

  @Override
  public long getLastAccessedTime() {
    return s.getLastAccessedTime();
  }

  @Override
  public int getMaxInactiveInterval() {
    return s.getMaxInactiveInterval();
  }

  @Override
  public ServletContext getServletContext() {
    return new ProxyServletContext(s.getServletContext());
  }

  @Override
  public HttpSessionContext getSessionContext() {
    return s.getSessionContext();
  }

  @Override
  public Object getValue(String arg0) {
    return s.getValue(arg0);
  }

  @Override
  public String[] getValueNames() {
    return s.getValueNames();
  }

  @Override
  public void invalidate() {
    s.invalidate();
  }

  @Override
  public boolean isNew() {
    return s.isNew();
  }

  @Override
  public void putValue(String arg0, Object arg1) {
    s.putValue(arg0, arg1);
  }

  @Override
  public void removeAttribute(String arg0) {
    s.removeAttribute(arg0);
  }

  @Override
  public void removeValue(String arg0) {
    s.removeValue(arg0);
  }

  @Override
  public void setAttribute(String arg0, Object arg1) {
    s.setAttribute(arg0, arg1);
  }

  @Override
  public void setMaxInactiveInterval(int arg0) {
    s.setMaxInactiveInterval(arg0);
  }

}
