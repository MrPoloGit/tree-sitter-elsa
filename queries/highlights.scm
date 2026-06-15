; Keywords
"let" @keyword
"eval" @keyword
"conf" @keyword

; Lambda arrow
"->" @keyword.operator

; Step operators (=b>, =d>, =n*>, etc.)
(step_operator) @operator

; Lambda backslash
"\\" @punctuation.special

; Names in definitions
(let_binding name: (identifier) @function.definition)
(eval_block name: (identifier) @function.definition)
(conf_block name: (identifier) @function.definition)

; Variables / identifiers
(variable (identifier) @variable)

; Lambda parameters
(lambda params: (identifier) @variable.parameter)

; Parentheses
"(" @punctuation.bracket
")" @punctuation.bracket

; Assignment
"=" @operator

; Colon after eval/conf name
":" @punctuation.delimiter

; Comments
(line_comment) @comment
(block_comment) @comment
