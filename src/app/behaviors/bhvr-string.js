import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";

function initStringBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "getLength",
        function: behaviorLength,
        parameters: [{ type: PropertyValueType.None, name: "value" }],
        category: "string",
        description: "Get the length of the specified string or array.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "substring",
        function: behaviorSubstring,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Number, name: "start" },
            { type: PropertyValueType.Number, name: "end" },
        ],
        category: "string",
        description: "Return a string that is a substring of the original.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "replace",
        function: behaviorReplace,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "match" },
            { type: PropertyValueType.Text, name: "repl" },
        ],
        category: "string",
        description:
            "Replace the first match of 'match' in the specified string with 'repl'.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "replaceAll",
        function: behaviorReplaceAll,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "match" },
            { type: PropertyValueType.Text, name: "repl" },
        ],
        category: "string",
        description:
            "Replace the first match of 'match' in the specified string with 'repl'.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "toLowerCase",
        function: behaviorToLowerCase,
        parameters: [{ type: PropertyValueType.Text, name: "string" }],
        category: "string",
        description:
            "Return a version of the specified string converted to lowercase.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "toUpperCase",
        function: behaviorToUpperCase,
        parameters: [{ type: PropertyValueType.Text, name: "string" }],
        category: "string",
        description:
            "Return a version of the specified string converted to uppercase.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "trim",
        function: behaviorTrim,
        parameters: [{ type: PropertyValueType.Text, name: "string" }],
        category: "string",
        description:
            "Return a copy of the specified string with whitespace removed from the start or end of the string.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "trimStart",
        function: behaviorTrimStart,
        parameters: [{ type: PropertyValueType.Text, name: "string" }],
        category: "string",
        description:
            "Return a copy of the specified string with whitespace removed from the start or end of the string.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "trimEnd",
        function: behaviorTrimEnd,
        parameters: [{ type: PropertyValueType.Text, name: "string" }],
        category: "string",
        description:
            "Return a copy of the specified string with whitespace removed from the start or end of the string.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "split",
        function: behaviorSplit,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "splitChar" },
        ],
        category: "string",
        description:
            "Split the specified string on occurences of the character splitChar.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "stringIndexOf",
        function: behaviorIndexOf,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "substring" },
        ],
        category: "string",
        description:
            "Returns the index of the first occurence of substring in string.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "stringLastIndexOf",
        function: behaviorLastIndexOf,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "substring" },
        ],
        category: "string",
        description:
            "Returns the index of the last occurence of substring in string.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "startsWith",
        function: behaviorStartsWith,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "substring" },
        ],
        category: "string",
        description:
            "Returns true if string starts with substring, false otherwise.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "endsWith",
        function: behaviorEndsWith,
        parameters: [
            { type: PropertyValueType.Text, name: "string" },
            { type: PropertyValueType.Text, name: "substring" },
        ],
        category: "string",
        description:
            "Returns true if string ends with substring, false otherwise.",
    });
}

function behaviorLength(val) {
    return val.length;
}

function behaviorSubstring(string, start, end) {
    return string.substring(start, end);
}

function behaviorReplace(string, match, repl) {
    return string.replace(match, repl);
}

function behaviorReplaceAll(string, match, repl) {
    return string.replaceAll(match, repl);
}

function behaviorToUpperCase(string) {
    return string.toUpperCase();
}

function behaviorToLowerCase(string) {
    return string.toLowerCase();
}

function behaviorTrim(string) {
    return string.trim();
}

function behaviorTrimStart(string) {
    return string.trimStart();
}

function behaviorTrimEnd(string) {
    return string.trimEnd();
}

function behaviorSplit(string, splitChar) {
    return string.split(splitChar);
}

function behaviorIndexOf(string, subString) {
    return string.indexOf(subString);
}

function behaviorLastIndexOf(string, subString) {
    return string.lastIndexOf(subString);
}

function behaviorStartsWith(string, subString) {
    return string.startsWith(subString);
}

function behaviorEndsWith(string, subString) {
    return string.endsWith(subString);
}

export { initStringBehaviors };
