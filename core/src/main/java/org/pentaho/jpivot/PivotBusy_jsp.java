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

import javax.servlet.ServletException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.JspFactory;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.SkipPageException;
import org.apache.jasper.runtime.HttpJspBase;

import org.pentaho.platform.util.messages.LocaleHelper;

public final class PivotBusy_jsp extends HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants = null;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody;

  //  private javax.el.ExpressionFactory _el_expressionfactory;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool
        .getTagHandlerPool( getServletConfig() );
    //    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody.release();
  }

  public void _jspService( HttpServletRequest request, HttpServletResponse response )
      throws java.io.IOException, ServletException {

    PageContext pageContext;
    JspWriter out;
    JspWriter _jspx_out;
    _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType( "text/html;" );
      pageContext = _jspxFactory.getPageContext( this, request, response, null, true, 8192, true );
      _jspx_page_context = pageContext;
      out = pageContext.getOut();
      _jspx_out = out;

      response.setCharacterEncoding( LocaleHelper.getSystemEncoding() );

      out.write( "<html>\r\n" );
      out.write( "<head>\r\n" );
      out.write( "  <title>JPivot is busy ...</title>\r\n" );
      out.write( "  <meta http-equiv=\"refresh\" content=\"1; URL=" );
      if ( _jspx_meth_c_005fout_005f0( _jspx_page_context ) ) {
        return;
      }
      out.write( "\">\r\n" );
      out.write( "</head>\r\n" );
      out.write( "<body bgcolor=\"white\" dir=\"" );
      out.print( LocaleHelper.getSystemEncoding() );
      out.write( "\">\r\n" );
      out.write( "\r\n" );
      out.write( "  <h2>JPivot is busy ...</h2>\r\n" );
      out.write( "\r\n" );
      out.write( "  Please wait until your results are computed. Click\r\n" );
      out.write( "  <a href=\"" );
      if ( _jspx_meth_c_005fout_005f1( _jspx_page_context ) ) {
        return;
      }
      out.write( "\">here</a>\r\n" );
      out.write( "  if your browser does not support redirects.\r\n" );
      out.write( "\r\n" );
      out.write( "</body>\r\n" );
      out.write( "</html>\r\n" );
    } catch ( Throwable t ) {
      if ( !( t instanceof SkipPageException ) ) {
        out = _jspx_out;
        if ( out != null && out.getBufferSize() != 0 ) {
          try {
            out.clearBuffer();
          } catch ( java.io.IOException e ) {
          }
        }
        if ( _jspx_page_context != null ) {
          _jspx_page_context.handlePageException( t );
        }
      }
    } finally {
      _jspxFactory.releasePageContext( _jspx_page_context );
    }
  }

  private boolean _jspx_meth_c_005fout_005f0( PageContext _jspx_page_context ) throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:out
    org.apache.taglibs.standard.tag.rt.core.OutTag _jspx_th_c_005fout_005f0 = (org.apache.taglibs.standard.tag.rt.core.OutTag) _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody
        .get( org.apache.taglibs.standard.tag.rt.core.OutTag.class );
    _jspx_th_c_005fout_005f0.setPageContext( _jspx_page_context );
    _jspx_th_c_005fout_005f0.setParent( null );
    // /jsp/PivotBusy.jsp(9,45) name = value type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fout_005f0.setValue( "${requestSynchronizer.resultURI}" );
    int _jspx_eval_c_005fout_005f0 = _jspx_th_c_005fout_005f0.doStartTag();
    if ( _jspx_th_c_005fout_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody.reuse( _jspx_th_c_005fout_005f0 );
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody.reuse( _jspx_th_c_005fout_005f0 );
    return false;
  }

  private boolean _jspx_meth_c_005fout_005f1( PageContext _jspx_page_context ) throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:out
    org.apache.taglibs.standard.tag.rt.core.OutTag _jspx_th_c_005fout_005f1 = (org.apache.taglibs.standard.tag.rt.core.OutTag) _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody
        .get( org.apache.taglibs.standard.tag.rt.core.OutTag.class );
    _jspx_th_c_005fout_005f1.setPageContext( _jspx_page_context );
    _jspx_th_c_005fout_005f1.setParent( null );
    // /jsp/PivotBusy.jsp(16,11) name = value type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fout_005f1.setValue( "${requestSynchronizer.resultURI}" );
    int _jspx_eval_c_005fout_005f1 = _jspx_th_c_005fout_005f1.doStartTag();
    if ( _jspx_th_c_005fout_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody.reuse( _jspx_th_c_005fout_005f1 );
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fout_0026_005fvalue_005fnobody.reuse( _jspx_th_c_005fout_005f1 );
    return false;
  }
}
