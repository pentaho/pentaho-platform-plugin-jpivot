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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.tonbeller.wcf.controller.MultiPartEnabledRequest;

public class ProxyHttpServletRequest extends MultiPartEnabledRequest {

  public ProxyHttpServletRequest(HttpServletRequest arg0) {
    super(arg0);
  }

  public HttpSession getSession(boolean val) {
    return new ProxyingHttpSession(super.getSession(val));
  }
  
  public HttpSession getSession() {
    return new ProxyingHttpSession(super.getSession());
  }

  @Override
  public String getContextPath() {
    return super.getContextPath() + "/content/jpivot";
  }

}
