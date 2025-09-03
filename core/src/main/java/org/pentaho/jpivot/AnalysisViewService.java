/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


package org.pentaho.jpivot;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.XMLConstants;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;
import org.dom4j.tree.DefaultElement;
import org.pentaho.actionsequence.dom.ActionInputConstant;
import org.pentaho.actionsequence.dom.ActionSequenceDocument;
import org.pentaho.actionsequence.dom.IActionSequenceDocument;
import org.pentaho.actionsequence.dom.actions.ActionFactory;
import org.pentaho.platform.api.data.IDBDatasourceService;
import org.pentaho.platform.api.engine.IOutputHandler;
import org.pentaho.platform.api.engine.IParameterProvider;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.engine.IRuntimeContext;
import org.pentaho.platform.api.engine.ISolutionEngine;
import org.pentaho.platform.api.engine.ObjectFactoryException;
import org.pentaho.platform.api.engine.PentahoAccessControlException;
import org.pentaho.platform.api.engine.PentahoSystemException;
import org.pentaho.platform.api.util.XmlParseException;
import org.pentaho.platform.engine.core.output.SimpleOutputHandler;
import org.pentaho.platform.engine.core.solution.SimpleParameterProvider;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.engine.services.SoapHelper;
import org.pentaho.platform.engine.services.WebServiceUtil;
import org.pentaho.platform.engine.services.solution.PentahoEntityResolver;
import org.pentaho.platform.plugin.action.mondrian.catalog.IMondrianCatalogService;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCatalog;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCube;
import org.pentaho.platform.util.logging.Logger;
import org.pentaho.platform.util.messages.LocaleHelper;
import org.pentaho.platform.util.web.SimpleUrlFactory;
import org.pentaho.platform.util.xml.dom4j.XmlDom4JHelper;
import org.pentaho.platform.web.http.api.resources.XactionUtil;
import org.pentaho.platform.web.http.request.HttpRequestParameterProvider;
import org.pentaho.platform.web.http.session.HttpSessionParameterProvider;
import org.pentaho.platform.web.servlet.ServletBase;
import org.pentaho.platform.web.servlet.messages.Messages;

public class AnalysisViewService extends ServletBase {

  public static final String jpivotPluginDir = "jpivot";

  public static String ANALYSIS_VIEW_TEMPLATE = "analysis_view_template.xjpivot";

  private static final long serialVersionUID = 831738225052159697L;

  private static final Log logger = LogFactory.getLog( AnalysisViewService.class );

  private final IMondrianCatalogService mondrianCatalogService =
    PentahoSystem.get( IMondrianCatalogService.class, "IMondrianCatalogService", PentahoSessionHolder.getSession() );

  @Override
  public Log getLogger() {
    return AnalysisViewService.logger;
  }

