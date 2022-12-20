import nearley from "nearley";
import grammar from "./canvas-lang";
import { isObject } from "../../utils/app-utils";

export const ExecutionMode = {
    Edit: "editmode",
    Play: "play",
};

var globalStack = [];

function initializeExecution() {
    globalStack = [];
}

function parse(source) {
    var ast = null;
    try {
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(source);
        ast = parser.results[0];
    } catch (err) {
        // these error messages are a bit much - cut at the location
        var msg = err.message;
        var idx = msg.search(":\n");
        if (idx > 0) {
            msg = msg.slice(0, idx);
        }
        err.message = msg;
        throw err;
    }
    return ast;
}

function simplify(ast) {
    return ast;
}

function execute(ast, mode) {
    // ast should be a list of executable records
    var value = null;
    for (let i = 0; i < ast.length; i++) {
        try {
            value = executeTopLevel(ast[i], mode);
        } catch (err) {
            throw err;
        }
    }
    return value;
}

function executionError(err, node) {
    var msg = err;
    if (node) {
        msg += `: ${node.start.line}:${node.start.col}`;
    }
    return new Error(msg);
}

function executeTopLevel(node, mode) {
    var value = null;
    switch (node.type) {
        case "comment":
            value = true;
            break;
        case "function_definition":
            value = defineFunction(node);
            break;
        case "return_statement":
            throw executionError("Return statement at top level", node);
        default:
            if (mode === ExecutionMode.Play) {
                if (isExpressionNode(node)) {
                    value = evaluateExpression(node);
                } else {
                    value = executeStatement(node);
                }
            }
    }
    return value;
}

function defineFunction(node) {
    return setFunction(node.name.value, node.parameters, node.body, node);
}

function executeStatement(node) {
    var value = null;
    switch (node.type) {
        case "comment":
        case "description":
        case "category":
            value = true;
            break;
        case "var_assignment":
            value = executeAssignment(node);
            break;
        case "var_op_assignment":
            value = executeOpAssignment(node);
            break;
        case "call_expression":
            value = executeFnCall(node);
            break;
        case "while_loop":
            value = executeWhileLoop(node);
            break;
        case "if_statement":
            value = executeIfStatement(node);
            break;
        case "for_loop":
            value = executeForLoop(node);
            break;
        case "indexed_assignment":
            value = executeIndexedAssignment(node);
            break;
        case "indexed_op_assignment":
            value = executeIndexedOpAssignment(node);
            break;
        case "return_statement":
            value = executeReturnStatement(node);
            break;
        default:
            throw new Error(`Improper statement: ${node.type}`);
    }
    return value;
}

function executeAssignment(node) {
    var value = evaluateExpression(node.value);
    setVariable(node.var_name.value, value);
    return value;
}

function opEvaluate(op, lvalue, rvalue) {
    switch (op) {
        case "pluseq":
            return lvalue + rvalue;
        case "minuseq":
            return lvalue - rvalue;
        case "multiplyeq":
            return lvalue * rvalue;
        case "divideeq":
            return lvalue / rvalue;
        case "moduloeq":
            return lvalue % rvalue;
        default:
            return 0;
    }
}

function opFromOpName(opName) {
    switch (opName) {
        case "pluseq":
            return "+=";
        case "minuseq":
            return "-=";
        case "multiplyeq":
            return "*=";
        case "divideeq":
            return "/=";
        case "moduloeq":
            return "%=";
        default:
            return "";
    }
}

function executeOpAssignment(node) {
    var lvalue = getVariableValue(node.var_name.value, node);
    var rvalue = evaluateExpression(node.value);
    var newvalue = opEvaluate(node.op.type, lvalue, rvalue);
    setVariable(node.var_name.value, newvalue);
    return newvalue;
}

function executeFnCall(node) {
    // get function definition
    var fnName = node.fn_name.value;
    var fnDef = getFunctionDef(fnName, node);

    // make sure the function exists
    if (!fnDef) {
        throw executionError(`Undefined function: (${fnName})`, node);
    }

    // make sure the number of function parameters match the number of expresions we have
    if (fnDef.params.length !== node.arguments.length) {
        throw executionError(
            `Argument mismatch for function (${fnName})`,
            node
        );
    }

    // is it a built-in function?
    if (fnDef.isBuiltIn) {
        // collect the argument values
        var args = [];
        for (let i = 0; i < node.arguments.length; i++) {
            args.push(evaluateExpression(node.arguments[i]));
        }
        return fnDef.builtInFn.apply(null, args);
    }

    var values = [];
    for (let i = 0; i < fnDef.params.length; i++) {
        values[i] = evaluateExpression(node.arguments[i]);
    }

    // push new frame and set parameter values
    pushStackFrame(fnName);
    for (let i = 0; i < fnDef.params.length; i++) {
        setVariable(fnDef.params[i].name, values[i]);
    }

    // run the code of the function definition
    executeCodeBlock(fnDef.body);
    var returnValue = stackTop().returnFlag ? stackTop().returnValue : null;
    popStackFrame();
    return returnValue;
}

