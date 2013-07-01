/*
 * Copyright 2007 Pentaho Corporation.  All rights reserved. 
 * This software was developed by Pentaho Corporation and is provided under the terms 
 * of the Mozilla Public License, Version 1.1, or any later version. You may not use 
 * this file except in compliance with the license. If you need a copy of the license, 
 * please go to http://www.mozilla.org/MPL/MPL-1.1.txt. The Original Code is the Pentaho 
 * BI Platform.  The Initial Developer is Pentaho Corporation.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS" 
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to 
 * the license for the specific language governing your rights and limitations.
 *
 * Created  
 * @author Steven Barkdull
 */

/**
 * @param businessView BusinessView
 */
function ReportSpec( businessView ){

	this.businessView = businessView;
	this.groups = new Array();
	this.details = new Array();
	this.filters = new Array();
	this.detailsSortList = new Array();
	this.groupHeaders = new Array();
	this.modelId = null;
	this.viewId = null;
	this.reportHeader = "";
	this.reportFooter = "";
	this.pageHeader = "";
	this.pageFooter = "";
	this.reportDescription = "";
	this.paperType = "LETTER";
	this.pageOrientation = "portrait";
	this.bDisableDistinct = false;
	this.templateName = null;
	/*
	 * this.strMql contains MQL plain constraint MQL text. If this 
	 * value is null, the constraint MQL will be derived from the constraints properties
	 * of the bvItem property of the items in the groups, details, and filters lists.
	 * Otherwise the MQL in this.strMql is used to generate the constraint mql
	 */
	this.strMql = null;
};

