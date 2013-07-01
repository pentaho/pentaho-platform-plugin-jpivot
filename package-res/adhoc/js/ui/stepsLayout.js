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
 * @author
 */

/* DETERMINE STEP BY WHICH DIV IS DISPLAY:BLOCK */
function resizePg() {
	if(document.getElementById("content0").style.display == "block") {
		setHeights_step0();
	} else if(document.getElementById("content1").style.display == "block") {
		setHeights_step1();
	} else if(document.getElementById("content2").style.display == "block") {
		setHeights_step2();
	} else if(document.getElementById("content3").style.display == "block") {
		setHeights_step3();
	}
}


/* ======================================================================================================================================= */
/* ======================================================================================================================================= */
/* =================================                       STEP ONE                 ====================================================== */
/* ======================================================================================================================================= */
/* ======================================================================================================================================= */
function setHeights_step0() {

	var windowWidth = 0;
	var windowHeight = 0;

	var block = document.getElementById("pixelshim");
	
	var shim_availBusinessBlock = document.getElementById("shim_availableBusinessViews");
	var descriptionContainer = document.getElementById("descriptionContainer");
	var categoriesContainer = document.getElementById("categoriesContainer");

	//var availableTemplatesContainer = document.getElementById("availableTemplatesContainer");
	var availableTemplatesDiv =  document.getElementById("availableTemplatesDiv");
	var templateDescriptionContainer = document.getElementById("templateDescriptionContainer");
	var thumbnailContainer = document.getElementById("thumbnailContainer");
	var topBodyWidthFix = document.getElementById("middleContentTable");
	var topBodyWidthFix2 = document.getElementById("middleContentTable2");
	
	var TOP_ROW_PERCENT = 0.55;	// 0.55; TODO sbarkdull, when re-introducing the templates, change 1.0 to 0.55;
	var MIN_HEIGHT = 350;
	var MIN_WIDTH = 965;
	var HEADER_HEIGHT = 72;	// see style sheet
	var FOOTER_HEIGHT = 50;	// see style sheet
	var usedSpace = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		// Firefox
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		
		var FUDGE = 130;
		var SHIM_HEIGHT = 34;
		usedSpace = HEADER_HEIGHT + FOOTER_HEIGHT + FUDGE;

	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE7
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
		
		var FUDGE = 145;
		var SHIM_HEIGHT = 28;
		usedSpace = HEADER_HEIGHT + FOOTER_HEIGHT + FUDGE;

	} else if(typeof document.body.style.maxHeight == "undefined") {
		// IE6
	/* =========================================
		   IE VERSION 6 in NON STANDARDS MODE
	   ========================================= */
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
		
		var FUDGE = 140;
		var SHIM_HEIGHT = 32;
		usedSpace = HEADER_HEIGHT + FOOTER_HEIGHT + FUDGE;
	}

	var totalHeight = Math.max( windowHeight - usedSpace, MIN_HEIGHT );
	var topRowHeight = Math.round( totalHeight * TOP_ROW_PERCENT );
	var bottomRowHeight = Math.max(totalHeight - topRowHeight, 255 );
	
	shim_availBusinessBlock.style.height = (topRowHeight - SHIM_HEIGHT - 26) + "px";
	descriptionContainer.style.height = topRowHeight + "px";
	categoriesContainer.style.height = topRowHeight + "px"; 

	availableTemplatesDiv.style.height = (bottomRowHeight - SHIM_HEIGHT - 3 )  + "px";
	templateDescriptionContainer.style.height = bottomRowHeight + "px";
	thumbnailContainer.style.height = bottomRowHeight + "px"; 
	
	
	/* ============================================================================================
		   set image height for upper left image object. This sets the min height of the upper row
	   ============================================================================================ */
	/*
	commented out for removal of template portion of step 1
	if(windowHeight > 135) {
		block.height = windowHeight;
	} else {
		block.height = 135;
	}*/
	// set hight image height
	// snb block.height = 435;
	/* =============================================================================================================================
		 handles width of upper and lower right section widths. If the page shrinks below this threshhold, its set to a fixed size.
		 This keeps the description divs from overlapping text and breaking the layout.
	   ============================================================================================================================= */
	if(windowWidth <= MIN_WIDTH) {
		topBodyWidthFix.width = MIN_WIDTH;
		topBodyWidthFix2.width = MIN_WIDTH;
	} else {
		topBodyWidthFix.width = "100%";
		topBodyWidthFix2.width = "100%";
	}
}



