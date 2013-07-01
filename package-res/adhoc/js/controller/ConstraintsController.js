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
 * @param controller Controller
 */
ConstraintsController = function( controller )
{
  this.parentController = controller;
  this.constraintsEditorCtrl = this.parentController.wiz.getPg( 2 ).getConstraintsEditorCtrl();
  
	var localThis = this;
	this.constraintsEditorCtrl.setOnTabShowHandler(
	 function( tabName )
	 {
	   localThis.handleOnTabShow( tabName );
	 }
	);
	this.constraintsEditorCtrl.setOnTabHideHandler(
	 function( tabName )
	 {
	   return localThis.handleOnTabHide( tabName );
	 }
	);
	var constraintsCtrl = this.constraintsEditorCtrl.getConstraintsCtrl();
	constraintsCtrl.setOnAddCallback(
		function()
		{
			localThis.addConstraint();
		}
	);
	
	constraintsCtrl.getAddBtn().setEnabled( null !== this.pg2CurrItem );
};

/**
 * Show the appropriate constraint editor tab, do not invoke
 * callback handlers.
 */
ConstraintsController.prototype.setEditorTab = function()
{
	var strMql = this.parentController.reportSpec.getConstraintMqlStr();
	this.constraintsEditorCtrl.setConstraintTab( ( null !== strMql )
	 ? ConstraintsEditorCtrl.FREE_FORM
	 : ConstraintsEditorCtrl.BUILDER );
}

ConstraintsController.prototype.addConstraint = function()
{
	var item = this.parentController.pg2CurrItem;
	var bvItem = item.getBVItem();
	var constraintsCtrl = this.constraintsEditorCtrl.getConstraintsCtrl();	
	var bTextReadOnly = bvItem.physicalType == BVItem.TYPE.DATE || bvItem.physicalType == BVItem.TYPE.BOOLEAN;
	var defaultCondition = bvItem.physicalType == BVItem.TYPE.BOOLEAN ? "true" : undefined;
	constraintsCtrl.addConstraint( this.parentController.modelId, this.parentController.viewId,
    	bvItem.tableId, bvItem.columnId, bvItem.name, 
		undefined, undefined, defaultCondition, BVItem.COMPARATOR_MAP[ bvItem.physicalType ],
		Controller.typeToClass[ bvItem.physicalType ], bTextReadOnly );
};

/**
 * @return boolean true if constraint controls contain valid constraints, else false
 */
ConstraintsController.prototype.validateConstraintsCtrls = function()
{
	var bIsValid = true;
	var businessView = this.parentController.mdModels.getBView( this.parentController.modelId, this.parentController.viewId );	
	var constraintsCtrl = this.constraintsEditorCtrl.getConstraintsCtrl();

	var columnIdList = constraintsCtrl.getColumnIdList();
	for ( var columnIdx=0; columnIdx<columnIdList.length; ++columnIdx )
	{
		var columnId = columnIdList[ columnIdx ];
		var bvItem = businessView.getItem( columnId );
    var columnConstraintCtrl = constraintsCtrl.getColumnConstraintCtrl( columnId );
    var invalidEmptyAr = null;
    var invalidNumericAr = null;
    this.clearInvalidConstratinsMarker( columnConstraintCtrl );
		// empty STRING types are ok, other types must not be blank
		if ( bvItem.physicalType != BVItem.TYPE.STRING )
		{
		  invalidEmptyAr = this.validateColumnConstraintsNotEmpty( columnConstraintCtrl );
		}
		if ( bvItem.physicalType == BVItem.TYPE.NUMERIC )
		{
		  invalidNumericAr = this.validateColumnConstraintsNumeric( columnConstraintCtrl );
		}
		for ( var ii=0; invalidEmptyAr && ii<invalidEmptyAr.length; ++ii )
		{
		  var obj = invalidEmptyAr[ ii ];
		  obj.ctrl.setValidStatus( false, obj.reason );
		  if ( bIsValid )
		  {
		    bIsValid = false;
		  }
		}
		invalidEmptyAr = null;  // we're done with it
		for ( var ii=0; invalidNumericAr && ii<invalidNumericAr.length; ++ii )
		{
		  var obj = invalidNumericAr[ ii ];
		  obj.ctrl.setValidStatus( false, obj.reason );
		  if ( bIsValid )
		  {
		    bIsValid = false;
		  }
		}	
		invalidNumericAr = null;  // we're done with it
	}
	
	return bIsValid;
};

