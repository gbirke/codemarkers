var _ = require( 'lodash' ),
	codemarkerPattern = /^[\s\W]+(?:cm|codemarker):(.*)/,
	codemarkerExpression = /(section=|endsection|json=)/g;

function MarkerParser() {
	this.result = { code: '' };
	this.currentSection = null;
	this.currentIndent = null;
}

MarkerParser.prototype.parseLine = function ( line, lineNumber, lines ) {
	var lineMatch = codemarkerPattern.exec( line );
	if ( !lineMatch ) {
		line += "\n";
		this.result.code += line;
		if ( this.currentSection !== null ) {
			if ( !this.result.sections[this.currentSection].code ) { // first line in new section
				this.currentIndent = line.match( /^\s*/ );
			}
			if ( !line.match( this.currentIndent ) ) {
				// TODO proper logging
				console.log( "WARNING - indentation does not match in section " + this.currentSection + ", line " + lineNumber );
			}
			this.result.sections[this.currentSection].code += line.replace( this.currentIndent, '' );
		}
	}
	else {
		this.handleExpressions( lineMatch[1] );
	}
}

MarkerParser.prototype.handleExpressions = function( line ) {
	var expressionResult = {},
		expressionCount = 0,
		expressionMatch, sectionName, jsonStr, vars;
	while ( ( expressionMatch = codemarkerExpression.exec( line ) ) !== null ) {
		expressionCount++;
		switch( expressionMatch[1] ) {
			case 'section=':
				sectionName = line.substr( expressionMatch.index + expressionMatch[0].length )
				if ( sectionName.indexOf(' ') !== -1 ) {
					sectionName = sectionName.substr( 0, sectionName.indexOf(' ') );
				}
				this.currentSection = sectionName;
				if ( _.isEmpty( this.result.sections ) ) {
					this.result.sections = {};
				}
				if ( _.has( this.result.sections, this.currentSection ) ) {
					// TODO proper logging with line number
					console.log( "WARNING - overriding section " + this.currentSection + ". make sure your section IDs are unique" );
				}
				this.result.sections[this.currentSection] = { code: '' };

				break;
			case 'endsection':
				this.currentSection = null;
				break;
			case 'json=':
				jsonStr = _.trim( line.substr( expressionMatch.index + expressionMatch[0].length ) );

				try {
					vars = JSON.parse( jsonStr );
				}
				catch( e ) {
					// TODO proper logging with line number
					console.log( "ERROR - faulty JSON: " + jsonStr + e );
					break;
				}
				this.result.globals = _.extend( this.result.globals, vars );
				if ( this.currentSection !== null ) {
					this.result.sections[this.currentSection].vars = _.extend(
						this.result.sections[this.currentSection].vars,
						vars
					);
				}
				break;
		}
	}
	if ( !expressionCount ) {
		// TODO proper logging with line number
		console.log( "ERROR - no expression found in " + line );
	}
}

MarkerParser.prototype.trimResult = function() {
	this.result.code = _.trimEnd( this.result.code );
	_.mapValues( this.result.sections, function( section ) {
		section.code = _.trimEnd( section.code );
		return section;
	} );
}

module.exports = {
	getMarkers: function( inputCode ) {
		var parser = new MarkerParser(),
			parseLine = _.bind( parser.parseLine, parser );
			lines = inputCode.match( /[^\r\n]+/g );;
		_.each( lines, parseLine );
		parser.trimResult();
		return parser.result;
	}
}