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

package org.pentaho.jpivot;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import org.pentaho.platform.util.messages.LocaleHelper;

public final class PivotError_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;


  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html;");
      pageContext = _jspxFactory.getPageContext(this, request, response,
                                                            null, true, 8192, true);
      _jspx_page_context = pageContext;
      out = pageContext.getOut();
      _jspx_out = out;


                    response.setCharacterEncoding(LocaleHelper.getSystemEncoding());

      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("  <title>Error handling JPivot request ...</title>\r\n");
      out.write("</head>\r\n");
      out.write("<body bgcolor=\"white\" dir=\"");
      out.print( LocaleHelper.getSystemEncoding() );
      out.write("\">\r\n");
      out.write("\r\n");
      out.write("  <h2>JPivot Error ...</h2>\r\n");
      out.write("\r\n");
      out.write("  An error happened servicing a JPivot request. Please see the server console for more details.\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