/* ======================================================================================================================================= */
/* ======================================================================================================================================= */
/* =================================                       STEP TWO                 ====================================================== */
/* ======================================================================================================================================= */
/* ======================================================================================================================================= */


function setHeights_step1() {
		var FUDGE = 7;
		var windowWidth = 0;
		var windowHeight = 0;
		var containerHeight = 0;
		var MIN_CONTENT_HEIGHT = 200;
/*
	if ( Debug.on )
	{
		Debug.clearMarkers();
	}
*/
		var availableItemsContainer = document.getElementById("availableItemsContainer");
		var topLoc = UIUtil.getElemOffset( availableItemsContainer );
		var footer = document.getElementById( "footer" );
		var footerLoc = UIUtil.getElemOffsetForAbsolutePosition( footer );
		
		var contentHeight = Math.max( footerLoc.top - topLoc.top, MIN_CONTENT_HEIGHT );
		//gLogger.debug( "contentHeight: " + contentHeight );
		
		contentHeight -= FUDGE;
		var rightContentHeight = contentHeight;
		
		var groups_container = document.getElementById("groups_container");
		var topLoc = UIUtil.getElemOffset( groups_container );
		var selecteditems_groups = document.getElementById("selecteditems_groups");
		var bottomLoc = UIUtil.getElemOffset( selecteditems_groups );
		var itemDelta = topLoc.top - bottomLoc.top;
		//gLogger.debug( "itemDelta " + itemDelta );
		rightContentHeight -= itemDelta;
		
		var details_container = document.getElementById("details_container");
		var topLoc = UIUtil.getElemOffset( details_container );
		var selecteditems_details = document.getElementById("selecteditems_details");
		var bottomLoc = UIUtil.getElemOffset( selecteditems_details );
		var itemDelta = topLoc.top - bottomLoc.top;
		//gLogger.debug( "itemDelta " + itemDelta );
		rightContentHeight -= itemDelta;
		
		var filters_container = document.getElementById("filters_container");
		var topLoc = UIUtil.getElemOffset( filters_container );
		var selecteditems_filters = document.getElementById("selecteditems_filters");
		var bottomLoc = UIUtil.getElemOffset( selecteditems_filters );
		var itemDelta = topLoc.top - bottomLoc.top;
		//gLogger.debug( "itemDelta " + itemDelta );
		rightContentHeight -= itemDelta;
		
		rightContentHeight -= 85;
		//gLogger.debug( "rightContentHeight: " + rightContentHeight );
		
		var quarter = Math.round( rightContentHeight / 4 );
		var groupHeight = rightContentHeight - (2*quarter);
		
		groups_container.style.height = groupHeight + "px";
		details_container.style.height = quarter + "px";
		filters_container.style.height = (rightContentHeight - quarter - groupHeight) + "px";
		availableItemsContainer.style.height = contentHeight + "px";

/*
	if ( Debug.on )
	{
		var selecteditems_groups = document.getElementById("selecteditems_groups");
		var selecteditems_details = document.getElementById("selecteditems_details");
		var selecteditems_filters = document.getElementById("selecteditems_filters");
		
		Debug.markElemOrigin(groups_container);
		Debug.markElemOrigin(selecteditems_groups);
		Debug.markElemOrigin(details_container);
		Debug.markElemOrigin(selecteditems_details);
		//Debug.markElemMax(selecteditems_details);
		Debug.markElemOrigin(filters_container);
		Debug.markElemOrigin(selecteditems_filters);
		//Debug.markElemMax(selecteditems_filters);
		Debug.markElemOrigin(availableItemsContainer);
		Debug.markElemOrigin(footer);
		Debug.markCoord( footerLoc, footer.id, "orange", false );
	}
*/
}


