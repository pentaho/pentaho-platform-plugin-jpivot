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

/**
 * @param operator String {And, Or}
 * @param comparator String {=,<>,>=,<=,<,>}
 * @param condition String the value being compared with the comparator
 */

Constraint = function( operator, comparator, condition ) {
	this.operator = operator;
	this.comparator = comparator;
	this.condition = condition;
}
