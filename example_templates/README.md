# Using Pug to generate code presentations

Install all packages:

	npm install -g codemarkers pug-cli

Generate the code data for a JavaScript file:

	codemarkers -o code.json code.js

Generate a reveal.js presentation where each section is on a sub-slide:

	pug -P -O code.json -o . example_templates/reveal_subslides.pug

Open `reveal_subslides.html`

TODO: Examples for how to present multiple files, try an example with impress.js