/* ======================================================================================================================================= */
/* ======================================================================================================================================= */
/* =================================                       STEP THREE               ====================================================== */
/* ======================================================================================================================================= */
/* ======================================================================================================================================= */

function setHeights_step2() {
	 
		var MIN_CONTENT_HEIGHT = 240;
    var FUDGE = 110;  // this probably is the sum of various padding and margin values
    
		var groups2Div = document.getElementById("groups2Div");
		var groups2DivPos = UIUtil.getElemOffset( groups2Div );
		
		var details2Div = document.getElementById("details2Div");
		var details2DivPos = UIUtil.getElemOffset( details2Div );
		var detailsParentTd = details2Div.parentNode.parentNode.parentNode.parentNode.parentNode;
		var detailsParentTdPos = UIUtil.getElemOffset( detailsParentTd );
		var details2Delta = details2DivPos.top - detailsParentTdPos.top;
		
		var filters2Div = document.getElementById("filters2Div");
		var filters2DivPos = UIUtil.getElemOffset( filters2Div );
		var filtersParentTd = filters2Div.parentNode.parentNode.parentNode.parentNode.parentNode;
		var filtersParentTdPos = UIUtil.getElemOffset( filtersParentTd );
		var filters2Delta = filters2DivPos.top - filtersParentTdPos.top;

		var footer = document.getElementById( "footer" );
		var footerLoc = UIUtil.getElemOffsetForAbsolutePosition( footer );
		
		var contentHeight = footerLoc.top - ( groups2DivPos.top + details2Delta + filters2Delta ) - FUDGE;
		contentHeight = Math.max( contentHeight, MIN_CONTENT_HEIGHT );
		
		var quarter = Math.round( contentHeight / 4 );
		var groupHeight = contentHeight - (2*quarter);
		
		groups2Div.style.height = groupHeight + "px";
		details2Div.style.height = quarter + "px";
		filters2Div.style.height = ( contentHeight - groupHeight - quarter ) + "px";
		// -----------------------
		
		
		var constraintsCtrlDivInner = document.getElementById("constraintsCtrlDivInner");
		var freeFormConstraintTextArea = document.getElementById("freeFormConstraintTextArea");
		var groupColumnSorterListDiv = document.getElementById("groupColumnSorterListDiv");
		var groupColumnSorterListDivParentTable = groupColumnSorterListDiv.parentNode.parentNode.parentNode.parentNode;
		var detailColumnSorterListDiv = document.getElementById("detailColumnSorterListDiv");
		var detailColumnSorterListDivParentTable = detailColumnSorterListDiv.parentNode.parentNode.parentNode.parentNode;
		
		var columnSorterListDiv = groupColumnSorterListDivParentTable.style.display == "block" ? groupColumnSorterListDiv : detailColumnSorterListDiv;
		
		var constraintsHeight = ( quarter*2)-6;
		constraintsCtrlDivInner.style.height = constraintsHeight + "px";
		freeFormConstraintTextArea.style.height = constraintsHeight + 29 + "px";
		columnSorterListDiv.style.height = constraintsHeight + "px";
		
		
		return;
	 
		Debug.clearMarkers();
		
		var groups2Td = document.getElementById("groups2Td");
		var details2Td = document.getElementById("details2Td");
		var filters2Td = document.getElementById("filters2Td");
		Debug.markElemOrigin(groups2Div);
		Debug.markElemMax(groups2Div);	 
		Debug.markElemOrigin(details2Div);
		Debug.markElemMax(details2Div);	 
		Debug.markElemOrigin(filters2Div);
		Debug.markElemMax(filters2Div);
		
		Debug.markElemOrigin(groups2Td);
		Debug.markElemMax(groups2Td);	 
		Debug.markElemOrigin(details2Td);
		Debug.markElemMax(details2Td);	 
		Debug.markElemOrigin(filters2Td);
		Debug.markElemMax(filters2Td);
		Debug.markElemOrigin(footer);
		
		Debug.markElemMax(constraintsCtrlDivInner);
		Debug.markElemOrigin(constraintsCtrlDivInner);
		Debug.markElemMax(detailColumnSorterListDiv);
		Debug.markElemOrigin(detailColumnSorterListDiv);
		Debug.markElemMax(groupColumnSorterListDiv);
		Debug.markElemOrigin(groupColumnSorterListDiv);
		
	 
	 return;
		var windowWidth = 0;
		var windowHeight = 0;
		var containerHeight = 0;
		
		var mainCenterTable = document.getElementById("step3_mainTable");
		
		var contentBlock_step3 = document.getElementById("contentBlock_step3");
		
		var step3GrpsFormatTitle = document.getElementById("step3GrpsFormatTitle");
		var formattingSubBlock = document.getElementById("formattingSubBlock");
		var formattingCell_groups = document.getElementById("groupHeaderAlignmentContainer");
		
		var levelname_box = document.getElementById("levelname_box");
		var options_box = document.getElementById("options_box");
		// TODO sbarkdull var categories_box = document.getElementById("categories_box");
		var pagebreak_box = document.getElementById("pagebreak_box");
		
		var levelnameInput = document.getElementById("levelnameInput");
		var listDivHeight = 0;
		var totalHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			/* ==============================
					  NON IE
			   ============================== */
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
	
			// set height for main table
			if(windowHeight <= 565) {
				mainCenterTable.style.height = 465 + "px";
			} else {
				mainCenterTable.style.height = windowHeight - 175 + "px";
			}
			
			// left column boxes and parents
			totalHeight = windowHeight - 300;
			var quarterHeight = Math.round( totalHeight/4 );
			listDivHeight = Math.max( 100, quarterHeight );

			if(windowWidth <= 985) {
				mainCenterTable.style.height = windowHeight - 125 + "px";
				contentBlock_step3.style.padding = "0px 15px 0px 0px";
			} else {
				contentBlock_step3.style.padding = "0px 0px 0px 0px";
			}
			
			// groups main level widths ( level name, options, categories, page break and formatting )
			var generalboxwidth = "50%";
			levelname_box.style.width = generalboxwidth;
			options_box.style.width = generalboxwidth;
			// TODO sbarkdull categories_box.style.width = generalboxwidth;
			pagebreak_box.style.width = generalboxwidth;
			// groups sub level
			if(document.getElementById("groupItemEditorContainer").style.display == "block") {
				var numericBlock = document.getElementById("numericBlock");
				
				if(windowWidth <= 985) {
					numericBlock.style.width = 520 + "px";
				} else {
					numericBlock.style.width = windowWidth - 472 + "px";
				}
				
				if(windowHeight < 585) {
					numericBlock.style.width = windowWidth - 590 + "px";
				}
			// details 
			} else if(document.getElementById("detailEditorContainer").style.display == "block") {
				var numericBlock_details = document.getElementById("numericBlock_details");
				
				if(windowWidth <=982) {
					numericBlock_details.style.width = 400 + "px";
				} else {
					numericBlock_details.style.width = windowWidth - 595 + "px";
				}
			}
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		
		/* ======================================================
			   IE VERSIONS 6 and 7 in STANDARDS COMPLIANT MODE
		   ====================================================== */
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
			
			// set height for main table
			if(windowHeight <= 570) {
				mainCenterTable.style.height = 470 + "px";
			} else {
				mainCenterTable.style.height = windowHeight - 150 + "px";
			}
			totalHeight = windowHeight - 300;
			var quarterHeight = Math.round( totalHeight/4 );
			listDivHeight = Math.max( 100, quarterHeight );
			
			// main level in groups
			if(document.getElementById("groupHeaderEditorContainer").style.display == "block") {
				// main level of groups for step 3
				//special styles for groups main level in IE
				mainCenterTable.style.width = "98%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				step3GrpsFormatTitle.style.width = 150;
				formattingCell_groups.style.height = 242; // formatting block for main level in groups
				formattingSubBlock.style.padding = "0px 10px 0px 0px"; // the padding here keeps the contents of the formatting block right edge visible
				formattingSubBlock.style.width = 150;
				
				// groups main level widths ( level name, options, categories, page break and formatting )
				levelname_box.style.width = Math.max( 150, windowWidth - 690 );  // textareas, text inputs sometimes inherit the sum of all its parents padding/margins in ie7, and ie6
				options_box.style.width = 175;
				pagebreak_box.style.width = 175;
				
			// groups sub level
			} else if(document.getElementById("groupItemEditorContainer").style.display == "block") {
				var numericBlock = document.getElementById("numericBlock");
				
				mainCenterTable.style.width = "100%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				// READ THIS PAGE FOR AN EXAMPLE  USE IE OF COURSE, OTHERWISE IT LOOKS FINE http://www.carcomplaints.com/test/ie-label-margin-bug.html
				
				if(windowHeight < 585) {
					numericBlock.style.width = windowWidth - 480 + "px";
				}
				if(windowWidth <= 1010) {
					numericBlock.style.width = 525 + "px";
				} else {
					numericBlock.style.width = windowWidth - 480 + "px";
				}
			// details 
			} else if(document.getElementById("detailEditorContainer").style.display == "block") {
				
				mainCenterTable.style.width = "100%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				
				var details_calculationBlock = document.getElementById("details_calculationBlock");
				var numericBlock_details = document.getElementById("numericBlock_details");
				var aggrFuncListCont = document.getElementById("aggrFuncListCont");

				//details_calculationBlock.style.margin = "0px 15px 0px 0px";
				aggrFuncListCont.style.height = 150;
				
				if(windowWidth <=985) {
					numericBlock_details.style.width = 310 + "px";
				} else {
					numericBlock_details.style.width = windowWidth - 660 + "px";
				}
			}
		} else if(typeof document.body.style.maxHeight == "undefined") {
		/* =========================================
			   IE VERSION 6 in NON STANDARDS MODE
		   ========================================= */
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
			
			// set height for main table
			if(windowHeight <= 570) {
				mainCenterTable.style.height = 470 + "px";
			} else {
				mainCenterTable.style.height = windowHeight - 150 + "px";
			}
			totalHeight = windowHeight - 264;
			var quarterHeight = Math.round( totalHeight/4 );
			listDivHeight = Math.max( 100, quarterHeight );
				
			// main level in groups
			if(document.getElementById("groupHeaderEditorContainer").style.display == "block") {
				// main level of groups for step 3
				//special styles for groups main level in IE
				mainCenterTable.style.width = "98%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				step3GrpsFormatTitle.style.width = 150;
				formattingCell_groups.style.height = 242; // formatting block for main level in groups
				formattingSubBlock.style.padding = "0px 10px 0px 0px"; // the padding here keeps the contents of the formatting block right edge visible
				formattingSubBlock.style.width = 150;
				
				// groups main level widths ( level name, options, categories, page break and formatting )
				var levelname_cell = document.getElementById("levelname_cell");
				var optionsbox_cell = document.getElementById("optionsbox_cell");
				
				levelname_box.style.width = Math.max( 150, windowWidth - 690 );  // read this for example of why ie has unremovable padding on form elements http://www.carcomplaints.com/test/ie-label-margin-bug.html
				levelname_cell.style.height = 80;
				options_box.style.width = 175;
				optionsbox_cell.style.height = 80;
				// TODO sbarkdull categories_box.style.width = windowWidth - 690;
				pagebreak_box.style.width = 175;
				
				// minimum width for categories box -- keeps things lined up
				if(windowWidth <=1025) {
					// TODO sbarkdull categories_box.style.width = 335;
				} else {
					// TODO sbarkdull categories_box.style.width = windowWidth - 690;
				}
			// groups sub level
			} else if(document.getElementById("groupItemEditorContainer").style.display == "block") {
				var numericBlock = document.getElementById("numericBlock");
				var constraintsBlock = document.getElementById("constraintsBlock");
				
				mainCenterTable.style.width = "100%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				
				if(windowHeight < 585) {
					constraintsBlock.style.height = 183 + "px";
					numericBlock.style.width = windowWidth - 600 + "px";
				} else {
					constraintsBlock.style.height = windowHeight - 412 + "px";
				}
				if(windowWidth <= 1016) {
					numericBlock.style.width = 533 + "px";
				} else {
					numericBlock.style.width = windowWidth - 485 + "px";
				}
				if((windowWidth <= 1016) && (windowHeight < 585)) {
					// TODO sbarkdull groupsSubConstraint.style.width = "99%";
				}
				if((windowWidth > 1016) && (windowHeight < 585)) {
					numericBlock.style.width = windowWidth - 510 + "px";
				}
			// details 
			} else if(document.getElementById("detailEditorContainer").style.display == "block") {
				
				mainCenterTable.style.width = "100%"; // the main content div for this phase of step 3 needs to be smaller in IE, they treat padding differently
				
				var details_calculationHeader = document.getElementById("details_calculationHeader");
				var details_calculationMainCell = document.getElementById("details_calculationMainCell");
				var details_calculationBlock = document.getElementById("details_calculationBlock");
				var numericBlock_details = document.getElementById("numericBlock_details");
				var aggrFuncListCont = document.getElementById("aggrFuncListCont");
				var details_alignmentTable = document.getElementById("details_alignmentTable");
				var detailsAlignmentContainer = document.getElementById("detailsAlignmentContainer");
				
				// this fixes the styled width of the border for this block in IE6 
				var details_alignment_adjustment = document.getElementById("details_alignment_adjustment");
				details_alignment_adjustment.style.width = "80%";
				details_alignmentTable.style.width = 100 + "px";
				detailsAlignmentContainer.style.width = 100 + "px";
				
				details_calculationBlock.style.margin = "0px 15px 0px 0px";
				aggrFuncListCont.style.height = 150;
				
				// this fixes the styled width of the border for this block in IE6 
				var details_usefunction_adjustment = document.getElementById("details_usefunction_adjustment");
				details_usefunction_adjustment.style.width = "50%";
				details_calculationHeader.style.width = 75 + "px";
				details_calculationMainCell.style.width = 75 + "px";
				details_calculationBlock.style.width = 95 + "px";
				aggrFuncListCont.style.width = 95 + "px";
				
				if(windowWidth <=1000) {
					numericBlock_details.style.width = 350 + "px";
				} else {
					numericBlock_details.style.width = windowWidth - 646 + "px";
				}
			}
		}

		// set selected items - groups height
		var groupsHeight = (totalHeight - (2*listDivHeight));
		groups2Td.style.height = groupsHeight + "px";
		groups2Div.style.height = groupsHeight -20 + "px";
		
		// set selected items - details height
		details2Td.style.height = listDivHeight + "px";
		details2Div.style.height = listDivHeight - 20 + "px";
		
		// set selected items - filters height
		filters2Td.style.height = listDivHeight + "px";
		filters2Div.style.height = listDivHeight - 20 + "px";
		
		var step3ConstraintsTitle = document.getElementById( "step3ConstraintsTitle" );
		var step3ConstraintsTitleTop = UIUtil.getElemOffset( step3ConstraintsTitle ).top;
		
		var filters2TdTop = UIUtil.getElemOffset( filters2Td ).top;
		var filtersBottom = filters2TdTop + filters2Td.offsetHeight;
		var totalHeight2 = filtersBottom - step3ConstraintsTitleTop - 37;
		var constraintsHeight = Math.round( totalHeight2/2 );
		var sortColumnsHeight = totalHeight2 - constraintsHeight;
		
		
		
		var constraintsCtrlDivInner = document.getElementById("constraintsCtrlDivInner");d
		
		var constraintsCtrlDivInnerParent = constraintsCtrlDivInner.parentNode;
		var constraintsCtrlDivInnerParentTop = UIUtil.getElemOffset( constraintsCtrlDivInnerParent ).top;
		
		var constraintsElemsAboveListHeight = constraintsCtrlDivInnerParentTop - step3ConstraintsTitleTop;
		var height = Math.max( 25, constraintsHeight - constraintsElemsAboveListHeight );
		constraintsCtrlDivInner.style.height = height + "px";
		
		
		
		var freeFormConstraintTextArea = document.getElementById( "freeFormConstraintTextArea" );
		freeFormConstraintTextArea.style.height = height + 28 + "px";
		
		/*
		//gLogger.debug( "constraintsCtrlDivInnerstyle.height: " 
		//	+ constraintsHeight + " - (" + constraintsCtrlDivInnerParentTop + " - " + step3ConstraintsTitleTop + ") = " + height );
		*/
		var constraintsTd = document.getElementById("constraintsTd");
		//constraintsTd.style.height = "200px";
		
		
		var step3ColumnSorterEditorTitle = document.getElementById( "step3ColumnSorterEditorTitle" );
		var step3ColumnSorterEditorTitleTop = UIUtil.getElemOffset( step3ColumnSorterEditorTitle ).top;
