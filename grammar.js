/* global alias, choice, grammar, optional, prec, repeat, seq, token */
const PREC = {
    ASSIGN: -2,
    CONDITIONAL: -1,
    DEFAULT: 0,
    LOR: 2,
    LAND: 3,
    EQ: 4,
    NEQ: 4,
    LT: 5,
    LEQ: 5,
    GT: 5,
    GEQ: 5,
    SUB: 6,
    ADD: 6,
    MOD: 7,
    DIV: 7,
    MULT: 7,
    LEFT_DIV: 8,
    EL_DIV: 9,
    EL_MULT: 9,
    PLUS: 10,
    MINUS: 10,
    LNEG: 10,
    EXPON: 11,
    BRACKET: 12,
    INDEX: 12,
    PAREN: 12,
    FUNCTION: 12,
    TRANSPOSE: 12,
    RANGE: 13,
};

function commaSep1(rule) {
    return seq(
        rule,
        repeat(seq(',', rule)),
    );
}

// comma separated variables
function commaSep(rule) {
    return optional(commaSep1(rule));
}

function decl($, type_rule, expr_rule) {
    return seq(
        optional($.arr_dims),
        type_rule,
        commaSep1(seq(field("name", $.identifier)
            , optional(seq('=', expr_rule)))),
        ';');
}

const operators = {
    infix: {
        arithmetic: [
            ['^', PREC.EXPON, prec.right],
            ['.^', PREC.EXPON, prec.right],
            ['.*', PREC.EL_MULT, prec.left],
            ['./', PREC.EL_DIV, prec.left],
            ['\\', PREC.LEFT_DIV, prec.left],
            ['*', PREC.MULT, prec.left],
            ['%', PREC.MOD, prec.left],
            ['/', PREC.DIV, prec.left],
            ['%/%', PREC.DIV, prec.left],
            ['+', PREC.ADD, prec.left],
            ['.+', PREC.ADD, prec.left],
            ['-', PREC.SUB, prec.left],
            ['.-', PREC.SUB, prec.left],
        ],
        logical: [
            ['>=', PREC.GEQ, prec.left],
            ['>', PREC.GT, prec.left],
            ['<=', PREC.LEQ, prec.left],
            ['<', PREC.LT, prec.left],
            ['!=', PREC.NEQ, prec.left],
            ['==', PREC.EQ, prec.left],
            ['&&', PREC.LAND, prec.left],
            ['||', PREC.LOR, prec.left],
        ],
    },
    prefix: [
        ['+', PREC.PLUS],
        ['-', PREC.MINUS],
        ['!', PREC.LNEG],
    ],
    postfix: [
        ['\'', PREC.TRANSPOSE],
    ],
};

function infixExpressions(ops, expression) {
    return ops.map(([op, number, func]) => func(number, seq(expression, op, expression)));
}

function prefixExpressions(ops, expression) {
    return ops.map(([op, number]) => prec.right(number, seq(op, expression)));
}

function postfixExpressions(ops, expression) {
    return ops.map(([op, number]) => prec.left(number, seq(expression, op)));
}