ConstraintsController.prototype.clearInvalidConstratinsMarker = function( columnConstraintCtrl )
{
  for ( var constraintIdx=0; constraintIdx<columnConstraintCtrl.getLength(); ++constraintIdx )
  {
  	var constraintCtrl = columnConstraintCtrl.getConstraintCtrl( constraintIdx );
    constraintCtrl.setValidStatus( true );
  }
};

ConstraintsController.prototype.validateColumnConstraintsNotEmpty = function( columnConstraintCtrl )
{
  var invalidAr = [];
  for ( var constraintIdx=0; constraintIdx<columnConstraintCtrl.getLength(); ++constraintIdx )
  {
  	var constraintCtrl = columnConstraintCtrl.getConstraintCtrl( constraintIdx );
  	var constraintValue = constraintCtrl.getValue();
  	var constraintValid = !StringUtils.isEmpty( constraintValue.compareValue );
    // Check to see if it's a null comparison, in which case it's ok
    if(!constraintValid){
      if(constraintValue.comparator == Constraints.operatorMap[ "isNull" ] 
         || constraintValue.comparator == Constraints.operatorMap[ "isNotNull" ]){
        constraintValid = true;        
      }
    }
    
  	if ( !constraintValid )
  	{
      invalidAr.push( { ctrl: constraintCtrl, reason: Messages.getString( "VALUE_MUST_BE_NONEMPTY" ) } );
  	}
  }
  return invalidAr;
};

ConstraintsController.prototype.validateColumnConstraintsNumeric = function( columnConstraintCtrl )
{
  var invalidAr = [];
  for ( var constraintIdx=0; constraintIdx<columnConstraintCtrl.getLength(); ++constraintIdx )
  {
  	var constraintCtrl = columnConstraintCtrl.getConstraintCtrl( constraintIdx );
  	var constraintValue = constraintCtrl.getValue();
  	var constraintValid = StringUtils.isNumeric( constraintValue.compareValue );
    // Check to see if it's a null comparison, in which case it's ok
    if(!constraintValid){
      if(constraintValue.comparator == Constraints.operatorMap[ "isNull" ] 
         || constraintValue.comparator == Constraints.operatorMap[ "isNotNull" ]){
        constraintValid = true;        
      }
    }
    
  	if ( !constraintValid )
  	{
      invalidAr.push( { ctrl: constraintCtrl, reason: Messages.getString( "VALUE_MUST_BE_NUMERIC" ) } );
  	}
  }
  return invalidAr;
};

// given a string like: "DATEVALUE( my_value )", give me the part that is "my_value"
/*static*/ConstraintsController.RE_DATEVALUE_FUNC_PARTS = /DATEVALUE\(([^)]+)\)/;
/*static*/ConstraintsController.DATEVALUE = "DATEVALUE";
/**
 * load the constraints control from the model (eg the BVItems that are
 * eligible to have constraints applied to them (bvItem property of RSGroupItem, RSDetailItem, RSFilterItem)
 */