//		gLogger.debug( "title top: " + step3ColumnSorterEditorTitleTop );
		
		var FUDGE = 37;
		var columnSorterTd = document.getElementById( "columnSorterTd" );
		var columnSorterTdTop = UIUtil.getElemOffset( columnSorterTd ).top;
//		gLogger.debug( "columnSorterTdTop: " + columnSorterTdTop );
		
		var columnSorterElemsAboveListHeight = columnSorterTdTop - step3ColumnSorterEditorTitleTop;
		var columnSorterHeight = (sortColumnsHeight - columnSorterElemsAboveListHeight - FUDGE ) + "px";
		
		var groupColumnSorterListDiv = document.getElementById( ColumnSorterEditorCtrl.GROUP_COLUMN_SORTER_ID
			+ EditableListCtrl.LIST_DIV_ID_SUFFIX );
		groupColumnSorterListDiv.style.height = columnSorterHeight;
		var detailColumnSorterListDiv = document.getElementById( ColumnSorterEditorCtrl.DETAIL_COLUMN_SORTER_ID
			+ EditableListCtrl.LIST_DIV_ID_SUFFIX );
		detailColumnSorterListDiv.style.height = columnSorterHeight;
		
//		gLogger.debug( "table ht: " + detailColumnSorterListDiv.style.height );
} // end setHeights_step2()

