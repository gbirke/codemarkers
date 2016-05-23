// Test json expressions for sections
var foo = 0;

// cm: section=firstSection
// cm: json={ "test":"foo", "another": 1 }
console.log( "foo" );
// cm: section=secondSection json={ "test": "bar" }
console.log( "bar" );
// cm: endsection
