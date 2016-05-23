// Test sections with different indentation levels
var foo = 0, i, j;
for( i = 0; i < 3; i++ ) {
	// cm: section=firstSection
	if(true){
		return "t";
	}
	// cm: endsection
}

for( i = 0; j < 7; j++ ) {
	for( i = 0; i < 3; i++ ) {
		// cm: section=secondSection
		if(true){
			return "t";
		}
		// cm: endsection
	}
