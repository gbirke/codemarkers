#Codemarkers - Annotate source code for examples in documentation

This script is for splitting whole code files into small example snippets. It checks the comments of the source code file for markers and generates a JSON data structure from it. The JSON structure can then be rendered with any template engine.

The reasoning behind this is to avoid duplicated effort between code samples in the documentation and actual example code.

## Installation
Run
    npm install -g gbirke/codemarkers

## Usage
The tools relies on special "marker" comments in your source code. Each comment must begin with `cm:` or `codemarker:` (pay attention to the colon). It can be followed by one or more code marker expressions (see below). All lines containing markers will be removed from the output data.

TODO show usage example from the command line


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

Each `section` needs to have a valid, unique ID. Valid IDs can consist of upper- and lowercase characters, digits and underscores and must not begin with a digit.

The `endsection` marker is optional - each new `section` ends the previous one.

### Adding variables
To add additional information to a section, you can use the `json` expression.

    // cm: json={ "description": "Global description of the file" }
    // cm: json={ "info": "Global info variable, will be overwritten" }
    // cm: section=variable_definition
    // cm: json={ "info": "Will overwrite" }
    var maxRoomSize = 50, currentRoomSize = 0,
        i, j, k; // counters
    // cm: endsection

Each section has its own "context" of defined variables. You can have variables with the same name in each section. Also, there is the "global" context for the whole code which contains all variables outside sections and the value from the last section that contained the variable.

At the moment, `json` must be the last expression in a codemarker line.

## Example JSON output

This is the output for a single file:

```JSON
{
    "code": "complete code from the file, with codemarker lines removed",
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
    "path/to/file_1.js": {
        "code": "// This code has no sections"
    },
    "path/to/file_2.js": {
        "code": "// This just demonstrating multiple file handling"
    }
}
```

## Possible extensions in the future
* Switches for whitespace handling (line removal, indentation removal, tab/space indentation conversion)
* Switch for splitting into lines instead of having the whole text (additional `code_lines` key in the result or switching `code` for `code_lines`). This'll allow for line numbering. The switch may allow a number offset
