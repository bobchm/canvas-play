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
} from "../scripting/canvas-exec";

export const blankBehavior = { source: "", compiled: null };
export class BehaviorManager {
    static appManager;
    static initialize(appManager) {
        this.appManager = appManager;

        // set up the execution environment
        initializeExecution();
        pushStackFrame("_base_");

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

    static executeFromObject(obj, behavior) {
        if (behavior && behavior.compiled) {
            pushStackFrame("executeFromObject");
            setVariable("self", obj);
            execute(behavior.compiled);
            popStackFrame();
        }
    }

    static getSelf() {
        if (hasVariableValue("self")) {
            return getVariableValue("self", null);
        }
        return null;
    }
}
