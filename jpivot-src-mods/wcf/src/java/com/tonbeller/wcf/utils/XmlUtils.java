/*
* ====================================================================
* This software is subject to the terms of the Common Public License
* Agreement, available at the following URL:
*   http://www.opensource.org/licenses/cpl.html .
* Copyright (C) 2003-2004 TONBELLER AG.
* All Rights Reserved.
* You must accept the terms of that agreement to use this software.
* ====================================================================
*
*
*/

package com.tonbeller.wcf.utils;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Hashtable;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.FactoryConfigurationError;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * @author av
 * XML Utilities
 */
public class XmlUtils {

  private static final String WEBKEY = XmlUtils.class.getName();
  private static Logger logger = Logger.getLogger(XmlUtils.class);

  private XmlUtils() {
  }

  /**
   * Xalan Templates are not thread safe (as the spec requires),
   * so we have one instance of the templatesCache for every
   * http session.
   */
  private Hashtable templatesCache = new Hashtable();

  /**
   * creates a transformer for a xsl stylesheet
   * @param xsltURI the uri of the xslt stylesheet, e.g. "/WEB-INF/mystyle.xsl"
   * @param useCache cache the transformer
   */
  public Transformer getTransformer(ServletContext ctx, String xslUri, boolean xslCache) {
    synchronized (templatesCache) {
      try {
        Templates templates = null;
        if (xslCache)
          templates = (Templates) templatesCache.get(xslUri);
        if (templates == null) {
          TransformerFactory tf = TransformerFactory.newInstance();
          URL url = ctx.getResource(xslUri);
          if (url == null)
            throw new IllegalArgumentException("stylesheet \"" + xslUri + "\" not found");

          StreamSource ss = new StreamSource(url.getFile());
          templates = tf.newTemplates(ss);
          if (xslCache)
            templatesCache.put(xslUri, templates);
        }
        return templates.newTransformer();
      } catch (TransformerConfigurationException e) {
        throw new SoftException(e);
      } catch (MalformedURLException e) {
        throw new SoftException(e);
      }
    }
  }

  /**
   * creates a transformer for a xsl stylesheet
   * @param context for resource lookup and stylesheet caching
   * @param xsltURI the uri of the xslt stylesheet, e.g. "/WEB-INF/mystyle.xsl"
   * @param useCache cache the transformer
   */
  public static Transformer getTransformer(HttpSession session, String xslUri, boolean xslCache) {
    return instance(session).getTransformer(session.getServletContext(), xslUri, xslCache);
  }

  public static DocumentBuilder getParser() {
    try {
      DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
      dbf.setValidating(false);
      dbf.setExpandEntityReferences(true);
      return dbf.newDocumentBuilder();
    } catch (FactoryConfigurationError e) {
      throw new SoftException(e);
    } catch (ParserConfigurationException e) {
      throw new SoftException(e);
    }
  }

  public static Document createDocument() {
    try {
      return getParser().newDocument();
    } catch (FactoryConfigurationError e) {
      throw new SoftException(e);
    }
  }

  public static void print(Node node, Writer out, Properties p) {
    try {
      TransformerFactory tf = TransformerFactory.newInstance();
      Source src = new DOMSource(node);
      Result dest = new StreamResult(out);
      Transformer t = tf.newTransformer();
      if (p != null)
        t.setOutputProperties(p);
      t.transform(src, dest);
    } catch (TransformerConfigurationException e) {
      throw new SoftException(e);
    } catch (TransformerFactoryConfigurationError e) {
      throw new SoftException(e);
    } catch (TransformerException e) {
      throw new SoftException(e);
    }
  }

  public static void print(Node node, Writer out) {
    print(node, out, null);
  }

  public static synchronized XmlUtils instance(HttpSession session) {
    XmlUtils service = (XmlUtils) session.getAttribute(WEBKEY);
    if (service == null) {
      service = new XmlUtils();
      session.setAttribute(WEBKEY, service);
    }
    return service;
  }

  /**
   * returns the Document. node itself may be a Document node in which case
   * node.getOwnerDocument() will return null
   */
  public static Document getDocument(Node node) {
    if (node.getNodeType() == Node.DOCUMENT_NODE)
      return (Document) node;
    return node.getOwnerDocument();
  }

  public static Document parse(URL url) {
    try {
      InputSource src = new InputSource(url.toExternalForm());
      return getParser().parse(src);
    } catch (IOException e) {
      throw new SoftException(e);
    } catch (SAXException e) {
      throw new SoftException(e);
    }
  }

  /**
   * escapes xml characters
   * &lt;, &gt; &amp;, &quot;
   */
  public static String escapeXml(String s) {
    if (s == null)
      return null;
    char[] arr = s.toCharArray();
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < arr.length; i++) {
      switch(arr[i]) {
        case '>':
          sb.append("&gt;");
          break;
        case '<':
          sb.append("&lt;");
          break;
        case '&':
          sb.append("&amp;");
          break;
        case '"':
          sb.append("&quot;");
          break;
        default:
          sb.append(arr[i]);
      }
    }
    return sb.toString();
  }


}