// match "stuff...[tableId.columnId]stuff...", and return the columnId
/*private static*/ReportSpec.RE_LEFT_OPERAND_COLUMN_ID = /^[^[]*\[[^.]+\.([^[]+)\].*$/;
/**
 * ReportSpec.propertyNameMap provides a mapping between the XML element names and
 * the corresponding property name for the ReportSpec class. The elements included
 * in this collection are precisely the elements in the default template. The 
 * location of the default template is specified by: Controller.WAQR_DEFAULT_TEMPLATE_PATH
 */
/*static*/ReportSpec.propertyNameMap = new Object();
ReportSpec.propertyNameMap[ "jndi-source" ] = "jndiSource";
ReportSpec.propertyNameMap[ "report-name" ] = "reportName";
ReportSpec.propertyNameMap[ "report-desc" ] = "reportDescription";
ReportSpec.propertyNameMap[ "page-format" ] = "paperType";
ReportSpec.propertyNameMap[ "orientation" ] = "pageOrientation";
ReportSpec.propertyNameMap[ "use-row-banding" ] = "useRowBanding";
ReportSpec.propertyNameMap[ "row-banding-color" ] = "rowBandingColor";
ReportSpec.propertyNameMap[ "use-column-header-background-color" ] = "useColumnHeaderBackgroundColor";
ReportSpec.propertyNameMap[ "column-header-background-color" ] = "columnHeaderBackgroundColor";
ReportSpec.propertyNameMap[ "grand-totals-label" ] = "grandTotalsLabel";
ReportSpec.propertyNameMap[ "grand-totals-horizontal-alignment" ] = "grandTotalsHorizontalAlignment";
ReportSpec.propertyNameMap[ "use-dummy-group-footer-background-color" ] = "useDummyGroupFooterBackgroundColor";
ReportSpec.propertyNameMap[ "dummy-group-footer-background-color" ] = "dummyGroupFooterBackgroundColor";
ReportSpec.propertyNameMap[ "use-horizontal-gridlines" ] = "useHorizontalGridlines";
ReportSpec.propertyNameMap[ "use-vertical-gridlines" ] = "useVerticalGridlines";
ReportSpec.propertyNameMap[ "horizontal-gridlines-color" ] = "horizontalGridlinesColor";
ReportSpec.propertyNameMap[ "vertical-gridlines-color" ] = "veticalGridlinesColor";
ReportSpec.propertyNameMap[ "group-header-font-name" ] = "groupHeaderFontName";
ReportSpec.propertyNameMap[ "group-header-font-style" ] = "groupHeaderFontStyle";
ReportSpec.propertyNameMap[ "group-header-font-size" ] = "groupHeaderFontSize";
ReportSpec.propertyNameMap[ "group-header-font-color" ] = "groupHeaderFontColor";
ReportSpec.propertyNameMap[ "group-footer-font-name" ] = "groupFooterFontName";
ReportSpec.propertyNameMap[ "group-footer-font-style" ] = "groupFooterFontStyle";
ReportSpec.propertyNameMap[ "group-footer-font-size" ] = "groupFooterFontSize";
ReportSpec.propertyNameMap[ "group-footer-font-color" ] = "groupFooterFontColor";
ReportSpec.propertyNameMap[ "column-header-font-name" ] = "columnHeaderFontName";
ReportSpec.propertyNameMap[ "column-header-font-style" ] = "columnHeaderFontStyle";
ReportSpec.propertyNameMap[ "column-header-font-size" ] = "columnHeaderFontSize";
ReportSpec.propertyNameMap[ "column-header-font-color" ] = "columnHeaderFontColor";
ReportSpec.propertyNameMap[ "column-header-gap" ] = "columnHeaderGap";
ReportSpec.propertyNameMap[ "items-font-name" ] = "itemsFontName";
ReportSpec.propertyNameMap[ "items-font-style" ] = "itemsFontStyle";
ReportSpec.propertyNameMap[ "items-font-size" ] = "itemsFontSize";
ReportSpec.propertyNameMap[ "items-font-color" ] = "itemsFontColor";

ReportSpec.prototype.loadTemplateReportSpecDoc = function( xmlDoc )
{
	this.loadXmlDoc( xmlDoc, "report-spec" );
};

/**
 * Initialize this instance with the contents of the xmlDoc
 * @param xmlDoc XDocument a waqr reportspec document.
 * 
 * @throws Error when any of the Mql Formulas in the xmlDoc's mql/constraints/constraint nodes fail to parse.
 */
ReportSpec.prototype.loadWaqrReportSpecDoc = function( xmlDoc )
{
	this.loadAdhocReportSpec( xmlDoc );
};

/**
 * @param constraintsNd XNode the constraints node in the reportSpec.
 * The xpath to the constraints node is mql/constraints
 * 
 * @throws Error when any of the Mql Formulas in the constraints' constraint nodes fail to parse.
 */
/*private*/ReportSpec.prototype.loadConstraintsMql = function( constraintsNd )
{
  if ( this.validateConstraints( constraintsNd ) )
  {
    this.loadConstraintsMqlIntoBVItems( constraintsNd )
  }
  else
  {
    this.loadConstraintsMqlStr( constraintsNd );
  }
};

/*private*/ReportSpec.prototype.loadConstraintsMqlStr = function( constraintsNd )
{
  var strMql = XmlUtil.asXml( constraintsNd );
  this.setConstraintMqlStr( strMql );
};

/**
 * Load the Mql Forumulas in the constraint nodes of the Mql into the 
 * appropriate BVItems. It is a good idea to call ReportSpec.validateConstraints()
 * on the constraintsNd prior to calling this method, to be sure that the Mql
 * is valid.
 * 
 * @param constraintsNd XNode the <constraints> node child of the Mql node.
 * 
 * @throws Error when any of the Mql Formulas in the constraint nodes fail to parse.
 */
/*private*/ReportSpec.prototype.loadConstraintsMqlIntoBVItems = function( constraintsNd )
{
	var nds = XmlUtil.selectNodes( constraintsNd, "constraint" );
	for ( var idx=0; idx<nds.length; ++ idx )
	{
		var constraintNd = nds[ idx ];
		var conditionNd = XmlUtil.selectSingleNode( constraintNd, "condition" );
		var operatorNd = XmlUtil.selectSingleNode( constraintNd, "operator" );
		var mqlFormula = XmlUtil.getNodeText( conditionNd );
		var operator = XmlUtil.getNodeText( operatorNd );
		
		// find the column Id we are working with 
		var parts = mqlFormula.match( ReportSpec.RE_LEFT_OPERAND_COLUMN_ID );
		var columnId = parts[1];
		
		// get the type of the column
		var bvItem = this.businessView.getItem( columnId );
		var physicalType = bvItem.physicalType;
		
		var constraints = new Constraints();
		constraints.setByMqlConstraintFormula( mqlFormula, physicalType );

		bvItem.setConstraints( constraints );
	}
};
/**
 * Find out of the constraints in the MQL node are parsable. In this context,
 * parsable means we can load it in the constraints Builder editor.
 * 
 * @param constraintsNd XNode the &lt;constraints&gt; node of the mql node
 * 
 * @return true if it is parsable, else false.
 */
ReportSpec.prototype.validateConstraints = function( constraintsNd )
{
	var parser = new MQLConstraintParser();
	try {
  	var nds = XmlUtil.selectNodes( constraintsNd, "constraint" );
  	for ( var idx=0; idx<nds.length; ++ idx )
  	{
  		var constraintNd = nds[ idx ];
  		var conditionNd = XmlUtil.selectSingleNode( constraintNd, "condition" );
      var mqlFormula = XmlUtil.getNodeText( conditionNd );
      if ( null === mqlFormula )  { return false; }
    	var strFailedMql = parser.parseMqlConstraintFormula( "", mqlFormula );
    	if ( null !== strFailedMql ) { return false; }
  		
  		var operatorNd = XmlUtil.selectSingleNode( constraintNd, "operator" );
      var operator = XmlUtil.getNodeText( operatorNd );
      // we only support the AND operator, first constraint will not have a logical (and/or) operator
      if ( ( 0 != idx ) && ( !operator || ( operator && "and" != operator.toLowerCase() ) ) )
      {
        return false;
      }
      
  		var parts = mqlFormula.match( ReportSpec.RE_LEFT_OPERAND_COLUMN_ID );
  		if ( null === parts ) { return false; }
  		var columnId = parts[1];
  		
  		// get the type of the column
  		var bvItem = this.businessView.getItem( columnId );
  		if ( !bvItem ) { return false; }
  	}
   
    return true;
	} catch( e ) {
	  return false;
	}
};

// TODO sbarkdull, note, some of the metadata names are up to date, and some arent
/**
 * load the constraints and sort information from the mql element of the reportSpec
 * document
 * 
 * @throws Error when any of the Mql Formulas in the Mql node's constraints/constraint nodes fail to parse.
 */
ReportSpec.prototype.loadMQL = function( mqlNd )
{
	var nd = XmlUtil.selectSingleNode( mqlNd, "domain_id" );
	this.modelId = XmlUtil.getNodeText( nd );
	nd = XmlUtil.selectSingleNode( mqlNd, "model_id" );
	this.viewId = XmlUtil.getNodeText( nd );

	// add the constraints
	var constraintsNd = XmlUtil.selectSingleNode( mqlNd, "constraints" );
	this.loadConstraintsMql( constraintsNd );
	
	var orderNds = XmlUtil.selectNodes( mqlNd, "orders/order" );
	this.loadSortMql( orderNds );
	
	var optionsNd = XmlUtil.selectSingleNode( mqlNd, "options" );
	if ( optionsNd )
	{
	 this.loadOptionsMql( optionsNd );
	}
};

/**
 * Load the sort Mql
 */
ReportSpec.prototype.loadSortMql = function( orderNds )
{
	for ( var ii=0; ii<orderNds.length; ++ii )
	{
		var orderNd = orderNds[ ii ];
		var directionNd = XmlUtil.selectSingleNode( orderNd, "direction" );
		var direction = XmlUtil.getNodeText( directionNd );
		var viewIdNd = XmlUtil.selectSingleNode( orderNd, "view_id" );	// sbarkdull, may not be needed
		var viewId = XmlUtil.getNodeText( viewIdNd );
		var columnIdNd = XmlUtil.selectSingleNode( orderNd, "column_id" );
		var columnId = XmlUtil.getNodeText( columnIdNd );
		var item = this.getGroupItemByColumnId( columnId );
		if ( !item )
		{
			item = this.getDetailItemByColumnId( columnId );
			this.addToDetailsSortList( item );

		}
		if ( !item )
		{
			throw new Error( Messages.getString( "badSortInfo" ) );
		}
		var bvItem = item.getBVItem();
		bvItem.setSortDirection( direction );
	}
};

ReportSpec.prototype.loadOptionsMql = function( optionsNd )
{
  var disableDistinctNd = XmlUtil.selectSingleNode( optionsNd, "disable_distinct" );
  if ( disableDistinctNd )
  {
    this.bDisableDistinct = XmlUtil.getNodeText( disableDistinctNd ) == "true";
  }
};

ReportSpec.prototype.getFilterColumnIds = function( constraintsNd )
{
	var columnIdSet = new Object(); //use an Object to simulate a Set. 
	
	// find all column Ids in the constraints Mql
	var nds = XmlUtil.selectNodes( constraintsNd, "constraint" );
	for ( var idx=0; idx<nds.length; ++ idx )
	{
		var constraintNd = nds[ idx ];
		var conditionNd = XmlUtil.selectSingleNode( constraintNd, "condition" );
		var mqlFormula = XmlUtil.getNodeText( conditionNd );
		
		// find the column Id we are working with 
		var parts = mqlFormula.match( ReportSpec.RE_LEFT_OPERAND_COLUMN_ID );
		var columnId = parts[1];
		columnIdSet[ columnId ] = columnId;
	}
	/* find all of the columnIds that are in the groups or details list.
	 * Delete them from the columnIdSet. The columnIds that are
	 * remaining are the column Ids for the filters.
	 */
	for ( var groupIdx=0; groupIdx<this.groups.length; ++groupIdx )
	{
		var groups=this.groups[groupIdx];
		for ( var itemIdx=0; itemIdx<groups.length; ++itemIdx )
		{
			var item = groups[ itemIdx ];
			var columnId = item.getBVItem().columnId;
			if ( columnIdSet[ columnId ] )
			{
				delete columnIdSet[ columnId ];
			}
		}
	}
	for ( var itemIdx=0; itemIdx<this.details.length; ++itemIdx )
	{
		var item = this.details[ itemIdx ];
		var columnId = item.getBVItem().columnId;
		if ( columnIdSet[ columnId ] )
		{
			delete columnIdSet[ columnId ];
		}
	}
	
	return columnIdSet;
};

/**

 * 
 * @param columnIdSet Object (Object used to simulate Set) a set
 * of all of the column Ids that have a constraint specified in the MQL
 */
ReportSpec.prototype.loadFilters = function( columnIdSet )
{
	/*
	 * at this point we have removed from columnIdSet all constraints
	 * that should be applied to groups and filters. The remaining constraints
	 * must be for filters, so lets create them.
	 */
	for ( var columnId in columnIdSet )
	{
		var bvItem = this.businessView.getItem( columnId );
		var item = new RSFilterItem( bvItem );
		this.addToFilters( item );
	}
};
ReportSpec.prototype.loadFields = function( rootNd )
{
	var groupNum = 0;
	var bIsAddGroupHeader = true;
	var fieldNds = XmlUtil.selectNodes( rootNd, "field" );
	for ( var idx=0; idx<fieldNds.length; ++idx )
	{
		var nd = fieldNds[ idx ];
		var isDetailAttribNd = XmlUtil.selectSingleNode( nd, "@is-detail" );
		var bIsDetail = XmlUtil.getNodeText( isDetailAttribNd ) == "true";
		if ( bIsDetail )
		{
			this.loadDetailNd( nd );
		}
		else
		{
      var nextNd = ( idx+1 < fieldNds.length )
        ? fieldNds[ idx+1 ]
        : null;
		  // keep in mind a node can be the first, last, and middle node at the same time
		  // if it is the only node in the group
			var bIsFirstNodeInGroup = ReportSpec.isFirstNodeInGroup( nd );
			var bIsLastNodeInGroup = ReportSpec.isLastNodeInGroup( nd, nextNd );
			
			if ( bIsFirstNodeInGroup )
			{
				this.loadGroupHeader( nd, groupNum );
			}
			this.loadGroupNd( nd, groupNum );
      if ( bIsLastNodeInGroup )
			{
			  this.finishLoadGroupHeader( nd, groupNum );
				groupNum++;
			}
		}
	}
};
ReportSpec.prototype.finishLoadGroupHeader = function( fieldNd, groupNum )
{
};

/**
 * Convert "$(BC_COLUMN_NAME)" to $(group-label)
 */
/*private */ReportSpec.prototype.totalsLabelToTotalsVariable = function( fieldNd, strLabel )
{
  var nameAttr = XmlUtil.selectSingleNode( fieldNd, "@name" );
  var columnId = XmlUtil.getNodeText( nameAttr );
  var re = "(.*)(" + columnId + ")(.*)";
  var parts = strLabel.match( re );
  if ( null != parts )
  {
    return parts[1] + "group-label" + parts[3];
  }
  else
  {
    return strLabel;
  }
};

ReportSpec.prototype.loadDetailNd = function( fieldNd )
{
	var columnNd = XmlUtil.selectSingleNode( fieldNd, "@name" );
	var columnId = XmlUtil.getNodeText( columnNd );
	var bvItem = this.businessView.getItem( columnId );
	var item = new RSDetailItem( bvItem );
	
	item.format = XmlUtil.getNodeText( XmlUtil.selectSingleNode( fieldNd, "@format" ) );
	var nd = XmlUtil.selectSingleNode( fieldNd, "@horizontal-alignment" );
	item.alignment = XmlUtil.getNodeText( nd );
	item.aggregatorFunc = XmlUtil.getNodeText( XmlUtil.selectSingleNode( fieldNd, "@expression" ) );

	this.addToDetails( item );
};
/**
 * If fieldNd has an create-group-header attribute, and it is set to true,
 * then it is the first element in its group, so, return true, else false.
 * NOTE: this code assumes that ONLY the first item in a group will have
 * the create-group-header attribute. If in the future this is no longer
 * true, this method will no longer function properly.
 * 
 * @param fieldNd XNode <field> element from a reportspec document
 * @return true if fieldNd is the first item in its group, else false.
 */
ReportSpec.isFirstNodeInGroup = function( fieldNd )
{
	var attribNd = XmlUtil.selectSingleNode( fieldNd, "@level-name" );
	return undefined != attribNd;
};

/**
 * @param fieldNd XNode <field> element from a reportspec document
 * @return true if fieldNd is the last item in its group, else false.
 */
ReportSpec.isLastNodeInGroup = function( fieldNd, nextFieldNd )
{
  if ( null != nextFieldNd )
  {
    var isDetailAttribNd = XmlUtil.selectSingleNode( nextFieldNd, "@is-detail" );
    var isDetail = XmlUtil.getNodeText( isDetailAttribNd );
    return isDetail == "true" || ReportSpec.isFirstNodeInGroup( nextFieldNd );
  }
  else
  {
    return true;
  }
};

ReportSpec.prototype.loadGroupNd = function( fieldNd, groupNum )
{
	var columnNd = XmlUtil.selectSingleNode( fieldNd, "@name" );
	var columnId = XmlUtil.getNodeText( columnNd );
	var bvItem = this.businessView.getItem( columnId );
	var item = new RSGroupItem( bvItem );
	
	item.format = XmlUtil.getNodeText( XmlUtil.selectSingleNode( fieldNd, "@format" ) );
	var nd = XmlUtil.selectSingleNode( fieldNd, "@horizontal-alignment" );
	item.alignment = XmlUtil.getNodeText( nd );

	this.addToGroups( item, undefined, groupNum );
};
/**
 * @param fieldNd XML element containing a <field> element, representing the first <field>
 * element in a Level
 * @param groupNum integer the group number (aka level number) that this header belongs to
 */
ReportSpec.prototype.loadGroupHeader = function( fieldNd, groupNum )
{
	var nd = XmlUtil.selectSingleNode( fieldNd, "@level-name" );
	var levelName = XmlUtil.getNodeText( nd );
	
	nd = XmlUtil.selectSingleNode( fieldNd, "@repeat-group-header" );
	var bIsRepeatGroupHeader = XmlUtil.getNodeText( nd ) == "true";
	
	nd = XmlUtil.selectSingleNode( fieldNd, "@vertical-alignment" );
	var alignment = XmlUtil.getNodeText( nd );
	
	nd = XmlUtil.selectSingleNode( fieldNd, "@page-break-before-header" );
	var bIsBeforeHeader = XmlUtil.getNodeText( nd ) == "true";
	nd = XmlUtil.selectSingleNode( fieldNd, "@page-break-after-header" );
	var bIsAfterHeader = XmlUtil.getNodeText( nd ) == "true";
	
	var pageBreak = null;
	if ( bIsBeforeHeader )
	{
		pageBreak = "beforeGroup";
	}
	else if ( bIsAfterHeader )
	{
		pageBreak = "afterGroup";
	}
	else
	{
		pageBreak = "none";
	}
	
	var showGroupSummaryAttr = XmlUtil.selectSingleNode( fieldNd, "@calculate-group-totals" );
	var showGroupSummary = XmlUtil.getNodeText( showGroupSummaryAttr );
  
	var groupTotalLabel = undefined;
	var groupTotalLabelAttr = XmlUtil.selectSingleNode( fieldNd, "@group-totals-label" );
	if ( null != groupTotalLabelAttr )
	{
  	groupTotalLabel = XmlUtil.getNodeText( groupTotalLabelAttr );
  	groupTotalLabel = this.totalsLabelToTotalsVariable( fieldNd, groupTotalLabel );
	}
	
  // NOTE ShowGroupSummary and groupTotalLabel will get set when we locate the 
  // last <field> element in the Level.
	var groupHeader = new RSGroupHeader( levelName, bIsRepeatGroupHeader,
		alignment, pageBreak, showGroupSummary == "true", groupTotalLabel );
	this.addGroupHeader( groupHeader, groupNum );
};

/**
 * The field-mapping element may have up to 4 attributes (reportheader reportfooter pageheader pagefooter).
 * ReportSpec.fieldMappingKeyToPropertyNameMap maps these attribute names
 * to a property name in a ReportSpec instance.
 */
ReportSpec.fieldMappingKeyToPropertyNameMap = new Object();
ReportSpec.fieldMappingKeyToPropertyNameMap[ 'reportheader' ] = "reportHeader";
ReportSpec.fieldMappingKeyToPropertyNameMap[ 'reportfooter' ] = "reportFooter";
ReportSpec.fieldMappingKeyToPropertyNameMap[ 'pageheader' ] = "pageHeader";
ReportSpec.fieldMappingKeyToPropertyNameMap[ 'pagefooter' ] = "pageFooter";

ReportSpec.prototype.loadFieldMappings = function( rootNd )
{
	var fieldMappingNds = XmlUtil.selectNodes( rootNd, "field-mapping" );
	for ( var idx=0; idx<fieldMappingNds.length; ++ idx )
	{
		var nd = fieldMappingNds[ idx ];
		var key = XmlUtil.getNodeText( XmlUtil.selectSingleNode( nd, "@key" ) );
		var value = XmlUtil.getNodeText( XmlUtil.selectSingleNode( nd, "@value" ) );
		// following line equivalent to: this.reportHeader = value;, or one of the 4 property variations
		this[ ReportSpec.fieldMappingKeyToPropertyNameMap[ key ] ] = value;
	}
};
/**
 * The current implementation of this method uses only those nodes
 * that are immediate children of the root node. If the templates grow to include
 * nodes that are not immediate children of the root, this method will need to be
 * refactored.
 * 
 * @param xmlDoc an xml document that conforms to the .xreportspec format
 * 
 * @throws Error when any of the Mql Formulas in the xmlDoc's mql/constraints/constraint nodes fail to parse.
 */
ReportSpec.prototype.loadAdhocReportSpec = function( xmlDoc )
{
	var rootNdName = "report-spec";
	var rootNd = XmlUtil.selectSingleNode( xmlDoc, rootNdName );
	
	// This will load all of the elements that are leaf nodes, and immediate children of the root node
	this.loadXmlDoc( xmlDoc, rootNdName );
	
	this.loadFields( rootNd );
	this.loadFieldMappings( rootNd );
	
	// must load the MQL last, lets get the interesting nodes from the doc
	var queryNd = XmlUtil.selectSingleNode( xmlDoc, "/" + rootNdName + "/query" );
	var mqlNd = XmlUtil.selectSingleNode( queryNd, "mql" );
	var constraintsNd = XmlUtil.selectSingleNode( mqlNd, "constraints" );
	
	this.loadMQL( mqlNd );
	
	//The columnIdSet will help us identify the filter itmems, and 
	// which constraints are to be applied to the filters
  var columnIdSet = this.getFilterColumnIds( constraintsNd );
  this.loadFilters( columnIdSet );
};

ReportSpec.prototype.loadXmlDoc = function( xmlDoc, rootNdName )
{
	var rootNd = XmlUtil.selectSingleNode( xmlDoc, "/" + rootNdName );
	this.templateName = rootNd.getAttribute( "template-name" );
	
	for (var ii = 0; ii < rootNd.childNodes.length; ++ii)
	{
		var nd = rootNd.childNodes[ii];
		if ( "#text" != nd.nodeName )	//#text nodes typically are whitespace between "interesting" nodes
		{
			// we have an interesting node
			var propertyName = ReportSpec.propertyNameMap[nd.nodeName];
			if ( propertyName != undefined )
			{
				this[ propertyName ] = XmlUtil.getNodeText( nd );
			}
		}
	}
};
ReportSpec.prototype.setModelId = function( modelId )
{
	this.modelId = modelId;
};
ReportSpec.prototype.getModelId = function()
{
	return this.modelId;
};
ReportSpec.prototype.setViewId = function( viewId )
{
	this.viewId = viewId;
};
ReportSpec.prototype.getViewId = function()
{
	return this.viewId;
};

/**
 * @param item RSGroupItem
 * @param itemNum integer specifying location in the list to insert the item. if
 * undefined, append to the list.
 * @param groupNum the number of the group (typically 0..4) to add the item to
 */
ReportSpec.prototype.addToGroups = function( item, itemNum, groupNum ) {
	if( this.groups.length <= groupNum ) {
		this.groups[ groupNum ] = new Array();
	}
	if ( undefined == this.groups[ groupNum ] )
	{
		this.groups[ groupNum ] = new Array();
	}
	if ( itemNum == undefined )
	{
		itemNum = this.groups[ groupNum ].length;
	}
	this.addTo( item, this.groups[ groupNum ], itemNum );
};

ReportSpec.prototype.removeFromGroup = function( item, groupNum ) {
	this.removeFrom( item, this.groups[ groupNum ] );
};

ReportSpec.prototype.removeAllFromGroup = function( groupNum ) {
	if ( this.groups[ groupNum ] )
	{
		var length = this.groups[ groupNum ].length;
		this.groups[ groupNum ].splice(0, length );
	}
};

ReportSpec.prototype.removeAllFromGroups = function() {
	for ( var groupIdx=0; groupIdx<this.groups.length; ++groupIdx )
	{
		this.removeAllFromGroup( groupIdx );
	}
};

ReportSpec.prototype.addToDetails = function( item, position ) {
	if ( item.constructor != RSDetailItem )
	{
		throw new Error( Messages.getString( "invalidDetailItem" ) );
	}
	if ( position == undefined )
	{
		position = this.details.length;
	}
	this.addTo( item, this.details, position );
};

ReportSpec.prototype.removeFromDetails = function( item ) {
	this.removeFrom( item, this.details );
};

ReportSpec.prototype.removeAllFromDetails = function() {
	var length = this.details.length;
	this.details.splice(0, length );
};

ReportSpec.prototype.addToFilters = function( item, position ) {
	if ( item.constructor != RSFilterItem )
	{
		throw new Error( Messages.getString( "invalidFilterItem" ) );
	}
	if ( position == undefined )
	{
		position = this.filters.length;
	}
	this.addTo( item, this.filters, position );
};

ReportSpec.prototype.removeFromFilters = function( item ) {
	this.removeFrom( item, this.filters );
};

ReportSpec.prototype.removeAllFromFilters = function() {
	var length = this.filters.length;
	this.filters.splice(0, length );
};

ReportSpec.prototype.addTo = function( item, list, position ) {
	// check to see if this item is grouped already
	// TODO sbarkdull, this next commented line may not be correct, it prevents duplicate items
	//this.removeFrom( item, list );
	if( position >= 0 && position < list.length ) {
		list.splice( position, 0, item );
	} else {
		list.push( item );
	}
};

ReportSpec.prototype.removeFrom = function( item, list )
{
	for( var idx=0; idx<list.length; idx++ ) {
		if( list[idx] == item ) {
			list.splice( idx, 1 );
		}
	}
};

/**
 * Map the xml element name to a ReportSpec property name (using
 * the propertyNameMap). If this instance of ReportSpec has a property
 * by that name, construct an appropriate xml string for the reportSpec
 * file output, otherwise return an empty string.
 * 
 * @param elemName String one of the element names (keys) in the ReportSpec.propertyNameMap
 */
/*private*/ReportSpec.prototype.createXmlElemStr = function( elemName )
{
	var propName = ReportSpec.propertyNameMap[ elemName ];
	return ( this[propName] != undefined )
		? "<" + elemName + "><![CDATA[" + this[ propName ] + "]]></" + elemName + ">\n"
		: "";
};
/**
 * Convert the state of this instance into the corresponding report spec xml document.
 * 
 * NOTE: the report-spec xsd requires that the xml elements generated by this
 * method be in a specific order.
 * 
 * @throws Error when there is an invalid value for the page break in the group header
 */
ReportSpec.prototype.asXml = function() {

	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
	 + "<report-spec tool='waqr' tool-version='1.0' "
	 + (this.templateName ? "template-name='" + this.templateName + "'" : "")
	 + ">\n";

	xml += this.createXmlElemStr( "jndi-source" );
	xml += this.createXmlElemStr( "report-name" );
	xml += this.createXmlElemStr( "report-desc" );
	
	xml += "<query>\n";
	xml += this.getMql();
	xml += "</query>\n";
	
	xml += '<field-mapping key="reportheader" value="' + XmlUtil.escapeXmlAttr( this.reportHeader ) + '"/>';
	xml += '<field-mapping key="reportfooter" value="' + XmlUtil.escapeXmlAttr( this.reportFooter ) + '"/>';
	xml += '<field-mapping key="pageheader" value="' + XmlUtil.escapeXmlAttr( this.pageHeader ) + '"/>';
	xml += '<field-mapping key="pagefooter" value="' + XmlUtil.escapeXmlAttr( this.pageFooter ) + '"/>';
	
	xml += this.createXmlElemStr( "page-format" );
	xml += this.createXmlElemStr( "orientation" );
	
	xml += this.createXmlElemStr( "use-row-banding" );
	xml += this.createXmlElemStr( "row-banding-color" );
	xml += this.createXmlElemStr( "use-column-header-background-color" );
	xml += this.createXmlElemStr( "column-header-background-color" );
	xml += this.createXmlElemStr( "grand-totals-label" );
	xml += this.createXmlElemStr( "grand-totals-horizontal-alignment" );
	xml += this.createXmlElemStr( "use-dummy-group-footer-background-color" );
	xml += this.createXmlElemStr( "dummy-group-footer-background-color" );
	xml += this.createXmlElemStr( "use-horizontal-gridlines" );
	xml += this.createXmlElemStr( "use-vertical-gridlines" );
	xml += this.createXmlElemStr( "horizontal-gridlines-color" );
	xml += this.createXmlElemStr( "vertical-gridlines-color" );
	xml += this.createXmlElemStr( "group-header-font-name" );
	xml += this.createXmlElemStr( "group-header-font-style" );
	xml += this.createXmlElemStr( "group-header-font-size" );
	xml += this.createXmlElemStr( "group-header-font-color" );
	xml += this.createXmlElemStr( "group-footer-font-name" );
	xml += this.createXmlElemStr( "group-footer-font-style" );
	xml += this.createXmlElemStr( "group-footer-font-size" );
	xml += this.createXmlElemStr( "group-footer-font-color" );
	xml += this.createXmlElemStr( "column-header-font-name" );
	xml += this.createXmlElemStr( "column-header-font-style" );
	xml += this.createXmlElemStr( "column-header-font-size" );
	xml += this.createXmlElemStr( "column-header-font-color" );
	xml += this.createXmlElemStr( "column-header-gap" );
	xml += this.createXmlElemStr( "items-font-name" );
	xml += this.createXmlElemStr( "items-font-style" );
	xml += this.createXmlElemStr( "items-font-size" );
	xml += this.createXmlElemStr( "items-font-color" );

	var currItem;	// of type RSDetailItem, RSGroupItem, RSGroupHeader
	for( var ii=0; ii<this.groups.length; ii++ ) {
		var groupHeader = this.groupHeaders[ "" + ii ];
		var repeatGroupHeaderAttrib = ' repeat-group-header="' + groupHeader.isRepeatGroupHeader + '"';
		var groupHeaderAttribs = ' vertical-alignment="' + groupHeader.alignment + '"';
    var firstItemInGroupAttribs = "";
    
    firstItemInGroupAttribs += ' level-name="' + XmlUtil.escapeXmlAttr( groupHeader.levelName ) + '"';
    if ( groupHeader.bShowGroupSummary )
    {
  		firstItemInGroupAttribs += ' group-totals-label="' + XmlUtil.escapeXmlAttr( groupHeader.groupTotalLabel ) + '"';
    }
		
		// Page Break	
		var isBefore = "false";
		var isAfter = "false";
		switch ( groupHeader.pageBreak )
		{
		case "beforeGroup":
			isBefore = "true";
			break;
		case "afterGroup":
			isAfter = "true";
			break;
		case "none":
			// do nothing
			break;
		default:
			throw new Error( Messages.getString( "UNRECOGNIZED_PAGE_BREAK_VALUE", currItem.pageBreak ) );
		}
		
		var pageBreakAttribs = ' page-break-before-header="' + isBefore + '"'
			+ ' page-break-after-header="' + isAfter + '"'
			+ ' page-break-before-footer="' + "false" + '"'
			+ ' page-break-after-footer="' + "false" + '"';
		firstItemInGroupAttribs += pageBreakAttribs;
		
		var group = this.groups[ii];
		for( var jj=0; jj<group.length; jj++ ) {
			currItem = group[jj];
			var extraAttribs = repeatGroupHeaderAttrib;
			
			if ( this.isFirstItemInGroupByIdx( ii, jj ) )
			{
			  extraAttribs += this.resolveColumnNameVariable( currItem, firstItemInGroupAttribs )
          + ' calculate-group-totals="' + groupHeader.bShowGroupSummary.toString() + '"';
			}
			else
			{
			  extraAttribs += ' calculate-group-totals="false"';
			}
			extraAttribs += ' create-group-header="true"';
			
      var alignmentAttrib = ' horizontal-alignment="' + currItem.alignment + '"';
			var formatAttrib = ReportSpec.getFormatStr( currItem );
			xml += '<field is-detail="false"' 
				+ ' name="' + XmlUtil.escapeXmlAttr( currItem.getBVItem().columnId ) + '"'
				+ alignmentAttrib
				+ formatAttrib
				+ ' type="' + BVItem.TYPE_TO_JAVA_SQL_TYPE[ currItem.getBVItem().physicalType ] + '"'
				+ extraAttribs
				+ groupHeaderAttribs
				+ '/>\n';
		} // end for group
	} // end for groups
	for( var idx=0; idx<this.details.length; idx++ ) {
		currItem = this.details[idx];
    var alignmentAttrib = ' horizontal-alignment="' + currItem.alignment + '"';
		var formatAttrib = ReportSpec.getFormatStr( currItem );
		xml += '<field is-detail="true"'
			+ ' name="' + XmlUtil.escapeXmlAttr( currItem.getBVItem().columnId ) + '"'
			+ alignmentAttrib
			+ formatAttrib
			+ ' expression="' + currItem.aggregatorFunc + '"'
			+ ' type="' + BVItem.TYPE_TO_JAVA_SQL_TYPE[ currItem.getBVItem().physicalType ] + '"'
			+ '/>\n';
	} // end for details

	xml += "</report-spec>\n";
	return xml;
};

/*private*/ReportSpec.prototype.isLastItemInLastGroupByIdx = function( itemNum )
{
  return ( 0 < this.groups.length )
    ? this.groups[ this.groups.length-1 ].length-1 == itemNum
    : false;
};
/*private*/ReportSpec.prototype.isLastItemInGroupByIdx = function( groupNum, itemNum )
{
  return ( groupNum < this.groups.length )
    ? this.groups[ groupNum ].length-1 == itemNum
    : false;
};
/*private*/ReportSpec.prototype.isFirstItemInGroupByIdx = function( groupNum, itemNum )
{
  return ( groupNum < this.groups.length )
    ? 0 == itemNum
    : false;
};
/*private*/ReportSpec.prototype.getLastItemInLastGroup = function()
{
  if ( this.groups.length > 0 )
  {
    var lastGroup = this.groups[ this.groups.length-1 ];
    return lastGroup[ lastGroup.length-1 ];
  }
  else
  {
    return null;
  }
};
/*static*/ReportSpec.RE_ATTR_PARTS = /(.*\$\()(group-label)(\).*)/;
/*private */ReportSpec.prototype.resolveColumnNameVariable = function( groupItem, strAttribs )
{
  var columnId = groupItem.getBVItem().columnId;
  var parts = strAttribs.match( ReportSpec.RE_ATTR_PARTS );
  if ( null != parts )
  {
    return parts[1] + columnId + parts[3];
  }
  else
  {
    return strAttribs;
  }
};

///*private */ReportSpec.prototype.getLastGroup = function()
//{
//  if ( ( this.groups.length > 0 ) && ( this.group > 0 ) )
//  {
//    return this.groups[ this.groups.length-1 ].group[ this.group-1 ];
//  }
//  else
//  {
//    return null;
//  }
//}
/*private static*/ReportSpec.getFormatStr = function( item )
{
	var physicalType = item.getBVItem().physicalType;
	if ( ( physicalType != BVItem.TYPE.STRING && physicalType != BVItem.TYPE.BOOLEAN )
	  && ( null != item.format )
		&& ( item.format != RSBaseItem.getDefaultFormat( physicalType ) ) )
	{
		return ' format="' + item.format + '"';
	}
	else
	{
		return "";
	}
};

ReportSpec.prototype.getMql = function() {
	var strMql = "<mql>\n<domain_type>relational</domain_type>\n<domain_id><![CDATA["+this.modelId+"]]></domain_id><model_id><![CDATA["+this.viewId+"]]></model_id>\n";
	strMql += this.getOptionsMql();
	strMql += this.getSelectionsMql();
  strMql += this.getConstraintMql();
	strMql += this.getSortMql();
	
	strMql += "</mql>\n";

	return strMql;
};

ReportSpec.prototype.getOptionsMql = function()
{
  var strMql = "<options>\n"
    + "<disable_distinct>"
    + this.bDisableDistinct
    + "</disable_distinct>\n"
    + "</options>\n";
    
    return strMql;
}

ReportSpec.prototype.getSelectionsMql = function()
{
	var strMql = "<selections>\n";
	// first add the grouping columns
	for( var ii=0; ii<this.groups.length; ii++ ) {
		for( var jj=0; jj<this.groups[ii].length; jj++ ) {
			strMql += this.groups[ii][jj].asXml();
		}
	}

	// now add the details
	for( var idx=0; idx<this.details.length; idx++ ) {
		strMql += this.details[idx].asXml();
	}
	strMql += "</selections>\n";
	
	return strMql;
};

ReportSpec.prototype.getSortMql = function()
{
  var strMql = "<orders>\n";

	var bvItems = this.getGroupsBVItemList();
	for ( var columnId in bvItems )
	{
		var bvItem = bvItems[ columnId ];
		strMql += bvItem.getSortXml();
	}
	// Details sorting second
	for ( var ii=0; ii<this.detailsSortList.length; ++ii )
	{
		var bvItem = this.detailsSortList[ ii ].getBVItem();
		strMql += bvItem.getSortXml();
	}

	strMql += "</orders>\n";
	
	return strMql;
};

ReportSpec.prototype.getConstraintMql = function()
{
  if ( this.strMql )
  {
    return this.strMql;
  }
  else
  {
    return this.getConstraintMqlByModel();
  }
}	

ReportSpec.prototype.getConstraintMqlByModel = function()
{
	var strMql = "<constraints>\n";
	var bvItems = this.getBVItemList();
	var bIsFirst = true;
	for ( var columnId in bvItems )
	{
		var bvItem = bvItems[ columnId ];
		strMql += bvItem.getConstraintXml( bIsFirst );
		bIsFirst = false;
	}
	strMql += "</constraints>\n";
	
	return strMql;
};

// TODO sbarkdull, is there a more elegant way than this?
// TODO sbarkdull, should we call removeAllConstraints to clean out constraint info from bvItems?
ReportSpec.prototype.setConstraintMqlStr = function( strMql )
{
  this.strMql = strMql;
};
ReportSpec.prototype.getConstraintMqlStr = function()
{
  return this.strMql;
};
ReportSpec.prototype.setDisableDistinct = function( bDisableDistinct )
{
  this.bDisableDistinct = bDisableDistinct;
};

ReportSpec.prototype.getDisableDistinct = function()
{
  return this.bDisableDistinct;
};

ReportSpec.prototype.getGroupItem = function( groupNum, itemIdx )
{
	return this.groups[ groupNum ][ itemIdx ];
};

ReportSpec.prototype.getGroupItemByColumnId = function( columnId )
{
	for ( var ii=0; ii<this.groups.length; ++ii )
	{
		var group = this.groups[ ii ];
		for ( var jj=0; jj<group.length; ++jj )
		{
			var item = group[ jj ];	// item is RSGroupItem
			var bvItem = item.getBVItem();
			if ( bvItem.columnId == columnId )
			{
				return item;
			}
		}
	}
	return null;
};

ReportSpec.prototype.getNumGroups = function()
{
	return this.groups.length;
};
ReportSpec.prototype.getNumGroupItems = function( groupNum )
{
	return this.groups[ groupNum ].length;
};
/**
 * @param groupHeader RSGroupHeader
 * @parm groupNum integer identifying the group number (usually 0..4)
 */
ReportSpec.prototype.addGroupHeader = function( groupHeader, groupNum )
{
	if ( groupHeader.constructor != RSGroupHeader )
	{
		throw new Error( Messages.getString( "invalidGrpHdr" ) );
	}
	this.groupHeaders[ groupNum ] = groupHeader;
};
ReportSpec.prototype.getGroupHeader = function(groupNum )
{
	return this.groupHeaders[ groupNum ];
};
ReportSpec.prototype.getNumDetails = function()
{
	return this.details.length;
};
ReportSpec.prototype.getDetailItem = function( itemIdx )
{
	return this.details[ itemIdx ];
};

ReportSpec.prototype.getNumFilters = function()
{
	return this.filters.length;
};
ReportSpec.prototype.getFilterItem = function( itemIdx )
{
	return this.filters[ itemIdx ];
};

ReportSpec.prototype.getDetailItemByColumnId = function( columnId )
{
	for ( var ii=0; ii<this.details.length; ++ii )
	{
		var item = this.details[ ii ];	// item is RSDetailItem
		var bvItem = item.getBVItem();
		if ( bvItem.columnId == columnId )
		{
			return item;
		}
	}
	return null;
};

/**
 * Get a map of all of the BVItems in the details, filters, and groups lists. Note
 * that a single BVItem can be shared by more than 1 item in the details, filters,
 * and groups lists.
 * 
 * @return Object the Object simulates a map, which is a map of columnIds to the
 * corresponding BVItem instances
 */
ReportSpec.prototype.getBVItemList = function()
{
	var list = new Object();
	
	this.addGroupsBVItemsToList( list );
	this.addDetailsBVItemsToList( list );
	this.addFiltersBVItemsToList( list );
	
	return list;
};
	
ReportSpec.prototype.getDetailsBVItemList = function()
{
	var list = new Object();
	this.addDetailsBVItemsToList( list );
	return list;
};
	
/**
 * 
 * NOTE: Separated details sorting form groups sorting, because
 * there is a requirement to order by all groupby items, so
 * that JFreeReport will be able to render groups 
 * correctly. 
 */	
ReportSpec.prototype.getGroupsBVItemList = function()
{
	var list = new Object();
	this.addGroupsBVItemsToList( list );
	return list;
};

/**
 * Remove all constraints from all items (constraints are stored in the BVItem,
 * each RS*Item has a reference to a BVItem, multiple RS*Items may reference the 
 * same BVItem).
 */
ReportSpec.prototype.removeAllConstraints = function()
{
	for( var ii=0; ii<this.groups.length; ii++ ) {
		var group = this.groups[ii];
		for( var jj=0; jj<group.length; jj++ ) {
			var bvItem = group[jj].getBVItem();
			bvItem.removeConstraints();
		}
	}
	
	for ( var idx=0; idx<this.details.length; ++idx )
	{
		var bvItem = this.details[ idx ].getBVItem();
		bvItem.removeConstraints();
	}
	for ( var idx=0; idx<this.filters.length; ++idx )
	{
		var bvItem = this.filters[ idx ].getBVItem();
		bvItem.removeConstraints();
	}
};

ReportSpec.prototype.addGroupsBVItemsToList = function( list )
{
	for( var ii=0; ii<this.groups.length; ii++ ) {
		for( var jj=0; jj<this.groups[ii].length; jj++ ) {
			var bvItem = this.groups[ii][jj].getBVItem();
			if ( !list[ bvItem.columnId ] )
			{
				list[ bvItem.columnId ] = bvItem;
			}
		}
	}
};
ReportSpec.prototype.addDetailsBVItemsToList = function( list )
{
	for ( var idx=0; idx<this.details.length; ++idx )
	{
		var bvItem = this.details[ idx ].getBVItem();
		if ( !list[ bvItem.columnId ] )
		{
			list[ bvItem.columnId ] = bvItem;
		}
	}
};
ReportSpec.prototype.addFiltersBVItemsToList = function( list )
{
	for ( var idx=0; idx<this.filters.length; ++idx )
	{
		var bvItem = this.filters[ idx ].getBVItem();
		if ( !list[ bvItem.columnId ] )
		{
			list[ bvItem.columnId ] = bvItem;
		}
	}
};

/**
 * @param item RSDetailItem
 */
ReportSpec.prototype.addToDetailsSortList = function( item )
{
	if ( item.constructor != RSDetailItem )
	{
		throw new Error( Messages.getString( "invalidDetailItem" ) );
	}
	this.detailsSortList.push( item );
};
ReportSpec.prototype.removeAllFromDetailsSortList = function()
{
	var length = this.detailsSortList.length;
	this.detailsSortList.splice(0, length );
};
ReportSpec.prototype.getNumDetailsSortListItems = function()
{
	return this.detailsSortList.length;
};
/**
 * @return RSDetailItem
 */
ReportSpec.prototype.getDetailsSortListItem = function( idx )
{
	return this.detailsSortList[ idx ];
};
/**
 * @param 
 */
ReportSpec.prototype.removeDetailsSortListItem = function( item )
{
  for ( var ii=this.detailsSortList.length-1; ii>=0; --ii )
  {
    /*RSItem*/var listItem = this.detailsSortList[ ii ];
    if ( listItem == item )
    {
      this.detailsSortList.splice( ii, 1 );
    }
  }
};

/**
 * @param 
 */
ReportSpec.prototype.setTemplateName = function( templateName )
{
  this.templateName = templateName;
}

/**
 * @return String the template name
 */
ReportSpec.prototype.getTemplateName = function()
{
  return this.templateName;
};