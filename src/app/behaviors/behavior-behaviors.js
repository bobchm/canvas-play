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

    static executeFromObject(obj, behavior) {
        if (behavior && behavior.compiled) {
            pushStackFrame("executeFromObject");
            setVariable("self", obj);

            try {
                execute(behavior.compiled);
            } catch (err) {
                alert(`Execution error in executeFromObject: ${err}`);
            }
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
