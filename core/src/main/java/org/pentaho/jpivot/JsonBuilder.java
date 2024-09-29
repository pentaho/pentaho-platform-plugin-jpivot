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
        .append( "\",\"cubes\":[" );
      int ccount = 0;
      for ( MondrianCube cube : catalog.getSchema().getCubes() ) {
        if ( ccount != 0 ) {
          builder.append( ',' );
        }
        builder.append( '{' )
          .append( "\"id\":\"" ).append( StringEscapeUtils.escapeJavaScript( cube.getId() ) ).append( '"' )
          .append( ',' )
          .append( "\"name\":\"" ).append( StringEscapeUtils.escapeJavaScript( cube.getName() ) ).append( '"' )
          .append( '}' );
        ccount++;
      }
      builder.append( "]}" );
      count++;
    }
    builder.append( ']' );
    return Matcher.quoteReplacement( builder.toString() );
  }
}