/* ======================================================================================================================================= */
/* ======================================================================================================================================= */
/* =================================                       STEP FOUR                ====================================================== */
/* ======================================================================================================================================= */
/* ======================================================================================================================================= */


function setHeights_step3() {
	 
		var windowWidth = 0;
		var windowHeight = 0;
		var containerHeight = 0;
		
		var headerReport = document.getElementById("shim_header_report");
		// TODO sbarkdull var headerReportDIV = document.getElementById("shim_header_reportDIV");
		var headerPage = document.getElementById("shim_header_page");
		// TODO sbarkdull var headerPageDIV = document.getElementById("shim_header_pageDIV");

		var footerReport = document.getElementById("shim_footer_report");
		// TODO sbarkdull var footerReportDIV = document.getElementById("shim_footer_reportDIV");
		var footerPage = document.getElementById("shim_footer_page");
		// TODO sbarkdull var footerPageDIV = document.getElementById("shim_footer_pageDIV");
		
		var content3_cell = document.getElementById("content3_cell");
		
		var general_report_table = document.getElementById("general_report_table");
		// TODO sbarkdull var general_report_div = document.getElementById("general_report_div");
		
		var header_report_table = document.getElementById("header_report_table");
		var header_page_table = document.getElementById("header_page_table");
		
		var widthShim = document.getElementById("widthShim");
		var orientation_cell = document.getElementById("orientation_cell");
		var paperTypeRadioContainer = document.getElementById("paperTypeRadioContainer");
		
		if( typeof( window.innerWidth ) == 'number' ) {
			/* ==============================
					  NON IE
			   ============================== */
			orientation_cell.style.height = "133px";
			paperTypeRadioContainer.style.height = "133px";
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			
			var cellHeight = (windowHeight - 425)/2;
			var divHeight = ((windowHeight - 425)/2)-40;
			
			if(cellHeight <= 120) {
				cellHeight = 120;
				divHeight = 80;
				content3_cell.style.height = "550px";
			}
			
			headerReport.style.height = cellHeight + "px";
			// TODO sbarkdull headerReportDIV.style.height = divHeight + "px";
			headerPage.style.height = cellHeight + "px";
			// TODO sbarkdull headerPageDIV.style.height = divHeight + "px";
			
			footerReport.style.height = cellHeight + "px";
			// TODO sbarkdull footerReportDIV.style.height = divHeight + "px";
			footerPage.style.height = cellHeight + "px";
			// TODO sbarkdull footerPageDIV.style.height = divHeight + "px";

			if(windowWidth < 991) {
				widthShim.width = 995;
				content3_cell.style.height = "560px";
			}
			
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		
		/* ======================================================
			   IE VERSIONS 6 and 7 in STANDARDS COMPLIANT MODE
		   ====================================================== */
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		
			
			var cellHeight = (windowHeight - 445)/2;
			var divHeight = ((windowHeight - 445)/2)-40;
			
			if(cellHeight <= 120) {
				cellHeight = 120;
				divHeight = 80;
				content3_cell.style.height = "560px";
			}
			
			headerReport.style.height = cellHeight + "px";
			// TODO sbarkdull headerReportDIV.style.height = divHeight + "px";
			headerPage.style.height = cellHeight + "px";
			// TODO sbarkdull headerPageDIV.style.height = divHeight + "px";
			
			footerReport.style.height = cellHeight + "px";
			// TODO sbarkdull footerReportDIV.style.height = divHeight + "px";
			footerPage.style.height = cellHeight + "px";
			// TODO sbarkdull footerPageDIV.style.height = divHeight + "px";

			if(windowWidth <= 965) {
				windowWidth = 965;
				widthShim.style.width = 935;
			}
			
			general_report_table.style.width = windowWidth - 560;
			// TODO sbarkdull general_report_div.style.width = "96.5%";
			
			var sectionCellWidth = (windowWidth/2) - 23;
			var sectionDivWidth = "97%";
			
			header_report_table.style.width = sectionCellWidth;
			// TODO sbarkdull headerReportDIV.style.width = sectionDivWidth;
			header_page_table.style.width = sectionCellWidth;
			// TODO sbarkdull headerPageDIV.style.width = sectionDivWidth;
			
			
			footer_report_table.style.width = sectionCellWidth;
			// TODO sbarkdull footerReportDIV.style.width = sectionDivWidth;
			footer_page_table.style.width = sectionCellWidth;
			// TODO sbarkdull footerPageDIV.style.width = sectionDivWidth;
		} else if(typeof document.body.style.maxHeight == "undefined") {
		
		/* =========================================
			   IE VERSION 6 in NON STANDARDS MODE
		   ========================================= */
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		
			orientation_cell.style.height = "122px";
			paperTypeRadioContainer.style.height = "122px";
			
			var cellHeight = (windowHeight - 425)/2;
			var divHeight = ((windowHeight - 425)/2)-20;
			
			if(cellHeight <= 120) {
				cellHeight = 120;
				divHeight = 100;
				content3_cell.style.height = "520px";
			}
			
			headerReport.style.height = cellHeight + "px";
			// TODO sbarkdull headerReportDIV.style.height = divHeight + "px";
			headerPage.style.height = cellHeight + "px";
			// TODO sbarkdull headerPageDIV.style.height = divHeight + "px";
			
			footerReport.style.height = cellHeight + "px";
			// TODO sbarkdull footerReportDIV.style.height = divHeight + "px";
			footerPage.style.height = cellHeight + "px";
			// TODO sbarkdull footerPageDIV.style.height = divHeight + "px";

			if(windowWidth <= 965) {
				windowWidth = 965;
				widthShim.style.width = 935;
			}
			
			general_report_table.style.width = windowWidth - 575;
			// TODO sbarkdull general_report_div.style.width = "99%";
			
			var sectionCellWidth = (windowWidth/2) - 30;
			var sectionDivWidth = "99%";
			
			header_report_table.style.width = sectionCellWidth;
			// TODO sbarkdull headerReportDIV.style.width = sectionDivWidth;
			header_page_table.style.width = sectionCellWidth;
			// TODO sbarkdull headerPageDIV.style.width = sectionDivWidth;
			
			
			footer_report_table.style.width = sectionCellWidth;
			// TODO sbarkdull footerReportDIV.style.width = sectionDivWidth;
			footer_page_table.style.width = sectionCellWidth;
			// TODO sbarkdull footerPageDIV.style.width = sectionDivWidth;
		}
}