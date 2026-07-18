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



﻿// ** I18N
Calendar._DN = new Array
("Κυ�?ιακή",
 "Δευτέ�?α",
 "Τ�?ίτη",
 "Τετά�?τη",
 "Πέμπτη",
 "Πα�?ασκευή",
 "Σάββατο",
 "Κυ�?ιακή");

Calendar._SDN = new Array
("Κυ",
 "Δε",
 "T�?",
 "Τε",
 "Πε",
 "Πα",
 "Σα",
 "Κυ");

Calendar._MN = new Array
("Ιανουά�?ιος",
 "Φεβ�?ουά�?ιος",
 "Μά�?τιος",
 "Απ�?ίλιος",
 "Μάϊος",
 "Ιο�?νιος",
 "Ιο�?λιος",
 "Α�?γουστος",
 "Σεπτέμβ�?ιος",
 "Οκτώβ�?ιος",
 "�?οέμβ�?ιος",
 "Δεκέμβ�?ιος");

Calendar._SMN = new Array
("Ιαν",
 "Φεβ",
 "Μα�?",
 "Απ�?",
 "Μαι",
 "Ιουν",
 "Ιουλ",
 "Αυγ",
 "Σεπ",
 "Οκτ",
 "�?οε",
 "Δεκ");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "Για το ημε�?ολόγιο";

Calendar._TT["ABOUT"] =
"Επιλογέας ημε�?ομηνίας/ώ�?ας σε DHTML\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"Για τελευταία έκδοση: http://www.dynarch.com/projects/calendar/\n" +
"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
"\n\n" +
"Επιλογή ημε�?ομηνίας:\n" +
"- Χ�?ησιμοποιείστε τα κουμπιά \xab, \xbb για επιλογή έτους\n" +
"- Χ�?ησιμοποιείστε τα κουμπιά " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " για επιλογή μήνα\n" +
"- Κ�?ατήστε κουμπί ποντικο�? πατημένο στα πα�?απάνω κουμπιά για πιο γ�?ήγο�?η επιλογή.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Επιλογή ώ�?ας:\n" +
"- Κάντε κλικ σε ένα από τα μέ�?η της ώ�?ας για α�?ξηση\n" +
"- ή Shift-κλικ για μείωση\n" +
"- ή κλικ και μετακίνηση για πιο γ�?ήγο�?η επιλογή.";
Calendar._TT["TOGGLE"] = "Μπά�?α π�?ώτης ημέ�?ας της εβδομάδας";
Calendar._TT["PREV_YEAR"] = "Π�?οηγ. έτος (κ�?ατήστε για το μενο�?)";
Calendar._TT["PREV_MONTH"] = "Π�?οηγ. μήνας (κ�?ατήστε για το μενο�?)";
Calendar._TT["GO_TODAY"] = "Σήμε�?α";
Calendar._TT["NEXT_MONTH"] = "Επόμενος μήνας (κ�?ατήστε για το μενο�?)";
Calendar._TT["NEXT_YEAR"] = "Επόμενο έτος (κ�?ατήστε για το μενο�?)";
Calendar._TT["SEL_DATE"] = "Επιλέξτε ημε�?ομηνία";
Calendar._TT["DRAG_TO_MOVE"] = "Σ�?�?τε για να μετακινήσετε";
Calendar._TT["PART_TODAY"] = " (σήμε�?α)";
Calendar._TT["MON_FIRST"] = "Εμφάνιση Δευτέ�?ας π�?ώτα";
Calendar._TT["SUN_FIRST"] = "Εμφάνιση Κυ�?ιακής π�?ώτα";
Calendar._TT["CLOSE"] = "Κλείσιμο";
Calendar._TT["TODAY"] = "Σήμε�?α";
Calendar._TT["TIME_PART"] = "(Shift-)κλικ ή μετακίνηση για αλλαγή";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "dd-mm-y";
Calendar._TT["TT_DATE_FORMAT"] = "D, d M";

Calendar._TT["WK"] = "εβδ";

