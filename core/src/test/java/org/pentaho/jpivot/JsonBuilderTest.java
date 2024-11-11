/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


package org.pentaho.jpivot;

import org.junit.Test;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCatalog;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianCube;
import org.pentaho.platform.plugin.action.mondrian.catalog.MondrianSchema;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.Assert.*;

/**
 * @author Andrey Khayrutdinov
 */
public class JsonBuilderTest {

  @Test
  public void handlesEscapedText() throws Exception {
    MondrianCube cube = new MondrianCube( "\u043A", "cubeId" );
    MondrianSchema schema = new MondrianSchema( "schema", Collections.singletonList( cube ) );
    MondrianCatalog catalog = new MondrianCatalog( "testCatalog", "fakeDataSource", "", schema );

    JsonBuilder builder = new JsonBuilder();

    String actual = builder.generateJsonForResponse( Collections.singletonList( catalog ) );
    String expected = "[{\"schema\":\"schema\",\"cubes\":[{\"id\":\"cubeId\",\"name\":\"\\\\u043A\"}]}]";
    assertEquals( expected, actual );
  }

  @Test
  public void generateForSeveralCubes() throws Exception {
    MondrianCube cube1 = new MondrianCube( "cube1", "id1" );
    MondrianCube cube2 = new MondrianCube( "cube2", "id2" );
    MondrianSchema schema = new MondrianSchema( "schema", Arrays.asList( cube1, cube2 ) );
    MondrianCatalog catalog = new MondrianCatalog( "testCatalog", "fakeDataSource", "", schema );

    JsonBuilder builder = new JsonBuilder();

    String actual = builder.generateJsonForResponse( Collections.singletonList( catalog ) );
    String expected = "[{"
      + "\"schema\":\"schema\","
      + "\"cubes\":["
      + "{\"id\":\"id1\",\"name\":\"cube1\"},"
      + "{\"id\":\"id2\",\"name\":\"cube2\"}"
      + "]"
      + "}]";
    assertEquals( expected, actual );
  }

}