function executeWhileLoop(node) {
    while (evaluateExpression(node.condition)) {
        executeCodeBlock(node.body);
        if (stackTop().returnFlag) break;
    }
    return true;
}

function executeIfStatement(node) {
    if (evaluateExpression(node.condition)) {
        executeCodeBlock(node.consequent);
    } else if (node.alternate) {
        // else clause can either be code block or another if statement (emulating elseif)
        if (node.alternate.type === "if_statement") {
            executeStatement(node.alternate);
        } else {
            executeCodeBlock(node.alternate);
        }
    }
    return true;
}

function executeForLoop(node) {
    var loopVar = node.loop_variable.value;
    var list = evaluateExpression(node.iterable);
    var body = node.body;
    if (!Array.isArray(list)) {
        executionError("Invalid list in 'for' loop", node);
    }
    for (let i = 0; i < list.length; i++) {
        setVariable(loopVar, list[i]);
        executeCodeBlock(body);
        if (stackTop().returnFlag) break;
    }
    return true;
}

function executeCodeBlock(body) {
    var value = null;
    for (let i = 0; i < body.statements.length; i++) {
        value = executeStatement(body.statements[i]);
        if (stackTop().returnFlag) {
            break;
        }
    }
    return value;
}

function executeIndexedAssignment(node) {
    var ary = evaluateExpression(node.subject);
    if (!Array.isArray(ary) && !isObject(ary)) {
        executionError("Indexed assignment of non-array", node);
    }
    ary[node.index.value] = evaluateExpression(node.value);
    return ary[node.index.value];
}

function executeIndexedOpAssignment(node) {
    var ary = evaluateExpression(node.subject);
    if (!Array.isArray(ary) && !isObject(ary)) {
        executionError("Indexed assignment of non-array", node);
    }

    var rvalue = evaluateExpression(node.value);
    ary[node.index.value] = opEvaluate(
        node.op.type,
        ary[node.index.value],
        rvalue
    );
    return ary[node.index.value];
}

function executeReturnStatement(node) {
    stackTop().returnValue = evaluateExpression(node.value);
    stackTop().returnFlag = true;
    return stackTop().returnValue;
}

function evaluateExpression(node) {
    switch (node.type) {
        case "string_literal":
            return node.value;
        case "number_literal":
            return node.value;
        case "boolean_literal":
            return node.value;
        case "null_literal":
            return node.value;
        case "list_literal":
            return evaluateList(node);
        case "dictionary_literal":
            return evaluateDictionary(node);
        case "binary_operation":
            var left = evaluateExpression(node.left);
            var right = evaluateExpression(node.right);
            return evaluateBinaryOp(node.operator.value, left, right, node);
        case "var_reference":
            return getVariableValue(node.var_name.value, node);
        case "call_expression":
            return executeFnCall(node);
        case "indexed_access":
            var subject = evaluateExpression(node.subject);
            var index = evaluateExpression(node.index);
            try {
                return subject[index];
            } catch (err) {
                throw executionError("Error accessing index value", node);
            }
        case "function_expression":
            return defineFunction(node);
        default:
            throw executionError(`Unknown AST node type (${node.type})`, node);
    }
}

const expressionNodes = [
    "string_literal",
    "number_literal",
    "boolean_literal",
    "null_literal",
    "list_literal",
    "dictionary_literal",
    "binary_operation",
    "var_reference",
    "call_expression",
    "indexed_access",
    "function_expression",
];

function isExpressionNode(node) {
    return expressionNodes.includes(node.type);
}

function evaluateList(node) {
    return node.items.map((item) => evaluateExpression(item));
}

function evaluateDictionary(node) {
    var val = {};
    for (let i = 0; i < node.entries.length; i++) {
        var entry = node.entries[i];
        val[entry[0].value] = evaluateExpression(entry[1]);
    }
    return val;
}

function evaluateBinaryOp(op, left, right, node) {
    try {
        switch (op) {
            case ">":
                return left > right;
            case ">=":
                return left >= right;
            case "<":
                return left < right;
            case "<=":
                return left <= right;
            case "==":
                return left === right;
            case "!=":
                return left !== right;
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "^":
                return left ** right;
            case "/":
                return left / right;
            case "%":
                return left % right;
            case "or":
                return left || right;
            case "and":
                return left && right;
            default:
                throw executionError(`Unknown binary operator: ${op}`, node);
        }
    } catch (err) {
        throw executionError(err, node);
    }
}

