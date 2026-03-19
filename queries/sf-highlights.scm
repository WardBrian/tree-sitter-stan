(identifier) @variable


(comment) @comment
(string_literal) @string

[
    "||"
    "&&"
    "=="
    "!="
    "<"
    "<="
    ">"
    ">="
    "+"
    "-"
    "*"
    "/"
    "%"
    "\\"
    ".^"
    "%/%"
    ".*"
    "./"
    "!"
    "-"
    "+"
    "^"
    "'"
    "~"
    "="
    (assignment_op)
] @operator

[
    "("
    ")"
    "["
    "]"
    "{"
    "}"
    "<"
    ">"
] @punctuation.bracket

[
    ","
    "|"
    ";"
] @punctuation.delimiter

(function_declarator
name: (identifier) @function
)

(function_expression
name: (identifier) @function.call
)

(function_statement
name: (identifier) @function.call
)

(distr_expression
name: (identifier) @function.call
)

(sampling_statement
name: (identifier) @function.call
)

(print_statement
"print" @function.call)

(reject_statement
"reject" @function.call)

(fatal_error_statement
"fatal_error" @function.call)

[
    "data"
    "int"
    "real"
    "complex"
    "array"
    "tuple"
    "vector"
    "void"
]@type

[
    (integer_literal)
    (real_literal)
    (imag_literal)
] @number

[
    "break"
    "continue"
    "while"
    "for"
    "if"
    "else"
    "return"
] @keyword.control


(preproc_include
    directive: "#include" @keyword
    file: (preproc_file) @string.special
)


(profile_statement "profile" @keyword)

(target_statement "target" @keyword "+=" @keyword)
(jacobian_statement "jacobian" @keyword "+=" @keyword)

(for_statement
loopvar: (identifier) @variable.parameter
)
(parameter_declaration
parameter: (identifier) @variable.parameter
)

