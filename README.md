# tree-sitter-stan

This is a [tree-sitter](https://tree-sitter.github.io/tree-sitter/) parser for the Stan language.
It can parse the [latest Stan syntax](./grammar.txt), however, it does not necessarily parse
deprecated language features which are scheduled for removal.

## Installation

### NPM
`tree-sitter-stan` is available on npm:
```bash
npm i @wardbrian/tree-sitter-stan
```

Note: The `@wardbrian` scope is necessary because the `tree-sitter-stan` package name is
already taken by a [previous attempt by jrnold](https://github.com/jrnold/tree-sitter-stan),
which this version is loosely based on.