  @Override
  protected void doGet( final HttpServletRequest request, final HttpServletResponse response )
    throws ServletException, IOException {
    String responseEncoding = PentahoSystem.getSystemSetting( "web-service-encoding", "utf-8" );
    String component = request.getParameter( "component" );

    // Check if we need to forward off before getting output stream. Fixes
    // JasperException
    if ( component.equalsIgnoreCase( "newView" ) ) {
      newAnalysisView( request, response );
      return;
    }

    PentahoSystem.systemEntryPoint();

    try {

      boolean wrapWithSoap = "false".equals( request.getParameter( "ajax" ) );

      String content = null;
      try {
        content = getPayloadAsString( request );
      } catch ( IOException ioEx ) {
        String msg = Messages.getInstance()
          .getErrorString( "AdhocWebService.ERROR_0006_FAILED_TO_GET_PAYLOAD_FROM_REQUEST" );
        error( msg, ioEx );
        XmlDom4JHelper.saveDom( WebServiceUtil.createErrorDocument( msg + " " + ioEx.getLocalizedMessage() ),
          response.getOutputStream(), responseEncoding, true );
      }

      IParameterProvider parameterProvider;
      HashMap parameters = new HashMap();

      if ( !StringUtils.isEmpty( content ) ) {
        Document doc = null;
        try {
          doc = XmlDom4JHelper.getDocFromString( content, new PentahoEntityResolver() );
        } catch ( XmlParseException e ) {
          String msg =
            Messages.getInstance().getErrorString( "HttpWebService.ERROR_0001_ERROR_DURING_WEB_SERVICE" );
          error( msg, e );
          XmlDom4JHelper
            .saveDom( WebServiceUtil.createErrorDocument( msg ), response.getOutputStream(), responseEncoding, true );
        }

        List parameterNodes = doc.selectNodes( "//SOAP-ENV:Body/*/*" );
        for ( int i = 0; i < parameterNodes.size(); i++ ) {
          Node parameterNode = (Node) parameterNodes.get( i );
          String parameterName = parameterNode.getName();
          String parameterValue = parameterNode.getText();

          if ( "action".equals( parameterName ) ) {
            parameters.put( "path", parameterValue );
          } else if ( "component".equals( parameterName ) ) {
            component = parameterValue;
          } else {
            parameters.put( parameterName, parameterValue );
          }
        }
        parameterProvider = new SimpleParameterProvider( parameters );
      } else {
        parameterProvider = new HttpRequestParameterProvider( request );
      }

      IPentahoSession userSession = getPentahoSession( request );

      dispatch( request, response, component, parameterProvider, userSession, wrapWithSoap );

    } catch ( IOException ioEx ) {
      String msg =
        Messages.getInstance().getErrorString( "HttpWebService.ERROR_0001_ERROR_DURING_WEB_SERVICE" );
      error( msg, ioEx );
      XmlDom4JHelper
        .saveDom( WebServiceUtil.createErrorDocument( msg ), response.getOutputStream(), responseEncoding, true );
    } catch ( PentahoSystemException | PentahoAccessControlException ex ) {
      String msg = ex.getLocalizedMessage();
      error( msg, ex );

      XmlDom4JHelper.saveDom( WebServiceUtil.createErrorDocument( msg ), response.getOutputStream(),
        responseEncoding, true );
    } finally {
      PentahoSystem.systemExitPoint();
    }
  }

  protected void dispatch( final HttpServletRequest request, final HttpServletResponse response, final String component,
                           final IParameterProvider parameterProvider,
                           final IPentahoSession userSession, final boolean wrapWithSoap )
    throws IOException, PentahoSystemException, PentahoAccessControlException {
    if ( "createNewView".equals( component ) ) {
      createNewView( userSession, parameterProvider, request, response, wrapWithSoap );
    } else if ( "listCatalogs".equals( component ) ) {
      listCatalogs( userSession, response.getOutputStream(), wrapWithSoap );
    }
  }

  private void newAnalysisView( final HttpServletRequest request, final HttpServletResponse response )
    throws IOException {

    PentahoSystem.systemEntryPoint();
    try {
      List<MondrianCatalog> catalogs = mondrianCatalogService.listCatalogs( getPentahoSession( request ), true );
      String newAnalysisViewTemplate = "system" + File.separator + jpivotPluginDir + File.separator
        + "resources" + File.separator + "new_analysis_view.html";

      String file = PentahoSystem.getApplicationContext().getSolutionPath( newAnalysisViewTemplate );
      String content = FileUtils.readFileToString( new File( file ), LocaleHelper.getSystemEncoding() );
      content = content.replaceAll( "\\{context\\}", request.getContextPath() );
      String json = new JsonBuilder().generateJsonForResponse( catalogs );
      content = content.replaceAll( "\\{json\\}", json );

      response.getWriter().print( content );
    } finally {
      PentahoSystem.systemExitPoint();
    }
  }

  public void listCatalogs( final IPentahoSession userSession, final OutputStream outputStream,
                            final boolean wrapWithSoap ) throws IOException {
    List<MondrianCatalog> catalogs = mondrianCatalogService.listCatalogs( userSession, true );
    Element rootElement = new DefaultElement( "catalogs" );
    Document doc = DocumentHelper.createDocument( rootElement );

    for ( MondrianCatalog catalog : catalogs ) {
      Element catalogElement = rootElement.addElement( "catalog" ).addAttribute( "name", catalog.getName() );
      Element schemaElement = catalogElement.addElement( "schema" )
        .addAttribute( "name", catalog.getSchema().getName() );
      Element cubesElement = schemaElement.addElement( "cubes" );

      for ( MondrianCube cube : catalog.getSchema().getCubes() ) {
        cubesElement.addElement( "cube" ).addAttribute( "name", cube.getName() );
      }
    }

    if ( wrapWithSoap ) {
      XmlDom4JHelper.saveDom( SoapHelper.createSoapResponseDocument( doc ), outputStream,
        PentahoSystem.getSystemSetting( "web-service-encoding", "utf-8" ), true );
    } else {
      XmlDom4JHelper
        .saveDom( doc, outputStream, PentahoSystem.getSystemSetting( "web-service-encoding", "utf-8" ), true );
    }
  }

