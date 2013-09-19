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

package org.pentaho.jpivot;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;
import org.dom4j.tree.DefaultElement;
import org.owasp.esapi.codecs.JavaScriptCodec;
import org.pentaho.actionsequence.dom.ActionInputConstant;
import org.pentaho.actionsequence.dom.ActionSequenceDocument;
import org.pentaho.actionsequence.dom.IActionSequenceDocument;
import org.pentaho.actionsequence.dom.actions.ActionFactory;
import org.pentaho.platform.api.data.IDBDatasourceService;
import org.pentaho.platform.api.engine.IActionSequenceResource;
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
import org.pentaho.platform.engine.core.solution.ActionInfo;
import org.pentaho.platform.engine.core.solution.SimpleParameterProvider;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.engine.services.SoapHelper;
import org.pentaho.platform.engine.services.WebServiceUtil;
import org.pentaho.platform.engine.services.actionsequence.ActionSequenceResource;
import org.pentaho.platform.engine.services.solution.PentahoEntityResolver;
import org.pentaho.platform.plugin.action.mondrian.catalog.IMondrianCatalogService;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCatalog;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCube;
//import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianDataSource;
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

  public static final String jpivotPluginDir;
  static {
      // the plugin dir will be in one of 2 location
      File f = new File(PentahoSystem.getApplicationContext()
              .getSolutionPath("system" + File.separator + "pentaho-jpivot-plugin"));
      if (f.exists()) {
          jpivotPluginDir = "pentaho-jpivot-plugin";
      } else {
          jpivotPluginDir = "pentaho-jpivot-plugin-legacy";
      }
  }

  public static String ANALYSIS_VIEW_TEMPLATE = "analysis_view_template.xjpivot"; //$NON-NLS-1$

  private static final long serialVersionUID = 831738225052159697L;

  private static final Log logger = LogFactory.getLog(AnalysisViewService.class);

  private final IMondrianCatalogService mondrianCatalogService = PentahoSystem.get(IMondrianCatalogService.class, "IMondrianCatalogService", PentahoSessionHolder.getSession()); //$NON-NLS-1$

  @Override
  public Log getLogger() {
    return AnalysisViewService.logger;
  }

  @Override
  protected void doGet(final HttpServletRequest request, final HttpServletResponse response) throws ServletException, IOException {
    String responseEncoding = PentahoSystem.getSystemSetting("web-service-encoding", "utf-8");
    String component = request.getParameter("component"); //$NON-NLS-1$

    // Check if we need to forward off before getting output stream. Fixes
    // JasperException
    if (component.equalsIgnoreCase("newView")) { //$NON-NLS-1$
      newAnalysisView(request, response);
      return;
    }

    PentahoSystem.systemEntryPoint();

    try {

      boolean wrapWithSoap = "false".equals(request.getParameter("ajax")); //$NON-NLS-1$ //$NON-NLS-2$
      String actionPath = request.getParameter("path"); //$NON-NLS-1$
      String content = null;
      try {
        content = getPayloadAsString(request);
      } catch (IOException ioEx) {
        String msg = Messages.getInstance().getErrorString("AdhocWebService.ERROR_0006_FAILED_TO_GET_PAYLOAD_FROM_REQUEST"); //$NON-NLS-1$
        error(msg, ioEx);
        XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(msg + " " + ioEx.getLocalizedMessage()), response.getOutputStream(), responseEncoding, true);
      }
      IParameterProvider parameterProvider = null;
      HashMap parameters = new HashMap();

      if (!StringUtils.isEmpty(content)) {
        Document doc = null;
        try {
          doc = XmlDom4JHelper.getDocFromString(content, new PentahoEntityResolver());
        } catch (XmlParseException e) {
          String msg = Messages.getInstance().getErrorString("HttpWebService.ERROR_0001_ERROR_DURING_WEB_SERVICE"); //$NON-NLS-1$
          error(msg, e);
          XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(msg), response.getOutputStream(), responseEncoding, true);
        }

        List parameterNodes = doc.selectNodes("//SOAP-ENV:Body/*/*"); //$NON-NLS-1$
        for (int i = 0; i < parameterNodes.size(); i++) {
          Node parameterNode = (Node) parameterNodes.get(i);
          String parameterName = parameterNode.getName();
          String parameterValue = parameterNode.getText();
          // String type = parameterNode.selectSingleNode( "@type" );
          // if( "xml-data".equalsIgnoreCase( ) )
          if ("action".equals(parameterName)) { //$NON-NLS-1$
//            ActionInfo info = ActionInfo.parseActionString(parameterValue);
//            solutionName = info.getSolutionName();
//            actionPath = info.getPath();
//            actionName = info.getActionName();
//            parameters.put("solution", solutionName); //$NON-NLS-1$
            parameters.put("path", parameterValue); //$NON-NLS-1$
//            parameters.put("name", actionName); //$NON-NLS-1$         
          } else if ("component".equals(parameterName)) { //$NON-NLS-1$  
            component = parameterValue;
          } else {
            parameters.put(parameterName, parameterValue);
          }
        }
        parameterProvider = new SimpleParameterProvider(parameters);
      } else {
        parameterProvider = new HttpRequestParameterProvider(request);
      }

