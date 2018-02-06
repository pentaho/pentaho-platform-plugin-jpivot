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
* Copyright 2013 - 2017 Hitachi Vantara.  All rights reserved.
*
* This servlet is source generated from Tomcat's JSP generator, based on PivotError.jsp.  This
* specific file was generated in 4.8 GA.
*/

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