  public void createNewView( final IPentahoSession session, final IParameterProvider parameterProvider,
                             final HttpServletRequest request, final HttpServletResponse response,
                             final boolean wrapWithSoap )
    throws IOException, PentahoSystemException, PentahoAccessControlException {

    try {
      String solutionName = parameterProvider.getStringParameter( "solution", null );
      String model = parameterProvider.getStringParameter( "schema", null );
      String cube = parameterProvider.getStringParameter( "cube", null );
      String title = parameterProvider.getStringParameter( "name", null );
      String description = parameterProvider.getStringParameter( "descr", null );
      String jndi = null;
      String jdbc = null;
      String xactionFilename = parameterProvider.getStringParameter( "actionName", null );

      // get reference to selected mondrian catalog
      MondrianCatalog selectedCatalog = mondrianCatalogService.getCatalog( model, session );

      // validate parameters
      if ( selectedCatalog == null ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0004_MODEL_NULL" ) );
      }

      if ( selectedCatalog.isJndi() ) {
        // by default, this datasource should be unbound. we still support fully
        // qualified JNDI names
        // specified in the datasources.xml
        try {
          IDBDatasourceService datasourceService =
            PentahoSystem.getObjectFactory().get( IDBDatasourceService.class, null );
          jndi = datasourceService.getDSUnboundName( selectedCatalog.getJndi() );
        } catch ( ObjectFactoryException objface ) {
          Logger.error( "AnalysisViewService", Messages.getInstance()
            .getErrorString( "AnalysisViewService.ERROR_0001_UNABLE_TO_FACTORY_OBJECT", jndi ), objface );
        }
      } else {
        jdbc = null;
      }

      model = selectedCatalog.getDefinition();

      if ( ( solutionName == null ) || solutionName.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0001_SOLUTION_NAME_NULL" ) );
      }
      if ( ( title == null ) || title.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0003_TITLE_NULL" ) );
      }
      if ( ( model == null ) || model.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0004_MODEL_NULL" ) );
      }
      if ( ( description == null ) || description.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0005_DESCRIPTION_NULL" ) );
      }
      if ( ( jndi == null ) || jndi.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0006_JNDI_NULL" ) );
      }
      if ( ( cube == null ) || cube.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0007_CUBE_NULL" ) );
      }
      if ( ( xactionFilename == null ) || xactionFilename.equals( "" ) ) {
        throw new PentahoSystemException(
          Messages.getInstance().getString( "AnalysisViewService.ERROR_0008_XACTION_NULL" ) );
      }

      if ( !xactionFilename.endsWith( ".xjpivot" ) ) {
        xactionFilename += ".xjpivot";
      }

      String xaction = generateXAction( session, title, description, model, jndi, jdbc, cube );

      String instanceId = request.getParameter( "instance-id" );

      IOutputHandler outputHandler = XactionUtil.createOutputHandler( response, XactionUtil
        .getOutputStream( response, false ) );

      ISolutionEngine solutionEngine = PentahoSystem.get( ISolutionEngine.class );
      solutionEngine.init( PentahoSessionHolder.getSession() );

      ArrayList messages = new ArrayList();
      HttpRequestParameterProvider requestParameters = new HttpRequestParameterProvider( request );
      HttpSessionParameterProvider sessionParameters =
        new HttpSessionParameterProvider( PentahoSessionHolder.getSession() );

      HashMap parameterProviders = new HashMap();
      requestParameters.setParameter( PivotViewComponent.MODE, "redirect" );
      parameterProviders.put( HttpRequestParameterProvider.SCOPE_REQUEST, requestParameters );
      parameterProviders.put( HttpSessionParameterProvider.SCOPE_SESSION, sessionParameters );

      SimpleUrlFactory urlFactory = new SimpleUrlFactory( "" );

      solutionEngine.execute( xaction, xactionFilename, Messages.getInstance().getString( "BaseTest.DEBUG_JUNIT_TEST" ),
        false, true, instanceId, false, parameterProviders, outputHandler, null,
        urlFactory, messages );

    } catch ( Exception e ) {
      e.printStackTrace( response.getWriter() );

    }
  }

