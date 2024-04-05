(functions "functions" @name) @definition.module
(data "data" @name) @definition.module
(transformed_data "transformed data" @name) @definition.module
(parameters "parameters" @name) @definition.module
(transformed_parameters "transformed parameters" @name) @definition.module
(model "model" @name) @definition.module
(generated_quantities "generated quantities" @name) @definition.module

(function_declarator
    name: (identifier) @name
) @definition.function


(function_expression
    name: (identifier) @name
) @reference.call

(distr_expression
    name: (identifier) @name
) @reference.call

(print_statement
"print" @name) @reference.call

(reject_statement
"reject" @name) @reference.call

(fatal_error_statement
"fatal_error" @name) @reference.call
