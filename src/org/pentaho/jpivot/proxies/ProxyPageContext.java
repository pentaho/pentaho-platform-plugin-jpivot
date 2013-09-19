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

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.ErrorData;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.el.ExpressionEvaluator;
import javax.servlet.jsp.el.VariableResolver;
import javax.servlet.jsp.tagext.BodyContent;

@SuppressWarnings({ "rawtypes" })
public class ProxyPageContext extends PageContext {
  PageContext p;

  public ProxyPageContext(PageContext p) {
    this.p = p;
  }

  @Override
  public void forward(String arg0) throws ServletException, IOException {
    p.forward(arg0);
  }

  @Override
  public Exception getException() {
    return p.getException();
  }

  @Override
  public Object getPage() {
    return p.getPage();
  }

  @Override
  public ServletRequest getRequest() {
    return p.getRequest();
  }

  @Override
  public ServletResponse getResponse() {
    return p.getResponse();
  }

  @Override
  public ServletConfig getServletConfig() {
    return p.getServletConfig();
  }

  @Override
  public ServletContext getServletContext() {
    return p.getServletContext();
  }

  @Override
  public HttpSession getSession() {
    return new ProxyingHttpSession(p.getSession());
  }

  @Override
  public void handlePageException(Exception arg0) throws ServletException, IOException {
    p.handlePageException(arg0);
  }

  @Override
  public void handlePageException(Throwable arg0) throws ServletException, IOException {
    p.handlePageException(arg0);
  }

  @Override
  public void include(String arg0) throws ServletException, IOException {
    p.include(arg0);
  }

  @Override
  public void include(String arg0, boolean arg1) throws ServletException, IOException {
    p.include(arg0, arg1);
  }

  @Override
  public void initialize(Servlet arg0, ServletRequest arg1, ServletResponse arg2, String arg3, boolean arg4, int arg5, boolean arg6) throws IOException, IllegalStateException,
      IllegalArgumentException {
    p.initialize(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
  }

  @Override
  public void release() {
    p.release();
  }

  @Override
  public Object findAttribute(String arg0) {
    return p.findAttribute(arg0);
  }

  @Override
  public Object getAttribute(String arg0) {
    return p.getAttribute(arg0);
  }

  @Override
  public Object getAttribute(String arg0, int arg1) {
    return p.getAttribute(arg0, arg1);
  }

  @Override
  public Enumeration getAttributeNamesInScope(int arg0) {
    return p.getAttributeNamesInScope(arg0);
  }

  @Override
  public int getAttributesScope(String arg0) {
    return p.getAttributesScope(arg0);
  }

  @Override
  public ExpressionEvaluator getExpressionEvaluator() {
    return p.getExpressionEvaluator();
  }

  @Override
  public JspWriter getOut() {
    return p.getOut();
  }

  @Override
  public VariableResolver getVariableResolver() {
    return p.getVariableResolver();
  }

  @Override
  public void removeAttribute(String arg0) {
    p.removeAttribute(arg0);
  }

  @Override
  public void removeAttribute(String arg0, int arg1) {
    p.removeAttribute(arg0, arg1);
  }

  @Override
  public void setAttribute(String arg0, Object arg1) {
    p.setAttribute(arg0, arg1);
  }

  @Override
  public void setAttribute(String arg0, Object arg1, int arg2) {
    p.setAttribute(arg0, arg1, arg2);
  }

  public JspWriter popBody() {
    return p.popBody();
  }

  public BodyContent pushBody() {
    return p.pushBody();
  }

  public JspWriter pushBody(JspWriter w) {
    return p.pushBody(w);
  }

  public ErrorData getErrorData() {
    return p.getErrorData();
  }
}
