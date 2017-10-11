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
* Copyright (c) 2002-2017 Hitachi Vantara..  All rights reserved.
*/

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