module.exports = grammar({
    name: 'stan',

    extras: $ => [
        /\s/,
        $.comment,
        $.preproc_include,
    ],

    inline: $ => [
        $._statement,
        $._vardecl_or_statement,
    ],

    conflicts: $ => [
        [$.array_expression, $.block_statement],
        [$._common_expression, $.lhs],
        [$._expression, $._range_expression],
        [$._common_expression, $.block_statement],
        [$._common_expression, $._top_vardecl_or_statement],
        [$.transformed_data, $._common_expression],
        [$.model, $._common_expression],
    ],

    word: $ => $.identifier,

    rules: {
        // The production rules of the context-free grammar
        program: $ => seq(
            optional($.functions),
            optional($.data),
            optional($.transformed_data),
            optional($.parameters),
            optional($.transformed_parameters),
            optional($.model),
            optional($.generated_quantities),
        ),

        functions: $ => seq(
            'functions',
            '{',
            repeat($.function_definition),
            '}',
        ),

        data: $ => seq(
            'data',
            '{',
            repeat($.top_var_decl_no_assign),
            '}',
        ),

        transformed_data: $ => seq(
            token('transformed data'),
            '{',
            repeat($._top_vardecl_or_statement),
            '}',
        ),

        parameters: $ => seq(
            'parameters',
            '{',
            repeat($.top_var_decl_no_assign),
            '}',
        ),

        transformed_parameters: $ => seq(
            token('transformed parameters'),
            '{',
            repeat($._top_vardecl_or_statement),
            '}',
        ),

        model: $ => prec(1, seq(
            'model',
            '{',
            repeat($._vardecl_or_statement),
            '}',
        )),

        generated_quantities: $ => seq(
            token('generated quantities'),
            '{',
            repeat($._top_vardecl_or_statement),
            '}',
        ),

        var_decl: $ => decl($, $.sized_basic_type, $._expression),
        top_var_decl: $ => choice(decl($, $.top_var_type, $._expression)),
        top_var_decl_no_assign: $ => choice(decl($, $.top_var_type, "<<<UNREACHABLE TOKEN>>>"), $.empty_statement),

        _vardecl_or_statement: $ => choice(
            $._statement,
            $.var_decl
        ),
        _top_vardecl_or_statement: $ => choice(
            $._statement,
            $.top_var_decl
        ),

        // Function declaration
        function_definition: $ => seq(
            $.return_type,
            $.function_declarator,
            field("body", $._statement),
        ),

        function_declarator: $ => prec(1, seq(
            field("name", $.identifier),
            $.parameter_list,
        )),

        parameter_list: $ => prec.dynamic(1, seq(
            '(',
            commaSep($.parameter_declaration),
            ')',
        )),

        parameter_declaration: $ => seq(
            optional('data'),
            $.unsized_type,
            field("parameter", $.identifier),
        ),

        return_type: $ => choice(
            'void',
            $.unsized_type,
        ),

        unsized_type: $ => choice(
            seq("array", $.unsized_dims, $.basic_type),
            $.basic_type),

        unsized_dims: $ => seq(
            '[',
            repeat(','),
            ']',
        ),

        sized_basic_type: $ => prec.dynamic(1, choice(
            'int',
            'real',
            'complex',
            seq('vector', '[', $._expression, ']'),
            seq('row_vector', '[', $._expression, ']'),
            seq('matrix', '[', $._expression, ',', $._expression, ']'),
            seq('complex_vector', '[', $._expression, ']'),
            seq('complex_row_vector', '[', $._expression, ']'),
            seq('complex_matrix', '[', $._expression, ',', $._expression, ']'),
        )),

        /* eslint-disable no-unused-vars */
        basic_type: $ => prec.dynamic(1, choice(
            'int',
            'real',
            'complex',
            'vector',
            'row_vector',
            'matrix',
            'complex_vector',
            'complex_row_vector',
            'complex_matrix',
        )),
        /* eslint-enable no-unused-vars */



        top_var_type: $ => choice(
            $.int_type,
            $.real_type,
            $.complex_type,
            $.vector_type,
            $.ordered_type,
            $.positive_ordered_type,
            $.simplex_type,
            $.unit_vector_type,
            $.row_vector_type,
            $.matrix_type,
            $.complex_vector_type,
            $.complex_row_vector_type,
            $.complex_matrix_type,
            $.cholesky_factor_cov_type,
            $.cholesky_factor_corr_type,
            $.cov_matrix_type,
            $.corr_matrix_type,
        ),

        arr_dims: $ => seq(
            'array',
            '[',
            commaSep($._expression),
            ']',
        ),

        int_type: $ => seq(
            'int',
            optional($._range_constraint),
        ),

        real_type: $ => seq(
            'real',
            optional($.type_constraint),
        ),

        complex_type: $ => "complex",

        vector_type: $ => seq(
            'vector',
            optional($.type_constraint),
            '[',
            $._expression,
            ']',
        ),

        ordered_type: $ => seq(
            'ordered',
            '[',
            $._expression,
            ']',
        ),

        positive_ordered_type: $ => seq(
            'positive_ordered',
            '[',
            $._expression,
            ']',
        ),

        simplex_type: $ => seq(
            'simplex',
            '[',
            $._expression,
            ']',
        ),

        unit_vector_type: $ => seq(
            'unit_vector',
            '[',
            $._expression,
            ']',
        ),

        row_vector_type: $ => seq(
            'row_vector',
            optional($.type_constraint),
            '[',
            $._expression,
            ']',
        ),

        matrix_type: $ => seq(
            'matrix',
            optional($.type_constraint),
            '[',
            $._expression,
            ',',
            $._expression,
            ']',
        ),

        complex_vector_type: $ => seq(
            'complex_vector',
            '[',
            $._expression,
            ']',
        ),

        complex_row_vector_type: $ => seq(
            'complex_row_vector',
            '[',
            $._expression,
            ']',
        ),

        complex_matrix_type: $ => seq(
            'complex_matrix',
            '[',
            $._expression,
            ',',
            $._expression,
            ']',
        ),

        cholesky_factor_corr_type: $ => seq(
            'cholesky_factor_corr',
            '[',
            $._expression,
            ']',
        ),

        cholesky_factor_cov_type: $ => seq(
            'cholesky_factor_cov',
            '[',
            $._expression,
            optional(
                seq(
                    ',',
                    $._expression,
                ),
            ),
            ']',
        ),

        corr_matrix_type: $ => seq(
            'corr_matrix',
            '[',
            $._expression,
            ']',
        ),

        cov_matrix_type: $ => seq(
            'cov_matrix',
            '[',
            $._expression,
            ']',
        ),

        type_constraint: $ => prec(PREC.RANGE,
            choice(
                $._range_constraint,
                seq("<", $.offset_mult, ">"
                )
            )
        ),

        // this parses differently than Stan. Stan does not allow
        // ANY <> expressions inside the
        _range_constraint: $ => prec(PREC.RANGE, choice(
            $.range_lower,
            $.range_upper,
            $.range_lower_upper,
            $.range_upper_lower,
        )),

        /* eslint-enable no-unused-vars */

        range_lower_upper: $ => prec(PREC.RANGE, seq(
            '<',
            'lower',
            '=',
            $._range_expression,
            ',',
            'upper',
            '=',
            $._range_expression,
            '>',
        )),

        range_upper_lower: $ => prec(PREC.RANGE, seq(
            '<',
            'upper',
            '=',
            $._range_expression,
            ',',
            'lower',
            '=',
            $._range_expression,
            '>',
        )),

        range_lower: $ => prec(PREC.RANGE, seq(
            '<',
            'lower',
            '=',
            $._range_expression,
            '>',
        )),

        range_upper: $ => prec(PREC.RANGE, seq(
            '<',
            'upper',
            '=',
            $._range_expression,
            '>',
        )),

        offset_mult: $ => prec(PREC.RANGE, choice(
            seq("offset", "=", $._range_expression, ",", "multiplier", "=", $._range_expression),
            seq("multiplier", "=", $._range_expression, ",", "offset", "=", $._range_expression),
            seq("offset", "=", $._range_expression),
            seq("multiplier", "=", $._range_expression),
        )),

        /* eslint-disable no-unused-vars */
        identifier: $ => /[A-Za-z][A-Za-z0-9_]*/,
        /* eslint-enable no-unused-vars */

        // Expressions
        _expression: $ => choice(
            $._range_expression,
            $.conditional_expression,
            $.infix_op_expression,
            $.prefix_op_expression,
            $.postfix_op_expression,
            $.indexed_expression,
        ),

        // in order to deal with ambiguity of <> range expressions
        // cannot directly include logical infix operators.
        _range_expression: $ => choice(
            $._common_expression,
            alias($.infix_op_range_expression, $.infix_op_expression),
            alias($.prefix_op_range_expression, $.prefix_op_expression),
            alias($.postfix_op_range_expression, $.postfix_op_expression),
            alias($.indexed_range_expression, $.indexed_expression),
        ),

        // range constraints only allow a subset of expressions
        _common_expression: $ => choice(
            $.integer_literal,
            $.real_literal,
            $.imag_literal,
            $.identifier,
            $.array_expression,
            $.vector_expression,
            $.function_expression,
            $.distr_expression,
            $.parenthized_expression,
        ),

        conditional_expression: $ => prec.right(PREC.CONDITIONAL, seq(
            $._expression,
            '?',
            $._expression,
            ':',
            $._expression,
        )),

        array_expression: $ => seq(
            '{',
            commaSep($._expression),
            '}',
        ),

        vector_expression: $ => prec(PREC.BRACKET, seq(
            '[',
            commaSep($._expression),
            ']',
        )),

        // operator expressions outside of range constraints
        infix_op_expression: $ => {
            const ops = operators.infix.arithmetic.concat(operators.infix.logical);
            return choice(
                ...infixExpressions(ops, $._expression),
            );
        },

        prefix_op_expression: $ => choice(...prefixExpressions(operators.prefix, $._expression)),

        postfix_op_expression: $ => choice(...postfixExpressions(operators.postfix, $._expression)),

        // trick used for call expression in c grammar
        indexed_expression: $ => prec.left(PREC.INDEX, seq(
            $._expression,
            '[',
            optional($.index),
            repeat(seq(',', optional($.index))),
            ']',
        )),

        // expressions inside of range constraints
        infix_op_range_expression: $ => choice(
            ...infixExpressions(operators.infix.arithmetic, $._range_expression),
        ),

        prefix_op_range_expression: $ => choice(
            ...prefixExpressions(operators.prefix, $._range_expression),
        ),

        postfix_op_range_expression: $ => choice(
            ...postfixExpressions(operators.postfix, $._range_expression),
        ),

        // trick used for call expression in c grammar
        indexed_range_expression: $ => prec.left(PREC.INDEX, seq(
            $._range_expression,
            '[',
            optional($.index),
            repeat(seq(',', optional($.index))),
            ']',
        )),

        function_expression: $ => prec(PREC.FUNCTION, seq(
            field("name", $.identifier),
            $.argument_list,
        )),

        argument_list: $ => prec.dynamic(1, seq(
            '(',
            commaSep($._expression),
            ')',
        )),

        distr_expression: $ => prec(PREC.FUNCTION, seq(
            field("name", $.identifier),
            $.distr_argument_list,
        )),

        distr_argument_list: $ => prec.dynamic(1, seq(
            '(',
            $._expression,
            '|',
            commaSep($._expression),
            ')',
        )),

        parenthized_expression: $ => seq(
            '(',
            $._expression,
            ')',
        ),

        index: $ => choice(
            $._expression,
            $.colon_expression,
            $.left_colon_expression,
            $.right_colon_expression,
            ":",
        ),

        colon_expression: $ => seq($._expression, ':', $._expression),

        left_colon_expression: $ => seq(':', $._expression),

        right_colon_expression: $ => seq($._expression, ':'),

        /* eslint-disable no-unused-vars */
        integer_literal: $ => /[0-9]+(_[0-9]+)*/,
        /* eslint-enable no-unused-vars */

        // can't use token because of https://github.com/tree-sitter/tree-sitter/issues/449
        exp_literal: $ => seq(
            token.immediate(/[eE][+-]?/), $.integer_literal
        ),

        real_literal: $ => choice(
            seq($.integer_literal, token.immediate("."), optional($.integer_literal), optional($.exp_literal)),
            seq(".", $.integer_literal, optional($.exp_literal)),
            seq($.integer_literal, $.exp_literal),
        ),

        imag_literal: $ => seq(
            choice(
                $.integer_literal,
                $.real_literal,
            ),
            token.immediate("i")
        ),

        // Statements
        _statement: $ => choice(
            $.empty_statement,
            $.assignment_statement,
            $.sampling_statement,
            $.function_expression,
            $.log_prob_statement,
            $.target_statement,
            $.break_statement,
            $.continue_statement,
            $.print_statement,
            $.reject_statement,
            $.return_statement,
            $.if_statement,
            $.while_statement,
            $.for_statement,
            $.block_statement,
            $.profile_statement,
        ),

        /* eslint-disable no-unused-vars */
        empty_statement: $ => ';',
        /* eslint-enable no-unused-vars */

        assignment_statement: $ => prec(PREC.ASSIGN, seq(
            $.lhs,
            $.assignment_op,
            $._expression,
            ';',
        )),

        lhs: $ => seq(
            $.identifier,
            optional(
                repeat(seq('[', commaSep1(optional($.index)), ']'))),
        ),

        /* eslint-disable no-unused-vars */
        assignment_op: $ => choice(
            '=',
            '+=',
            '-=',
            '*=',
            '/=',
            '.*=',
            './=',
        ),
        /* eslint-enable no-unused-vars */

        sampling_statement: $ => seq(
            $._expression,
            '~',
            $.identifier,
            '(',
            commaSep($._expression),
            ')',
            optional($._truncation),
            ';',
        ),

        /* eslint-disable no-unused-vars */
        _truncation: $ => choice(
            $.lower_upper_truncation,
            $.lower_truncation,
            $.upper_truncation,
            $.empty_truncation,
        ),
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-unused-vars */
        lower_upper_truncation: $ => seq(
            'T',
            '[',
            $._expression,
            ',',
            $._expression,
            ']',
        ),
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-unused-vars */
        lower_truncation: $ => seq(
            'T',
            '[',
            $._expression,
            ',',
            ']',
        ),
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-unused-vars */
        upper_truncation: $ => seq(
            'T',
            '[',
            ',',
            $._expression,
            ']',
        ),
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-unused-vars */
        empty_truncation: $ => seq(
            'T',
            '[',
            ',',
            ']',
        ),
        /* eslint-enable no-unused-vars */

        log_prob_statement: $ => seq(
            'increment_log_prob',
            '(',
            $._expression,
            ')',
            ';',
        ),

        target_statement: $ => seq(
            'target',
            '+=',
            $._expression,
            ';',
        ),

        /* eslint-disable no-unused-vars */
        break_statement: $ => seq('break', ';'),
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-unused-vars */
        continue_statement: $ => seq('continue', ';'),
        /* eslint-enable no-unused-vars */

        print_statement: $ => seq(
            'print',
            '(',
            commaSep(choice($._expression, $.string_literal)),
            ')',
            ';',
        ),

        // currently nested quotes not allowed
        /* eslint-disable no-unused-vars */
        string_literal: $ => /"[^\"]*"/,
        /* eslint-enable no-unused-vars */

        reject_statement: $ => seq(
            'reject',
            '(',
            optional(commaSep(choice($._expression, $.string_literal))),
            ')',
            ';',
        ),

        return_statement: $ => seq(
            'return',
            optional($._expression),
            ';',
        ),

        // right precedence needed to resolve ambiguity
        if_statement: $ => prec.right(1, seq(
            'if',
            '(', $._expression, ')',
            $._vardecl_or_statement,
            // implicit else if
            optional(seq('else', $._statement)),
        )),

        while_statement: $ => prec(1, seq(
            'while',
            '(',
            $._expression,
            ')',
            $._vardecl_or_statement,
        )),

        for_statement: $ => prec(1, seq(
            'for',
            '(',
            field("loopvar", $.identifier),
            'in',
            $._expression,
            optional(seq(':', $._expression)),
            ')',
            $._vardecl_or_statement,
        )),

        block_statement: $ => seq(
            '{',
            repeat($._vardecl_or_statement),
            '}',
        ),

        profile_statement: $ => seq(
            "profile",
            "(",
            $.string_literal,
            ")",
            '{',
            repeat($._vardecl_or_statement),
            '}',
        ),

        /* eslint-disable no-unused-vars */
        preproc_include: $ => seq(
            field("directive", '#include'),
            // could be more specific
            /[<'\"]?/,
            field("file", $.preproc_file),
            /[>'\"]?/,
        ),
        /* eslint-enable no-unused-vars */

        preproc_file: $ => token.immediate(/.*/),

        /* eslint-disable no-unused-vars */
        comment: $ => token(choice(
            seq('//', /.*/),
            // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
            seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/',
            ),
        )),
        /* eslint-enable no-unused-vars */

    },
});