function pushStackFrame(name) {
    globalStack.push({
        name: name,
        fns: [],
        vars: [],
        returnFlag: false,
        returnValue: null,
    });
}

function popStackFrame() {
    if (globalStack.length > 0) {
        globalStack.pop();
    }
}

function stackTop() {
    if (globalStack.length === 0) return null;
    return globalStack[globalStack.length - 1];
}

function clearStackTo(frameName, including) {
    for (let i = 0; i < globalStack.length; i++) {
        if (globalStack[i].name === frameName) {
            var clearTo = i + (including ? 0 : 1);
            globalStack = globalStack.slice(0, clearTo);
        }
    }
}

function addStackFrame(frame) {
    // this is for sharing stack frames with other execution stacks, not the normal "push new stack"
    globalStack.push(frame);
}

function getVariableValue(name, node) {
    for (let i = globalStack.length - 1; i >= 0; i--) {
        if (globalStack[i].vars.hasOwnProperty(name))
            return globalStack[i].vars[name];
    }
    throw executionError(`Undefined variable: ${name}`, node);
}

function hasVariableValue(name) {
    for (let i = globalStack.length - 1; i >= 0; i--) {
        if (globalStack[i].vars.hasOwnProperty(name)) return true;
    }
    return false;
}

function setVariable(name, value) {
    for (let i = globalStack.length - 1; i >= 0; i--) {
        if (globalStack[i].vars.hasOwnProperty(name)) {
            globalStack[i].vars[name] = value;
            return;
        }
    }
    stackTop().vars[name] = value;
}

function getFunctionDef(name, node) {
    for (let i = globalStack.length - 1; i >= 0; i--) {
        var fn = globalStack[i].fns[name];
        if (fn) {
            return fn;
        }
    }
    throw executionError(`Unknown function: ${name}`, node);
}

function functionFromName(name) {
    for (let i = globalStack.length - 1; i >= 0; i--) {
        var fn = globalStack[i].fns[name];
        if (fn) {
            return fn;
        }
    }
    return null;
}

function allFunctionNames() {
    var fnNames = [];
    for (let i = globalStack.length - 1; i >= 0; i--) {
        for (const fnName in globalStack[i].fns) {
            if (!fnNames.includes(fnName)) {
                fnNames.push(fnName);
            }
        }
    }
    return fnNames;
}

function functionsForCategory(category) {
    var catFns = [];
    for (let i = globalStack.length - 1; i >= 0; i--) {
        var fns = globalStack[i].fns;
        for (const fnName in fns) {
            var fn = fns[fnName];
            if (fn.category === category) {
                catFns.push(fn);
            }
        }
    }
    return fns;
}

function findFunctionAnnotation(body, atype) {
    if (body.type === "code_block") {
        for (let i = 0; i < body.statements.length; i++) {
            if (body.statements[i].type === atype) {
                return body.statements[i].value;
            }
        }
    }
    return null;
}

function setFunction(name, params, body, node) {
    var category = findFunctionAnnotation(body, "category");
    var description = findFunctionAnnotation(body, "description");
    addFnDefToStackFrame(
        name,
        params,
        false,
        body,
        null,
        category,
        description,
        node
    );
    return name;
}

function addBuiltInFunction(fnDef) {
    addFnDefToStackFrame(
        fnDef.name,
        fnDef.parameters,
        true,
        null,
        fnDef.function,
        fnDef.category,
        fnDef.description,
        null
    );
}

function addFnDefToStackFrame(
    name,
    params,
    isBuiltIn,
    body,
    builtInFn,
    category,
    description,
    node
) {
    var frame = stackTop();
    if (frame.fns[name]) {
        throw executionError(`Duplicate function definition (${name})`, node);
    }
    if (!Array.isArray(params)) {
        throw executionError(
            "Invalide parameter specification when adding function",
            node
        );
    }
    frame.fns[name] = {
        params: params,
        isBuiltIn: isBuiltIn,
        body: body,
        builtInFn: builtInFn,
        category: category,
        description: description,
    };
}

function decompile(statements) {
    var decompiled = "";
    for (let i = 0; i < statements.length; i++) {
        decompiled += decompileNode(statements[i]) + "\n";
    }
    return decompiled;
}

