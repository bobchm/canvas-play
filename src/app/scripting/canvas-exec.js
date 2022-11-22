import nearley from "nearley";
import grammar from "./canvas-lang";

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

function execute(ast) {
    // ast should be a list of executable records
    for (let i = 0; i < ast.length; i++) {
        try {
            executeTopLevel(ast[i]);
        } catch (err) {
            throw err;
        }
    }
}

function executionError(err, node) {
    var msg = err;
    if (node) {
        msg += `: ${node.start.line}:${node.start.col}`;
    }
    return new Error(msg);
}

function executeTopLevel(node) {
    switch (node.type) {
        case "comment":
            break;
        case "function_definition":
            defineFunction(node);
            break;
        case "return_statement":
            throw executionError("Return statement at top level", node);
        default:
            executeStatement(node);
    }
}

function defineFunction(node) {
    setFunction(node.name.value, node.parameters, node.body, node);
}

function executeStatement(node) {
    switch (node.type) {
        case "comment":
        case "description":
        case "category":
            break;
        case "var_assignment":
            executeAssignment(node);
            break;
        case "call_expression":
            executeFnCall(node);
            break;
        case "while_loop":
            executeWhileLoop(node);
            break;
        case "if_statement":
            executeIfStatement(node);
            break;
        case "for_loop":
            executeForLoop(node);
            break;
        case "indexed_assignment":
            executeIndexedAssignment(node);
            break;
        case "return_statement":
            executeReturnStatement(node);
            break;
        default:
            throw new Error(`Improper statement: ${node.type}`);
    }
}

function executeAssignment(node) {
    setVariable(node.var_name.value, evaluateExpression(node.value));
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
}

function executeIfStatement(node) {
    if (evaluateExpression(node.condition)) {
        executeCodeBlock(node.consequent);
    }

    // else clause can either be code block or another if statement (emulating elseif)
    else if (node.alternate.type === "if_statement") {
        executeStatement(node.alternate);
    } else {
        executeCodeBlock(node.alternate);
    }
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
}

function executeCodeBlock(body) {
    for (let i = 0; i < body.statements.length; i++) {
        executeStatement(body.statements[i]);
        if (stackTop().returnFlag) {
            break;
        }
    }
}

function executeIndexedAssignment(node) {
    var ary = evaluateExpression(node.subject);
    if (!Array.isArray(ary)) {
        executionError("Indexed assignment of non-array", node);
    }
    ary[node.index] = evaluateExpression(node.value);
}

function executeReturnStatement(node) {
    stackTop().returnValue = evaluateExpression(node.value);
    stackTop().returnFlag = true;
}

function evaluateExpression(node) {
    switch (node.type) {
        case "string_literal":
            return node.value;
        case "number_literal":
            return node.value;
        case "boolean_literal":
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
            defineFunction(node);
            break;
        default:
            throw executionError(`Unknown AST node type (${node.type})`, node);
    }
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
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
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

function resetStack(toFrame) {
    for (let i = 0; i < globalStack.length - 1; i++) {
        if (globalStack[i] === toFrame) {
            globalStack = globalStack.slice(0, i + 1);
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
        case "string_literal":
            decompiled += '"' + node.value + '"';
            break;
        case "number_literal":
            decompiled += node.value;
            break;
        case "boolean_literal":
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
    if (node.type != "call_expression") return false;
    for (let j = 0; j < node.arguments.length; j++) {
        var arg = node.arguments[i];
        if (
            ![
                "string_literal",
                "number_literal",
                "boolean_literal",
                "list_literal",
                "dictionary_literal",
            ].includes(arg.type)
        )
            return false;
    }
    return true;
}

export {
    initializeExecution,
    pushStackFrame,
    popStackFrame,
    addStackFrame,
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
};
