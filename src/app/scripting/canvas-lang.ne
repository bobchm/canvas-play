@{%
import moo from "moo";

let comment,
    number_literal,
    identifier,
    string_literal,
    description,
    category;

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    lte: "<=",
    lt: "<",
    gte: ">=",
    gt: ">",
    eq: "==",
    neq: "!=",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    pluseq: "+=",
    minuseq: "-=",
    multiplyeq: "*=",
    divideeq: "/=",
    moduloeq: "%=",
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "/",
    modulo: "%",
    power: "^",
    colon: ":",
    period: ".",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    description: {
        match: /@description[^\n]*/,
        value: s => s.substring(12).trim()
    },
    category: {
        match: /@category[^\n]*/,
        value: s => s.substring(9).trim()
    },
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: {
        match: /[a-zA-Z_][a-zA-Z_0-9]*/,
        type: moo.keywords({
            function: "function",
            while: "while",
            for: "for",
            else: "else",
            in: "in",
            if: "if",
            return: "return",
            and: "and",
            or: "or",
            true: "true",
            false: "false",
            null: "null",
        })
    }
});


function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1
    };
}

function tokenValueEnd(token) {
    const lastNewLine = token.value.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.value.length - 1
    };
}

function convertToken(token) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}

function convertTokenId(data) {
    return convertToken(data[0]);
}

function convertNegToken(data) {
    var token = data[1];
    return {
        type: token.type,
        value: -token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
    
}

%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements
    ->  top_level_statement
        {%
            d => [d[0]]
        %}
    |  top_level_statement _ "\n" _ top_level_statements
        {%
            d => [
                d[0],
                ...d[4]
            ]
        %}
    # below 2 sub-rules handle blank lines
    |  _ "\n" top_level_statements
        {%
            d => d[2]
        %}
    |  _
        {%
            d => []
        %}

top_level_statement
    -> _ function_definition   {% d => d[1] %}
    |  _ executable_statement {% d => d[1] %}
    |  _ line_comment     {% d => d[1] %}
    |  _ expression {% d => d[1] %}

function_definition
    -> "function" __ identifier _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "function_definition",
                name: d[2],
                parameters: d[6],
                body: d[10],
                start: tokenStart(d[0]),
                end: d[10].end
            })
        %}

parameter_list
    -> null        {% () => [] %}
    | parameter   {% d => [d[0]] %}
    | parameter _ "," _ parameter_list
        {%
            d => [d[0], ...d[4]]
        %}

parameter
    -> identifier   
        {% 
            d => ({
                name: d[0].value,
                type: "none"
            })
        %}
    |  identifier _ ":" _ identifier
        {%
            d => ({
                name: d[0].value,
                type: d[4].value
            })
        %}

code_block -> "{" executable_statements "}"
    {%
        (d) => ({
            type: "code_block",
            statements: d[1],
            start: tokenStart(d[0]),
            end: tokenEnd(d[2])
        })
    %}

executable_statements
    -> _
        {% () => [] %}
    |  _ "\n" executable_statements
        {% (d) => d[2] %}
    |  _ executable_statement _
        {% d => [d[1]] %}
    |  _ executable_statement _ "\n" executable_statements
        {%
            d => [d[1], ...d[4]]
        %}

executable_statement
   -> return_statement      {% id %}
   |  var_assignment        {% id %}
   |  var_op_assignment     {% id %}
   |  call_statement        {% id %}
   |  line_comment          {% id %}
   |  line_category         {% id %}
   |  line_description      {% id %}
   |  indexed_assignment    {% id %}
   |  indexed_op_assignment {% id %}
   |  while_loop            {% id %}
   |  if_statement          {% id %}
   |  for_loop              {% id %}

return_statement
   -> "return" __ expression
       {%
           d => ({
               type: "return_statement",
               value: d[2],
               start: tokenStart(d[0]),
               end: d[2].end
           })
       %}

