/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  LAMBDA: -1,
  APPLICATION: 1,
};

module.exports = grammar({
  name: "elsa",

  extras: ($) => [$.line_comment, $.block_comment, /\s/],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice($.let_binding, $.eval_block, $.conf_block),

    // let id = \x -> x
    let_binding: ($) =>
      seq("let", field("name", $.identifier), "=", field("body", $._term)),

    // eval name :
    //   term
    //   =b> term
    eval_block: ($) =>
      seq(
        "eval",
        field("name", $.identifier),
        ":",
        field("initial", $._term),
        repeat($.reduction_step)
      ),

    // conf name :
    //   term
    //   =b> term
    conf_block: ($) =>
      seq(
        "conf",
        field("name", $.identifier),
        ":",
        field("initial", $._term),
        repeat($.reduction_step)
      ),

    reduction_step: ($) =>
      seq(field("operator", $.step_operator), field("term", $._term)),

    // All step operators: =a>, =b>, =e>, =d>, =n>, =p>, =*>, =~>, =n*>, =p*>
    // With optional normal-form modifier: =b:w>, =n:s>, =p:h>, etc.
    step_operator: (_) =>
      token(
        seq(
          "=",
          choice("a", "b", "e", "d", "n", "p", "*", "~", "n*", "p*"),
          optional(seq(":", choice("s", "w", "h"))),
          ">"
        )
      ),

    _term: ($) => choice($.lambda, $.application, $._atom),

    // \x y z -> body  (right-associative, lowest precedence)
    lambda: ($) =>
      prec.right(
        PREC.LAMBDA,
        seq(
          "\\",
          field("params", repeat1($.identifier)),
          "->",
          field("body", $._term)
        )
      ),

    // f x y  (left-associative application)
    application: ($) =>
      prec.left(PREC.APPLICATION, seq($._term, $._atom)),

    _atom: ($) => choice($.variable, $.paren_term),

    variable: ($) => $.identifier,

    paren_term: ($) => seq("(", $._term, ")"),

    // Identifiers: letter followed by alphanumeric / _ / # / '
    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_#']*/,

    // -- single line comment
    line_comment: (_) => token(seq("--", /.*/)),

    // {- block comment -}  (non-nested; content cannot end with -- immediately before })
    block_comment: (_) =>
      token(seq("{-", /([^-]|-[^}])*/, "-}")),
  },
});
