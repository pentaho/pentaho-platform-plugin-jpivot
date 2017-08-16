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
* Copyright 2016 Pentaho Corporation.  All rights reserved.
*
* This servlet is source generated from Tomcat's JSP generator, based on Pivot.jsp.  This
* specific file was generated in 4.8 GA.
*/

package org.pentaho.jpivot;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.JspFactory;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.SkipPageException;
import javax.servlet.jsp.jstl.core.Config;
import javax.sql.DataSource;

import org.apache.log4j.MDC;
import org.owasp.encoder.Encode;
import org.pentaho.jpivot.proxies.ProxyHttpServletRequest;
import org.pentaho.jpivot.proxies.ProxyPageContext;
import org.pentaho.platform.api.data.IDBDatasourceService;
import org.pentaho.platform.api.engine.IConnectionUserRoleMapper;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.engine.IRuntimeContext;
import org.pentaho.platform.api.engine.ISolutionEngine;
import org.pentaho.platform.engine.core.output.SimpleOutputHandler;
import org.pentaho.platform.engine.core.solution.ActionInfo;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.plugin.services.connections.mondrian.MDXConnection;
import org.pentaho.platform.util.UUIDUtil;
import org.pentaho.platform.util.messages.LocaleHelper;
import org.pentaho.platform.util.web.SimpleUrlFactory;
import org.pentaho.platform.web.http.request.HttpRequestParameterProvider;
import org.pentaho.platform.web.http.session.HttpSessionParameterProvider;
import org.pentaho.platform.web.jsp.messages.Messages;

import com.tonbeller.jpivot.chart.ChartComponent;
import com.tonbeller.jpivot.olap.model.OlapModel;
import com.tonbeller.jpivot.olap.model.OlapModelDecorator;
import com.tonbeller.jpivot.olap.query.MdxOlapModel;
import com.tonbeller.jpivot.table.TableComponent;
import com.tonbeller.jpivot.tags.OlapModelProxy;
import com.tonbeller.wcf.controller.Controller;
import com.tonbeller.wcf.controller.MultiPartEnabledRequest;
import com.tonbeller.wcf.controller.RequestContext;
import com.tonbeller.wcf.controller.RequestContextFactoryFinder;
import com.tonbeller.wcf.controller.WcfController;
import com.tonbeller.wcf.form.FormComponent;

public final class Pivot_jsp extends org.apache.jasper.runtime.HttpJspBase {

  private static final ResourceBundle messages = ResourceBundle.getBundle( "org.pentaho.jpivot.messages" );
  private static final String deprecationWarningMessage = messages.getString( "deprecationWarning" );
  private static final String SETTINGS_FILE = AnalysisViewService.jpivotPluginDir + "/settings.xml";

  private static boolean writeDeprecationWarning() {
    String showWarning = PentahoSystem.getSystemSetting( SETTINGS_FILE, "show-deprecation-warning", "true" );
    return Boolean.valueOf( showWarning );
  }

  //  NOTE: Not necessary so commented out to reduce dependencies
  // implements org.apache.jasper.runtime.JspSourceDependent {

  private IRuntimeContext getRuntimeForQuery( String actionPath, HttpServletRequest request,
                                              IPentahoSession userSession ) {
    String processId = "PivotView"; //$NON-NLS-1$
    String instanceId = request.getParameter( "instance-id" ); //$NON-NLS-1$
    boolean doMessages = "true".equalsIgnoreCase( request.getParameter( "debug" ) ); //$NON-NLS-1$ //$NON-NLS-2$

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    SimpleOutputHandler outputHandler = new SimpleOutputHandler( outputStream, true );
    ISolutionEngine solutionEngine = PentahoSystem.get( ISolutionEngine.class, userSession );
    solutionEngine.init( userSession );
    IRuntimeContext context = null;
    ArrayList messages = new ArrayList();
    HttpRequestParameterProvider requestParameters = new HttpRequestParameterProvider( request );
    HttpSessionParameterProvider sessionParameters = new HttpSessionParameterProvider( userSession );
    HashMap parameterProviders = new HashMap();
    requestParameters.setParameter( PivotViewComponent.MODE, PivotViewComponent.EXECUTE ); //$NON-NLS-1$ //$NON-NLS-2$
    parameterProviders.put( HttpRequestParameterProvider.SCOPE_REQUEST, requestParameters ); //$NON-NLS-1$
    parameterProviders.put( HttpSessionParameterProvider.SCOPE_SESSION, sessionParameters ); //$NON-NLS-1$
    SimpleUrlFactory urlFactory = new SimpleUrlFactory( "" ); //$NON-NLS-1$

    context = solutionEngine
      .execute( actionPath, Messages.getInstance().getString( "BaseTest.DEBUG_JUNIT_TEST" ), false, true, instanceId,
        false, parameterProviders, outputHandler, null, urlFactory, messages ); //$NON-NLS-1$

    if ( context != null && context.getStatus() == IRuntimeContext.RUNTIME_STATUS_SUCCESS ) {
      return context;
    } else {
      return null;
    }
  }


  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  static {
    _jspx_dependants = new java.util.ArrayList( 2 );
    _jspx_dependants.add( "/WEB-INF/jpivot/jpivot-tags.tld" );
    _jspx_dependants.add( "/WEB-INF/wcf/wcf-tags.tld" );
  }

  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool
    _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody;

