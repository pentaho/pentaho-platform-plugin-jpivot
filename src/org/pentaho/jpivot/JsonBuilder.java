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

package org.pentaho.jpivot;

import org.apache.commons.lang.StringEscapeUtils;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCatalog;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCube;

import java.util.List;
import java.util.regex.Matcher;

/**
 * @author Andrey Khayrutdinov
 */
class JsonBuilder {

  // package-local visibility for testing purposes
  String generateJsonForResponse( List<MondrianCatalog> catalogs ) {
    StringBuilder builder = new StringBuilder( 128 );
    builder.append( '[' );
    // json representation
    int count = 0;
    for ( MondrianCatalog catalog : catalogs ) {
      if ( count != 0 ) {
        builder.append( ',' );
      }
      builder.append( "{\"schema\":\"" )
        .append( StringEscapeUtils.escapeJavaScript( catalog.getSchema().getName() ) )
        .append( "\", \"cubes\":[" );
      int ccount = 0;
      for ( MondrianCube cube : catalog.getSchema().getCubes() ) {
        if ( ccount != 0 ) {
          builder.append( ',' );
        }
        builder.append( '"' ).append( StringEscapeUtils.escapeJavaScript( cube.getName() ) ).append( '"' );
        ccount++;
      }
      builder.append( "]}\n" );
      count++;
    }
    builder.append( ']' );
    return Matcher.quoteReplacement( builder.toString() );
  }
}