  public String generateXAction( final IPentahoSession session, final String title, final String description,
                                 final String model, final String jndi, final String jdbc, final String cube )
    throws PentahoSystemException {

    // makes sure the class has been loaded.
    if ( ActionFactory.getActionDefinition( "PivotViewAction" ) == null ) {
      ActionFactory.pluginActions.put( "PivotViewAction", PivotViewAction.class );
    }

    ActionSequenceDocument doc = loadAnalysisViewTemplate( session );
    doc.setTitle( title );
    if ( session.getName() != null ) {
      doc.setAuthor( session.getName() );
    } else {
      doc.setAuthor( "Analysis View" );
    }

    doc.setDescription( description );

    PivotViewAction action = (PivotViewAction) doc.getElement(
      "/" + IActionSequenceDocument.ACTION_SEQUENCE + "/" + IActionSequenceDocument.ACTIONS_NAME + "/"
        + IActionSequenceDocument.ACTION_DEFINITION_NAME
        + "[component-name='PivotViewComponent']" );
    action.setModel( new ActionInputConstant( model, null ) );
    if ( jndi != null ) {
      action.setJndi( new ActionInputConstant( jndi, null ) );
    } else {
      // note, pivot view action does not support jdbc based connections at this
      // time
      throw new PentahoSystemException(
        Messages.getInstance().getErrorString( "AnalysisViewService.ERROR_0006_JNDI_NULL" ) );
    }

    // TODO: add JDBC datasource support
    if ( cube != null ) {
      action.setComponentDefinition( "cube", cube );
    }

    return doc.toString();
  }

  /**
   * on pentaho system startup, load the mondrian.properties file from system/mondrian/mondrian.properties
   */
  public ActionSequenceDocument loadAnalysisViewTemplate( final IPentahoSession session )
    throws PentahoSystemException {

    String analysisViewTemplate = "system" + File.separator + jpivotPluginDir + File.separator
      + "resources" + File.separator + AnalysisViewService.ANALYSIS_VIEW_TEMPLATE;
    InputStream is = null;

    try {
      File f = new File( PentahoSystem.getApplicationContext().getSolutionPath( analysisViewTemplate ) );
      if ( f.exists() ) {
        is = new FileInputStream( f );
        SAXReader reader = new SAXReader();
        reader.setFeature( "http://apache.org/xml/features/disallow-doctype-decl", true );
        reader.setFeature( XMLConstants.FEATURE_SECURE_PROCESSING, true );
        reader.setFeature( "http://xml.org/sax/features/external-general-entities", false );
        reader.setFeature( "http://xml.org/sax/features/external-parameter-entities", false );
        reader.setFeature( "http://apache.org/xml/features/nonvalidating/load-external-dtd", false );
        Document doc = reader.read( is );
        return new ActionSequenceDocument( doc );
      } else {
        throw new PentahoSystemException( Messages.getInstance()
          .getString( "AnalysisViewService.ERROR_0009_TEMPLATE_DOES_NOT_EXIST", analysisViewTemplate ) );
      }
    } catch ( Exception e ) {
      throw new PentahoSystemException( Messages.getInstance()
        .getString( "AnalysisViewService.ERROR_0010_TEMPLATE_DOES_NOT_PARSE", analysisViewTemplate ), e );
    } finally {
      try {
        if ( is != null ) {
          is.close();
        }
      } catch ( IOException e ) {
        // ignore
      }
    }
  }

  public String getPayloadAsString( final HttpServletRequest request ) throws IOException {
    InputStream is = request.getInputStream();
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    String content;

    byte[] buffer = new byte[ 2048 ];
    int b = is.read( buffer );
    while ( b > 0 ) {
      os.write( buffer, 0, b );
      b = is.read( buffer );
    }

    content = os.toString( LocaleHelper.getSystemEncoding() );
    return content;
  }

