const assert = require("node:assert");
const { test } = require("node:test");

const Parser = require("tree-sitter");

const { stan, stanfunctions } = require("../..");

test("can load stan grammar", () => {
  const parser = new Parser();
  assert.doesNotThrow(() => parser.setLanguage(stan));
});

test("can load stanfunctions grammar", () => {
  const parser = new Parser();
  assert.doesNotThrow(() => parser.setLanguage(stanfunctions));
});
