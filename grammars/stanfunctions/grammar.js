module.exports = grammar(require('../stan/grammar'), {
  name: 'stanfunctions',

  rules: {
    program: $ => repeat($.function_definition),
  },
});
