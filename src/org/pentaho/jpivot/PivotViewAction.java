/*
* Copyright 2002 - 2013 Pentaho Corporation.  All rights reserved.
* 
* This software was developed by Pentaho Corporation and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

package org.pentaho.jpivot;

import org.dom4j.Element;
import org.pentaho.actionsequence.dom.ActionSequenceDocument;
import org.pentaho.actionsequence.dom.IActionInput;
import org.pentaho.actionsequence.dom.IActionInputSource;
import org.pentaho.actionsequence.dom.actions.ActionDefinition;
import org.pentaho.actionsequence.dom.actions.IActionParameterMgr;

public class PivotViewAction extends ActionDefinition {
  
  public static final String COMPONENT_NAME = "org.pentaho.component.PivotViewComponent"; //$NON-NLS-1$

  public static final String MODE_ELEMENT = "mode"; //$NON-NLS-1$
  public static final String VIEWER_ELEMENT = "viewer"; //$NON-NLS-1$
  public static final String MODEL_ELEMENT = "model"; //$NON-NLS-1$
  public static final String JNDI_ELEMENT = "jndi"; //$NON-NLS-1$
  public static final String OPTIONS_ELEMENT = "options"; //$NON-NLS-1$
  public static final String CONNECTION_ELEMENT = "connection"; //$NON-NLS-1$
  public static final String MDX_ELEMENT = "mdx"; //$NON-NLS-1$
  public static final String TITLE_ELEMENT = "title"; //$NON-NLS-1$
  public static final String URL_ELEMENT = "url"; //$NON-NLS-1$
  public static final String EXECUTE_MODE = "execute"; //$NON-NLS-1$
  public static final String QUERY_ELEMENT = "query"; //$NON-NLS-1$
  public static final String ROLE_ELEMENT = "role"; //$NON-NLS-1$
  
  protected static final String[] EXPECTED_INPUTS = new String[] {
    MODE_ELEMENT,
    VIEWER_ELEMENT,
    MODEL_ELEMENT, 
    JNDI_ELEMENT,
    QUERY_ELEMENT
  };
  
  public PivotViewAction(Element actionDefElement, IActionParameterMgr actionInputProvider) {
    super(actionDefElement, actionInputProvider);
  }

  public PivotViewAction() {
    super(COMPONENT_NAME);
  }

  public static boolean accepts(Element element) {
    return ActionDefinition.accepts(element) && hasComponentName(element, COMPONENT_NAME);
  }
  
  protected void initNewActionDefinition() {
    super.initNewActionDefinition();
    setComponentDefinition(MODE_ELEMENT, EXECUTE_MODE);
    setOutput(OPTIONS_ELEMENT, OPTIONS_ELEMENT, ActionSequenceDocument.LIST_TYPE);
    setOutput(MODEL_ELEMENT, MODEL_ELEMENT, ActionSequenceDocument.STRING_TYPE);
    setOutput(CONNECTION_ELEMENT, CONNECTION_ELEMENT, ActionSequenceDocument.STRING_TYPE);
    setOutput(MDX_ELEMENT, MDX_ELEMENT, ActionSequenceDocument.STRING_TYPE);
    setOutput(TITLE_ELEMENT, TITLE_ELEMENT, ActionSequenceDocument.STRING_TYPE);
    setOutput(URL_ELEMENT, URL_ELEMENT, ActionSequenceDocument.STRING_TYPE);
  }
  
  public String[] getReservedInputNames() {
    return EXPECTED_INPUTS;
  }
  
  public void setMode(IActionInputSource value) {
    setActionInputValue(MODE_ELEMENT, value);
  }
  
  public IActionInput getMode() {
    return getInput(MODE_ELEMENT);
  }
  
  public void setViewer(IActionInputSource value) {
    setActionInputValue(VIEWER_ELEMENT, value);
  }
  
  public IActionInput getViewer() {
    return getInput(VIEWER_ELEMENT);
  }
  
  public void setModel(IActionInputSource value) {
    setActionInputValue(MODEL_ELEMENT, value);
  }
  
  public IActionInput getModel() {
    return getInput(MODEL_ELEMENT);
  }
  
  public void setJndi(IActionInputSource value) {
    setActionInputValue(JNDI_ELEMENT, value);
  }
  
  public IActionInput getJndi() {
    return getInput(JNDI_ELEMENT);
  }
  
  public void setRole(IActionInputSource value) {
    setActionInputValue(ROLE_ELEMENT, value);
  }
  
  public IActionInput getRole() {
    return getInput(ROLE_ELEMENT);
  }
  
  public void setQuery(IActionInputSource value) {
    setActionInputValue(QUERY_ELEMENT, value);
  }
  
  public IActionInput getQuery() {
    return getInput(QUERY_ELEMENT);
  }
}