  private void sendXActionError( final String errorString, final HttpServletRequest request,
                                 final HttpServletResponse response ) throws IOException {
    request.setAttribute( "errorMessage", errorString );
    response.getWriter().println( errorString );
  }

  public IRuntimeContext getNewAnalysisViewRuntime( HttpServletRequest request, IPentahoSession userSession )
    throws PentahoSystemException {
    String schema = request.getParameter( "schema" );
    String cube = request.getParameter( "cube" );
    String instanceId = request.getParameter( "instance-id" );

    String jndi = null;
    String jdbc = null;
    IMondrianCatalogService mondrianCatalogService =
      PentahoSystem.get( IMondrianCatalogService.class, "IMondrianCatalogService", userSession );

    // get reference to selected mondrian catalog
    MondrianCatalog selectedCatalog = mondrianCatalogService.getCatalog( schema, userSession );

    // validate parameters
    if ( selectedCatalog == null ) {
      throw new PentahoSystemException(
        Messages.getInstance().getString( "AnalysisViewService.ERROR_0004_MODEL_NULL" ) );
    }

    if ( selectedCatalog.isJndi() ) {
      // by default, this datasource should be unbound. we still support fully
      // qualified JNDI names
      // specified in the datasources.xml
      try {
        IDBDatasourceService datasourceService =
          PentahoSystem.getObjectFactory().get( IDBDatasourceService.class, null );
        jndi = datasourceService.getDSUnboundName( selectedCatalog.getJndi() );
      } catch ( ObjectFactoryException objface ) {
        Logger.error( "AnalysisViewService",
          Messages.getInstance().getErrorString( "AnalysisViewService.ERROR_0001_UNABLE_TO_FACTORY_OBJECT", jndi ),
          objface );
      }
    } else {
      jdbc = null;
    }

    String model = selectedCatalog.getDefinition();

    if ( ( model == null ) || model.equals( "" ) ) {
      throw new PentahoSystemException(
        Messages.getInstance().getString( "AnalysisViewService.ERROR_0004_MODEL_NULL" ) );
    }

    if ( ( jndi == null ) || jndi.equals( "" ) ) {
      throw new PentahoSystemException(
        Messages.getInstance().getString( "AnalysisViewService.ERROR_0006_JNDI_NULL" ) );
    }

    if ( ( cube == null ) || cube.equals( "" ) ) {
      throw new PentahoSystemException(
        Messages.getInstance().getString( "AnalysisViewService.ERROR_0007_CUBE_NULL" ) );
    }

    String xaction = new AnalysisViewService()
      .generateXAction( userSession, Messages.getInstance().getString( "BaseTest.DEFAULT_TITLE" ),
        Messages.getInstance().getString( "BaseTest.DEFAULT_DESCRIPTION" ), model, jndi, jdbc, cube );

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    SimpleOutputHandler outputHandler = new SimpleOutputHandler( outputStream, true );
    ISolutionEngine solutionEngine = PentahoSystem.get( ISolutionEngine.class, userSession );
    solutionEngine.init( userSession );

    ArrayList messages = new ArrayList();
    HttpRequestParameterProvider requestParameters = new HttpRequestParameterProvider( request );
    HttpSessionParameterProvider sessionParameters = new HttpSessionParameterProvider( userSession );

    HashMap parameterProviders = new HashMap();
    requestParameters.setParameter( PivotViewComponent.MODE, PivotViewComponent.EXECUTE );
    parameterProviders.put( HttpRequestParameterProvider.SCOPE_REQUEST, requestParameters );
    parameterProviders.put( HttpSessionParameterProvider.SCOPE_SESSION, sessionParameters );

    SimpleUrlFactory urlFactory = new SimpleUrlFactory( "" );

    IRuntimeContext context = solutionEngine.execute( xaction, "default.xjpivot",
      Messages.getInstance().getString( "BaseTest.DEBUG_JUNIT_TEST" ), false, true, instanceId,
      false, parameterProviders, outputHandler, null, urlFactory, messages );


    if ( context != null && context.getStatus() == IRuntimeContext.RUNTIME_STATUS_SUCCESS ) {
      return context;
    } else {
      return null;
    }
  }

}
