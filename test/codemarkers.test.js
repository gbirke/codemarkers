var test = require( 'tape' ),
	getMarkers = require( '../' ).getMarkers,
	fs = require('fs');

test( 'Given code with no markers, just the text is returned', function( assert ) {
	var code = "just\nsome\nlines",
		expectedResult = {
			code: "just\nsome\nlines"
		};
	assert.deepEquals( getMarkers( code ), expectedResult );
	assert.end();
} );

test( 'Whitespace at the end is trimmed', function( assert ) {
	var code = "just\nsome\nlines\n",
		expectedResult = {
			code: "just\nsome\nlines"
		};
	assert.deepEquals( getMarkers( code ), expectedResult );
	assert.end();
} );

test( 'Given code with section marker, the trimmed section text is returned', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/section_simple.js', 'utf-8' ),
		result = getMarkers( code ),
		expectedSections = {
			firstSection: { code: 'console.log( "test" );' }
		};
	assert.deepEquals( result.sections, expectedSections );
	assert.end();
} );

test( 'Given code with section markers, each section ends the previous', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/section_multi_no_end.js', 'utf-8' ),
		result = getMarkers( code ),
		expectedSections = {
			firstSection: { code: 'console.log( "foo" );' },
			secondSection: { code: 'console.log( "bar" );' }
		};
	assert.deepEquals( result.sections, expectedSections );
	assert.end();
} );

test( 'Indentation of first line of section is removed from all section lines', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/indented_sections.js', 'utf-8' ),
		result = getMarkers( code ),
		indentedCode = 'if(true){\n\treturn "t";\n}'
		expectedSections = {
			firstSection: { code: indentedCode },
			secondSection: { code: indentedCode }
		};
	assert.deepEquals( result.sections, expectedSections );
	assert.end();
} );

test( 'Given global json expressions, they are merged in global context', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/section_json.js', 'utf-8' ),
		result = getMarkers( code ),
		expectedGlobals =  { test: 'bar', another: 1 };
	assert.deepEquals( result.globals, expectedGlobals );
	assert.end();
} );


test( 'Given json expression, variables are stored for section', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/section_json.js', 'utf-8' ),
		result = getMarkers( code ),
		expectedVarsInFirstSection =  { test: 'foo', another: 1 },
		expectedVarsInSecondSection =  { test: 'bar' };
	assert.deepEquals( result.sections.firstSection.vars, expectedVarsInFirstSection );
	assert.deepEquals( result.sections.secondSection.vars, expectedVarsInSecondSection );
	assert.end();
} );

test( 'Given json expressions in sections, global variables are overridden', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/section_json.js', 'utf-8' ),
		result = getMarkers( code ),
		expectedGlobals =  { test: 'bar', another: 1 };
	assert.deepEquals( result.globals, expectedGlobals );
	assert.end();
} );

test( 'Given global string after json expressions, variable merging fails', function( assert ) {
	var code = fs.readFileSync( __dirname + '/marked_code/invalid_json.js', 'utf-8' ),
		result = getMarkers( code );
	assert.notOk( result.globals );
	assert.end();
} );

