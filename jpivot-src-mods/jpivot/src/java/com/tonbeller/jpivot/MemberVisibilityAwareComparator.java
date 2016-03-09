/*!
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
* Copyright (c) 2002-2016 Pentaho Corporation..  All rights reserved.
*/

package com.tonbeller.jpivot;

import java.util.Comparator;
import java.util.List;

/**
 * This class is used to fix a bug in JPivot. The bug is about determining the correct index when sorting members using
 * a list of visible elements.
 *
 * @author Andrey Khayrutdinov
 */
public class MemberVisibilityAwareComparator<Member> implements Comparator<Member> {

  private final List<Member> visible;

  public MemberVisibilityAwareComparator( List<Member> visible ) {
    // deliberately neglect making a defensive copy
    this.visible = visible;
  }

  @Override
  public int compare( Member m1, Member m2 ) {
    int index1 = visible.indexOf( m1 );
    int index2 = visible.indexOf( m2 );
    if ( index1 == -1 ) {
      if ( index2 == -1 ) {
        return 0;
      } else {
        return 1; // m1 is higher, unvisible to the end
      }
    } else {
      if ( index2 == -1 ) {
        return -1; // m2 is higher, unvisible to the end
      } else {
        return index1 - index2;
      }
    }
  }
}