var_assignment
    -> identifier _ "=" _ expression
        {%
            d => ({
                type: "var_assignment",
                var_name: d[0],
                value: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

var_op_assignment
    -> identifier _ assign_operator _ expression
        {%
            d => ({
                type: "var_op_assignment",
                var_name: d[0],
                op: d[2],
                value: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

assign_operator
    -> "+="  {% convertTokenId %}
    |  "-="  {% convertTokenId %}
    |  "*="  {% convertTokenId %}
    |  "/="  {% convertTokenId %}
    |  "%="  {% convertTokenId %}

call_statement -> call_expression  {% id %}

call_expression
    -> identifier _ "(" argument_list ")"
        {%
            d => ({
                type: "call_expression",
                fn_name: d[0],
                arguments: d[3],
                start: d[0].start,
                end: tokenEnd(d[4])
            })
        %}

indexed_access
    -> unary_expression _ "[" _ expression _ "]"
        {%
            d => ({
                type: "indexed_access",
                subject: d[0],
                index: d[4],
                start: d[0].start,
                end: tokenEnd(d[6])
            })
        %}
    |  unary_expression "." identifier
        {%
            d => ({
                type: "indexed_access",
                subject: d[0],
                index: {
                    type: "string_literal",
                    value: d[2].value,
                    start: d[2].start,
                    end: d[2].end,
                },
                start: d[0].start,
                end: tokenValueEnd(d[2])
            })
        %}

indexed_assignment
    -> unary_expression _ "[" _ expression _ "]" _ "=" _ expression
        {%
            d => ({
                type: "indexed_assignment",
                subject: d[0],
                index: d[4],
                value: d[10],
                start: d[0].start,
                end: d[10].end
            })
        %}
    | unary_expression "." identifier _ "=" _ expression
        {%
            d => ({
                type: "indexed_assignment",
                subject: d[0],
                index: {
                    type: "string_literal",
                    value: d[2].value,
                    start: d[2].start,
                    end: d[2].end,
                },
                value: d[6],
                start: d[0].start,
                end: d[6].end
            })
        %}

indexed_op_assignment
    -> unary_expression _ "[" _ expression _ "]" _ assign_operator _ expression
        {%
            d => ({
                type: "indexed_op_assignment",
                subject: d[0],
                index: d[4],
                op: d[8],
                value: d[10],
                start: d[0].start,
                end: d[10].end
            })
        %}
    | unary_expression "." identifier _ assign_operator _ expression
        {%
            d => ({
                type: "indexed_op_assignment",
                subject: d[0],
                index: {
                    type: "string_literal",
                    value: d[2].value,
                    start: d[2].start,
                    end: d[2].end,
                },
                op: d[4],
                value: d[6],
                start: d[0].start,
                end: d[6].end
            })
        %}

while_loop
    -> "while" __ expression __ code_block
        {%
            d => ({
                type: "while_loop",
                condition: d[2],
                body: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}

if_statement
    -> "if" __ expression __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ if_statement
       {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
       %}

for_loop
    -> "for" __ identifier __ "in" __ expression _ code_block
        {%
            d => ({
                type: "for_loop",
                loop_variable: d[2],
                iterable: d[6],
                body: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}

argument_list
    -> null {% () => [] %}
    |  _ expression _  {% d => [d[1]] %}
    |  _ expression _ "," argument_list
        {%
            d => [d[1], ...d[4]]
        %}

expression -> boolean_expression         {% id %}

boolean_expression
    -> comparison_expression     {% id %}
    |  comparison_expression _ boolean_operator _ boolean_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "boolean",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

boolean_operator
    -> "and"      {% id %}
    |  "or"       {% id %}

comparison_expression
    -> additive_expression    {% id %}
    |  additive_expression _ comparison_operator _ comparison_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "comparison",
                operator: d[2],
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

comparison_operator
    -> ">"   {% convertTokenId %}
    |  ">="  {% convertTokenId %}
    |  "<"   {% convertTokenId %}
    |  "<="  {% convertTokenId %}
    |  "=="  {% convertTokenId %}
    |  "!="  {% convertTokenId %}

additive_expression
    -> multiplicative_expression    {% id %}
    |  multiplicative_expression _ "+" _ additive_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "additive",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}
    |  multiplicative_expression _ "-" _ additive_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "additive",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

multiplicative_expression
    -> power_expression     {% id %}
    |  power_expression _ "*" _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "multiplicative",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}
    |  power_expression _ "/" _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "multiplicative",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}
    |  power_expression _ "%" _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "multiplicative",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

power_expression
    -> unary_expression     {% id %}
    |  unary_expression _ "^" _ unary_expression
        {%
            d => ({
                type: "binary_operation",
                subtype: "power",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

unary_expression
    -> number               {% id %}
    |  identifier
        {%
            d => ({
                type: "var_reference",
                var_name: d[0],
                start: d[0].start,
                end: d[0].end
            })
        %}
    |  call_expression      {% id %}
    |  string_literal       {% id %}
    |  list_literal         {% id %}
    |  dictionary_literal   {% id %}
    |  boolean_literal      {% id %}
    |  null_literal         {% id %}
    |  indexed_access       {% id %}
    |  function_expression  {% id %}
    |  "(" expression ")"
        {%
            data => data[1]
        %}

list_literal
    -> "[" list_items "]"
        {%
            d => ({
                type: "list_literal",
                items: d[1],
                start: tokenStart(d[0]),
                end: tokenEnd(d[2])
            })
        %}

list_items
    -> null
        {% () => [] %}
    |  _ml expression _ml
        {% d => [d[1]] %}
    |  _ml expression _ml "," list_items
        {%
            d => [
                d[1],
                ...d[4]
            ]
        %}

dictionary_literal
    -> "{" dictionary_entries "}"
        {%
            d => ({
                type: "dictionary_literal",
                entries: d[1],
                start: tokenStart(d[0]),
                end: tokenEnd(d[2])
            })
        %}

dictionary_entries
    -> null  {% () => [] %}
    |  _ml dictionary_entry _ml
        {%
            d => [d[1]]
        %}
    |  _ml dictionary_entry _ml "," dictionary_entries
        {%
            d => [d[1], ...d[4]]
        %}

dictionary_entry
    -> identifier _ml ":" _ml expression
        {%
            d => [d[0], d[4]]
        %}

boolean_literal
    -> "true"
        {%
            d => ({
                type: "boolean_literal",
                value: true,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}
    |  "false"
        {%
            d => ({
                type: "boolean_literal",
                value: false,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}

null_literal
    -> "null"
        {%
            d => ({
                type: "null_literal",
                value: null,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}

function_expression
    -> "function" _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "function_expression",
                parameters: d[4],
                body: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}

line_comment -> %comment {% convertTokenId %}

line_category -> %category {% convertTokenId %}

line_description -> %description {% convertTokenId %}

string_literal -> %string_literal {% convertTokenId %}

number -> %number_literal {% convertTokenId %}
     | "-" %number_literal {% convertNegToken %}

identifier -> %identifier {% convertTokenId %}

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> [ \t]
    |  "\n"

__ -> [ \t]:+

_ -> [ \t]:*
