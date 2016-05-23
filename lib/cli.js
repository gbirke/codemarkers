#!/usr/bin/env node

var program = require( 'commander' ),
	getMarkers = require( './index' ).getMarkers,
	fs = require( 'fs' ),
	inputFileName;

program
  .version( '0.1.0' )
  .option( '-o, --output <file>', 'Output file (instead of stdout)' )
  .option( '-p, --pretty', 'Indent JSON output' )
  .arguments( '<inputfile>' )
  .action( function( inputFile ) {
  	inputFileName = inputFile;
  } )
  .parse(process.argv);


if ( typeof( inputFileName ) === 'undefined' ) {
	// TODO if ( !process.stdin.isTTY ) { read code from stdin }
	process.stderr.write( 'No input file specified.\n\n' );
	program.help();
	return;
}

var indent = program.pretty ? '\t' : 0,
	data, code, outStream;

try {
	// TODO handle directories and globs, allow for async read and async processing of lines
	code = fs.readFileSync( inputFileName, 'utf-8' );
} catch ( e ) {
	console.error( "Could not open file " + inputFileName );
	process.exit( 1 );
}

data = getMarkers( code );

if ( program.output && program.output !== '-' ) {
	outStream =  fs.createWriteStream( program.output );
} else {
	outStream = process.stdout;
}

outStream.write( JSON.stringify( data, null, indent ) );
outStream.write( program.pretty ? '\n' : '' );
if ( program.output ) {
	outStream.end();
}