ConstraintsController.prototype.loadConstraintsUiFromModel = function()
{
	var strMql = this.parentController.reportSpec.getConstraintMqlStr();
	if ( strMql != null )
	{
    this.constraintsEditorCtrl.getFreeFormConstraintsCtrl().setMql( strMql );
	}
	else
	{
  	var constraintsCtrl = this.constraintsEditorCtrl.getConstraintsCtrl();
  	constraintsCtrl.removeAllConstraints();
  	
  	var bVItems = this.parentController.reportSpec.getBVItemList();
  	
  	for ( var columnId in bVItems )
  	{
  		var bvItem = bVItems[ columnId ];
  		var constraints = bvItem.constraints;
  		// NOTE: all operators within a column group are the SAME
  		var operator = ( constraints.getNumConstraints() > 1 )
  		  ? constraints.getConstraint( 1 ).operator
  		  : "";

  		for (var idx=0; idx<constraints.getNumConstraints(); ++idx )
  		{
  			var constraint = constraints.getConstraint( idx );
			switch ( bvItem.physicalType ) {
			case BVItem.TYPE.DATE:
				var parts = constraint.condition.match( ConstraintsController.RE_DATEVALUE_FUNC_PARTS );
				constraint.condition = StringUtils.convertDateToClientFormat( parts[1] );
  				break;
			case BVItem.TYPE.BOOLEAN:
				if ( ( "TRUE()" == constraint.condition ) ) {
					constraint.condition = "true";
				} else if ( "FALSE()" == constraint.condition ) {
					constraint.condition = "false";
				} else {
					// surface an error here
				}
				break;
			default:
				// nada	
			}
			
  			var bTextReadOnly = bvItem.physicalType == BVItem.TYPE.DATE || bvItem.physicalType == BVItem.TYPE.BOOLEAN;
  			constraintsCtrl.addConstraint( this.parentController.modelId, this.parentController.viewId, 
  				bvItem.tableId, bvItem.columnId, bvItem.name,
  				operator, constraint.comparator, constraint.condition,
  				BVItem.COMPARATOR_MAP[ bvItem.physicalType ],
  				Controller.typeToClass[ bvItem.physicalType ], bTextReadOnly );
  		}
  	}
	}
};

/**
 * save the constraints control contents to the model (eg the BVItems that are
 * eligible to have constraints applied to them (bvItem property of RSGroupItem, RSDetailItem, RSFilterItem)
 */
ConstraintsController.prototype.saveConstraintsUiToModel = function()
{
	this.parentController.reportSpec.removeAllConstraints();
  this.parentController.reportSpec.setConstraintMqlStr( null );
  if ( this.constraintsEditorCtrl.getCurrentTabName() == ConstraintsEditorCtrl.FREE_FORM )
  {
    var strMql = this.constraintsEditorCtrl.getFreeFormConstraintsCtrl().getMql();
    this.parentController.reportSpec.setConstraintMqlStr( strMql );
  }
  else
  {
  	var businessView = this.parentController.mdModels.getBView( this.parentController.modelId, this.parentController.viewId );	
  	var constraintsCtrl = this.constraintsEditorCtrl.getConstraintsCtrl();
  
  	var columnIdList = constraintsCtrl.getColumnIdList();
  	for ( var columnIdx=0; columnIdx<columnIdList.length; ++columnIdx )
  	{
  		var columnId = columnIdList[ columnIdx ];
  		var bvItem = businessView.getItem( columnId );
  		var bvItemConstraints = bvItem.getConstraints();
  		var columnConstraintCtrl = constraintsCtrl.getColumnConstraintCtrl( columnId );
  		var logicalOperator = null;
  		for ( var constraintIdx=0; constraintIdx<columnConstraintCtrl.getLength(); ++constraintIdx )
  		{
  			var constraintCtrl = columnConstraintCtrl.getConstraintCtrl( constraintIdx );
  			var constraintValue = constraintCtrl.getValue();
	  		if ( 0 == constraintIdx )
	  		{
	  		  logicalOperator = constraintValue.logicalOperator;
	  		}
			switch ( bvItem.physicalType ) {
			case BVItem.TYPE.DATE:
  				var serverDate = StringUtils.convertDateToServerFormat( constraintValue.compareValue );
  				constraintValue.compareValue = ConstraintsController.DATEVALUE + "(\"" + serverDate + "\")";
				break;
			case BVItem.TYPE.BOOLEAN:
				if ( ( "true" == constraintValue.compareValue ) ) {
					constraintValue.compareValue = "TRUE()";
				} else if ( "false" == constraintValue.compareValue ) {
					constraintValue.compareValue = "FALSE()";
				} else {
					// surface an error here
				}
				break;
			default:
				// nada	
			}
  			
  			bvItemConstraints.addConstraint( 0 == constraintIdx ? "" : logicalOperator,
  				constraintValue.comparator, constraintValue.compareValue );
  		}
  	}
  }
};

