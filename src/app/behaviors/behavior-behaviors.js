import { initSystemBehaviors } from "./bhvr-system";
import { initScreenObjectBehaviors } from "./bhvr-screen-object";
import { initSpeechBehaviors } from "./bhvr-speech";
import { initNavigationBehaviors } from "./bhvr-navigation";
import {
    initializeExecution,
    pushStackFrame,
    addBuiltInFunction,
    parse,
    simplify,
    execute,
    popStackFrame,
    functionFromName,
    allFunctionNames,
    functionsForCategory,
    getVariableValue,
    hasVariableValue,
    setVariable,
    decompile,
    decompileNode,
    isSimpleFunctionCall,
    logStack,
} from "../scripting/canvas-exec";
import { PropertyValueType } from "../constants/property-types";
import { SymBtnShape } from "../../utils/symbol-button";

export const blankBehavior = { source: "", compiled: [] };

function getFnCatEntry(catList, cat) {
    for (let i = 0; i < catList.length; i++) {
        var entry = catList[i];
        if (entry.name === cat) return entry;
    }
    return null;
}

function stringCompare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
}

export class BehaviorManager {
    static appManager;
    static initialize(appManager) {
        this.appManager = appManager;

        // set up the execution environment
        initializeExecution();
        this.pushStackFrame("_base_");

        // initialize the different categories of behaviors
        initSystemBehaviors();
        initScreenObjectBehaviors();
        initSpeechBehaviors();
        initNavigationBehaviors();
    }

    static functionsForCategory(category) {
        return functionsForCategory(category);
    }

    static allFunctionNames() {
        return allFunctionNames();
    }

    static functionFromName(name) {
        return functionFromName(name);
    }

    static categorizedFunctionNames() {
        var allNames = allFunctionNames();
        var catNames = [];

        for (let i = 0; i < allNames.length; i++) {
            var fnName = allNames[i];
            var fnSpec = functionFromName(fnName);
            var fnCat = fnSpec.category || "none";
            var entry = getFnCatEntry(catNames, fnCat);
            if (!entry) {
                entry = { name: fnCat, children: [fnName] };
                catNames.push(entry);
            } else {
                entry.children.push(fnName);
            }
        }
        catNames.sort((a, b) => stringCompare(a.name, b.name));
        for (let i = 0; i < catNames.length; i++) {
            var item = catNames[i];
            item.children.sort((c1, c2) => stringCompare(c1, c2));
        }
        return catNames;
    }

    static parseSource(source) {
        return simplify(parse(source));
    }

    static runSource(source) {
        var ast = null;
        try {
            ast = simplify(parse(source));
        } catch (err) {
            alert(`Error parsing in runSource: ${err}`);
        }

        try {
            execute(ast);
        } catch (err) {
            alert(`Execution error in runSource: ${err}`);
        }
    }

    static addBuiltInFunction(fnDef) {
        addBuiltInFunction(fnDef);
    }

    static execute(behavior) {
        if (behavior && behavior.compiled) {
            try {
                execute(behavior.compiled);
            } catch (err) {
                alert(`Execution error in execute: ${err}`);
            }
        }
    }

    static executeWithStackFrame(frameName, behavior) {
        this.pushStackFrame(frameName);
        if (behavior && behavior.compiled) {
            try {
                execute(behavior.compiled);
            } catch (err) {
                alert(`Execution error in executeWithStackFrame: ${err}`);
            }
        }
    }

    static executeFromObject(obj, behavior) {
        if (behavior && behavior.compiled) {
            setVariable("self", obj);

            try {
                execute(behavior.compiled);
            } catch (err) {
                alert(`Execution error in executeFromObject: ${err}`);
            }
            setVariable("self", null);
        }
    }

    static popStackFrame() {
        popStackFrame();
        logStack(false);
    }

    static pushStackFrame(frameName) {
        pushStackFrame(frameName);
        logStack(false);
    }

