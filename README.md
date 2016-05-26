# Codemarkers - Annotate source code for examples in documentation

This script is for splitting whole code files into small example snippets. It checks the comments of the source code file for markers and generates a JSON data structure from it. Use your favorite template engine to render the JSON into any format. For presentations, documentation, tutorials, etc.

Why do this? You avoid avoid duplicated effort between documentation and example code! No more copy-pasting, no more outdated examples.

## Usage
The tools relies on special "marker" comments in your source code. Each comment must begin with `cm:` or `codemarker:` (the colon is mandatory). Each marker must be followed by one or more code marker expressions like `section`, `endsection` and `json`. All lines containing markers will be removed from the output data.

### Defining example sections
Use the `section` and `endsection` expressions to designate sections of code:

    // cm: section=variable_definition
    var maxRoomSize = 50, currentRoomSize = 0,
        i, j, k; // counters
    // cm: endsection
    for ( i = 0; i < maxRoomSize; i++ ) {
        // cm: section=square_algorithm
        currentRoomSize = i * i;
        // cm: section=function_call
        calculateOxygen( currentRoomSize )
        // cm: endsection
    }

Each `section` needs to have a valid, unique ID. Valid IDs can consist of any non-whitespace character.

The `endsection` marker is optional - each new `section` ends the previous one.

### Adding variables
If you want to output explanations or short descriptions of your code, use the `json` expression. 

    // cm: json={ "description": "Global description of the file" }
    // cm: json={ "info": "Global info variable, will be overwritten" }
    // cm: section=variable_definition
    // cm: json={ "info": "Will overwrite" }
    var maxRoomSize = 50, currentRoomSize = 0,
        i, j, k; // counters
    // cm: endsection

Each section has its own "context" of defined variables. You can have variables with the same name in each section. Also, there is the "global" context for the whole code which contains all variables outside sections and the value from the last section that contained the variable.

At the moment, `json` must be the last expression in a codemarker line.

## Generating the JSON data on the command line

To display the generated JSON, use

    codemarkers -p input_file.js

To save the JSON to an output file, use

    codemarkers -o output_file.json input_file.js

You can also use a globbing pattern:

```
codemarkers -o output_file.json 'code/**/*.js'
```

Run `codemarkers -h` to see all options.

The generated JSON has the keys *parts* and *sections*.  
Parts contain the whole code, unchanged, separated at section markers. The parts are in order of occurence.  
Sections contain only the example code, with whitespace at the beginning trimmed.


## JSON output

This is the output for a single file:

```JSON
{
    "parts": [
        { "code": "code from before the first section" },
        { "code": "section code", "section": "section_id" }
    ],
    "sections": {
        "section_id": {
            "code": "section code",
            "vars": {
                "var_name": "var created with json expression",
                "another_var": "another var from json expression"
            }
        }
    },
    "globals": {
        "global_var_name": "var created with json expression outside section",
        "another_var": "value of 'another_var' from last section"
    }
}
```

If applied to a directory, the above output is repeated for each file like this:

```JSON
{
    "files": {
        "path/to/file_1.js": {
            "code": "// This code has no sections"
        },
        "path/to/file_2.js": {
            "code": "// This just demonstrating multiple file handling"
        }
    }
}
```

## Installation
Run

    npm install -g codemarkers

## Possible extensions and changes in the future
* Allow section without ID (generate the IDs as hashes from content)
* Switches for whitespace handling (line removal, indentation removal, tab/space indentation conversion)
* Remove the "sections" concept, put all data in parts, with whitespace/indentation information 
* Switch for splitting into lines instead of having the whole text (additional `code_lines` key in the result or switching `code` for `code_lines`). This'll allow for line numbering. The switch may allow a number offset
* Add mime type hint to generated info
* Replace lodash library with other libraries.