ConstraintsController.prototype.handleOnTabShow = function( tabName )
{
  var reportSpec = this.parentController.reportSpec;
  switch ( tabName )
  {
  case ConstraintsEditorCtrl.BUILDER:
    var bLoadingStillOk = true;
    var strMql = reportSpec.getConstraintMqlStr();
    var constraintsNd = null;
    try {
      var constraintsDoc = XmlUtil.load( strMql );
      constraintsNd = XmlUtil.selectSingleNode( constraintsDoc, "constraints" );
    } catch ( ignore ) {
      // the user has been warned that there may be problems with the MQL, we did our best to load it
      // ignore any exceptions.
      bLoadingStillOk = false;
    }
    if ( bLoadingStillOk )
    {
      try {
        reportSpec.loadConstraintsMqlIntoBVItems( constraintsNd );
      } catch( ignore ) {
        // the user has been warned that there may be problems with the MQL, we did our best to load it
        // ignore any exceptions.
      }
    }
    reportSpec.setConstraintMqlStr( null );
    break;
  case ConstraintsEditorCtrl.FREE_FORM:
    // convert the model's Mql (this was generated by the Builder, and is stored in the BVItems),
    // into a string, and then copy the string to the reportSpec so that the constraints are
    // represented by a simple Mql string, instead of the BVItem's constraints property.
    var strMql = reportSpec.getConstraintMqlByModel();
    reportSpec.setConstraintMqlStr( strMql );
    break;
  default:
    // do nothing
    break;
  }
  // load the appropriate UI component (Builder of Free Form) with the constraints
  // from the ReportSpec
  this.loadConstraintsUiFromModel();
};

/**
 * @param tabName String the name of the tab whose state is changing to hidden
 */
ConstraintsController.prototype.handleOnTabHide = function( tabName )
{
  switch ( tabName )
  {
  case ConstraintsEditorCtrl.BUILDER:
    var bContinueToFreeForm = this.validateSwitchToFreeForm();
    if ( !bContinueToFreeForm ) { return false; }
    break;
  case ConstraintsEditorCtrl.FREE_FORM:
    var bContinueToBuilder = this.validateSwitchToBuilder();
    if ( !bContinueToBuilder ) { return false; }
    break;
  default:
    // do nothing
    break;
  }
  // at this point, the Mql is only in the UI, lets copy the UI to the model
  this.saveConstraintsUiToModel();
  return true;
};

/**
 * @return boolean true if it is ok to switch to free form editor, else false
 */
ConstraintsController.prototype.validateSwitchToFreeForm = function()
{
  var bIsConstraintsValid = this.validateConstraintsCtrls();
  if ( !bIsConstraintsValid )
  {
  	var msg = Messages.getString("CONSTRAINTS_INVALID");
  	this.parentController.wiz.msgCtrl.error( msg );
  }
  return bIsConstraintsValid;
};

/**
 * @return boolean true if it is ok to switch to builder, else false
 */
ConstraintsController.prototype.validateSwitchToBuilder = function()
{
  var bContinueToBuilder = true;
  var reportSpec = this.parentController.reportSpec;
  
  var bValidConstraints = true;
  var strMql = this.constraintsEditorCtrl.getFreeFormConstraintsCtrl().getMql();
  try {
    var constraintsDoc = XmlUtil.load( strMql );
    var constraintsNd = XmlUtil.selectSingleNode( constraintsDoc, "constraints" );
    bValidConstraints = reportSpec.validateConstraints( constraintsNd );
  } catch ( e ) {
    bValidConstraints = false;
  }
  if ( !bValidConstraints )
  {
		bContinueToBuilder = this.parentController.wiz.msgCtrl.confirm( Messages.getString("PARTIAL_MQL_PARSE_FAILURE") );
  }
  return bContinueToBuilder;
}