  // NOTE: commented out to reduce external dependencies, these are not used
  //  private javax.el.ExpressionFactory _el_expressionfactory;
  //  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody =
      org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool( getServletConfig() );
    // _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext())
    // .getExpressionFactory();
    // _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext()
    // .getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
      .release();
    _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody.release();
    _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody.release();
    _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody.release();
    _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody.release();
    _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle.release();
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
      .release();
    _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody.release();
    _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody.release();
  }

  @SuppressWarnings( { "rawtypes", "unchecked" } )
  public void _jspService( HttpServletRequest request, HttpServletResponse response )
    throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType( "text/html;" );
      pageContext = _jspxFactory.getPageContext( this, request, response,
        null, true, 8192, true );
      _jspx_page_context = new ProxyPageContext( pageContext );
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write( '\n' );
      out.write( '\n' );

      // the following code replaces wcf's RequestFilter due to session based
      // synchronization logic that is no longer necessary. (PDB-369)
      MultiPartEnabledRequest mprequest = new MultiPartEnabledRequest( (HttpServletRequest) request );
      HttpSession mpsession = mprequest.getSession( true );
      MDC.put( "SessionID", mpsession.getId() );
      String cpath = mprequest.getContextPath();
      mprequest.setAttribute( "context", cpath + "/plugin/jpivot" );

      HttpServletRequest req = new ProxyHttpServletRequest( mprequest );


      RequestContext wcfcontext = RequestContextFactoryFinder.createContext( req, response, true );
      try {
        Config.set( req, Config.FMT_LOCALE, wcfcontext.getLocale() );
        Controller controller = WcfController.instance( session );
        controller.request( wcfcontext );

        out.write( "\n" );
        out.write( "\n" );
        out.write( "\n" );
        out.write( "\n" );


/*
 * Copyright 2006-2009 Pentaho Corporation.  All rights reserved.
 * This software was developed by Pentaho Corporation and is provided under the terms
 * of the Mozilla Public License, Version 1.1, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to http://www.mozilla.org/MPL/MPL-1.1.txt. The Original Code is the Pentaho
 * BI Platform.  The Initial Developer is Pentaho Corporation.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
*/

        response.setCharacterEncoding( LocaleHelper.getSystemEncoding() );
        PentahoSystem.systemEntryPoint();
        try {
          IPentahoSession userSession = PentahoSessionHolder.getSession();

          String pivotId = null;
          if ( request.getParameter( "pivotId" ) != null ) {
            pivotId = request.getParameter( "pivotId" );
          } else {
            pivotId = UUIDUtil.getUUIDAsString();
            if ( pivotId == null ) {
              // TODO need to log an error here
              return;
            }
          }

          // this allows navigation renderer to have access to the pivotId, which it uses
          // in an href link back to itself.
          Map map = new HashMap();
          map.put( "pivotId", pivotId );
          request.setAttribute( "com.tonbeller.wcf.component.RendererParameters", map );

          boolean saveResult = false;
          String saveMessage = "";
          String queryId = "query" + pivotId; //$NON-NLS-1$
          String mdxEditId = "mdxedit" + pivotId;
          String tableId = "table" + pivotId;
          String titleId = PivotViewComponent.TITLE + pivotId;
          String optionsId = "pivot-" + PivotViewComponent.OPTIONS + "-" + pivotId; //$NON-NLS-1$
          String chartId = "chart" + pivotId;
          String naviId = "navi" + pivotId;
          String sortFormId = "sortform" + pivotId;
          String chartFormId = "chartform" + pivotId;
          String printId = "print" + pivotId;
          String printFormId = "printform" + pivotId;
          String drillThroughTableId = queryId + ".drillthroughtable";
          String toolbarId = "toolbar" + pivotId;

          // Internal JPivot References, if available.  Note that these references change
          // after each creation tag within the JSP.
          OlapModel _olapModel = (OlapModel) session.getAttribute( queryId );
          FormComponent _mdxEdit = (FormComponent) session.getAttribute( mdxEditId );
          TableComponent _table = (TableComponent) session.getAttribute( tableId );
          ChartComponent _chart = (ChartComponent) session.getAttribute( chartId );

          boolean authenticated = userSession.getName() != null;
          String pageName = "Pivot"; //$NON-NLS-1$

          String actionPath = request.getParameter( "path" ); //$NON-NLS-1$
          String actionName = request.getParameter( "action" ); //$NON-NLS-1$

          actionPath = AnalysisSaver.cleansePath( actionPath, actionName );

          String newAction = request.getParameter( "new-action" );


          String actionReference = (String) session.getAttribute( "pivot-action-" + pivotId ); //$NON-NLS-1$

          String subscribeResult = null;
          String subscribeAction = request.getParameter( "subscribe" ); //$NON-NLS-1$
          String saveAction = request.getParameter( "save-action" ); //$NON-NLS-1$

          String dataSource = null;
          String catalogUri = null;
          String query = null;
          String role = null;
          String pivotTitle =
            (String) session.getAttribute( "pivot-" + PivotViewComponent.TITLE + "-" + pivotId ); //$NON-NLS-1$
          String actionTitle = (String) session.getAttribute( "action-" + PivotViewComponent.TITLE + "-" + pivotId );
          ArrayList options = (ArrayList) session.getAttribute( optionsId );
          boolean chartChange = false;
          boolean showGrid = true;

          if ( session.getAttribute( "save-message-01" ) != null ) {
            saveMessage = ( (String) session.getAttribute( "save-message-01" ) );
          }

          if ( session.getAttribute( "pivot-" + PivotViewComponent.SHOWGRID + "-" + pivotId ) != null ) {
            showGrid = ( (Boolean) session.getAttribute( "pivot-" + PivotViewComponent.SHOWGRID + "-" + pivotId ) )
              .booleanValue();
          }
          if ( session.getAttribute( "pivot-" + PivotViewComponent.MODEL + "-" + pivotId ) != null ) { //$NON-NLS-1$
            catalogUri = (String) session.getAttribute( "pivot-" + PivotViewComponent.MODEL + "-" + pivotId );
          }
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CONNECTION + "-" + pivotId )
            != null ) { //$NON-NLS-1$
            dataSource = (String) session.getAttribute( "pivot-" + PivotViewComponent.CONNECTION + "-" + pivotId );
          }

          int chartType = 1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTTYPE + "-" + pivotId ) != null ) { //$NON-NLS-1$
            chartType = ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTTYPE + "-" + pivotId ) )
              .intValue(); //$NON-NLS-1$
          }
          String chartLocation = "bottom"; //$NON-NLS-1$
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTLOCATION + "-" + pivotId )
            != null ) { //$NON-NLS-1$
            chartLocation =
              (String) session.getAttribute( "pivot-" + PivotViewComponent.CHARTLOCATION + "-" + pivotId );
          }
          int chartWidth = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTWIDTH + "-" + pivotId ) != null ) {
            chartWidth =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTWIDTH + "-" + pivotId ) ).intValue();
          }
          int chartHeight = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTHEIGHT + "-" + pivotId ) != null ) {
            chartHeight =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTHEIGHT + "-" + pivotId ) )
                .intValue();
          }
          boolean chartDrillThroughEnabled = false;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTDRILLTHROUGHENABLED + "-" + pivotId )
            != null ) {
            chartDrillThroughEnabled = ( (Boolean) session
              .getAttribute( "pivot-" + PivotViewComponent.CHARTDRILLTHROUGHENABLED + "-" + pivotId ) ).booleanValue();
          }
          String chartTitle = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLE + "-" + pivotId ) != null ) {
            chartTitle = session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLE + "-" + pivotId ).toString();
          }
          String chartTitleFontFamily = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTFAMILY + "-" + pivotId ) != null ) {
            chartTitleFontFamily =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTFAMILY + "-" + pivotId ).toString();
          }
          int chartTitleFontStyle = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSTYLE + "-" + pivotId ) != null ) {
            chartTitleFontStyle =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSTYLE + "-" + pivotId ) )
                .intValue();
          }
          int chartTitleFontSize = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSIZE + "-" + pivotId ) != null ) {
            chartTitleFontSize =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSIZE + "-" + pivotId ) )
                .intValue();
          }
          String chartHorizAxisLabel = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTHORIZAXISLABEL + "-" + pivotId ) != null ) {
            chartHorizAxisLabel =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTHORIZAXISLABEL + "-" + pivotId ).toString();
          }
          String chartVertAxisLabel = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTVERTAXISLABEL + "-" + pivotId ) != null ) {
            chartVertAxisLabel =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTVERTAXISLABEL + "-" + pivotId ).toString();
          }
          String chartAxisLabelFontFamily = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTFAMILY + "-" + pivotId )
            != null ) {
            chartAxisLabelFontFamily =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTFAMILY + "-" + pivotId ).toString();
          }
          int chartAxisLabelFontStyle = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSTYLE + "-" + pivotId ) != null ) {
            chartAxisLabelFontStyle = ( (Integer) session
              .getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSTYLE + "-" + pivotId ) ).intValue();
          }
          int chartAxisLabelFontSize = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSIZE + "-" + pivotId ) != null ) {
            chartAxisLabelFontSize =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSIZE + "-" + pivotId ) )
                .intValue();
          }
          String chartAxisTickFontFamily = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTFAMILY + "-" + pivotId ) != null ) {
            chartAxisTickFontFamily =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTFAMILY + "-" + pivotId ).toString();
          }
          int chartAxisTickFontStyle = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSTYLE + "-" + pivotId ) != null ) {
            chartAxisTickFontStyle =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSTYLE + "-" + pivotId ) )
                .intValue();
          }
          int chartAxisTickFontSize = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSIZE + "-" + pivotId ) != null ) {
            chartAxisTickFontSize =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSIZE + "-" + pivotId ) )
                .intValue();
          }
          int chartAxisTickLabelRotation = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKLABELROTATION + "-" + pivotId )
            != null ) {
            chartAxisTickLabelRotation = ( (Integer) session
              .getAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKLABELROTATION + "-" + pivotId ) ).intValue();
          }
          boolean chartShowLegend = false;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSHOWLEGEND + "-" + pivotId ) != null ) {
            chartShowLegend =
              ( (Boolean) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSHOWLEGEND + "-" + pivotId ) )
                .booleanValue();
          }
          int chartLegendLocation = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDLOCATION + "-" + pivotId ) != null ) {
            chartLegendLocation =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDLOCATION + "-" + pivotId ) )
                .intValue();
          }
          String chartLegendFontFamily = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTFAMILY + "-" + pivotId ) != null ) {
            chartLegendFontFamily =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTFAMILY + "-" + pivotId ).toString();
          }
          int chartLegendFontStyle = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSTYLE + "-" + pivotId ) != null ) {
            chartLegendFontStyle =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSTYLE + "-" + pivotId ) )
                .intValue();
          }
          int chartLegendFontSize = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSIZE + "-" + pivotId ) != null ) {
            chartLegendFontSize =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSIZE + "-" + pivotId ) )
                .intValue();
          }
          boolean chartShowSlicer = false;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSHOWSLICER + "-" + pivotId ) != null ) {
            chartShowSlicer =
              ( (Boolean) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSHOWSLICER + "-" + pivotId ) )
                .booleanValue();
          }
          int chartSlicerLocation = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERLOCATION + "-" + pivotId ) != null ) {
            chartSlicerLocation =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERLOCATION + "-" + pivotId ) )
                .intValue();
          }
          int chartSlicerAlignment = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERALIGNMENT + "-" + pivotId ) != null ) {
            chartSlicerAlignment =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERALIGNMENT + "-" + pivotId ) )
                .intValue();
          }
          String chartSlicerFontFamily = "";
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTFAMILY + "-" + pivotId ) != null ) {
            chartSlicerFontFamily =
              session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTFAMILY + "-" + pivotId ).toString();
          }
          int chartSlicerFontStyle = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSTYLE + "-" + pivotId ) != null ) {
            chartSlicerFontStyle =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSTYLE + "-" + pivotId ) )
                .intValue();
          }
          int chartSlicerFontSize = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSIZE + "-" + pivotId ) != null ) {
            chartSlicerFontSize =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSIZE + "-" + pivotId ) )
                .intValue();
          }
          int chartBackgroundR = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDR + "-" + pivotId ) != null ) {
            chartBackgroundR =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDR + "-" + pivotId ) )
                .intValue();
          }
          int chartBackgroundG = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDG + "-" + pivotId ) != null ) {
            chartBackgroundG =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDG + "-" + pivotId ) )
                .intValue();
          }
          int chartBackgroundB = -1;
          if ( session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDB + "-" + pivotId ) != null ) {
            chartBackgroundB =
              ( (Integer) session.getAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDB + "-" + pivotId ) )
                .intValue();
          }

          if ( ( actionPath != null && actionName != null ) || newAction != null ) {
            // we need to initialize from an action sequence document

            IRuntimeContext context = null;
            try {
              if ( newAction != null ) {
                context = new AnalysisViewService().getNewAnalysisViewRuntime( request, userSession );
              } else {
                context = getRuntimeForQuery( actionPath + "/" + actionName, request, userSession );
              }
              if ( context != null && context.getStatus() == IRuntimeContext.RUNTIME_STATUS_SUCCESS ) {
                if ( context.getOutputNames().contains( PivotViewComponent.MODEL ) ) {
                  try {
                    catalogUri = context.getOutputParameter( PivotViewComponent.MODEL ).getStringValue(); //$NON-NLS-1$
                    session.setAttribute( "pivot-" + PivotViewComponent.MODEL + "-" + pivotId, catalogUri );
                  } catch ( Exception e ) {
                  }
                }

                dataSource = context.getOutputParameter( PivotViewComponent.CONNECTION ).getStringValue(); //$NON-NLS-1$
                if ( dataSource != null ) {
                  session.setAttribute( "pivot-" + PivotViewComponent.CONNECTION + "-" + pivotId, dataSource );
                }
                query = context.getOutputParameter( "mdx" ).getStringValue(); //$NON-NLS-1$

                if ( catalogUri == null || dataSource == null || query == null ) {
                  throw new Exception( Messages.getInstance()
                    .getErrorString( "UI.ERROR_0003_XACTION_INVALID_OUTPUTS", actionPath + "/" + actionName,
                      "Catalog URI=" + catalogUri + "; Data Source=" + dataSource + "; MDX Query=" + query,
                      "isPromptPending=" + context.isPromptPending() ) );
                }

                if ( context.getOutputNames().contains( PivotViewComponent.ROLE ) ) { //$NON-NLS-1$
                  role = context.getOutputParameter( PivotViewComponent.ROLE ).getStringValue(); //$NON-NLS-1$
                }

                if ( ( role == null ) || ( role.trim().length() == 0 ) ) {
                  // Only if the action sequence/requester hasn't already injected a role in here do this.
                  if ( PentahoSystem.getObjectFactory().objectDefined( MDXConnection.MDX_CONNECTION_MAPPER_KEY ) ) {
                    IConnectionUserRoleMapper mondrianUserRoleMapper = PentahoSystem
                      .get( IConnectionUserRoleMapper.class, MDXConnection.MDX_CONNECTION_MAPPER_KEY, null );
                    if ( mondrianUserRoleMapper != null ) {
                      // Do role mapping
                      String[] validMondrianRolesForUser =
                        mondrianUserRoleMapper.mapConnectionRoles( PentahoSessionHolder.getSession(), catalogUri );
                      if ( ( validMondrianRolesForUser != null ) && ( validMondrianRolesForUser.length > 0 ) ) {
                        StringBuffer buff = new StringBuffer();
                        String aRole = null;
                        for ( int i = 0; i < validMondrianRolesForUser.length; i++ ) {
                          aRole = validMondrianRolesForUser[ i ];
                          // According to http://mondrian.pentaho.org/documentation/configuration.php
                          // double-comma escapes a comma
                          if ( i > 0 ) {
                            buff.append( "," );
                          }
                          buff.append( aRole.replaceAll( ",", ",," ) );
                        }
                        role = buff.toString();
                      }
                    }
                  }
                }

                if ( context.getOutputNames().contains( PivotViewComponent.CHARTTYPE ) ) { //$NON-NLS-1$
                  try {
                    chartType = Integer.parseInt(
                      context.getOutputParameter( PivotViewComponent.CHARTTYPE ).getStringValue() ); //$NON-NLS-1$
                    session.setAttribute( "pivot-" + PivotViewComponent.CHARTTYPE + "-" + pivotId,
                      new Integer( chartType ) ); //$NON-NLS-1$

                  } catch ( Exception e ) {
                  }
                } else {
                  chartType = 1;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.SHOWGRID ) ) {
                  try {
                    showGrid =
                      Boolean.valueOf( context.getOutputParameter( PivotViewComponent.SHOWGRID ).getStringValue() )
                        .booleanValue();
                    session
                      .setAttribute( "pivot-" + PivotViewComponent.SHOWGRID + "-" + pivotId, new Boolean( showGrid ) );
                  } catch ( Exception e ) {
                  }
                } else {
                  showGrid = true;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTWIDTH ) ) { //$NON-NLS-1$
                  try {
                    chartWidth = Integer.parseInt(
                      context.getOutputParameter( PivotViewComponent.CHARTWIDTH ).getStringValue() ); //$NON-NLS-1$
                    session.setAttribute( "pivot-" + PivotViewComponent.CHARTWIDTH + "-" + pivotId,
                      new Integer( chartWidth ) ); //$NON-NLS-1$
                  } catch ( Exception e ) {
                  }
                } else {
                  chartWidth = 500;  // Default from ChartComponent
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTHEIGHT ) ) { //$NON-NLS-1$
                  try {
                    chartHeight = Integer.parseInt(
                      context.getOutputParameter( PivotViewComponent.CHARTHEIGHT ).getStringValue() ); //$NON-NLS-1$
                    session.setAttribute( "pivot-" + PivotViewComponent.CHARTHEIGHT + "-" + pivotId,
                      new Integer( chartHeight ) ); //$NON-NLS-1$
                  } catch ( Exception e ) {
                  }
                } else {
                  chartHeight = 300; // Default from ChartComponent
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTLOCATION ) ) { //$NON-NLS-1$
                  chartLocation =
                    context.getOutputParameter( PivotViewComponent.CHARTLOCATION ).getStringValue(); //$NON-NLS-1$
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTLOCATION + "-" + pivotId,
                    chartLocation ); //$NON-NLS-1$
                } else {
                  chartLocation = "none"; //$NON-NLS-1$
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTDRILLTHROUGHENABLED ) ) {
                  chartDrillThroughEnabled = Boolean.valueOf(
                    context.getOutputParameter( PivotViewComponent.CHARTDRILLTHROUGHENABLED ).getStringValue() )
                    .booleanValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTDRILLTHROUGHENABLED + "-" + pivotId,
                    new Boolean( chartDrillThroughEnabled ) );
                } else {
                  chartDrillThroughEnabled = false;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTTITLE ) ) {
                  chartTitle = context.getOutputParameter( PivotViewComponent.CHARTTITLE ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTTITLE + "-" + pivotId, chartTitle );
                } else {
                  chartTitle = "";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTTITLEFONTFAMILY ) ) {
                  chartTitleFontFamily =
                    context.getOutputParameter( PivotViewComponent.CHARTTITLEFONTFAMILY ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTFAMILY + "-" + pivotId,
                    chartTitleFontFamily );
                } else {
                  chartTitleFontFamily = "SansSerif";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTTITLEFONTSTYLE ) ) {
                  chartTitleFontStyle = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTTITLEFONTSTYLE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSTYLE + "-" + pivotId,
                    new Integer( chartTitleFontStyle ) );
                } else {
                  chartTitleFontStyle = java.awt.Font.BOLD;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTTITLEFONTSIZE ) ) {
                  chartTitleFontSize = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTTITLEFONTSIZE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTTITLEFONTSIZE + "-" + pivotId,
                    new Integer( chartTitleFontSize ) );
                } else {
                  chartTitleFontSize = 18;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTHORIZAXISLABEL ) ) {
                  chartHorizAxisLabel =
                    context.getOutputParameter( PivotViewComponent.CHARTHORIZAXISLABEL ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTHORIZAXISLABEL + "-" + pivotId,
                    chartHorizAxisLabel );
                } else {
                  chartHorizAxisLabel = "";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTVERTAXISLABEL ) ) {
                  chartVertAxisLabel =
                    context.getOutputParameter( PivotViewComponent.CHARTVERTAXISLABEL ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTVERTAXISLABEL + "-" + pivotId,
                    chartVertAxisLabel );
                } else {
                  chartVertAxisLabel = "";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISLABELFONTFAMILY ) ) {
                  chartAxisLabelFontFamily =
                    context.getOutputParameter( PivotViewComponent.CHARTAXISLABELFONTFAMILY ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTFAMILY + "-" + pivotId,
                    chartAxisLabelFontFamily );
                } else {
                  chartAxisLabelFontFamily = "SansSerif";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISLABELFONTSTYLE ) ) {
                  chartAxisLabelFontStyle = Integer.parseInt(
                    context.getOutputParameter( PivotViewComponent.CHARTAXISLABELFONTSTYLE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSTYLE + "-" + pivotId,
                    new Integer( chartAxisLabelFontStyle ) );
                } else {
                  chartAxisLabelFontStyle = java.awt.Font.PLAIN;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISLABELFONTSIZE ) ) {
                  chartAxisLabelFontSize = Integer.parseInt(
                    context.getOutputParameter( PivotViewComponent.CHARTAXISLABELFONTSIZE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISLABELFONTSIZE + "-" + pivotId,
                    new Integer( chartAxisLabelFontSize ) );
                } else {
                  chartAxisLabelFontSize = 12;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISTICKFONTFAMILY ) ) {
                  chartAxisTickFontFamily =
                    context.getOutputParameter( PivotViewComponent.CHARTAXISTICKFONTFAMILY ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTFAMILY + "-" + pivotId,
                    chartAxisTickFontFamily );
                } else {
                  chartAxisTickFontFamily = "SansSerif";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISTICKFONTSTYLE ) ) {
                  chartAxisTickFontStyle = Integer.parseInt(
                    context.getOutputParameter( PivotViewComponent.CHARTAXISTICKFONTSTYLE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSTYLE + "-" + pivotId,
                    new Integer( chartAxisTickFontStyle ) );
                } else {
                  chartAxisTickFontStyle = java.awt.Font.PLAIN;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISTICKFONTSIZE ) ) {
                  chartAxisTickFontSize = Integer.parseInt(
                    context.getOutputParameter( PivotViewComponent.CHARTAXISTICKFONTSIZE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKFONTSIZE + "-" + pivotId,
                    new Integer( chartAxisTickFontSize ) );
                } else {
                  chartAxisTickFontSize = 12;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTAXISTICKLABELROTATION ) ) {
                  chartAxisTickLabelRotation = Integer.parseInt(
                    context.getOutputParameter( PivotViewComponent.CHARTAXISTICKLABELROTATION ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTAXISTICKLABELROTATION + "-" + pivotId,
                    new Integer( chartAxisTickLabelRotation ) );
                } else {
                  chartAxisTickLabelRotation = 30;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSHOWLEGEND ) ) {
                  chartShowLegend =
                    Boolean.valueOf( context.getOutputParameter( PivotViewComponent.CHARTSHOWLEGEND ).getStringValue() )
                      .booleanValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSHOWLEGEND + "-" + pivotId,
                    new Boolean( chartShowLegend ) );
                } else {
                  chartShowLegend = true;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTLEGENDLOCATION ) ) {
                  chartLegendLocation = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTLEGENDLOCATION ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDLOCATION + "-" + pivotId,
                    new Integer( chartLegendLocation ) );
                } else {
                  chartLegendLocation = 3;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTLEGENDFONTFAMILY ) ) {
                  chartLegendFontFamily =
                    context.getOutputParameter( PivotViewComponent.CHARTLEGENDFONTFAMILY ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTFAMILY + "-" + pivotId,
                    chartLegendFontFamily );
                } else {
                  chartLegendFontFamily = "SansSerif";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTLEGENDFONTSTYLE ) ) {
                  chartLegendFontStyle = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTLEGENDFONTSTYLE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSTYLE + "-" + pivotId,
                    new Integer( chartLegendFontStyle ) );
                } else {
                  chartLegendFontStyle = java.awt.Font.PLAIN;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTLEGENDFONTSIZE ) ) {
                  chartLegendFontSize = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTLEGENDFONTSIZE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTLEGENDFONTSIZE + "-" + pivotId,
                    new Integer( chartLegendFontSize ) );
                } else {
                  chartLegendFontSize = 10;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSHOWSLICER ) ) {
                  chartShowSlicer =
                    Boolean.valueOf( context.getOutputParameter( PivotViewComponent.CHARTSHOWSLICER ).getStringValue() )
                      .booleanValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSHOWSLICER + "-" + pivotId,
                    new Boolean( chartShowSlicer ) );
                } else {
                  chartShowSlicer = true;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSLICERLOCATION ) ) {
                  chartSlicerLocation = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTSLICERLOCATION ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSLICERLOCATION + "-" + pivotId,
                    new Integer( chartSlicerLocation ) );
                } else {
                  chartSlicerLocation = 1;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSLICERALIGNMENT ) ) {
                  chartSlicerAlignment = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTSLICERALIGNMENT ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSLICERALIGNMENT + "-" + pivotId,
                    new Integer( chartSlicerAlignment ) );
                } else {
                  chartSlicerAlignment = 3;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSLICERFONTFAMILY ) ) {
                  chartSlicerFontFamily =
                    context.getOutputParameter( PivotViewComponent.CHARTSLICERFONTFAMILY ).getStringValue();
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTFAMILY + "-" + pivotId,
                    chartSlicerFontFamily );
                } else {
                  chartSlicerFontFamily = "SansSerif";
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSLICERFONTSTYLE ) ) {
                  chartSlicerFontStyle = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTSLICERFONTSTYLE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSTYLE + "-" + pivotId,
                    new Integer( chartSlicerFontStyle ) );
                } else {
                  chartSlicerFontStyle = java.awt.Font.PLAIN;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTSLICERFONTSIZE ) ) {
                  chartSlicerFontSize = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTSLICERFONTSIZE ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTSLICERFONTSIZE + "-" + pivotId,
                    new Integer( chartSlicerFontSize ) );
                } else {
                  chartSlicerFontSize = 12;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTBACKGROUNDR ) ) {
                  chartBackgroundR = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTBACKGROUNDR ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDR + "-" + pivotId,
                    new Integer( chartBackgroundR ) );
                } else {
                  chartBackgroundR = 255;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTBACKGROUNDG ) ) {
                  chartBackgroundG = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTBACKGROUNDG ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDG + "-" + pivotId,
                    new Integer( chartBackgroundG ) );
                } else {
                  chartBackgroundG = 255;
                }
                if ( context.getOutputNames().contains( PivotViewComponent.CHARTBACKGROUNDB ) ) {
                  chartBackgroundB = Integer
                    .parseInt( context.getOutputParameter( PivotViewComponent.CHARTBACKGROUNDB ).getStringValue() );
                  session.setAttribute( "pivot-" + PivotViewComponent.CHARTBACKGROUNDB + "-" + pivotId,
                    new Integer( chartBackgroundB ) );
                } else {
                  chartBackgroundB = 255;
                }

                chartChange = true;

                options = (ArrayList) context.getOutputParameter( PivotViewComponent.OPTIONS ).getValue(); //$NON-NLS-1$
                pivotTitle = context.getOutputParameter( PivotViewComponent.TITLE ).getStringValue(); //$NON-NLS-1$
                actionTitle = context.getActionTitle();
                if ( options != null ) {
                  session.setAttribute( optionsId, options );
                } else {
                  session.removeAttribute( optionsId );
                }
                if ( newAction != null ) {
                  actionReference = AnalysisSaver.NEW_ACTION;
                } else {
                  actionReference = actionPath + "/" + actionName; //$NON-NLS-1$ //$NON-NLS-2$
                }
                session.setAttribute( "pivot-action-" + pivotId, actionReference ); //$NON-NLS-1$
                session.setAttribute( "pivot-" + PivotViewComponent.TITLE + "-" + pivotId, pivotTitle ); //$NON-NLS-1$
                session.setAttribute( "action-" + PivotViewComponent.TITLE + "-" + pivotId, actionTitle ); //$NON-NLS-1$
              }
            } finally {
              if ( context != null ) {
                context.dispose();
              }
            }

          }

          if ( pivotTitle == null ) {
            pivotTitle = Messages.getInstance().getString( "UI.USER_ANALYSIS_UNTITLED_PIVOT_NAME" ); //$NON-NLS-1$
          }

          // Take care of saving this xaction
          if ( saveAction != null ) {
            // Get the current mdx
            String mdx = null;
            String connectString = null;
            if ( _table != null ) {
              OlapModel olapModel = _table.getOlapModel();
              while ( olapModel != null ) {
                if ( olapModel instanceof OlapModelProxy ) {
                  OlapModelProxy proxy = (OlapModelProxy) olapModel;
                  olapModel = proxy.getDelegate();
                }
                if ( olapModel instanceof OlapModelDecorator ) {
                  OlapModelDecorator decorator = (OlapModelDecorator) olapModel;
                  olapModel = decorator.getDelegate();
                }
                if ( olapModel instanceof MdxOlapModel ) {
                  MdxOlapModel model = (MdxOlapModel) olapModel;
                  mdx = model.getCurrentMdx();
                  olapModel = null;
                }
              }
            }

            HashMap props = new HashMap();

            props.put( PivotViewComponent.MODEL, catalogUri );
            props.put( PivotViewComponent.CONNECTION, dataSource );
            props.put( PivotViewComponent.ROLE, role );
            props.put( PivotViewComponent.SHOWGRID, new Boolean( showGrid ) );
            props.put( "query", mdx );
            props.put( PivotViewComponent.OPTIONS, options );
            props.put( PivotViewComponent.TITLE, request.getParameter( "save-title" ) );
            props.put( "actionreference", actionReference );

            if ( _chart != null ) {
              props.put( PivotViewComponent.CHARTTYPE, new Integer( _chart.getChartType() ) );
              props.put( PivotViewComponent.CHARTWIDTH, new Integer( _chart.getChartWidth() ) );
              props.put( PivotViewComponent.CHARTHEIGHT, new Integer( _chart.getChartHeight() ) );
              if ( _chart.isVisible() && chartLocation.equalsIgnoreCase( "none" ) ) {
                chartLocation = "bottom";
              }
              props.put( PivotViewComponent.CHARTLOCATION, _chart.isVisible() ? chartLocation : "none" );
              props.put( PivotViewComponent.CHARTDRILLTHROUGHENABLED, new Boolean( _chart.isDrillThroughEnabled() ) );
              props.put( PivotViewComponent.CHARTTITLE, _chart.getChartTitle() );
              props.put( PivotViewComponent.CHARTTITLEFONTFAMILY, _chart.getFontName() );
              props.put( PivotViewComponent.CHARTTITLEFONTSTYLE, new Integer( _chart.getFontStyle() ) );
              props.put( PivotViewComponent.CHARTTITLEFONTSIZE, new Integer( _chart.getFontSize() ) );
              props.put( PivotViewComponent.CHARTHORIZAXISLABEL, _chart.getHorizAxisLabel() );
              props.put( PivotViewComponent.CHARTVERTAXISLABEL, _chart.getVertAxisLabel() );
              props.put( PivotViewComponent.CHARTAXISLABELFONTFAMILY, _chart.getAxisFontName() );
              props.put( PivotViewComponent.CHARTAXISLABELFONTSTYLE, new Integer( _chart.getAxisFontStyle() ) );
              props.put( PivotViewComponent.CHARTAXISLABELFONTSIZE, new Integer( _chart.getAxisFontSize() ) );
              props.put( PivotViewComponent.CHARTAXISTICKFONTFAMILY, _chart.getAxisTickFontName() );
              props.put( PivotViewComponent.CHARTAXISTICKFONTSTYLE, new Integer( _chart.getAxisTickFontStyle() ) );
              props.put( PivotViewComponent.CHARTAXISTICKFONTSIZE, new Integer( _chart.getAxisTickFontSize() ) );
              props.put( PivotViewComponent.CHARTAXISTICKLABELROTATION, new Integer( _chart.getTickLabelRotate() ) );
              props.put( PivotViewComponent.CHARTSHOWLEGEND, new Boolean( _chart.getShowLegend() ) );
              props.put( PivotViewComponent.CHARTLEGENDLOCATION, new Integer( _chart.getLegendPosition() ) );
              props.put( PivotViewComponent.CHARTLEGENDFONTFAMILY, _chart.getLegendFontName() );
              props.put( PivotViewComponent.CHARTLEGENDFONTSTYLE, new Integer( _chart.getLegendFontStyle() ) );
              props.put( PivotViewComponent.CHARTLEGENDFONTSIZE, new Integer( _chart.getLegendFontSize() ) );
              props.put( PivotViewComponent.CHARTSHOWSLICER, new Boolean( _chart.isShowSlicer() ) );
              props.put( PivotViewComponent.CHARTSLICERLOCATION, new Integer( _chart.getSlicerPosition() ) );
              props.put( PivotViewComponent.CHARTSLICERALIGNMENT, new Integer( _chart.getSlicerAlignment() ) );
              props.put( PivotViewComponent.CHARTSLICERFONTFAMILY, _chart.getSlicerFontName() );
              props.put( PivotViewComponent.CHARTSLICERFONTSTYLE, new Integer( _chart.getSlicerFontStyle() ) );
              props.put( PivotViewComponent.CHARTSLICERFONTSIZE, new Integer( _chart.getSlicerFontSize() ) );
              props.put( PivotViewComponent.CHARTBACKGROUNDR, new Integer( _chart.getBgColorR() ) );
              props.put( PivotViewComponent.CHARTBACKGROUNDG, new Integer( _chart.getBgColorG() ) );
              props.put( PivotViewComponent.CHARTBACKGROUNDB, new Integer( _chart.getBgColorB() ) );
            }

            if ( ( "save".equals( saveAction ) ) || ( "saveAs".equals( saveAction ) ) ) {

              // Overwrite is true, because the saveAs dialog checks for overwrite, and we never
              // would have gotten here unless the user selected to overwrite the file.
              try {
                saveResult = AnalysisSaver.saveAnalysis( userSession, props, request.getParameter( "save-path" ),
                  request.getParameter( "save-file" ), true );
                if ( saveResult ) {
                  saveMessage = Messages.getInstance().getString( "UI.USER_SAVE_SUCCESS" );
                  // only set the session attribute on success, it's the only path that requires it
                  session.setAttribute( "save-message-01", saveMessage ); //$NON-NLS-1$
                } else {
                  saveMessage = Messages.getInstance().getString( "UI.USER_SAVE_FAILED_GENERAL" );
                }
              } catch ( Throwable e ) {
                saveResult = false;
                // TODO: Log error
                saveMessage = e.getMessage();
              }
            }
          }

          if ( query != null ) {
            IDBDatasourceService datasourceService =
              PentahoSystem.getObjectFactory().get( IDBDatasourceService.class, null );
            DataSource currDataSource = null;
            try {
              currDataSource = datasourceService.getDataSource( dataSource );
            } catch ( Throwable t ) {
              t.printStackTrace();
            }
            if ( currDataSource != null ) {
              request.setAttribute( "currDataSource", currDataSource );

              out.write( '\n' );
              //  jp:mondrianQuery
              com.tonbeller.jpivot.tags.MondrianOlapModelTag _jspx_th_jp_005fmondrianQuery_005f0 =
                (com.tonbeller.jpivot.tags.MondrianOlapModelTag)
                        _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                  .get( com.tonbeller.jpivot.tags.MondrianOlapModelTag.class );
              _jspx_th_jp_005fmondrianQuery_005f0.setPageContext( _jspx_page_context );
              _jspx_th_jp_005fmondrianQuery_005f0.setParent( null );
              // /jsp/Pivot.jsp(712,0) name = id type = null reqTime = true required = true fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setId( queryId );
              // /jsp/Pivot.jsp(712,0) name = dataSource type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setDataSource( "${currDataSource}" );
              // /jsp/Pivot.jsp(712,0) name = dynResolver type = null reqTime = true required = false fragment =
              // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setDynResolver( "mondrian.i18n.LocalizingDynamicSchemaProcessor" );
              // /jsp/Pivot.jsp(712,0) name = dynLocale type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setDynLocale( userSession.getLocale().toString() );
              // /jsp/Pivot.jsp(712,0) name = role type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setRole( role );
              // /jsp/Pivot.jsp(712,0) name = catalogUri type = null reqTime = true required = true fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f0.setCatalogUri( catalogUri );
              int _jspx_eval_jp_005fmondrianQuery_005f0 = _jspx_th_jp_005fmondrianQuery_005f0.doStartTag();
              if ( _jspx_eval_jp_005fmondrianQuery_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY ) {
                if ( _jspx_eval_jp_005fmondrianQuery_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE ) {
                  out = _jspx_page_context.pushBody();
                  _jspx_th_jp_005fmondrianQuery_005f0.setBodyContent( (javax.servlet.jsp.tagext.BodyContent) out );
                  _jspx_th_jp_005fmondrianQuery_005f0.doInitBody();
                }
                do {
                  out.write( '\n' );
                  out.write( ' ' );
                  out.write( ' ' );
                  out.print( query );
                  out.write( '\n' );
                  int evalDoAfterBody = _jspx_th_jp_005fmondrianQuery_005f0.doAfterBody();
                  if ( evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN ) {
                    break;
                  }
                } while ( true );
                if ( _jspx_eval_jp_005fmondrianQuery_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE ) {
                  out = _jspx_page_context.popBody();
                }
              }
              if ( _jspx_th_jp_005fmondrianQuery_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                  .reuse( _jspx_th_jp_005fmondrianQuery_005f0 );
                return;
              }
              _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                .reuse( _jspx_th_jp_005fmondrianQuery_005f0 );
              out.write( '\n' );

            } else {

              out.write( '\n' );
              //  jp:mondrianQuery
              com.tonbeller.jpivot.tags.MondrianOlapModelTag _jspx_th_jp_005fmondrianQuery_005f1 =
                (com.tonbeller.jpivot.tags.MondrianOlapModelTag)
                        _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                  .get( com.tonbeller.jpivot.tags.MondrianOlapModelTag.class );
              _jspx_th_jp_005fmondrianQuery_005f1.setPageContext( _jspx_page_context );
              _jspx_th_jp_005fmondrianQuery_005f1.setParent( null );
              // /jsp/Pivot.jsp(721,0) name = id type = null reqTime = true required = true fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setId( queryId );
              // /jsp/Pivot.jsp(721,0) name = dataSource type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setDataSource( dataSource );
              // /jsp/Pivot.jsp(721,0) name = dynResolver type = null reqTime = true required = false fragment =
              // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setDynResolver( "mondrian.i18n.LocalizingDynamicSchemaProcessor" );
              // /jsp/Pivot.jsp(721,0) name = dynLocale type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setDynLocale( userSession.getLocale().toString() );
              // /jsp/Pivot.jsp(721,0) name = role type = null reqTime = true required = false fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setRole( role );
              // /jsp/Pivot.jsp(721,0) name = catalogUri type = null reqTime = true required = true fragment = false
              // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_jp_005fmondrianQuery_005f1.setCatalogUri( catalogUri );
              int _jspx_eval_jp_005fmondrianQuery_005f1 = _jspx_th_jp_005fmondrianQuery_005f1.doStartTag();
              if ( _jspx_eval_jp_005fmondrianQuery_005f1 != javax.servlet.jsp.tagext.Tag.SKIP_BODY ) {
                if ( _jspx_eval_jp_005fmondrianQuery_005f1 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE ) {
                  out = _jspx_page_context.pushBody();
                  _jspx_th_jp_005fmondrianQuery_005f1.setBodyContent( (javax.servlet.jsp.tagext.BodyContent) out );
                  _jspx_th_jp_005fmondrianQuery_005f1.doInitBody();
                }
                do {
                  out.write( '\n' );
                  out.write( ' ' );
                  out.write( ' ' );
                  out.print( query );
                  out.write( '\n' );
                  int evalDoAfterBody = _jspx_th_jp_005fmondrianQuery_005f1.doAfterBody();
                  if ( evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN ) {
                    break;
                  }
                } while ( true );
                if ( _jspx_eval_jp_005fmondrianQuery_005f1 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE ) {
                  out = _jspx_page_context.popBody();
                }
              }
              if ( _jspx_th_jp_005fmondrianQuery_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                  .reuse( _jspx_th_jp_005fmondrianQuery_005f1 );
                return;
              }
              _005fjspx_005ftagPool_005fjp_005fmondrianQuery_0026_005frole_005fid_005fdynResolver_005fdynLocale_005fdataSource_005fcatalogUri
                .reuse( _jspx_th_jp_005fmondrianQuery_005f1 );
              out.write( '\n' );

            }
          }

          _olapModel = (OlapModel) session.getAttribute( queryId );
          session.setAttribute( titleId, pivotTitle );

          out.write( "<html>\n" );
          out.write( "<head>\n" );
          out.write( "<title>" );
          out.print( Messages.getInstance().getString( "UI.USER_ANALYSIS" ) );
          out.write( "</title>\n" );
          out.write( "<meta http-equiv=\"Content-Type\"\n" );
          out.write( "  content=\"text/html; charset=" );
          out.print( LocaleHelper.getSystemEncoding() );
          out.write( "\">\n" );
          out.write(
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../content/jpivot/jpivot/table/mdxtable.css\">\n" );
          out.write(
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../content/jpivot/jpivot/navi/mdxnavi.css\">\n" );
          out.write( "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../content/jpivot/wcf/form/xform.css\">\n" );
          out.write(
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../content/jpivot/wcf/table/xtable.css\">\n" );
          out.write( "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../content/jpivot/wcf/tree/xtree.css\">\n" );
          out.write( "<link href=\"/pentaho-style/styles-new.css\" rel=\"stylesheet\"\n" );
          out.write( "  type=\"text/css\" />\n" );
          out.write( "<link rel=\"shortcut icon\" href=\"/pentaho-style/favicon.ico\" />\n" );
          out.write( "\n" );
          out.write(
            "<!-- ****************************************************************************************** -->\n" );
          out.write(
            "<!-- ****************        JAVASCRIPT FOR SAVE DIALOGS              ************************* -->\n" );
          out.write(
            "<!-- ****************************************************************************************** -->\n" );
          out.write( "\n" );
          out.write(
            "<link href=\"../../content/jpivot/adhoc/styles/repositoryBrowserStyles.css\" rel=\"stylesheet\" "
                    + "type=\"text/css\" />\n" );
          out.write(
            "<link href=\"../../content/jpivot/adhoc/styles/jpivot.css\" rel=\"stylesheet\" type=\"text/css\" />\n" );
          out.write( "<!--[if IE]>\n" );
          out.write(
            "      <link href=\"../../content/jpivot/adhoc/styles/jpivotIE6.css\" rel=\"stylesheet\" "
                    + "type=\"text/css\"/>  \n" );
          out.write( "    <![endif]-->\n" );
          out.write( "\n" );
          out.write( "\n" );
          out.write( "<script src=\"../../content/jpivot/wcf/scroller.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/ajaxslt0.7/xmltoken.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/ajaxslt0.7/util.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/ajaxslt0.7/dom.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/ajaxslt0.7/xpath.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/ajaxslt0.7/xslt.js\" type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write( "<script src=\"../../js/pentaho-ajax.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script src=\"../../js/utils.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script type=\"text/javascript\">\n" );
          out.write( "    djConfig = { isDebug: false};\n" );
          out.write( "  </script>\n" );
          out.write( "\n" );
          out.write( "<script src=\"../../js/dojo.js\" type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          // TODO: Not sure how to deal with this
          out.write( "<script type=\"text/javascript\">\n" );
          out.write( "    dojo.registerModulePath(\"adhoc\", \"../adhoc/js\");\n" );
          out.write( "  </script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/messages/Messages.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write( "<script type=\"text/javascript\">\n" );
          out.write( "    Messages.addBundle(\"adhoc.ui.messages\", \"message_strings\");\n" );
          out.write( "  </script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/MessageCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/server/WebServiceProxy.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/util/StringUtils.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/util/Status.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/util/XmlUtil.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/model/SolutionRepository.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/UIUtil.js\" type=\"text/javascript\"></script>\n" );
          out.write( "<script type=\"text/javascript\">\n" );
          out.write( "    UIUtil.setImageFolderPath( \"../../content/jpivot/adhoc/images/\" );\n" );
          out.write( "  </script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/HTMLCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/Logger.js\" type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/BusyCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/PickListCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/ListCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/ComboCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/ButtonCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/common/ui/MessageCtrl.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write(
            "<script src=\"../../content/jpivot/adhoc/js/ui/RepositoryBrowser.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write(
            "<script src=\"../../content/jpivot/jpivot/PivotRepositoryBrowserController.js\" "
                    + "type=\"text/javascript\"></script>\n" );
          out.write( "\n" );
          out.write( "<script type=\"text/javascript\"><!--\n" );
          out.write( "    \n" );
          out.write( "    var controller = null;\n" );
          out.write( "    var newActionName = null;\n" );
          out.write( "    var newSolution = null;\n" );
          out.write( "    var newActionPath = null;\n" );
          out.write( "    \n" );
          out.write( "    function cursor_wait() {\n" );
          out.write( "      document.body.style.cursor = 'wait';\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "    function cursor_clear() {\n" );
          out.write( "      document.body.style.cursor = 'default';\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "    //\n" );
          out.write( "    // This method creates a temporary form in the dom,\n" );
          out.write( "    // adds the inputs we want to post back to ourselves,\n" );
          out.write( "    // and then posts the form. Once the form is posted,\n" );
          out.write( "    // we remove the temporary form from the DOM.\n" );
          out.write( "    //\n" );
          out.write( "    function handle_puc_save(path, name, overwrite) {\n" );
          out.write( "        var r = controller.saveAs(name, name, \"\", path, overwrite);\n" );
          out.write( "        if(r) {\n" );
          out.write( "            return path + \"/\" + name + \".xjpivot\";\n" );
          out.write( "        }\n" );
          out.write( "    }\n" );
          out.write( "    var gCtrlr = {};\n" );
          out.write( "    gCtrlr.repositoryBrowserController = {};\n" );
          out.write( "    gCtrlr.repositoryBrowserController.getPossibleFileExtensions = function() {\n" );
          out.write( "       return ['xjpivot'];\n" );
          out.write( "    };\n" );
          out.write(
            "    function doSaveAsPost(postActionName, postActionSolution, postActionPath, postActionTitle) {\n" );
          out.write( "      var postForm = document.createElement(\"form\");\n" );
          out.write( "      postForm.method=\"post\" ;\n" );
          out.write( "      postForm.action = '" );
          out.print( pageName );
          out.write( "';\n" );
          out.write( "      var anInput;\n" );
          out.write( "      // save-action\n" );
          out.write( "      anInput = document.createElement(\"input\");\n" );
          out.write( "      anInput.setAttribute(\"name\", \"save-action\");\n" );
          out.write( "      anInput.setAttribute(\"value\", \"saveAs\");\n" );
          out.write( "      postForm.appendChild(anInput);\n" );
          out.write( "      // save-path\n" );
          out.write( "      anInput = document.createElement(\"input\");\n" );
          out.write( "      anInput.setAttribute(\"name\", \"save-path\");\n" );
          out.write( "      anInput.setAttribute(\"value\", postActionPath );\n" );
          out.write( "      postForm.appendChild(anInput);\n" );
          out.write( "      // save-file\n" );
          out.write( "      anInput = document.createElement(\"input\");\n" );
          out.write( "      anInput.setAttribute(\"name\", \"save-file\");\n" );
          out.write( "      anInput.setAttribute(\"value\",  postActionName);\n" );
          out.write( "      postForm.appendChild(anInput);\n" );
          out.write( "      // save-title\n" );
          out.write( "      anInput = document.createElement(\"input\");\n" );
          out.write( "      anInput.setAttribute(\"name\", \"save-title\");\n" );
          out.write( "      anInput.setAttribute(\"value\",  postActionTitle);\n" );
          out.write( "      postForm.appendChild(anInput);\n" );
          out.write( "      // pivotId\n" );
          out.write( "      anInput = document.createElement(\"input\");\n" );
          out.write( "      anInput.setAttribute(\"name\", \"pivotId\");\n" );
          out.write( "      anInput.setAttribute(\"value\",  \"" );
          out.print( Encode.forJavaScript( pivotId ) );
          out.write( "\");\n" );
          out.write( "      postForm.appendChild(anInput);\n" );
          out.write( "      \n" );
          out.write( "      document.body.appendChild(postForm); // Add the form into the document...\n" );
          out.write( "      postForm.submit(); // Post to ourselves...\n" );
          out.write( "      document.body.removeChild(postForm); // Remove the temporary form from the DOM.\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "    function load(){\n" );
          out.write( "      xScrollerScroll(); \n" );
          out.write( "      cursor_wait();\n" );
          out.write( "      controller = new PivotRepositoryBrowserController();\n" );
          out.write( "      controller.setOnAfterSaveCallback( function()\n" );
          out.write( "      {\n" );
          out.write( "        var nActionName = controller.getActionName();\n" );
          out.write( "        var nSolution = controller.getSolution();\n" );
          out.write( "        var nActionPath = controller.getActionPath();\n" );
          out.write(
            "        var nActionTitle = controller.getActionTitle()!=null?controller.getActionTitle():controller"
                    + ".getActionName();\n" );
          out.write( "        doSaveAsPost(nActionName, nSolution, nActionPath, nActionTitle);\n" );
          out.write( "      });\n" );
          out.write( "      cursor_clear();\n" );
          out.write( "      if (saveMessage != null && \"\" != saveMessage) {\n" );
          out.write( "        if (window.top != null && window.top.mantle_initialized) {\n" );
          out.write( "        window.top.mantle_refreshRepository();\n" );
          out.write( "          window.top.mantle_showMessage(\"Info\", saveMessage);\n" );
          out.write( "        } else {\n" );
          out.write( "          alert(saveMessage);\n" );
          out.write( "        }\n" );
          out.write( "      }\n" );
          out.write( "      \n" );
          out.write(
            "//      if (window.top != null && window.top.mantle_initialized) { // Uncomment this line and the close "
                    + "brace to enable these buttons when in window only mode\n" );
          out.write( "        var tmpSaveButton = document.getElementById('folder-down');\n" );
          out.write( "        var tmpSaveAsButton = document.getElementById('folder-up');\n" );
          out.write( "        tmpSaveButton.parentNode.parentNode.removeChild(tmpSaveButton.parentNode);\n" );
          out.write( "        tmpSaveAsButton.parentNode.parentNode.removeChild(tmpSaveAsButton.parentNode);\n" );
          out.write( "//      }  // Uncomment this if above if is uncommented\n" );
          out.write( "\n" );
          //       out.write("      window.pivot_initialized = true;\n");
          out.write( "       " );
          if ( "true".equalsIgnoreCase( PentahoSystem.getSystemSetting( "kiosk-mode", "false" ) ) ) {
            out.write( "\n" );
            out.write( "               try {\n" );
            out.write( "                 var mdxEditTxtBx = document.getElementById('" );
            out.print( Encode.forJavaScript( mdxEditId ) );
            out.write( ".9');\n" );
            out.write( "                 if (mdxEditTxtBx) {\n" );
            out.write( "                   mdxEditTxtBx.readOnly = true;\n" );
            out.write( "                 }\n" );
            out.write( "               } catch (ignored) {\n" );
            out.write( "               }\n" );
            out.write( "       " );
          }
          out.write( "\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "    function save() {\n" );
          out.write( "      cursor_wait();\n" );
          out.write( "    " );

          ActionInfo actionInfo = ActionInfo.parseActionString( actionReference );
          if ( actionInfo != null ) {

            out.write( "\n" );
            out.write( "      var nActionName = \"" );
            out.print( Encode.forJavaScript( actionInfo.getActionName() ) );
            out.write( "\";\n" );
            out.write( "      var nSolution = \"" );
            out.print( Encode.forJavaScript( actionInfo.getSolutionName() ) );
            out.write( "\";\n" );
            out.write( "      var nActionPath = \"" );
            out.print( Encode.forJavaScript( actionInfo.getPath() ) );
            out.write( "\";\n" );
            out.write( "      var nActionTitle = \"" );
            out.print( Encode.forJavaScript( actionTitle ) );
            out.write( "\";\n" );
            out.write( "      doSaveAsPost(nActionName, nSolution, nActionPath, nActionTitle);\n" );
            out.write( "    " );
          }
          out.write( "\n" );
          out.write( "      cursor_clear();\n" );
          out.write( "    }\n" );
          out.write( "\n" );
          out.write( "    function saveAs() {\n" );
          out.write( "      controller.save();\n" );
          out.write( "    }\n" );
          out.write( "\n" );
          out.write( "  --></script>\n" );
          out.write( "\n" );
          out.write( '\n' );
          out.write( '\n' );
          out.write( "\n" );
          out.write( "\n" );
          out.write( "\n" );
          out.write( "<script type=\"text/javascript\">\n" );
          out.write( "\n" );
          out.write( "    \n" );
          out.write( "    function doSubscribed() {\n" );
          out.write( "        var submitUrl = '';\n" );
          out.write( "      var action= document.getElementById('subscription-action').value;\n" );
          out.write( "      var target='';\n" );
          out.write( "        \n" );
          out.write( "      if( action == 'load' ) {\n" );
          out.write( "        submitUrl += '" );
          out.print( pageName );
          out.write( "?subscribe=load&query=SampleData';\n" );
          out.write( "      }\n" );
          out.write( "      else \n" );
          out.write( "      if( action == 'delete' ) {\n" );
          out.write( "        submitUrl += '" );
          out.print( pageName );
          out.write( "?subscribe=delete';\n" );
          out.write( "      }\n" );
          out.write( "\n" );
          out.write( "      var name= document.getElementById('subscription').value;\n" );
          out.write( "      submitUrl += '&subscribe-name='+encodeURIComponent(name);\n" );
          out.write( "          document.location.href=submitUrl;\n" );
          out.write( "        return false;\n" );
          out.write( "      }\n" );
          out.write( "\n" );
          out.write( "    /***********************************************\n" );
          out.write( "    * Ajax Includes script-  Dynamic Drive DHTML code library (www.dynamicdrive.com)\n" );
          out.write( "    * This notice MUST stay intact for legal use\n" );
          out.write( "    * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code\n" );
          out.write( "    ***********************************************/\n" );
          out.write( "\n" );
          out.write( "    //To include a page, invoke ajaxinclude(\"afile.htm\") in the BODY of page\n" );
          out.write( "    //Included file MUST be from the same domain as the page displaying it.\n" );
          out.write( "    \n" );
          out.write( "    var rootdomain=\"http://\"+window.location.hostname\n" );
          out.write( "    \n" );
          out.write( "    function ajaxinclude(url) {\n" );
          out.write( "      var page_request = false\n" );
          out.write( "      if (window.XMLHttpRequest) // if Mozilla, Safari etc\n" );
          out.write( "        page_request = new XMLHttpRequest()\n" );
          out.write( "      else if (window.ActiveXObject){ // if IE\n" );
          out.write( "        try {\n" );
          out.write( "          page_request = new ActiveXObject(\"Msxml2.XMLHTTP\")\n" );
          out.write( "        } catch (e){\n" );
          out.write( "          try{\n" );
          out.write( "            page_request = new ActiveXObject(\"Microsoft.XMLHTTP\")\n" );
          out.write( "          }catch (e){}\n" );
          out.write( "        }\n" );
          out.write( "      }\n" );
          out.write( "      else\n" );
          out.write( "        return false\n" );
          out.write( "      page_request.open('GET', url, false) //get page synchronously \n" );
          out.write( "      page_request.send(null)\n" );
          out.write( "      writecontent(page_request)\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "    function writecontent(page_request){\n" );
          out.write( "      if (window.location.href.indexOf(\"http\")==-1 || page_request.status==200)\n" );
          out.write( "        document.write(page_request.responseText)\n" );
          out.write( "    }\n" );
          out.write( "    \n" );
          out.write( "  </script>\n" );
          out.write( "\n" );
          out.write( '\n' );
          out.write( '\n' );
          out.write( "\n" );
          out.write( "\n" );
          out.write( "</head>\n" );
          out.write( "<body class=\"body_dialog01\" dir=\"" );
          out.print( LocaleHelper.getTextDirection() );
          out.write( "\" onload=\"javascript:load();\">\n" );
          out.write( "<div class=\"dialog01_content\">\n" );

          if ( subscribeResult != null ) {
            out.println( Encode.forHtml( subscribeResult ) );
            out.println( "<br/>" ); //$NON-NLS-1$
          }

          out.write( "\n" );
          out.write( "\n" );
          out.write( "<table border=\"0\" width=\"100%\" class=\"content_container2\"\n" );
          out.write( "  cellpadding=\"0\" cellspacing=\"0\">\n" );
          out.write( "  <tr>\n" );
          out.write( "    <td class=\"content_body\">\n" );
          out.write( "\n" );
          out.write( "    <form action=\"" );
          out.print( pageName );
          out.write( "\" method=\"post\">\n" );
          out.write( "      " );
          out.write( "\n" );
          out.write( "      <input type=\"hidden\" name=\"pivotId\" value=\"" );
          out.print( Encode.forHtmlAttribute( pivotId ) );
          out.write( "\">\n" );
          out.write( "      " );
          if ( _olapModel == null ) {
            out.write( "\n" );
            out.write( "        " );
            out.print( Messages.getInstance().getString( "UI.USER_ANALYSIS_INVALID_PAGE" ) );
            out.write( " \n" );
            out.write( "      " );
          } else {
            out.write( "\n" );
            out.write( "      " );
            out.write( " \n" );
            out.write( "      " );
            if ( _jspx_meth_wcf_005fscroller_005f0( _jspx_page_context ) ) {
              return;
            }
            out.write( "\n" );
            out.write( "      " );
            //  jp:table
            com.tonbeller.jpivot.table.TableComponentTag _jspx_th_jp_005ftable_005f0 =
              (com.tonbeller.jpivot.table.TableComponentTag)
                      _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody
                .get( com.tonbeller.jpivot.table.TableComponentTag.class );
            _jspx_th_jp_005ftable_005f0.setPageContext( _jspx_page_context );
            _jspx_th_jp_005ftable_005f0.setParent( null );
            // /jsp/Pivot.jsp(1020,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005ftable_005f0.setId( tableId );
            // /jsp/Pivot.jsp(1020,6) name = query type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005ftable_005f0.setQuery( queryId );
            int _jspx_eval_jp_005ftable_005f0 = _jspx_th_jp_005ftable_005f0.doStartTag();
            if ( _jspx_th_jp_005ftable_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody
                .reuse( _jspx_th_jp_005ftable_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fjp_005ftable_0026_005fquery_005fid_005fnobody
              .reuse( _jspx_th_jp_005ftable_005f0 );
            out.write( "\n" );
            out.write( "      " );
            //  jp:navigator
            com.tonbeller.jpivot.navigator.NavigatorTag _jspx_th_jp_005fnavigator_005f0 =
              (com.tonbeller.jpivot.navigator.NavigatorTag)
                      _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody
                .get( com.tonbeller.jpivot.navigator.NavigatorTag.class );
            _jspx_th_jp_005fnavigator_005f0.setPageContext( _jspx_page_context );
            _jspx_th_jp_005fnavigator_005f0.setParent( null );
            // /jsp/Pivot.jsp(1021,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fnavigator_005f0.setId( naviId );
            // /jsp/Pivot.jsp(1021,6) name = query type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fnavigator_005f0.setQuery( queryId );
            // /jsp/Pivot.jsp(1021,6) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fnavigator_005f0.setVisible( false );
            int _jspx_eval_jp_005fnavigator_005f0 = _jspx_th_jp_005fnavigator_005f0.doStartTag();
            if ( _jspx_th_jp_005fnavigator_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody
                .reuse( _jspx_th_jp_005fnavigator_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fjp_005fnavigator_0026_005fvisible_005fquery_005fid_005fnobody
              .reuse( _jspx_th_jp_005fnavigator_005f0 );
            out.write( " \n" );
            out.write( "      " );

            String wrappedQueryId = "#{" + queryId + "}";
            String wrappedTableId = "#{" + tableId + "}";
            String wrappedPrintId = "#{" + printId + "}";
            String chartControllerURL = "?pivotId=" + pivotId;

            out.write( " \n" );
            out.write( "      " );
            //  wcf:form
            com.tonbeller.wcf.form.FormComponentTag _jspx_th_wcf_005fform_005f0 =
              (com.tonbeller.wcf.form.FormComponentTag)
                      _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .get( com.tonbeller.wcf.form.FormComponentTag.class );
            _jspx_th_wcf_005fform_005f0.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005fform_005f0.setParent( null );
            // /jsp/Pivot.jsp(1028,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f0.setId( mdxEditId );
            // /jsp/Pivot.jsp(1028,6) name = xmlUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f0.setXmlUri( "/WEB-INF/jpivot/table/mdxedit.xml" );
            // /jsp/Pivot.jsp(1028,6) name = model type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f0.setModel( wrappedQueryId );
            // /jsp/Pivot.jsp(1028,6) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f0.setVisible( false );
            int _jspx_eval_wcf_005fform_005f0 = _jspx_th_wcf_005fform_005f0.doStartTag();
            if ( _jspx_th_wcf_005fform_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .reuse( _jspx_th_wcf_005fform_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
              .reuse( _jspx_th_wcf_005fform_005f0 );
            out.write( "\n" );
            out.write( "      " );
            //  wcf:form
            com.tonbeller.wcf.form.FormComponentTag _jspx_th_wcf_005fform_005f1 =
              (com.tonbeller.wcf.form.FormComponentTag)
                      _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .get( com.tonbeller.wcf.form.FormComponentTag.class );
            _jspx_th_wcf_005fform_005f1.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005fform_005f1.setParent( null );
            // /jsp/Pivot.jsp(1030,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f1.setId( sortFormId );
            // /jsp/Pivot.jsp(1030,6) name = xmlUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f1.setXmlUri( "/WEB-INF/jpivot/table/sortform.xml" );
            // /jsp/Pivot.jsp(1030,6) name = model type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f1.setModel( wrappedTableId );
            // /jsp/Pivot.jsp(1030,6) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f1.setVisible( false );
            int _jspx_eval_wcf_005fform_005f1 = _jspx_th_wcf_005fform_005f1.doStartTag();
            if ( _jspx_th_wcf_005fform_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .reuse( _jspx_th_wcf_005fform_005f1 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
              .reuse( _jspx_th_wcf_005fform_005f1 );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "      " );
            //  jp:print
            com.tonbeller.jpivot.print.PrintComponentTag _jspx_th_jp_005fprint_005f0 =
              (com.tonbeller.jpivot.print.PrintComponentTag)
                      _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody
                .get( com.tonbeller.jpivot.print.PrintComponentTag.class );
            _jspx_th_jp_005fprint_005f0.setPageContext( _jspx_page_context );
            _jspx_th_jp_005fprint_005f0.setParent( null );
            // /jsp/Pivot.jsp(1033,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fprint_005f0.setId( printId );
            int _jspx_eval_jp_005fprint_005f0 = _jspx_th_jp_005fprint_005f0.doStartTag();
            if ( _jspx_th_jp_005fprint_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody.reuse( _jspx_th_jp_005fprint_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fjp_005fprint_0026_005fid_005fnobody.reuse( _jspx_th_jp_005fprint_005f0 );
            out.write( "\n" );
            out.write( "      " );
            //  wcf:form
            com.tonbeller.wcf.form.FormComponentTag _jspx_th_wcf_005fform_005f2 =
              (com.tonbeller.wcf.form.FormComponentTag)
                      _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .get( com.tonbeller.wcf.form.FormComponentTag.class );
            _jspx_th_wcf_005fform_005f2.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005fform_005f2.setParent( null );
            // /jsp/Pivot.jsp(1034,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f2.setId( printFormId );
            // /jsp/Pivot.jsp(1034,6) name = xmlUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f2.setXmlUri( "/WEB-INF/jpivot/print/printpropertiesform.xml" );
            // /jsp/Pivot.jsp(1034,6) name = model type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f2.setModel( wrappedPrintId );
            // /jsp/Pivot.jsp(1034,6) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f2.setVisible( false );
            int _jspx_eval_wcf_005fform_005f2 = _jspx_th_wcf_005fform_005f2.doStartTag();
            if ( _jspx_th_wcf_005fform_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .reuse( _jspx_th_wcf_005fform_005f2 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
              .reuse( _jspx_th_wcf_005fform_005f2 );
            out.write( "\n" );
            out.write( "      " );
            //  jp:chart
            com.tonbeller.jpivot.chart.ChartComponentTag _jspx_th_jp_005fchart_005f0 =
              (com.tonbeller.jpivot.chart.ChartComponentTag)
                      _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody
                .get( com.tonbeller.jpivot.chart.ChartComponentTag.class );
            _jspx_th_jp_005fchart_005f0.setPageContext( _jspx_page_context );
            _jspx_th_jp_005fchart_005f0.setParent( null );
            // /jsp/Pivot.jsp(1037,6) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fchart_005f0.setId( chartId );
            // /jsp/Pivot.jsp(1037,6) name = query type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fchart_005f0.setQuery( wrappedQueryId );
            // /jsp/Pivot.jsp(1037,6) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fchart_005f0.setVisible( false );
            // /jsp/Pivot.jsp(1037,6) name = controllerURL type = null reqTime = true required = false fragment =
            // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_jp_005fchart_005f0.setControllerURL( chartControllerURL );
            int _jspx_eval_jp_005fchart_005f0 = _jspx_th_jp_005fchart_005f0.doStartTag();
            if ( _jspx_th_jp_005fchart_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody
                .reuse( _jspx_th_jp_005fchart_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fjp_005fchart_0026_005fvisible_005fquery_005fid_005fcontrollerURL_005fnobody
              .reuse( _jspx_th_jp_005fchart_005f0 );
            out.write( ' ' );


            // we've reloaded the following session objects
            _table = (TableComponent) session.getAttribute( tableId );
            _mdxEdit = (FormComponent) session.getAttribute( mdxEditId );
            _chart = (ChartComponent) session.getAttribute( chartId );

            if ( chartChange ) {
              _chart.setChartType( chartType );
              _chart.setVisible( ( chartLocation != null ) && !chartLocation.equals( "none" ) );
              if ( chartWidth > 0 ) {
                _chart.setChartWidth( chartWidth );
              } else {
                _chart.setChartWidth( 500 );    // 500 is the default that the ChartCompoent uses
              }
              if ( chartHeight > 0 ) {
                _chart.setChartHeight( chartHeight );
              } else {
                _chart.setChartHeight( 300 ); // 300 is the default that the ChartComponent uses
              }
              _chart.setChartTitle( chartTitle );
              _chart.setDrillThroughEnabled( chartDrillThroughEnabled );
              _chart.setFontName( chartTitleFontFamily );
              _chart.setFontStyle( chartTitleFontStyle );
              _chart.setFontSize( chartTitleFontSize );
              _chart.setHorizAxisLabel( chartHorizAxisLabel );
              _chart.setVertAxisLabel( chartVertAxisLabel );
              _chart.setAxisFontName( chartAxisLabelFontFamily );
              _chart.setAxisFontStyle( chartAxisLabelFontStyle );
              _chart.setAxisFontSize( chartAxisLabelFontSize );
              _chart.setAxisTickFontName( chartAxisTickFontFamily );
              _chart.setAxisTickFontStyle( chartAxisTickFontStyle );
              _chart.setAxisTickFontSize( chartAxisTickFontSize );
              _chart.setTickLabelRotate( chartAxisTickLabelRotation );
              _chart.setShowLegend( chartShowLegend );
              _chart.setLegendPosition( chartLegendLocation );
              _chart.setLegendFontName( chartLegendFontFamily );
              _chart.setLegendFontStyle( chartLegendFontStyle );
              _chart.setLegendFontSize( chartLegendFontSize );
              _chart.setShowSlicer( chartShowSlicer );
              _chart.setSlicerPosition( chartSlicerLocation );
              _chart.setSlicerAlignment( chartSlicerAlignment );
              _chart.setSlicerFontName( chartSlicerFontFamily );
              _chart.setSlicerFontStyle( chartSlicerFontStyle );
              _chart.setSlicerFontSize( chartSlicerFontSize );
              _chart.setBgColorR( chartBackgroundR );
              _chart.setBgColorG( chartBackgroundG );
              _chart.setBgColorB( chartBackgroundB );
            }

            String wrappedChartId = "#{" + chartId + "}";

            out.write( " \n" );
            out.write( "    " );
            //  wcf:form
            com.tonbeller.wcf.form.FormComponentTag _jspx_th_wcf_005fform_005f3 =
              (com.tonbeller.wcf.form.FormComponentTag)
                      _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .get( com.tonbeller.wcf.form.FormComponentTag.class );
            _jspx_th_wcf_005fform_005f3.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005fform_005f3.setParent( null );
            // /jsp/Pivot.jsp(1090,4) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f3.setId( chartFormId );
            // /jsp/Pivot.jsp(1090,4) name = xmlUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f3.setXmlUri( "/WEB-INF/jpivot/chart/chartpropertiesform.xml" );
            // /jsp/Pivot.jsp(1090,4) name = model type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f3.setModel( wrappedChartId );
            // /jsp/Pivot.jsp(1090,4) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005fform_005f3.setVisible( false );
            int _jspx_eval_wcf_005fform_005f3 = _jspx_th_wcf_005fform_005f3.doStartTag();
            if ( _jspx_th_wcf_005fform_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
                .reuse( _jspx_th_wcf_005fform_005f3 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005fform_0026_005fxmlUri_005fvisible_005fmodel_005fid_005fnobody
              .reuse( _jspx_th_wcf_005fform_005f3 );
            out.write( "\n" );
            out.write( "    " );
            //  wcf:table
            com.tonbeller.wcf.table.TableComponentTag _jspx_th_wcf_005ftable_005f0 =
              (com.tonbeller.wcf.table.TableComponentTag)
                      _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody
                .get( com.tonbeller.wcf.table.TableComponentTag.class );
            _jspx_th_wcf_005ftable_005f0.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005ftable_005f0.setParent( null );
            // /jsp/Pivot.jsp(1093,4) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftable_005f0.setId( drillThroughTableId );
            // /jsp/Pivot.jsp(1093,4) name = visible type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftable_005f0.setVisible( false );
            // /jsp/Pivot.jsp(1093,4) name = selmode type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftable_005f0.setSelmode( "none" );
            // /jsp/Pivot.jsp(1093,4) name = editable type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftable_005f0.setEditable( true );
            int _jspx_eval_wcf_005ftable_005f0 = _jspx_th_wcf_005ftable_005f0.doStartTag();
            if ( _jspx_th_wcf_005ftable_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody
                .reuse( _jspx_th_wcf_005ftable_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005ftable_0026_005fvisible_005fselmode_005fid_005feditable_005fnobody
              .reuse( _jspx_th_wcf_005ftable_005f0 );
            out.write( "\n" );
            out.write( "      \n" );

            // define a toolbar

            if ( options != null ) {
              session.removeAttribute( toolbarId ); //$NON-NLS-1$
            }
            String wrappedNaviVisible = "#{" + naviId + ".visible}";
            String wrappedMdxEditVisible = "#{" + mdxEditId + ".visible}";
            String wrappedSortFormVisible = "#{" + sortFormId + ".visible}";
            String wrappedTableLevelStyle = "#{" + tableId + ".extensions.axisStyle.levelStyle}";
            String wrappedTableHideSpans = "#{" + tableId + ".extensions.axisStyle.hideSpans}";
            String wrappedTableShowProperties =
              "#{" + tableId + ".rowAxisBuilder.axisConfig.propertyConfig.showProperties}";
            String wrappedTableNonEmptyButtonPressed = "#{" + tableId + ".extensions.nonEmpty.buttonPressed}";
            String wrappedTableSwapAxesButtonPressed = "#{" + tableId + ".extensions.swapAxes.buttonPressed}";
            String wrappedTableDrillMemberEnabled = "#{" + tableId + ".extensions.drillMember.enabled}";
            String wrappedTableDrillPositionEnabled = "#{" + tableId + ".extensions.drillPosition.enabled}";
            String wrappedTableDrillReplaceEnabled = "#{" + tableId + ".extensions.drillReplace.enabled}";
            String wrappedTableDrillThroughEnabled = "#{" + tableId + ".extensions.drillThrough.enabled}";
            String wrappedChartVisible = "#{" + chartId + ".visible}";
            String wrappedChartFormVisible = "#{" + chartFormId + ".visible}";
            String wrappedPrintFormVisible = "#{" + printFormId + ".visible}";
            String printExcel = "./Print?cube=" + pivotId + "&type=0";
            String printPdf = "./Print?cube=" + pivotId + "&type=1";


            out.write( ' ' );
            //  wcf:toolbar
            com.tonbeller.wcf.toolbar.ToolBarTag _jspx_th_wcf_005ftoolbar_005f0 =
              (com.tonbeller.wcf.toolbar.ToolBarTag) _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle
                .get( com.tonbeller.wcf.toolbar.ToolBarTag.class );
            _jspx_th_wcf_005ftoolbar_005f0.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005ftoolbar_005f0.setParent( null );
            // /jsp/Pivot.jsp(1121,4) name = id type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftoolbar_005f0.setId( toolbarId );
            // /jsp/Pivot.jsp(1121,4) name = bundle type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005ftoolbar_005f0.setBundle( "com.tonbeller.jpivot.toolbar.resources" );
            int _jspx_eval_wcf_005ftoolbar_005f0 = _jspx_th_wcf_005ftoolbar_005f0.doStartTag();
            if ( _jspx_eval_wcf_005ftoolbar_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY ) {
              do {
                out.write( "\n" );
                out.write( "      " );
                if ( options == null ) {


                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f0 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f0.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f0
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1126,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f0.setId( "cubeNaviButton" );
                  // /jsp/Pivot.jsp(1126,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f0.setTooltip( "toolb.cube" );
                  // /jsp/Pivot.jsp(1126,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f0.setImg( "cube" );
                  // /jsp/Pivot.jsp(1126,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f0.setModel( wrappedNaviVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f0 = _jspx_th_wcf_005fscriptbutton_005f0.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f0 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f0 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f1 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f1.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f1
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1128,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f1.setId( "mdxEditButton" );
                  // /jsp/Pivot.jsp(1128,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f1.setTooltip( "toolb.mdx.edit" );
                  // /jsp/Pivot.jsp(1128,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f1.setImg( "mdx-edit" );
                  // /jsp/Pivot.jsp(1128,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f1.setModel( wrappedMdxEditVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f1 = _jspx_th_wcf_005fscriptbutton_005f1.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f1 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f1 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f2 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f2.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f2
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1130,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f2.setId( "sortConfigButton" );
                  // /jsp/Pivot.jsp(1130,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f2.setTooltip( "toolb.table.config" );
                  // /jsp/Pivot.jsp(1130,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f2.setImg( "sort-asc" );
                  // /jsp/Pivot.jsp(1130,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f2.setModel( wrappedSortFormVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f2 = _jspx_th_wcf_005fscriptbutton_005f2.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f2 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f2 );
                  out.write( "\n" );
                  out.write( "      " );
                  if ( _jspx_meth_wcf_005fseparator_005f0( _jspx_th_wcf_005ftoolbar_005f0, _jspx_page_context ) ) {
                    return;
                  }
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f3 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f3.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f3
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1133,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f3.setId( "levelStyle" );
                  // /jsp/Pivot.jsp(1133,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f3.setTooltip( "toolb.level.style" );
                  // /jsp/Pivot.jsp(1133,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f3.setImg( "level-style" );
                  // /jsp/Pivot.jsp(1133,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f3.setModel( wrappedTableLevelStyle );
                  int _jspx_eval_wcf_005fscriptbutton_005f3 = _jspx_th_wcf_005fscriptbutton_005f3.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f3 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f3 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f4 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f4.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f4
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1135,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f4.setId( "hideSpans" );
                  // /jsp/Pivot.jsp(1135,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f4.setTooltip( "toolb.hide.spans" );
                  // /jsp/Pivot.jsp(1135,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f4.setImg( "hide-spans" );
                  // /jsp/Pivot.jsp(1135,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f4.setModel( wrappedTableHideSpans );
                  int _jspx_eval_wcf_005fscriptbutton_005f4 = _jspx_th_wcf_005fscriptbutton_005f4.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f4.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f4 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f4 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f5 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f5.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f5
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1137,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f5.setId( "propertiesButton" );
                  // /jsp/Pivot.jsp(1137,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f5.setTooltip( "toolb.properties" );
                  // /jsp/Pivot.jsp(1137,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f5.setImg( "properties" );
                  // /jsp/Pivot.jsp(1137,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f5.setModel( wrappedTableShowProperties );
                  int _jspx_eval_wcf_005fscriptbutton_005f5 = _jspx_th_wcf_005fscriptbutton_005f5.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f5.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f5 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f5 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f6 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f6.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f6
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1139,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f6.setId( "nonEmpty" );
                  // /jsp/Pivot.jsp(1139,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f6.setTooltip( "toolb.non.empty" );
                  // /jsp/Pivot.jsp(1139,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f6.setImg( "non-empty" );
                  // /jsp/Pivot.jsp(1139,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f6.setModel( wrappedTableNonEmptyButtonPressed );
                  int _jspx_eval_wcf_005fscriptbutton_005f6 = _jspx_th_wcf_005fscriptbutton_005f6.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f6.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f6 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f6 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f7 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f7.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f7
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1141,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f7.setId( "swapAxes" );
                  // /jsp/Pivot.jsp(1141,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f7.setTooltip( "toolb.swap.axes" );
                  // /jsp/Pivot.jsp(1141,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f7.setImg( "swap-axes" );
                  // /jsp/Pivot.jsp(1141,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f7.setModel( wrappedTableSwapAxesButtonPressed );
                  int _jspx_eval_wcf_005fscriptbutton_005f7 = _jspx_th_wcf_005fscriptbutton_005f7.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f7.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f7 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f7 );
                  out.write( "\n" );
                  out.write( "      " );
                  if ( _jspx_meth_wcf_005fseparator_005f1( _jspx_th_wcf_005ftoolbar_005f0, _jspx_page_context ) ) {
                    return;
                  }
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f8 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f8.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f8
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1144,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f8.setModel( wrappedTableDrillMemberEnabled );
                  // /jsp/Pivot.jsp(1144,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f8.setTooltip( "toolb.navi.member" );
                  // /jsp/Pivot.jsp(1144,6) name = radioGroup type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f8.setRadioGroup( "navi" );
                  // /jsp/Pivot.jsp(1144,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f8.setId( "drillMember" );
                  // /jsp/Pivot.jsp(1144,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f8.setImg( "navi-member" );
                  int _jspx_eval_wcf_005fscriptbutton_005f8 = _jspx_th_wcf_005fscriptbutton_005f8.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f8.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f8 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f8 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f9 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f9.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f9
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1147,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f9.setModel( wrappedTableDrillPositionEnabled );
                  // /jsp/Pivot.jsp(1147,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f9.setTooltip( "toolb.navi.position" );
                  // /jsp/Pivot.jsp(1147,6) name = radioGroup type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f9.setRadioGroup( "navi" );
                  // /jsp/Pivot.jsp(1147,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f9.setId( "drillPosition" );
                  // /jsp/Pivot.jsp(1147,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f9.setImg( "navi-position" );
                  int _jspx_eval_wcf_005fscriptbutton_005f9 = _jspx_th_wcf_005fscriptbutton_005f9.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f9.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f9 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f9 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f10 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f10.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f10
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1150,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f10.setModel( wrappedTableDrillReplaceEnabled );
                  // /jsp/Pivot.jsp(1150,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f10.setTooltip( "toolb.navi.replace" );
                  // /jsp/Pivot.jsp(1150,6) name = radioGroup type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f10.setRadioGroup( "navi" );
                  // /jsp/Pivot.jsp(1150,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f10.setId( "drillReplace" );
                  // /jsp/Pivot.jsp(1150,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f10.setImg( "navi-replace" );
                  int _jspx_eval_wcf_005fscriptbutton_005f10 = _jspx_th_wcf_005fscriptbutton_005f10.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f10.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f10 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f10 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f11 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f11.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f11
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1153,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f11.setModel( wrappedTableDrillThroughEnabled );
                  // /jsp/Pivot.jsp(1153,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f11.setTooltip( "toolb.navi.drillthru" );
                  // /jsp/Pivot.jsp(1153,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f11.setId( "drillThrough01" );
                  // /jsp/Pivot.jsp(1153,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f11.setImg( "navi-through" );
                  int _jspx_eval_wcf_005fscriptbutton_005f11 = _jspx_th_wcf_005fscriptbutton_005f11.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f11.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f11 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f11 );
                  out.write( "\n" );
                  out.write( "      " );
                  if ( _jspx_meth_wcf_005fseparator_005f2( _jspx_th_wcf_005ftoolbar_005f0, _jspx_page_context ) ) {
                    return;
                  }
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f12 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f12.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f12
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1157,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f12.setId( "chartButton01" );
                  // /jsp/Pivot.jsp(1157,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f12.setTooltip( "toolb.chart" );
                  // /jsp/Pivot.jsp(1157,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f12.setImg( "chart" );
                  // /jsp/Pivot.jsp(1157,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f12.setModel( wrappedChartVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f12 = _jspx_th_wcf_005fscriptbutton_005f12.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f12.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f12 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f12 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f13 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f13.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f13
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1159,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f13.setId( "chartPropertiesButton01" );
                  // /jsp/Pivot.jsp(1159,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f13.setTooltip( "toolb.chart.config" );
                  // /jsp/Pivot.jsp(1159,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f13.setImg( "chart-config" );
                  // /jsp/Pivot.jsp(1159,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f13.setModel( wrappedChartFormVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f13 = _jspx_th_wcf_005fscriptbutton_005f13.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f13.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f13 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f13 );
                  out.write( "\n" );
                  out.write( "      " );
                  if ( _jspx_meth_wcf_005fseparator_005f3( _jspx_th_wcf_005ftoolbar_005f0, _jspx_page_context ) ) {
                    return;
                  }
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:scriptbutton
                  com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f14 =
                    (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                  _jspx_th_wcf_005fscriptbutton_005f14.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fscriptbutton_005f14
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1163,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f14.setId( "printPropertiesButton01" );
                  // /jsp/Pivot.jsp(1163,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f14.setTooltip( "toolb.print.config" );
                  // /jsp/Pivot.jsp(1163,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f14.setImg( "print-config" );
                  // /jsp/Pivot.jsp(1163,6) name = model type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fscriptbutton_005f14.setModel( wrappedPrintFormVisible );
                  int _jspx_eval_wcf_005fscriptbutton_005f14 = _jspx_th_wcf_005fscriptbutton_005f14.doStartTag();
                  if ( _jspx_th_wcf_005fscriptbutton_005f14.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                      .reuse( _jspx_th_wcf_005fscriptbutton_005f14 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                    .reuse( _jspx_th_wcf_005fscriptbutton_005f14 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:imgbutton
                  com.tonbeller.wcf.toolbar.ImgButtonTag _jspx_th_wcf_005fimgbutton_005f0 =
                    (com.tonbeller.wcf.toolbar.ImgButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ImgButtonTag.class );
                  _jspx_th_wcf_005fimgbutton_005f0.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fimgbutton_005f0
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1166,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f0.setId( "printpdf" );
                  // /jsp/Pivot.jsp(1166,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f0.setTooltip( "toolb.print" );
                  // /jsp/Pivot.jsp(1166,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f0.setImg( "print" );
                  // /jsp/Pivot.jsp(1166,6) name = href type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f0.setHref( printPdf );
                  int _jspx_eval_wcf_005fimgbutton_005f0 = _jspx_th_wcf_005fimgbutton_005f0.doStartTag();
                  if ( _jspx_th_wcf_005fimgbutton_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                      .reuse( _jspx_th_wcf_005fimgbutton_005f0 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                    .reuse( _jspx_th_wcf_005fimgbutton_005f0 );
                  out.write( "\n" );
                  out.write( "      " );
                  //  wcf:imgbutton
                  com.tonbeller.wcf.toolbar.ImgButtonTag _jspx_th_wcf_005fimgbutton_005f1 =
                    (com.tonbeller.wcf.toolbar.ImgButtonTag)
                            _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                      .get( com.tonbeller.wcf.toolbar.ImgButtonTag.class );
                  _jspx_th_wcf_005fimgbutton_005f1.setPageContext( _jspx_page_context );
                  _jspx_th_wcf_005fimgbutton_005f1
                    .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                  // /jsp/Pivot.jsp(1168,6) name = id type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f1.setId( "printxls" );
                  // /jsp/Pivot.jsp(1168,6) name = tooltip type = null reqTime = true required = false fragment =
                  // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f1.setTooltip( "toolb.excel" );
                  // /jsp/Pivot.jsp(1168,6) name = img type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f1.setImg( "excel" );
                  // /jsp/Pivot.jsp(1168,6) name = href type = null reqTime = true required = true fragment = false
                  // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                  _jspx_th_wcf_005fimgbutton_005f1.setHref( printExcel );
                  int _jspx_eval_wcf_005fimgbutton_005f1 = _jspx_th_wcf_005fimgbutton_005f1.doStartTag();
                  if ( _jspx_th_wcf_005fimgbutton_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                    _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                      .reuse( _jspx_th_wcf_005fimgbutton_005f1 );
                    return;
                  }
                  _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                    .reuse( _jspx_th_wcf_005fimgbutton_005f1 );
                  out.write( "\n" );
                  out.write( "      " );
                } else {
                  Iterator iterator = options.iterator();
                  while ( iterator.hasNext() ) {
                    String optionName = (String) iterator.next();
                    if ( "cube-nav".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f15 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f15.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f15
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1175,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f15.setId( "cubeNaviButton" );
                      // /jsp/Pivot.jsp(1175,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f15.setTooltip( "toolb.cube" );
                      // /jsp/Pivot.jsp(1175,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f15.setImg( "cube" );
                      // /jsp/Pivot.jsp(1175,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f15.setModel( wrappedNaviVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f15 = _jspx_th_wcf_005fscriptbutton_005f15.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f15.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f15 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f15 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "mdx-edit".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f16 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f16.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f16
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1179,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f16.setId( "mdxEditButton" );
                      // /jsp/Pivot.jsp(1179,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f16.setTooltip( "toolb.mdx.edit" );
                      // /jsp/Pivot.jsp(1179,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f16.setImg( "mdx-edit" );
                      // /jsp/Pivot.jsp(1179,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f16.setModel( wrappedMdxEditVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f16 = _jspx_th_wcf_005fscriptbutton_005f16.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f16.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f16 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f16 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "sort-conf".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f17 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f17.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f17
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1183,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f17.setId( "sortConfigButton" );
                      // /jsp/Pivot.jsp(1183,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f17.setTooltip( "toolb.table.config" );
                      // /jsp/Pivot.jsp(1183,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f17.setImg( "sort-asc" );
                      // /jsp/Pivot.jsp(1183,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f17.setModel( wrappedSortFormVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f17 = _jspx_th_wcf_005fscriptbutton_005f17.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f17.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f17 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f17 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "spacer".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      if ( _jspx_meth_wcf_005fseparator_005f4( _jspx_th_wcf_005ftoolbar_005f0, _jspx_page_context ) ) {
                        return;
                      }
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "level-style".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f18 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f18.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f18
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1190,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f18.setId( "levelStyle" );
                      // /jsp/Pivot.jsp(1190,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f18.setTooltip( "toolb.level.style" );
                      // /jsp/Pivot.jsp(1190,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f18.setImg( "level-style" );
                      // /jsp/Pivot.jsp(1190,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f18.setModel( wrappedTableLevelStyle );
                      int _jspx_eval_wcf_005fscriptbutton_005f18 = _jspx_th_wcf_005fscriptbutton_005f18.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f18.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f18 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f18 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "hide-spans".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f19 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f19.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f19
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1194,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f19.setId( "hideSpans" );
                      // /jsp/Pivot.jsp(1194,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f19.setTooltip( "toolb.hide.spans" );
                      // /jsp/Pivot.jsp(1194,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f19.setImg( "hide-spans" );
                      // /jsp/Pivot.jsp(1194,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f19.setModel( wrappedTableHideSpans );
                      int _jspx_eval_wcf_005fscriptbutton_005f19 = _jspx_th_wcf_005fscriptbutton_005f19.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f19.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f19 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f19 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "properties".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f20 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f20.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f20
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1198,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f20.setId( "propertiesButton" );
                      // /jsp/Pivot.jsp(1198,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f20.setTooltip( "toolb.properties" );
                      // /jsp/Pivot.jsp(1198,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f20.setImg( "properties" );
                      // /jsp/Pivot.jsp(1198,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f20.setModel( wrappedTableShowProperties );
                      int _jspx_eval_wcf_005fscriptbutton_005f20 = _jspx_th_wcf_005fscriptbutton_005f20.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f20.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f20 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f20 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "non-empty".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f21 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f21.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f21
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1202,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f21.setId( "nonEmpty" );
                      // /jsp/Pivot.jsp(1202,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f21.setTooltip( "toolb.non.empty" );
                      // /jsp/Pivot.jsp(1202,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f21.setImg( "non-empty" );
                      // /jsp/Pivot.jsp(1202,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f21.setModel( wrappedTableNonEmptyButtonPressed );
                      int _jspx_eval_wcf_005fscriptbutton_005f21 = _jspx_th_wcf_005fscriptbutton_005f21.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f21.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f21 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f21 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "swap-axes".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f22 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f22.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f22
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1206,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f22.setId( "swapAxes" );
                      // /jsp/Pivot.jsp(1206,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f22.setTooltip( "toolb.swap.axes" );
                      // /jsp/Pivot.jsp(1206,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f22.setImg( "swap-axes" );
                      // /jsp/Pivot.jsp(1206,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f22.setModel( wrappedTableSwapAxesButtonPressed );
                      int _jspx_eval_wcf_005fscriptbutton_005f22 = _jspx_th_wcf_005fscriptbutton_005f22.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f22.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f22 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f22 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "drill-member".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f23 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f23.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f23
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1210,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f23.setModel( wrappedTableDrillMemberEnabled );
                      // /jsp/Pivot.jsp(1210,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f23.setTooltip( "toolb.navi.member" );
                      // /jsp/Pivot.jsp(1210,6) name = radioGroup type = null reqTime = true required = false
                      // fragment = false deferredValue = false expectedTypeName = null deferredMethod = false
                      // methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f23.setRadioGroup( "navi" );
                      // /jsp/Pivot.jsp(1210,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f23.setId( "drillMember" );
                      // /jsp/Pivot.jsp(1210,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f23.setImg( "navi-member" );
                      int _jspx_eval_wcf_005fscriptbutton_005f23 = _jspx_th_wcf_005fscriptbutton_005f23.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f23.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f23 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f23 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "drill-position".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f24 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f24.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f24
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1215,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f24.setModel( wrappedTableDrillPositionEnabled );
                      // /jsp/Pivot.jsp(1215,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f24.setTooltip( "toolb.navi.position" );
                      // /jsp/Pivot.jsp(1215,6) name = radioGroup type = null reqTime = true required = false
                      // fragment = false deferredValue = false expectedTypeName = null deferredMethod = false
                      // methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f24.setRadioGroup( "navi" );
                      // /jsp/Pivot.jsp(1215,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f24.setId( "drillPosition" );
                      // /jsp/Pivot.jsp(1215,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f24.setImg( "navi-position" );
                      int _jspx_eval_wcf_005fscriptbutton_005f24 = _jspx_th_wcf_005fscriptbutton_005f24.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f24.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f24 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f24 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "drill-replace".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f25 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f25.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f25
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1220,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f25.setModel( wrappedTableDrillReplaceEnabled );
                      // /jsp/Pivot.jsp(1220,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f25.setTooltip( "toolb.navi.replace" );
                      // /jsp/Pivot.jsp(1220,6) name = radioGroup type = null reqTime = true required = false
                      // fragment = false deferredValue = false expectedTypeName = null deferredMethod = false
                      // methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f25.setRadioGroup( "navi" );
                      // /jsp/Pivot.jsp(1220,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f25.setId( "drillReplace" );
                      // /jsp/Pivot.jsp(1220,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f25.setImg( "navi-replace" );
                      int _jspx_eval_wcf_005fscriptbutton_005f25 = _jspx_th_wcf_005fscriptbutton_005f25.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f25.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f25 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fradioGroup_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f25 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "drill-thru".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f26 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f26.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f26
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1225,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f26.setModel( wrappedTableDrillThroughEnabled );
                      // /jsp/Pivot.jsp(1225,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f26.setTooltip( "toolb.navi.drillthru" );
                      // /jsp/Pivot.jsp(1225,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f26.setId( "drillThrough01" );
                      // /jsp/Pivot.jsp(1225,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f26.setImg( "navi-through" );
                      int _jspx_eval_wcf_005fscriptbutton_005f26 = _jspx_th_wcf_005fscriptbutton_005f26.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f26.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f26 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f26 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "chart".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f27 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f27.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f27
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1230,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f27.setId( "chartButton01" );
                      // /jsp/Pivot.jsp(1230,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f27.setTooltip( "toolb.chart" );
                      // /jsp/Pivot.jsp(1230,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f27.setImg( "chart" );
                      // /jsp/Pivot.jsp(1230,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f27.setModel( wrappedChartVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f27 = _jspx_th_wcf_005fscriptbutton_005f27.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f27.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f27 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f27 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "chart-conf".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f28 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f28.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f28
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1234,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f28.setId( "chartPropertiesButton01" );
                      // /jsp/Pivot.jsp(1234,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f28.setTooltip( "toolb.chart.config" );
                      // /jsp/Pivot.jsp(1234,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f28.setImg( "chart-config" );
                      // /jsp/Pivot.jsp(1234,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f28.setModel( wrappedChartFormVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f28 = _jspx_th_wcf_005fscriptbutton_005f28.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f28.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f28 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f28 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "print-conf".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:scriptbutton
                      com.tonbeller.wcf.toolbar.ScriptButtonTag _jspx_th_wcf_005fscriptbutton_005f29 =
                        (com.tonbeller.wcf.toolbar.ScriptButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ScriptButtonTag.class );
                      _jspx_th_wcf_005fscriptbutton_005f29.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fscriptbutton_005f29
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1239,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fscriptbutton_005f29.setId( "printPropertiesButton01" );
                      // /jsp/Pivot.jsp(1239,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f29.setTooltip( "toolb.print.config" );
                      // /jsp/Pivot.jsp(1239,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f29.setImg( "print-config" );
                      // /jsp/Pivot.jsp(1239,6) name = model type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fscriptbutton_005f29.setModel( wrappedPrintFormVisible );
                      int _jspx_eval_wcf_005fscriptbutton_005f29 = _jspx_th_wcf_005fscriptbutton_005f29.doStartTag();
                      if ( _jspx_th_wcf_005fscriptbutton_005f29.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                          .reuse( _jspx_th_wcf_005fscriptbutton_005f29 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fscriptbutton_0026_005ftooltip_005fmodel_005fimg_005fid_005fnobody
                        .reuse( _jspx_th_wcf_005fscriptbutton_005f29 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "print-pdf".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:imgbutton
                      com.tonbeller.wcf.toolbar.ImgButtonTag _jspx_th_wcf_005fimgbutton_005f2 =
                        (com.tonbeller.wcf.toolbar.ImgButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ImgButtonTag.class );
                      _jspx_th_wcf_005fimgbutton_005f2.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fimgbutton_005f2
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1244,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fimgbutton_005f2.setId( "printpdf" );
                      // /jsp/Pivot.jsp(1244,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f2.setTooltip( "toolb.print" );
                      // /jsp/Pivot.jsp(1244,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f2.setImg( "print" );
                      // /jsp/Pivot.jsp(1244,6) name = href type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f2.setHref( printPdf );
                      int _jspx_eval_wcf_005fimgbutton_005f2 = _jspx_th_wcf_005fimgbutton_005f2.doStartTag();
                      if ( _jspx_th_wcf_005fimgbutton_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                          .reuse( _jspx_th_wcf_005fimgbutton_005f2 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                        .reuse( _jspx_th_wcf_005fimgbutton_005f2 );
                      out.write( "\n" );
                      out.write( "      " );
                    } else if ( "excel".equals( optionName ) ) {
                      out.write( "\n" );
                      out.write( "      " );
                      //  wcf:imgbutton
                      com.tonbeller.wcf.toolbar.ImgButtonTag _jspx_th_wcf_005fimgbutton_005f3 =
                        (com.tonbeller.wcf.toolbar.ImgButtonTag)
                                _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                          .get( com.tonbeller.wcf.toolbar.ImgButtonTag.class );
                      _jspx_th_wcf_005fimgbutton_005f3.setPageContext( _jspx_page_context );
                      _jspx_th_wcf_005fimgbutton_005f3
                        .setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
                      // /jsp/Pivot.jsp(1248,6) name = id type = null reqTime = true required = true fragment = false
                      // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
                      _jspx_th_wcf_005fimgbutton_005f3.setId( "printxls" );
                      // /jsp/Pivot.jsp(1248,6) name = tooltip type = null reqTime = true required = false fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f3.setTooltip( "toolb.excel" );
                      // /jsp/Pivot.jsp(1248,6) name = img type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f3.setImg( "excel" );
                      // /jsp/Pivot.jsp(1248,6) name = href type = null reqTime = true required = true fragment =
                      // false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature =
                      // null
                      _jspx_th_wcf_005fimgbutton_005f3.setHref( printExcel );
                      int _jspx_eval_wcf_005fimgbutton_005f3 = _jspx_th_wcf_005fimgbutton_005f3.doStartTag();
                      if ( _jspx_th_wcf_005fimgbutton_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                        _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                          .reuse( _jspx_th_wcf_005fimgbutton_005f3 );
                        return;
                      }
                      _005fjspx_005ftagPool_005fwcf_005fimgbutton_0026_005ftooltip_005fimg_005fid_005fhref_005fnobody
                        .reuse( _jspx_th_wcf_005fimgbutton_005f3 );
                      out.write( "\n" );
                      out.write( "      " );
                    }

                  }
                }

                out.write( "\n" );
                out.write( "    " );
                int evalDoAfterBody = _jspx_th_wcf_005ftoolbar_005f0.doAfterBody();
                if ( evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN ) {
                  break;
                }
              } while ( true );
            }
            if ( _jspx_th_wcf_005ftoolbar_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle.reuse( _jspx_th_wcf_005ftoolbar_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005ftoolbar_0026_005fid_005fbundle.reuse( _jspx_th_wcf_005ftoolbar_005f0 );
            out.write( " \n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    <div id=\"folder-options\" style=\"display: block\">\n" );
            out.write( "    <table cellpadding=\"0\" cellspacing=\"0\">\n" );
            out.write( "      <tr>\n" );
            out.write( "        " );
            if ( authenticated ) {
              out.write( "\n" );
              out.write( "        <td><span id=\"folder-down\" style=\"display: block\"> <img\n" );
              out.write(
                "          src=\"../../content/jpivot/jpivot/toolbar/jpivot_save.png\" onclick=\"javascript:save();"
                        + "\"\n" );
              out.write( "          alt=\"Save\" title=\"Save\" /> </span></td>\n" );
              out.write( "        <td><span id=\"folder-up\" style=\"display: block\"> <img\n" );
              out.write( "          src=\"../../content/jpivot/jpivot/toolbar/jpivot_saveas.png\"\n" );
              out.write(
                "          onclick=\"javascript:saveAs();\" alt=\"Save As\" title=\"Save As\" /> </span></td>\n" );
              out.write( "        " );
            }
            out.write( "\n" );
            out.write( "\n" );
            out.write( "        " );
            out.write( "\n" );
            out.write( "        " );
            out.write( "\n" );
            out.write( "        " );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "        <td>" );
            out.write( ' ' );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f0 =
              (com.tonbeller.wcf.component.RendererTag)
                      _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f0.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f0.setParent( null );
            // /jsp/Pivot.jsp(1277,37) name = ref type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f0.setRef( toolbarId );
            // /jsp/Pivot.jsp(1277,37) name = xslUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f0.setXslUri( "/WEB-INF/jpivot/toolbar/htoolbar.xsl" );
            // /jsp/Pivot.jsp(1277,37) name = xslCache type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f0.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f0 = _jspx_th_wcf_005frender_005f0.doStartTag();
            if ( _jspx_th_wcf_005frender_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f0 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f0 );
            out.write( "</td>\n" );
            out.write( "      </tr>\n" );
            out.write( "    </table>\n" );
            out.write( "    </div>\n" );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    <div id=\"browser.modalDiv\" class='browser'>\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write(
              "    <div id=\"browser.saveasDialog\" style=\"display: none; position: absolute; top: 100px; left: "
                      + "200px; height: 25px;\">\n" );
            out.write( "    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"popupDialog_table\">\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td class=\"popupDialog_header\">\n" );
            out.write(
              "          <div id=\"browser.titleBar\" class=\"popupDialogTitleBar\" ondragstart=\"return false;\" "
                      + "onselectstart=\"return false;\"></div>\n" );
            out.write( "        </td>\n" );
            out.write( "      </tr>\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td valign=\"top\" style=\"padding: 15px;\">\n" );
            out.write(
              "        <table style=\"width: 40em; height: 100%;\" border=\"0\" cellspacing=\"2px\" "
                      + "cellpadding=\"2px\">\n" );
            out.write( "          <tr>\n" );
            out.write( "            <td id=\"saveDlgSaveAsPrompt\" style='width: 25%'>Save As:</td>\n" );
            out.write(
              "            <td style='width: 75%'><input type=\"text\" id=\"browser.saveAsNameInputText\" "
                      + "tabindex='0' name=\"textfield\" class=\"browserSaveAsText\" /></td>\n" );
            out.write( "          </tr>\n" );
            out.write( "          <tr>\n" );
            out.write( "            <td id=\"saveDlgWherePrompt\">Where:</td>\n" );
            out.write( "            <td>\n" );
            out.write( "            <table style='width: 100%;' border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" );
            out.write( "              <tr>\n" );
            out.write(
              "                <td style=\"width: 100%; padding-right: 5px;\" id=\"browser.comboContainer\"></td>\n" );
            out.write(
              "                <td><img id='browser.upImg' src=\"../../content/jpivot/adhoc/images/up.png\" "
                      + "alt=\"up\" /></td>\n" );
            out.write( "              </tr>\n" );
            out.write( "            </table>\n" );
            out.write( "            </td>\n" );
            out.write( "          </tr>\n" );
            out.write( "          <tr>\n" );
            out.write( "            <td id=\"saveDlgSelectSltnTitle\" colspan='2'>Select a Solution</td>\n" );
            out.write( "          </tr>\n" );
            out.write( "          <tr>\n" );
            out.write( "            <td id=\"browser.solutionFolderListTd\" height=\"100%\" colspan='2'>\n" );
            out.write( "            </td>\n" );
            out.write( "          </tr>\n" );
            out.write( "        </table>\n" );
            out.write( "        </td>\n" );
            out.write( "      </tr>\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td style=\"border-top: 1px solid #818f49; background-color: #ffffff;\">\n" );
            out.write( "        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"right\">\n" );
            out.write( "          <tr>\n" );
            out.write( "            <td id=\"browser.saveBtnContainer\" width=\"75\"></td>\n" );
            out.write( "            <td id=\"browser.cancelBtnContainer\" width=\"85\"></td>\n" );
            out.write( "          </tr>\n" );
            out.write( "        </table>\n" );
            out.write( "        </td>\n" );
            out.write( "      </tr>\n" );
            out.write( "    </table>\n" );
            out.write( "    </div>\n" );
            out.write( "  " );
            out.write( "\n" );
            out.write( "</div>\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    <script type=\"text/javascript\">\n" );
            out.write( "      var saveMessage = '" );
            out.print( Encode.forJavaScript( saveMessage ) );
            out.write( "';\n" );
            out.write( "    </script> " );


            if ( saveResult && "saveAs".equals( saveAction ) ) {
              // If performing a save as.. , we need to reload the view with the newly saved
              // action sequence.
              String fileName = request.getParameter( "save-file" );
              fileName = fileName.endsWith( AnalysisSaver.SUFFIX ) ? fileName : fileName + AnalysisSaver.SUFFIX;
              String path = AnalysisSaver.cleansePath( request.getParameter( "save-path" ), fileName );

              out.write( " <script type=\"text/javascript\">\n" );
              out.write( "          var path = encodeURIComponent( \"" );
              out.print( Encode.forJavaScript( path ) );
              out.write( "\" );\n" );
              out.write( "          var fileName = encodeURIComponent( \"" );
              out.print( Encode.forJavaScript( fileName ) );
              out.write( "\" );\n" );
              out.write( "          var uri = \"Pivot?path=\" + path + \"&action=\" + fileName;\n" );
              out.write( "          document.location.href = uri;\n" );
              out.write( "        </script> " );
            } else {
              saveMessage = "";
              session.setAttribute( "save-message-01", saveMessage ); //$NON-NLS-1$

            }

            out.write( "\n" );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    <div id=\"internal_content\">\n" );
            out.write( "      " );

            // if there was an overflow, show error message
            // note, if internal error is caused by query.getResult(),
            // no usable log messages make it to the user or the log system

            if ( _olapModel != null ) {
              try {
                _olapModel.getResult();
                if ( _olapModel.getResult().isOverflowOccured() ) {

                  out.write( "<p><strong style=\"color: red\">Resultset overflow occured</strong></p>" );

                }
              } catch ( Throwable t ) {
                t.printStackTrace();

                out.write( "<p><strong style=\"color: red\">Error Occurred While getting Resultset</strong></p>" );

              }
            }

            out.write( "\n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "    <div id=\"" );
            out.print( Encode.forHtmlAttribute( naviId ) );
            out.write( "div\">" );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f1 =
              (com.tonbeller.wcf.component.RendererTag)
                      _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f1.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f1.setParent( null );
            // /jsp/Pivot.jsp(1403,69) name = ref type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f1.setRef( naviId );
            // /jsp/Pivot.jsp(1403,69) name = xslUri type = null reqTime = true required = true fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f1.setXslUri( "/WEB-INF/jpivot/navi/navigator.xsl" );
            // /jsp/Pivot.jsp(1403,69) name = xslCache type = null reqTime = true required = false fragment = false
            // deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f1.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f1 = _jspx_th_wcf_005frender_005f1.doStartTag();
            if ( _jspx_th_wcf_005frender_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f1 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f1 );
            out.write( "</div>\n" );
            out.write( "\n" );
            if ( _mdxEdit.isVisible() ) {
              out.write( "\n" );
              out.write( "    " );
              if ( "true".equalsIgnoreCase( PentahoSystem.getSystemSetting( "kiosk-mode", "false" ) ) ) {
                out.write( "\n" );
                out.write( "    <h3>MDX Query Viewer <font color=\"red\">(editing disabled)</font></h3>\n" );
                out.write( "    " );
              } else {
                out.write( "\n" );
                out.write( "    <h3>MDX Query Editor</h3>\n" );
                out.write( "    " );
              }
              out.write( "\n" );
              out.write( "    " );
              out.write( "\n" );
              out.write( "    " );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f2 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f2.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f2.setParent( null );
              // /jsp/Pivot.jsp(1413,4) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f2.setRef( mdxEditId );
              // /jsp/Pivot.jsp(1413,4) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f2.setXslUri( "/WEB-INF/wcf/wcf.xsl" );
              // /jsp/Pivot.jsp(1413,4) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f2.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f2 = _jspx_th_wcf_005frender_005f2.doStartTag();
              if ( _jspx_th_wcf_005frender_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f2 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f2 );
              out.write( ' ' );
            }
            out.write( " \n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "    " );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f3 =
              (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f3.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f3.setParent( null );
            // /jsp/Pivot.jsp(1415,4) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f3.setRef( sortFormId );
            // /jsp/Pivot.jsp(1415,4) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f3.setXslUri( "/WEB-INF/wcf/wcf.xsl" );
            // /jsp/Pivot.jsp(1415,4) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f3.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f3 = _jspx_th_wcf_005frender_005f3.doStartTag();
            if ( _jspx_th_wcf_005frender_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f3 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f3 );
            out.write( " \n" );
            out.write( "    " );
            out.write( " \n" );
            out.write( "    " );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f4 =
              (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f4.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f4.setParent( null );
            // /jsp/Pivot.jsp(1417,4) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f4.setRef( chartFormId );
            // /jsp/Pivot.jsp(1417,4) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f4.setXslUri( "/WEB-INF/wcf/wcf.xsl" );
            // /jsp/Pivot.jsp(1417,4) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f4.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f4 = _jspx_th_wcf_005frender_005f4.doStartTag();
            if ( _jspx_th_wcf_005frender_005f4.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f4 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f4 );
            out.write( " \n" );
            out.write( "    " );
            out.write( "\n" );
            out.write( "    " );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f5 =
              (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f5.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f5.setParent( null );
            // /jsp/Pivot.jsp(1419,4) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f5.setRef( printFormId );
            // /jsp/Pivot.jsp(1419,4) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f5.setXslUri( "/WEB-INF/wcf/wcf.xsl" );
            // /jsp/Pivot.jsp(1419,4) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f5.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f5 = _jspx_th_wcf_005frender_005f5.doStartTag();
            if ( _jspx_th_wcf_005frender_005f5.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f5 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f5 );
            out.write( "\n" );
            out.write( "\n" );
            out.write( "    <table border=\"0\">\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td></td>\n" );
            out.write( "        <td>\n" );
            out.write( "        " );

            boolean chartRendered = false;
            if ( "top".equals( chartLocation ) ) {
              out.write( ' ' );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f6 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f6.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f6.setParent( null );
              // /jsp/Pivot.jsp(1427,52) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f6.setRef( chartId );
              // /jsp/Pivot.jsp(1427,52) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f6.setXslUri( "/WEB-INF/jpivot/chart/chart.xsl" );
              // /jsp/Pivot.jsp(1427,52) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f6.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f6 = _jspx_th_wcf_005frender_005f6.doStartTag();
              if ( _jspx_th_wcf_005frender_005f6.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f6 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f6 );
              out.write( ' ' );

              chartRendered = true;
            }

            out.write( "\n" );
            out.write( "        </td>\n" );
            out.write( "        <td></td>\n" );
            out.write( "      </tr>\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td valign=\"top\">\n" );
            out.write( "        " );
            if ( "left".equals( chartLocation ) && !chartRendered ) {
              out.write( ' ' );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f7 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f7.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f7.setParent( null );
              // /jsp/Pivot.jsp(1438,67) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f7.setRef( chartId );
              // /jsp/Pivot.jsp(1438,67) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f7.setXslUri( "/WEB-INF/jpivot/chart/chart.xsl" );
              // /jsp/Pivot.jsp(1438,67) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f7.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f7 = _jspx_th_wcf_005frender_005f7.doStartTag();
              if ( _jspx_th_wcf_005frender_005f7.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f7 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f7 );
              out.write( ' ' );

              chartRendered = true;
            }
            out.write( "\n" );
            out.write( "        </td>\n" );
            out.write( "        <td valign=\"top\"><!-- render the table --> " );
            if ( showGrid ) {
              out.write( "\n" );
              out.write( "        <p>" );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f8 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f8.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f8.setParent( null );
              // /jsp/Pivot.jsp(1444,11) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f8.setRef( tableId );
              // /jsp/Pivot.jsp(1444,11) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f8.setXslUri( "/WEB-INF/jpivot/table/mdxtable.xsl" );
              // /jsp/Pivot.jsp(1444,11) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f8.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f8 = _jspx_th_wcf_005frender_005f8.doStartTag();
              if ( _jspx_th_wcf_005frender_005f8.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f8 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f8 );
              out.write( ' ' );
            }
            out.write( "\n" );
            out.write( "        \n" );
            out.write( "        <p><font size=\"2\"> Slicer: " );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f9 =
              (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f9.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f9.setParent( null );
            // /jsp/Pivot.jsp(1447,35) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f9.setRef( tableId );
            // /jsp/Pivot.jsp(1447,35) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f9.setXslUri( "/WEB-INF/jpivot/table/mdxslicer.xsl" );
            // /jsp/Pivot.jsp(1447,35) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f9.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f9 = _jspx_th_wcf_005frender_005f9.doStartTag();
            if ( _jspx_th_wcf_005frender_005f9.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f9 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f9 );
            out.write( " </font>\n" );
            out.write( "        <p><!-- drill through table --> " );
            //  wcf:render
            com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f10 =
              (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .get( com.tonbeller.wcf.component.RendererTag.class );
            _jspx_th_wcf_005frender_005f10.setPageContext( _jspx_page_context );
            _jspx_th_wcf_005frender_005f10.setParent( null );
            // /jsp/Pivot.jsp(1449,40) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f10.setRef( drillThroughTableId );
            // /jsp/Pivot.jsp(1449,40) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f10.setXslUri( "/WEB-INF/wcf/wcf.xsl" );
            // /jsp/Pivot.jsp(1449,40) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
            _jspx_th_wcf_005frender_005f10.setXslCache( true );
            int _jspx_eval_wcf_005frender_005f10 = _jspx_th_wcf_005frender_005f10.doStartTag();
            if ( _jspx_th_wcf_005frender_005f10.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f10 );
              return;
            }
            _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
              .reuse( _jspx_th_wcf_005frender_005f10 );
            out.write( "\n" );
            out.write( "        </td>\n" );
            out.write( "        <td valign=\"top\">\n" );
            out.write( "        " );
            if ( "right".equals( chartLocation ) && !chartRendered ) {
              out.write( ' ' );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f11 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f11.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f11.setParent( null );
              // /jsp/Pivot.jsp(1454,68) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f11.setRef( chartId );
              // /jsp/Pivot.jsp(1454,68) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f11.setXslUri( "/WEB-INF/jpivot/chart/chart.xsl" );
              // /jsp/Pivot.jsp(1454,68) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f11.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f11 = _jspx_th_wcf_005frender_005f11.doStartTag();
              if ( _jspx_th_wcf_005frender_005f11.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f11 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f11 );
              out.write( ' ' );

              chartRendered = true;
            }
            out.write( "\n" );
            out.write( "        </td>\n" );
            out.write( "      </tr>\n" );
            out.write( "      <tr>\n" );
            out.write( "        <td></td>\n" );
            out.write( "        <td>\n" );
            out.write( "        " );

            if ( ( "bottom".equals( chartLocation ) || _chart.isVisible() ) && !chartRendered ) {
              out.write( "\n" );
              out.write( "        " );
              //  wcf:render
              com.tonbeller.wcf.component.RendererTag _jspx_th_wcf_005frender_005f12 =
                (com.tonbeller.wcf.component.RendererTag) _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .get( com.tonbeller.wcf.component.RendererTag.class );
              _jspx_th_wcf_005frender_005f12.setPageContext( _jspx_page_context );
              _jspx_th_wcf_005frender_005f12.setParent( null );
              // /jsp/Pivot.jsp(1466,8) name = ref type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f12.setRef( chartId );
              // /jsp/Pivot.jsp(1466,8) name = xslUri type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f12.setXslUri( "/WEB-INF/jpivot/chart/chart.xsl" );
              // /jsp/Pivot.jsp(1466,8) name = xslCache type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
              _jspx_th_wcf_005frender_005f12.setXslCache( true );
              int _jspx_eval_wcf_005frender_005f12 = _jspx_th_wcf_005frender_005f12.doStartTag();
              if ( _jspx_th_wcf_005frender_005f12.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
                _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                  .reuse( _jspx_th_wcf_005frender_005f12 );
                return;
              }
              _005fjspx_005ftagPool_005fwcf_005frender_0026_005fxslUri_005fxslCache_005fref_005fnobody
                .reuse( _jspx_th_wcf_005frender_005f12 );
              out.write( ' ' );

              chartRendered = true;
            }
            out.write( "\n" );
            out.write( "        </td>\n" );
            out.write( "        <td></td>\n" );
            out.write( "      </tr>\n" );
            out.write( "      <table>\n" );
            out.write( "        " );
          }
          out.write( "\n" );
          out.write( "      </table>\n" );
          out.write( "      </table>\n" );
          out.write( "      </div>\n" );
          out.write( "      </form>\n" );
          out.write( "      </table>\n" );
          out.write( "      </div>\n" );
          if ( writeDeprecationWarning() ) {
            out.write( "  <div id=\"deprecatedWarning\" style=\"margin: auto; width: 100%\">\n" );
            out.write(
              "  <table width=\"740px\" align=\"center\" style=\"background-color: #fffdd5; border-style: solid; border-color: #dcb114; border-width= 1px; font: normal .85em Tahoma, 'Trebuchet MS', Arial\">\n" );
            out.write( "    <tr>\n" );
            out.write( "      <td valign=\"top\">\n" );
            out.write( "        <img src=\"../../content/jpivot/jpivot/navi/warning.png\"/>\n" );
            out.write( "      </td>\n" );
            out.write( "      <td>\n" );
            out.write( deprecationWarningMessage );
            out.write( "      </td>\n" );
            out.write( "    </tr>\n" );
            out.write( "  </table>\n" );
            out.write( "</div>\n" );
          }
          out.write( "</body>\n" );
          out.write( "\n" );
          out.write( "</html>\n" );

        } catch ( Throwable t ) {

          out.write( " An error occurred while rendering Pivot.jsp. Please see the log for details. " );

          // TODO log an error
          t.printStackTrace();
        } finally {
          PentahoSystem.systemExitPoint();
        }

        out.write( '\n' );

      } finally {
        wcfcontext.invalidate();
      }


      out.write( '\n' );
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

  private boolean _jspx_meth_wcf_005fscroller_005f0( PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:scroller
    com.tonbeller.wcf.scroller.ScrollerTag _jspx_th_wcf_005fscroller_005f0 =
      (com.tonbeller.wcf.scroller.ScrollerTag) _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody
        .get( com.tonbeller.wcf.scroller.ScrollerTag.class );
    _jspx_th_wcf_005fscroller_005f0.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fscroller_005f0.setParent( null );
    int _jspx_eval_wcf_005fscroller_005f0 = _jspx_th_wcf_005fscroller_005f0.doStartTag();
    if ( _jspx_th_wcf_005fscroller_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody.reuse( _jspx_th_wcf_005fscroller_005f0 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fscroller_005fnobody.reuse( _jspx_th_wcf_005fscroller_005f0 );
    return false;
  }

  private boolean _jspx_meth_wcf_005fseparator_005f0( javax.servlet.jsp.tagext.JspTag _jspx_th_wcf_005ftoolbar_005f0,
                                                      PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:separator
    com.tonbeller.wcf.toolbar.ToolSeparatorTag _jspx_th_wcf_005fseparator_005f0 =
      (com.tonbeller.wcf.toolbar.ToolSeparatorTag) _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody
        .get( com.tonbeller.wcf.toolbar.ToolSeparatorTag.class );
    _jspx_th_wcf_005fseparator_005f0.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fseparator_005f0.setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
    int _jspx_eval_wcf_005fseparator_005f0 = _jspx_th_wcf_005fseparator_005f0.doStartTag();
    if ( _jspx_th_wcf_005fseparator_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f0 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f0 );
    return false;
  }

  private boolean _jspx_meth_wcf_005fseparator_005f1( javax.servlet.jsp.tagext.JspTag _jspx_th_wcf_005ftoolbar_005f0,
                                                      PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:separator
    com.tonbeller.wcf.toolbar.ToolSeparatorTag _jspx_th_wcf_005fseparator_005f1 =
      (com.tonbeller.wcf.toolbar.ToolSeparatorTag) _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody
        .get( com.tonbeller.wcf.toolbar.ToolSeparatorTag.class );
    _jspx_th_wcf_005fseparator_005f1.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fseparator_005f1.setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
    int _jspx_eval_wcf_005fseparator_005f1 = _jspx_th_wcf_005fseparator_005f1.doStartTag();
    if ( _jspx_th_wcf_005fseparator_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f1 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f1 );
    return false;
  }

  private boolean _jspx_meth_wcf_005fseparator_005f2( javax.servlet.jsp.tagext.JspTag _jspx_th_wcf_005ftoolbar_005f0,
                                                      PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:separator
    com.tonbeller.wcf.toolbar.ToolSeparatorTag _jspx_th_wcf_005fseparator_005f2 =
      (com.tonbeller.wcf.toolbar.ToolSeparatorTag) _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody
        .get( com.tonbeller.wcf.toolbar.ToolSeparatorTag.class );
    _jspx_th_wcf_005fseparator_005f2.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fseparator_005f2.setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
    int _jspx_eval_wcf_005fseparator_005f2 = _jspx_th_wcf_005fseparator_005f2.doStartTag();
    if ( _jspx_th_wcf_005fseparator_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f2 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f2 );
    return false;
  }

  private boolean _jspx_meth_wcf_005fseparator_005f3( javax.servlet.jsp.tagext.JspTag _jspx_th_wcf_005ftoolbar_005f0,
                                                      PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:separator
    com.tonbeller.wcf.toolbar.ToolSeparatorTag _jspx_th_wcf_005fseparator_005f3 =
      (com.tonbeller.wcf.toolbar.ToolSeparatorTag) _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody
        .get( com.tonbeller.wcf.toolbar.ToolSeparatorTag.class );
    _jspx_th_wcf_005fseparator_005f3.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fseparator_005f3.setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
    int _jspx_eval_wcf_005fseparator_005f3 = _jspx_th_wcf_005fseparator_005f3.doStartTag();
    if ( _jspx_th_wcf_005fseparator_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f3 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f3 );
    return false;
  }

  private boolean _jspx_meth_wcf_005fseparator_005f4( javax.servlet.jsp.tagext.JspTag _jspx_th_wcf_005ftoolbar_005f0,
                                                      PageContext _jspx_page_context )
    throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  wcf:separator
    com.tonbeller.wcf.toolbar.ToolSeparatorTag _jspx_th_wcf_005fseparator_005f4 =
      (com.tonbeller.wcf.toolbar.ToolSeparatorTag) _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody
        .get( com.tonbeller.wcf.toolbar.ToolSeparatorTag.class );
    _jspx_th_wcf_005fseparator_005f4.setPageContext( _jspx_page_context );
    _jspx_th_wcf_005fseparator_005f4.setParent( (javax.servlet.jsp.tagext.Tag) _jspx_th_wcf_005ftoolbar_005f0 );
    int _jspx_eval_wcf_005fseparator_005f4 = _jspx_th_wcf_005fseparator_005f4.doStartTag();
    if ( _jspx_th_wcf_005fseparator_005f4.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE ) {
      _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f4 );
      return true;
    }
    _005fjspx_005ftagPool_005fwcf_005fseparator_005fnobody.reuse( _jspx_th_wcf_005fseparator_005f4 );
    return false;
  }
}
