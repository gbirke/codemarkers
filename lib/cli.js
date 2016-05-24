#!/usr/bin/env node

var program = require( 'commander' ),
	getMarkers = require( './index' ).getMarkers,
	fs = require( 'fs' ),
	glob = require( 'glob' ),
	inputFileName, inputGlob;

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

function getDataForFile( fileName ) {
	try {
		code = fs.readFileSync( fileName, 'utf-8' );
	} catch ( e ) {
		console.error( "Could not open file " + fileName );
		process.exit( 1 );
	}
	return getMarkers( code );
}

function handleFileGlob( globStr ) {

	glob( globStr, function( err, files ) {
		if ( err !== null ) {
			console.error( err );
			process.exit( 1 );
		}

		if ( files.length === 0 ) {
			console.error( "No files found with the given pattern." );
			process.exit( 1 );
		} else if ( files.length === 1 ) {
			data = getDataForFile( files[0] );
		} else {
			data = { files: {} };
			files.forEach( function ( file ) {
				data.files[ file ] = getDataForFile( file );
			} );
		}

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

	} );
}

handleFileGlob( inputFileName );


