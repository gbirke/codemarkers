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