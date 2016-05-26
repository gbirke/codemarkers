# Using Pug to generate code presentations

Install all packages:

	npm install -g codemarkers pug-cli

Generate the code data for a JavaScript file:

	codemarkers -o code.json code.js

## Example 1
Generate a [reveal.js](https://github.com/hakimel/reveal.js) presentation where each section is on a sub-slide:

	pug -P -O code.json -o . example_templates/reveal_subslides.pug

Open `reveal_subslides.html`

## Example 2
Generate a reveal.js presentation where the sections are highlighted on one slide:

	pug -P -O code.json -o . example_templates/reveal_fragment_parts.pug

When using fragments in code with reveal.js you can't use the highlight plugin because it would render the HTML code instead of displaying it.

Open `reveal_fragment_parts.html`

## Planned examples
* How to present multiple files
* Example code with [impress.js](https://github.com/impress/impress.js?) instead of reveal.js
