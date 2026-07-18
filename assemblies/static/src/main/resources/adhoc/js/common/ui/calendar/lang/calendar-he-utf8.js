/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 - 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/



// ** I18N

// Calendar EN language
// Author: Idan Sofer, <idan@idanso.dyndns.org>
// Encoding: UTF-8
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names
Calendar._DN = new Array
("ר�?שון",
 "שני",
 "שלישי",
 "רביעי",
 "חמישי",
 "שישי",
 "שבת",
 "ר�?שון");

// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary.  We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
//   Calendar._SDN_len = N; // short day name length
//   Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

// short day names
Calendar._SDN = new Array
("�?",
 "ב",
 "ג",
 "ד",
 "ה",
 "ו",
 "ש",
 "�?");

// full month names
Calendar._MN = new Array
("ינו�?ר",
 "פברו�?ר",
 "מרץ",
 "�?פריל",
 "מ�?י",
 "יוני",
 "יולי",
 "�?וגוסט",
 "ספטמבר",
 "�?וקטובר",
 "נובמבר",
 "דצמבר");

// short month names
Calendar._SMN = new Array
("ינ�?",
 "פבר",
 "מרץ",
 "�?פר",
 "מ�?י",
 "יונ",
 "יול",
 "�?וג",
 "ספט",
 "�?וק",
 "נוב",
 "דצמ");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "�?ודות השנתון";

Calendar._TT["ABOUT"] =
"בחרן ת�?ריך/שעה DHTML\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"הגירס�? ה�?חרונה זמינה ב: http://www.dynarch.com/projects/calendar/\n" +
"מופץ תחת זיכיון ה GNU LGPL.  עיין ב http://gnu.org/licenses/lgpl.html לפרטי�? נוספי�?." +
"\n\n" +
בחירת ת�?ריך:\n" +
"- השתמש בכפתורי�? \xab, \xbb לבחירת שנה\n" +
"- השתמש בכפתורי�? " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " לבחירת חודש\n" +
"- החזק העכבר לחוץ מעל הכפתורי�? המוזכרי�? לעיל לבחירה מהירה יותר.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"בחירת זמן:\n" +
"- לחץ על כל �?חד מחלקי הזמן כדי להוסיף\n" +
"- �?ו shift בשילוב ע�? לחיצה כדי להחסיר\n" +
"- �?ו לחץ וגרור לפעולה מהירה יותר.";

Calendar._TT["PREV_YEAR"] = "שנה קודמת - החזק לקבלת תפריט";
Calendar._TT["PREV_MONTH"] = "חודש קוד�? - החזק לקבלת תפריט";
Calendar._TT["GO_TODAY"] = "עבור להיו�?";
Calendar._TT["NEXT_MONTH"] = "חודש הב�? - החזק לתפריט";
Calendar._TT["NEXT_YEAR"] = "שנה הב�?ה - החזק לתפריט";
Calendar._TT["SEL_DATE"] = "בחר ת�?ריך";
Calendar._TT["DRAG_TO_MOVE"] = "גרור להזזה";
Calendar._TT["PART_TODAY"] = " )היו�?(";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "הצג %s קוד�?";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "6";

Calendar._TT["CLOSE"] = "סגור";
Calendar._TT["TODAY"] = "היו�?";
Calendar._TT["TIME_PART"] = "(שיפט-)לחץ וגרור כדי לשנות ערך";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%a, %b %e";

Calendar._TT["WK"] = "wk";
Calendar._TT["TIME"] = "שעה::";
