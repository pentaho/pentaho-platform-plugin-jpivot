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
 * Copyright 2007 - 2013 Pentaho Corporation.  All rights reserved.
 *
 * @created Jun 29, 2007 
 * @author wseyler
 */

package org.pentaho.jpivot;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.repository2.unified.IUnifiedRepository;
import org.pentaho.platform.api.repository2.unified.RepositoryFile;
import org.pentaho.platform.api.repository2.unified.UnifiedRepositoryException;
import org.pentaho.platform.api.repository2.unified.data.simple.SimpleRepositoryFileData;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.engine.services.PentahoMessenger;
import org.pentaho.platform.engine.services.SolutionURIResolver;
import org.pentaho.platform.engine.services.actionsequence.ActionSequenceResource;
import org.pentaho.platform.plugin.action.messages.Messages;
import org.pentaho.platform.plugin.action.mondrian.InvalidDocumentException;
import org.pentaho.platform.plugin.action.mondrian.MissingParameterException;
import org.pentaho.platform.util.messages.LocaleHelper;
import org.pentaho.platform.util.xml.XmlHelper;

/**
 * Utility class used to save an analysis action sequence from a JPivot view.
 */
public class AnalysisSaver extends PentahoMessenger {
  private static final long serialVersionUID = 6290291421129174060L;

  private static final String ATTRIBUTE_TYPE = "type"; //$NON-NLS-1$

  private static final String ATTRIBUTE_STRING = "string"; //$NON-NLS-1$

  private static final String TITLE_NODE_NAME = "title"; //$NON-NLS-1$

  public static final String SUFFIX = ".xjpivot"; //$NON-NLS-1$

  public static final String PROPERTIES_SUFFIX = ".properties"; //$NON-NLS-1$

  public static final String NEW_ACTION = "NEW_ACTION";
  
  private static Log logger = null;
  
  /*
   * (non-Javadoc)
   * 
   * @see org.pentaho.core.system.PentahoBase#getLogger()
   */
  @Override
  public Log getLogger() {
    return AnalysisSaver.logger;
  }

  public static boolean saveAnalysis(final IPentahoSession session, final HashMap props, String path, String fileName, final boolean overwrite) {

    if ("true".equals(PentahoSystem.getSystemSetting("kiosk-mode", "false"))) { //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
      throw new RuntimeException(Messages.getInstance().getErrorString("ANALYSISSAVER.ERROR_0006_SAVE_IS_DISABLED")); //$NON-NLS-1$
    }

    try {
      AnalysisSaver.logger = LogFactory.getLog(AnalysisSaver.class);

      // TODO: if this is a new JPivot report, get doc from generateXAction
      
      // We will (at this point in time) always have an original action sequence to start from...
      String originalActionReference = (String) props.get("actionreference"); //$NON-NLS-1$

      if (originalActionReference == null) {
        throw new MissingParameterException(Messages.getInstance().getErrorString("ANALYSISSAVER.ERROR_0001_MISSING_ACTION_REFERENCE")); //$NON-NLS-1$
      }
      Document document = null;
      if (NEW_ACTION.equals(originalActionReference)) {
        String model = (String)props.get(PivotViewComponent.MODEL);
        String jndi = (String)props.get(PivotViewComponent.CONNECTION);
        String jdbc = null; // NOT SUPPORTED AT THIS TIME
        String cube = null; // No need, MDX statement already exists 
        
        String xaction = new AnalysisViewService().generateXAction(PentahoSessionHolder.getSession(), Messages.getInstance().getString("BaseTest.DEFAULT_TITLE"), Messages.getInstance().getString("BaseTest.DEFAULT_DESCRIPTION"), model, jndi, jdbc, cube);
        org.dom4j.io.SAXReader reader = new org.dom4j.io.SAXReader();
        reader.setEntityResolver(new SolutionURIResolver());
        final String encoding = XmlHelper.getEncoding(xaction, null);
        document = reader.read(new ByteArrayInputStream(xaction.getBytes(encoding)));
      } else {    
        try {
          org.dom4j.io.SAXReader reader = new org.dom4j.io.SAXReader();
          reader.setEntityResolver(new SolutionURIResolver());
          document = reader.read(ActionSequenceResource.getInputStream(originalActionReference, LocaleHelper.getLocale()));
        } catch (Throwable t) {
          // XML document can't be read. We'll just return a null document.
        }
      }
      // Update the document with the stuff we passed in on the props
      document = AnalysisSaver.updateDocument(document, props);
      fileName = fileName.endsWith(AnalysisSaver.SUFFIX) ? fileName : fileName + AnalysisSaver.SUFFIX;

      path = cleansePath(path, fileName);
      
      // Write contents to Unified Repository
      
      RepositoryFile jpivotRepoFile = null;
      IUnifiedRepository repository = PentahoSystem.get(IUnifiedRepository.class);
      try {
        jpivotRepoFile = repository.getFile(path + '/' + fileName);
      } catch (UnifiedRepositoryException e) {
        // file does not exist, ignore exception
      }
      if (jpivotRepoFile != null) {
        jpivotRepoFile = repository.updateFile(jpivotRepoFile, new SimpleRepositoryFileData(new ByteArrayInputStream(
            document.asXML().getBytes(document.getXMLEncoding())), LocaleHelper.getSystemEncoding(), "application/xml"),
            "Update to existing file");
      } else {
        RepositoryFile parentFile = repository.getFile(path);
        jpivotRepoFile = new RepositoryFile.Builder(fileName).title(RepositoryFile.ROOT_LOCALE, fileName).description(RepositoryFile.ROOT_LOCALE, fileName).build();
        jpivotRepoFile = repository.createFile(parentFile.getId(), jpivotRepoFile, new SimpleRepositoryFileData(
            new ByteArrayInputStream(document.asXML().getBytes(document.getXMLEncoding())), LocaleHelper.getSystemEncoding(),
            "application/xml"), "Initial JPivot View Check-in");
      }
    } catch (Exception e) {
      AnalysisSaver.logger.error(Messages.getInstance().getErrorString("ANALYSISSAVER.ERROR_0000_UNKNOWN"), e); //$NON-NLS-1$
      return false;
    }

    return true;
  }

