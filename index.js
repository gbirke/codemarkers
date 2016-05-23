var _ = require( 'lodash' ),
	codemarkerPattern = /^[\s\W]+(?:cm|codemarker):(.*)/,
	codemarkerExpression = /(section=|endsection|json=)/g;

function MarkerParser() {
	this.result = { code: '' };
	this.currentSection = null;
}

MarkerParser.prototype.parseLine = function ( line, lineNumber, lines ) {
	var lineMatch = codemarkerPattern.exec( line );
	if ( !lineMatch ) {
		line += "\n";
		this.result.code += line;
		if ( this.currentSection !== null ) {
			this.result.sections[this.currentSection].code += line;
		}
	}
	else {
		this.handleExpressions( lineMatch[1] );
	}
}

MarkerParser.prototype.handleExpressions = function( line ) {
	var expressionResult = {},
		expressionCount = 0,
		expressionMatch, sectionName;
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
				// TODO check for existing section and log error
				this.result.sections[this.currentSection] = { code: '' };

				break;
			case 'endsection':
				this.currentSection = null;
				break;
			case 'json=':
				throw new Exception( "not implemented yet!");
		}
	}
	if ( !expressionCount ) {
		console.log("Error: no expression found in " + line)
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