    static getSelf() {
        if (hasVariableValue("self")) {
            return getVariableValue("self", null);
        }
        return null;
    }

    static isBehaviorSimple(behavior) {
        // does the behavior consist only of zero or more function calls with literal arguments?
        for (let i = 0; i < behavior.compiled.length; i++) {
            if (!isSimpleFunctionCall(behavior.compiled[i])) return false;
        }
        return true;
    }

    static sourceFromNode(node) {
        // generate source code from the specified node - this will only be done for "simple" code (lists
        //   of function calls) but we should probably do everything - this should be done in canvas-exec
        return decompileNode(node);
    }

    static behaviorFromCompiled(compiled) {
        // create a new behavior by taking the compiled nodes, generating source from them, then compiling
        // the source to align the new source with the compiled nodes
        try {
            var source = decompile(compiled);
            return { source: source, compiled: simplify(parse(source)) };
        } catch (err) {
            alert(`Error parsing in behaviorFromCompiled: ${err}`);
        }
    }

    static appendFunctionToBehavior(behavior, fnName) {
        // create a new behavior appending the named function with "default" parameters, and compiling the result
        var fnSpec = functionFromName(fnName);
        if (!fnSpec) {
            alert(`Unknown function in appendFunctionToBehavior: ${fnName}`);
            return null;
        }
        var newSource = behavior.source;
        if (newSource.length > 0) newSource += "\n";
        newSource += fnName + "(";
        for (let i = 0; i < fnSpec.params.length; i++) {
            if (i > 0) newSource += ", ";
            newSource += this.defaultParameterValue(fnSpec.params[i].type);
        }
        newSource += ")";
        try {
            return {
                source: newSource,
                compiled: simplify(parse(newSource)),
            };
        } catch (err) {
            alert(`Error parsing in appendFunctionToBehavior: ${err}`);
            return null;
        }
    }

    static defaultParameterValue(ptype) {
        switch (ptype) {
            case PropertyValueType.Percent:
                return 0;
            case PropertyValueType.ButtonShape:
                return SymBtnShape.RoundedRect;
            case PropertyValueType.Color:
                return '"white"';
            case PropertyValueType.ScreenObject:
                return "self";
            default:
                return '""';
        }
    }

    static hasFunctionArguments(behavior, fnIdx) {
        // does the behavior at fnIdx have function arguments?
        var node = behavior.compiled[fnIdx];
        if (node.type !== "call_expression") return false; // shouldn't happen
        return node.arguments.length > 0;
    }

    static getFunctionArgumentDescriptions(behavior, fnIdx) {
        // get description of function arguments for the editing UI
        var node = behavior.compiled[fnIdx];
        if (node.type !== "call_expression") return null; // shouldn't happen
        var fnDesc = functionFromName(node.fn_name.value);
        if (fnDesc === null || fnDesc.params.length !== node.arguments.length)
            return null;
        var argDescrs = [];
        for (let i = 0; i < node.arguments.length; i++) {
            argDescrs.push({
                name: fnDesc.params[i].name,
                valueType: fnDesc.params[i].type,
                value: node.arguments[i].value,
            });
        }
        return argDescrs;
    }

    static setFunctionArguments(behavior, fnIdx, args) {
        // the function specified by fnIdx is to have its arguments set to those specified by args
        //      set them, generate source from behavior, compile it, return a new behavior with the
        //      new source and compiled block
        var node = behavior.compiled[fnIdx];
        if (node.type !== "call_expression") return null; // shouldn't happen
        for (let i = 0; i < args.length; i++) {
            node.arguments[i].value = args[i].value;
        }
        try {
            var newSource = decompile(behavior.compiled);
            return {
                source: newSource,
                compiled: simplify(parse(newSource)),
            };
        } catch (err) {
            alert(`Error parsing in setFunctionArguments: ${err}`);
            return null;
        }
    }
}
