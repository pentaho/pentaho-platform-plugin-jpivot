/*
* Copyright 2002 - 2017 Hitachi Vantara.  All rights reserved.
* 
* This software was developed by Hitachi Vantara and is provided under the terms
* of the Mozilla Public License, Version 1.1, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://www.mozilla.org/MPL/MPL-1.1.txt. TThe Initial Developer is Pentaho Corporation.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

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
