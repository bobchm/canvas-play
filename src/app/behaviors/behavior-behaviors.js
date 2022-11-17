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
} from "../scripting/canvas-exec";

export const blankBehavior = { source: "", compiled: null };
export class BehaviorManager {
    static appManager;
    static initialize(appManager) {
        this.appManager = appManager;

        // set up the execution environment
        initializeExecution();
        pushStackFrame("_base_", [], []);

        // initialize the different categories of behaviors
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

    static async loadSource(fileName) {
        var r = await fetch(fileName);
        var source = await r.text();

        var ast = null;
        try {
            ast = simplify(parse(source));
        } catch (err) {
            alert(`Error loading behavior source file: ${fileName}`);
        }

        execute(ast);
    }

    static addBuiltInFunction(fnDef) {
        addBuiltInFunction(fnDef);
    }

    static executeFromObject(obj, ast) {
        pushStackFrame("executeFromObject", [], { self: obj });
        execute(ast);
        popStackFrame();
    }
}