function decompileNode(node) {
    var decompiled = "";
    switch (node.type) {
        case "comment":
            decompiled = "#" + node.value;
            break;
        case "function_definition":
            decompileFnDef(node);
            break;
        case "return_statement":
            decompiled += "return " + decompileNode(node.value);
            break;
        case "description":
            decompiled += "@description " + node.value;
            break;
        case "category":
            decompiled += "@category " + node.value;
            break;
        case "var_assignment":
            decompiled +=
                node.var_name.value + " = " + decompileNode(node.value);
            break;
        case "var_op_assignment":
            decompiled +=
                node.var_name.value +
                " " +
                opFromOpName(node.op.type) +
                " " +
                decompileNode(node.value);
            break;
        case "call_expression":
            decompiled += node.fn_name.value + "(";
            for (let i = 0; i < node.arguments.length; i++) {
                if (i > 0) decompiled += ", ";
                decompiled += decompileNode(node.arguments[i]);
            }
            decompiled += ")";
            break;
        case "while_loop":
            decompiled += "while " + decompileNode(node.condition) + " {\n";
            decompiled += decompile(node.body.statements) + "}";
            break;
        case "if_statement":
            decompiled += "if " + decompileNode(node.condition) + " {\n";
            decompiled += decompile(node.consequent.statements);
            if (node.alternate.type === "if_statement") {
                decompiled += "} else ";
                decompiled += decompile(node.alternate);
            } else if (node.alternate === "code_block") {
                decompiled +=
                    "} else {\n" + decompile(node.alternate.statements) + "}";
            } else {
                decompiled += "}";
            }
            break;
        case "for_loop":
            decompiled +=
                "for " +
                node.loop_variable.value +
                " in " +
                decompileNode(node.iterable) +
                " {\n" +
                decompile(node.body.statements) +
                "}";
            break;
        case "indexed_assignment":
            decompiled += decompileNode(node.subject);
            decompiled += " = " + decompileNode(node.value);
            break;
        case "indexed_op_assignment":
            decompiled += decompileNode(node.subject);
            decompiled +=
                " " +
                opFromOpName(node.op.type) +
                " " +
                decompileNode(node.value);
            break;
        case "string_literal":
            decompiled += '"' + node.value + '"';
            break;
        case "number_literal":
            decompiled += node.value;
            break;
        case "boolean_literal":
            decompiled += node.value;
            break;
        case "null_literal":
            decompiled += node.value;
            break;
        case "list_literal":
            decompiled += "[";
            for (let i = 0; i < node.items; i++) {
                if (i > 0) decompiled += ", ";
                decompiled += decompileNode(node.items[i]);
            }
            decompiled += "]";
            break;
        case "dictionary_literal":
            decompiled += "{";
            for (let i = 0; i < node.entries.length; i++) {
                var entry = node.entries[i];
                if (i > 0) decompiled += ", ";
                decompiled += entry[0].value + ": " + decompileNode(entry[1]);
            }
            decompiled += "}";
            break;
        case "binary_operation":
            decompiled +=
                decompileNode(node.left) +
                " " +
                node.operator.value +
                " " +
                decompileNode(node.right);
            break;
        case "var_reference":
            decompiled += node.var_name.value;
            break;
        case "indexed_access":
            decompiled +=
                decompileNode(node.subject) +
                "[" +
                decompileNode(node.index) +
                "]";
            break;
        case "function_expression":
            decompiled += decompileFnDef(node);
            break;

        default:
    }
    return decompiled;
}

function decompileFnDef(node) {
    var decompiled = "function " + node.name.value + "(";
    for (let i = 0; i < node.parameters.length; i++) {
        if (i > 0) decompiled += ", ";
        decompiled += node.parameters[i].name;
    }
    decompiled += ") {\n";
    decompiled += decompile(node.body.statements);
    decompiled += "}\n";
    return decompiled;
}

function isSimpleFunctionCall(node) {
    // is this a "simple" function call? i.e., a function call with literal
    //    arguments?
    if (node.type !== "call_expression") return false;
    for (let i = 0; i < node.arguments.length; i++) {
        var arg = node.arguments[i];
        if (
            ![
                "string_literal",
                "number_literal",
                "boolean_literal",
                "null_literal",
                "list_literal",
                "dictionary_literal",
            ].includes(arg.type)
        )
            return false;
    }
    return true;
}

function logStack(verbose) {
    // for (let i = globalStack.length - 1; i >= 0; i--) {
    //     console.log(verbose ? globalStack[i] : globalStack[i].name);
    // }
    // console.log("-------------");
}

export {
    initializeExecution,
    pushStackFrame,
    popStackFrame,
    addStackFrame,
    clearStackTo,
    addBuiltInFunction,
    functionFromName,
    allFunctionNames,
    functionsForCategory,
    getVariableValue,
    setVariable,
    hasVariableValue,
    parse,
    simplify,
    execute,
    decompile,
    decompileNode,
    isSimpleFunctionCall,
    logStack,
};