//      if (!"generatePreview".equals(component)) { //$NON-NLS-1$
//        response.setContentType("text/xml"); //$NON-NLS-1$
//        response.setCharacterEncoding(responseEncoding);
//      }

      // PentahoHttpSession userSession = new PentahoHttpSession(
      // request.getRemoteUser(), request.getSession(),
      // request.getLocale() );
      IPentahoSession userSession = getPentahoSession(request);

      // send the header of the message to prevent time-outs while we are
      // working
      //response.setHeader("expires", "0"); //$NON-NLS-1$ //$NON-NLS-2$

      dispatch(request, response, component, parameterProvider, userSession, wrapWithSoap);

    } catch (IOException ioEx) {
      String msg = Messages.getInstance().getErrorString("HttpWebService.ERROR_0001_ERROR_DURING_WEB_SERVICE"); //$NON-NLS-1$
      error(msg, ioEx);
      XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(msg), response.getOutputStream(), responseEncoding, true);
    } catch (PentahoSystemException ex) {
      String msg = ex.getLocalizedMessage();
      error(msg, ex);
      XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(msg), response.getOutputStream(), responseEncoding, true);
    } catch (PentahoAccessControlException ex) {
      String msg = ex.getLocalizedMessage();
      error(msg, ex);
      XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(msg), response.getOutputStream(), responseEncoding, true);
    } finally {
      PentahoSystem.systemExitPoint();
    }
  }

  protected void dispatch(final HttpServletRequest request, final HttpServletResponse response, final String component, final IParameterProvider parameterProvider,
      final IPentahoSession userSession, final boolean wrapWithSoap) throws IOException, PentahoSystemException, PentahoAccessControlException {
    if ("createNewView".equals(component)) { //$NON-NLS-1$
      createNewView(userSession, parameterProvider, request, response, wrapWithSoap);
    } else if ("listCatalogs".equals(component)) { //$NON-NLS-1$
      listCatalogs(userSession, response.getOutputStream(), wrapWithSoap);
    }
  }

  private void newAnalysisView(final HttpServletRequest request, final HttpServletResponse response) throws IOException {

    PentahoSystem.systemEntryPoint();
    try {
      List<MondrianCatalog> catalogs = mondrianCatalogService.listCatalogs(getPentahoSession(request), true);
      String newAnalysisViewTemplate = "system" + File.separator + jpivotPluginDir + File.separator + "resources" + File.separator + "new_analysis_view.html"; //$NON-NLS-1$ //$NON-NLS-2$
      String file = PentahoSystem.getApplicationContext().getSolutionPath(newAnalysisViewTemplate);
      BufferedReader br = new BufferedReader(new FileReader(file));
      String content = "";
      String line = br.readLine();
      while (line != null) {
        content += line + "\n";
        line = br.readLine();
      }
      content = content.replaceAll("\\{context\\}", request.getContextPath());
      String json = "[";
      // json representation
      int count = 0;
      for (MondrianCatalog catalog : catalogs) {
        if (count != 0) {
          json += ",";
        }
        json += "{schema:\"" + StringEscapeUtils.escapeJavaScript(catalog.getSchema().getName()) + "\", cubes:[";
        int ccount = 0;
        for (MondrianCube cube : catalog.getSchema().getCubes()) {
          if (ccount != 0) {
            json += ",";
          }
          json += "\"" + StringEscapeUtils.escapeJavaScript(cube.getName()) + "\""; 
          ccount++;
        }
        json += "]}\n";
        count++;
      }
      catalogs.get(0).getSchema().getName();
      json += "]";
      content = content.replaceAll("\\{json\\}", json);
      response.getWriter().print(content);

      // request.setAttribute("catalog", catalogs); //$NON-NLS-1$
//      try {
//        RequestDispatcher dispatcher = request.getRequestDispatcher("NewAnalysisView"); //$NON-NLS-1$
//        if (dispatcher != null) {
//          dispatcher.forward(request, response);
//        }
//      } catch (ServletException e) {
//        XmlDom4JHelper.saveDom(WebServiceUtil.createErrorDocument(e.getMessage()), response.getOutputStream(), LocaleHelper.getSystemEncoding(), true);
//      }
    } finally {
      PentahoSystem.systemExitPoint();
    }
  }

    
  public void listCatalogs(final IPentahoSession userSession, final OutputStream outputStream, final boolean wrapWithSoap) throws IOException {
    StringBuilder builder = new StringBuilder();
    List<MondrianCatalog> catalogs = mondrianCatalogService.listCatalogs(userSession, true);
    Element rootElement = new DefaultElement("catalogs"); //$NON-NLS-1$
    Document doc = DocumentHelper.createDocument(rootElement);
    for (MondrianCatalog catalog : catalogs) {
      Element catalogElement = rootElement.addElement("catalog").addAttribute("name", catalog.getName()); //$NON-NLS-1$ //$NON-NLS-2$
      Element schemaElement = catalogElement.addElement("schema").addAttribute("name", catalog.getSchema().getName()); //$NON-NLS-1$ //$NON-NLS-2$
      Element cubesElement = schemaElement.addElement("cubes"); //$NON-NLS-1$
      for (MondrianCube cube : catalog.getSchema().getCubes()) {
        cubesElement.addElement("cube").addAttribute("name", cube.getName()); //$NON-NLS-1$ //$NON-NLS-2$
      }
    }
    if (wrapWithSoap) {
      XmlDom4JHelper.saveDom(SoapHelper.createSoapResponseDocument(doc), outputStream, PentahoSystem.getSystemSetting("web-service-encoding", "utf-8"), true);
    } else {
      XmlDom4JHelper.saveDom(doc, outputStream, PentahoSystem.getSystemSetting("web-service-encoding", "utf-8"), true);
    }
  }

  public void createNewView(final IPentahoSession session, final IParameterProvider parameterProvider, final HttpServletRequest request, final HttpServletResponse response, final boolean wrapWithSoap) throws IOException, PentahoSystemException, PentahoAccessControlException {

    try {
      String solutionName = parameterProvider.getStringParameter("solution", null); //$NON-NLS-1$
      String solutionPath = parameterProvider.getStringParameter("actionPath", null); //$NON-NLS-1$
      String model = parameterProvider.getStringParameter("schema", null); //$NON-NLS-1$
      String cube = parameterProvider.getStringParameter("cube", null); //$NON-NLS-1$    
      String title = parameterProvider.getStringParameter("name", null); //$NON-NLS-1$
      String description = parameterProvider.getStringParameter("descr", null); //$NON-NLS-1$
      String jndi = null;
      String jdbc = null;
      String xactionFilename = parameterProvider.getStringParameter("actionName", null); //$NON-NLS-1$

      // get reference to selected mondrian catalog
      MondrianCatalog selectedCatalog = mondrianCatalogService.getCatalog(model, session);

      // validate parameters
      if (selectedCatalog == null) {
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0004_MODEL_NULL")); //$NON-NLS-1$
      }

      // MondrianDataSource datasource =
      // selectedCatalog.getEffectiveDataSource();

      if (selectedCatalog.isJndi()) {
        // by default, this datasource should be unbound. we still support fully
        // qualified JNDI names
        // specified in the datasources.xml
        try {
          IDBDatasourceService datasourceService = PentahoSystem.getObjectFactory().get(IDBDatasourceService.class, null);
          jndi = datasourceService.getDSUnboundName(selectedCatalog.getJndi());
        } catch (ObjectFactoryException objface) {
          Logger.error("AnalysisViewService", Messages.getInstance().getErrorString("AnalysisViewService.ERROR_0001_UNABLE_TO_FACTORY_OBJECT", jndi), objface); //$NON-NLS-1$ //$NON-NLS-2$
        }
      } else {
        jdbc = null; // datasource.getJdbc();
      }

      model = selectedCatalog.getDefinition();

      if ((solutionName == null) || solutionName.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0001_SOLUTION_NAME_NULL")); //$NON-NLS-1$
      }
      if ((solutionPath == null) || solutionPath.equals("")) { //$NON-NLS-1$
        solutionPath = "/"; //$NON-NLS-1$
      }
      if ((title == null) || title.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0003_TITLE_NULL")); //$NON-NLS-1$
      }
      if ((model == null) || model.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0004_MODEL_NULL")); //$NON-NLS-1$
      }
      if ((description == null) || description.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0005_DESCRIPTION_NULL")); //$NON-NLS-1$
      }
      if ((jndi == null) || jndi.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0006_JNDI_NULL")); //$NON-NLS-1$
      }
      if ((cube == null) || cube.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0007_CUBE_NULL")); //$NON-NLS-1$
      }
      if ((xactionFilename == null) || xactionFilename.equals("")) { //$NON-NLS-1$
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0008_XACTION_NULL")); //$NON-NLS-1$
      }
      String path = solutionName;
      if (!solutionName.endsWith("/") && !solutionPath.startsWith("/")) { //$NON-NLS-1$ //$NON-NLS-2$
        path += "/"; //$NON-NLS-1$
      }

      if (!xactionFilename.endsWith(".xjpivot")) { //$NON-NLS-1$
        xactionFilename += ".xjpivot"; //$NON-NLS-1$
      }

      path += solutionPath;

      boolean overwrite = parameterProvider.getStringParameter("overwrite", "false").equalsIgnoreCase("true"); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$

      String xaction = generateXAction(session, title, description, model, jndi, jdbc, cube);
      
      String processId = "PivotView"; //$NON-NLS-1$
      String instanceId = request.getParameter( "instance-id" ); //$NON-NLS-1$
      boolean doMessages = "true".equalsIgnoreCase( request.getParameter("debug" ) ); //$NON-NLS-1$ //$NON-NLS-2$

//      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      IOutputHandler outputHandler = XactionUtil.createOutputHandler(response, XactionUtil.getOutputStream(response, false));
      
//      SimpleOutputHandler outputHandler = new SimpleOutputHandler( outputStream, true );
      ISolutionEngine solutionEngine = PentahoSystem.get(ISolutionEngine.class);
      solutionEngine.init( PentahoSessionHolder.getSession() );
      IRuntimeContext context = null;
      ArrayList messages = new ArrayList();
      HttpRequestParameterProvider requestParameters = new HttpRequestParameterProvider( request );
      HttpSessionParameterProvider sessionParameters = new HttpSessionParameterProvider( PentahoSessionHolder.getSession() );
      HashMap parameterProviders = new HashMap();
      requestParameters.setParameter( PivotViewComponent.MODE, "redirect" ); //$NON-NLS-1$ //$NON-NLS-2$
      parameterProviders.put( HttpRequestParameterProvider.SCOPE_REQUEST, requestParameters ); //$NON-NLS-1$
      parameterProviders.put( HttpSessionParameterProvider.SCOPE_SESSION, sessionParameters ); //$NON-NLS-1$
      SimpleUrlFactory urlFactory = new SimpleUrlFactory(""); //$NON-NLS-1$
  
      context = solutionEngine.execute(xaction, xactionFilename, Messages.getInstance().getString("BaseTest.DEBUG_JUNIT_TEST"), false, true, instanceId, false, parameterProviders, outputHandler, null, urlFactory, messages ); //$NON-NLS-1$
  
    } catch (Exception e) {
      e.printStackTrace(response.getWriter());
      
      // sendXActionError(e.getMessage(), request, response);
    }
  }

  public String generateXAction(final IPentahoSession session, final String title, final String description, final String model, final String jndi, final String jdbc, final String cube) throws PentahoSystemException {

    // makes sure the class has been loaded.
    if (ActionFactory.getActionDefinition("PivotViewAction") == null) {
      ActionFactory.pluginActions.put("PivotViewAction", PivotViewAction.class);
    }
    
    ActionSequenceDocument doc = loadAnalysisViewTemplate(session);
    doc.setTitle(title);
    if (session.getName() != null) {
      doc.setAuthor(session.getName());
    } else {
      doc.setAuthor("Analysis View"); //$NON-NLS-1$
    }
    doc.setDescription(description);

    PivotViewAction action = (PivotViewAction) doc.getElement("/" + IActionSequenceDocument.ACTION_SEQUENCE + "/" + IActionSequenceDocument.ACTIONS_NAME + "/" + IActionSequenceDocument.ACTION_DEFINITION_NAME + "[component-name='PivotViewComponent']"); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
    action.setModel(new ActionInputConstant(model, null));
    if (jndi != null) {
      action.setJndi(new ActionInputConstant(jndi, null));
    } else {
      // note, pivot view action does not support jdbc based connections at this
      // time
      throw new PentahoSystemException(Messages.getInstance().getErrorString("AnalysisViewService.ERROR_0006_JNDI_NULL")); //$NON-NLS-1$
    }

    // TODO: add JDBC datasource support
    if (cube != null) {
      action.setComponentDefinition("cube", cube); //$NON-NLS-1$
    }

    return doc.toString();
  }

  /**
   * on pentaho system startup, load the mondrian.properties file from
   * system/mondrian/mondrian.properties
   */
  public ActionSequenceDocument loadAnalysisViewTemplate(final IPentahoSession session) throws PentahoSystemException {

    String analysisViewTemplate = "system" + File.separator + jpivotPluginDir + File.separator + "resources" + File.separator + AnalysisViewService.ANALYSIS_VIEW_TEMPLATE; //$NON-NLS-1$ //$NON-NLS-2$
    InputStream is = null;

    try {
      File f = new File(PentahoSystem.getApplicationContext().getSolutionPath(analysisViewTemplate));
      if (f.exists()) {
        is = new FileInputStream(f);
        SAXReader reader = new SAXReader();
        Document doc = reader.read(is);
        return new ActionSequenceDocument(doc);
      } else {
        throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0009_TEMPLATE_DOES_NOT_EXIST", analysisViewTemplate)); //$NON-NLS-1$
      }
    } catch (Exception e) {
      throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0010_TEMPLATE_DOES_NOT_PARSE", analysisViewTemplate), e); //$NON-NLS-1$
    } finally {
      try {
        if (is != null) {
          is.close();
        }
      } catch (IOException e) {
        // ignore
      }
    }
  }

  public String getPayloadAsString(final HttpServletRequest request) throws IOException {
    InputStream is = request.getInputStream();
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    String content = null;

    byte buffer[] = new byte[2048];
    int b = is.read(buffer);
    while (b > 0) {
      os.write(buffer, 0, b);
      b = is.read(buffer);
    }
    content = os.toString(LocaleHelper.getSystemEncoding());
    return content;
  }

  private void sendXActionError(final String errorString, final HttpServletRequest request, final HttpServletResponse response) throws IOException {
    request.setAttribute("errorMessage", errorString); //$NON-NLS-1$
    //newAnalysisView(request, response);
    response.getWriter().println(errorString);
    
  }
  
  public IRuntimeContext getNewAnalysisViewRuntime(HttpServletRequest request, IPentahoSession userSession ) throws PentahoSystemException {
    String schema = request.getParameter("schema"); //$NON-NLS-1$
    String cube = request.getParameter("cube"); //$NON-NLS-1$
    String instanceId = request.getParameter( "instance-id" ); //$NON-NLS-1$

    String jndi = null;
    String jdbc = null;
    IMondrianCatalogService mondrianCatalogService = PentahoSystem.get(IMondrianCatalogService.class, "IMondrianCatalogService", userSession); //$NON-NLS-1$

    // get reference to selected mondrian catalog
    MondrianCatalog selectedCatalog = mondrianCatalogService.getCatalog(schema, userSession);

    // validate parameters
    if (selectedCatalog == null) {
      throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0004_MODEL_NULL")); //$NON-NLS-1$
    }

    if (selectedCatalog.isJndi()) {
      // by default, this datasource should be unbound. we still support fully
      // qualified JNDI names
      // specified in the datasources.xml
      try {
        IDBDatasourceService datasourceService = PentahoSystem.getObjectFactory().get(IDBDatasourceService.class, null);
        jndi = datasourceService.getDSUnboundName(selectedCatalog.getJndi());
      } catch (ObjectFactoryException objface) {
        Logger.error("AnalysisViewService", Messages.getInstance().getErrorString("AnalysisViewService.ERROR_0001_UNABLE_TO_FACTORY_OBJECT", jndi), objface); //$NON-NLS-1$ //$NON-NLS-2$
      }
    } else {
      jdbc = null; // datasource.getJdbc();
    }

    String model = selectedCatalog.getDefinition();
    
    if ((model == null) || model.equals("")) { //$NON-NLS-1$
      throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0004_MODEL_NULL")); //$NON-NLS-1$
    }
    
    if ((jndi == null) || jndi.equals("")) { //$NON-NLS-1$
      throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0006_JNDI_NULL")); //$NON-NLS-1$
    }
    
    if ((cube == null) || cube.equals("")) { //$NON-NLS-1$
      throw new PentahoSystemException(Messages.getInstance().getString("AnalysisViewService.ERROR_0007_CUBE_NULL")); //$NON-NLS-1$
    }
    
    String xaction = new AnalysisViewService().generateXAction(userSession, Messages.getInstance().getString("BaseTest.DEFAULT_TITLE"), Messages.getInstance().getString("BaseTest.DEFAULT_DESCRIPTION"), model, jndi, jdbc, cube);
    
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    SimpleOutputHandler outputHandler = new SimpleOutputHandler( outputStream, true );
    ISolutionEngine solutionEngine = PentahoSystem.get(ISolutionEngine.class, userSession);
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

    // context = solutionEngine.execute( solutionName + "/" + actionPath, actionName, Messages.getInstance().getString("BaseTest.DEBUG_JUNIT_TEST"), false, true, instanceId, false, parameterProviders, outputHandler, null, urlFactory, messages ); //$NON-NLS-1$

    context = solutionEngine.execute(xaction, "default.xjpivot", Messages.getInstance().getString("BaseTest.DEBUG_JUNIT_TEST"), false, true, instanceId, false, parameterProviders, outputHandler, null, urlFactory, messages ); //$NON-NLS-1$

    
    if( context != null && context.getStatus() == IRuntimeContext.RUNTIME_STATUS_SUCCESS ) {
      return context;
    } else {
      return null;
    }
  }

}