  /**
   * @param document
   * @param props
   * @return
   */
  private static Document updateDocument(final Document document, final HashMap props) {
    try {
      Element componentDefinition = null;
      Element actionOutput = null;
      Element actionSequenceOutput = null;

      Node actionSequence = document.selectSingleNode("/action-sequence"); //$NON-NLS-1$
      if (actionSequence == null) {
        throw new InvalidDocumentException(Messages.getInstance().getErrorString("ANALYSISSAVER.ERROR_0004_INVALID_ORIGIN_DOCUMENT")); //$NON-NLS-1$
      }
      Element asElement = ((Element)actionSequence);
      Node title = null;
      String propertyTitle = (String) props.get(AnalysisSaver.TITLE_NODE_NAME);
      title = asElement.selectSingleNode(AnalysisSaver.TITLE_NODE_NAME);
      if ( (title == null) && (propertyTitle != null) ) {
        title = asElement.addElement(AnalysisSaver.TITLE_NODE_NAME);
      }
      
      if ( (title != null) && (propertyTitle != null)  ) {
        // remove existing text if it's there
        title.setText(""); //$NON-NLS-1$ 
        ((Element)title).addCDATA( propertyTitle ); // adds CDATA
      }

      // Next, we need to retrieve the PivotViewComponent action and
      // process/update it.. there could possibly be more than one
      // PivotViewComponent in an action sequence, however, we have no idea
      // how to figure out which one to process, so we default to picking the last one we found.

      componentDefinition = (Element) document.selectSingleNode("//action-definition[component-name='PivotViewComponent']/component-definition"); //$NON-NLS-1$
      if (componentDefinition == null) {
        throw new InvalidDocumentException(Messages.getInstance().getErrorString("ANALYSISSAVER.ERROR_0005_INVALID_NO_PIVOT_ACTION")); //$NON-NLS-1$
      }

      AnalysisSaver.updateComponent(componentDefinition, props);

      // Get the action's root action-output node, in case we need to add the
      // appropriate outputs for the pivot view...
      actionOutput = (Element) document.selectSingleNode("//action-definition[component-name='PivotViewComponent']/action-outputs"); //$NON-NLS-1$
      AnalysisSaver.updateOutput(actionOutput, props);

      // Get the action's root action sequence output node, in case we need to add the
      // appropriate outputs for the pivot view...
      actionSequenceOutput = (Element) document.selectSingleNode("//action-sequence/outputs"); //$NON-NLS-1$
      AnalysisSaver.updateOutput(actionSequenceOutput, props);

    } catch (Exception e) {
      e.printStackTrace();
    }
    return document;
  }

  /**
   * @param componentDefinition
   * @param props
   */
  private static void updateComponent(final Element componentDefinition, final HashMap props) {
    Iterator iter = props.keySet().iterator();

    while (iter.hasNext()) {
      Object key = iter.next();
      Node node = componentDefinition.selectSingleNode(key.toString());
      if (node == null) {
        node = componentDefinition.addElement(key.toString());
      }
      if (PivotViewComponent.OPTIONS.equals(node.getName())) {
        List optionsList = (List) props.get(key);
        Iterator optsIter = optionsList.iterator();
        while (optsIter.hasNext()) {
          String anOption = optsIter.next().toString();
          Node anOptionNode = node.selectSingleNode(anOption);
          if (anOptionNode == null) {
            ((Element) node).addElement(anOption);
          }
        }
      } else {
        Object value = props.get(key);
        if (value != null) {
          // remove existing text
          node.setText(""); //$NON-NLS-1$
          ((Element)node).addCDATA( value.toString() );
        }
      }
    }
                                        // the property "mdx" is no longer being put in the hashmap. So,
                                        // query will be passed properly now.
  }

  /**
   * @param outputNode
   * @param props
   */
  private static void updateOutput(final Element outputNode, final HashMap props) {
    Iterator iter = props.keySet().iterator();

    while (iter.hasNext()) {
      Object key = iter.next();
      Node node = outputNode.selectSingleNode(key.toString());
      if (node == null) {
        outputNode.addElement(key.toString()).addAttribute(AnalysisSaver.ATTRIBUTE_TYPE,
            "options".equals(key.toString()) ? "list" : AnalysisSaver.ATTRIBUTE_STRING);//$NON-NLS-1$//$NON-NLS-2$
      }
    }
  }
  
  public static String cleansePath(String path, String fileName) {
    if (path == null)
        return null;
    File file = new File(path);
    if (file.getName().equals(fileName) ||
            file.getName().equals(fileName + AnalysisSaver.SUFFIX)) {
        file = file.getParentFile();
    }
    if (file == null)
        return null;
    String cleansedPath = file.getPath();
    if (File.separatorChar == '\\') {
        cleansedPath = cleansedPath.replace('\\', '/');
    }
    if (path.endsWith("/")) {
        cleansedPath = path.substring(0, path.length() - 1);
    }
    return cleansedPath;
  }
}