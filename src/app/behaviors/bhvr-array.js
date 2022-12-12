import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";

function initArrayBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "arrayPop",
        function: behaviorPop,
        parameters: [{ type: PropertyValueType.None, name: "array" }],
        category: "array",
        description: "Pop and return the last item from the array",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayPush",
        function: behaviorPush,
        parameters: [
            { type: PropertyValueType.None, name: "array" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "array",
        description: "Push the value onto the end of the specified array.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayShift",
        function: behaviorShift,
        parameters: [{ type: PropertyValueType.None, name: "array" }],
        category: "array",
        description: "Shift and return the first item from the array",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayUnshift",
        function: behaviorUnshift,
        parameters: [
            { type: PropertyValueType.None, name: "array" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "array",
        description: "Push the value onto the front of the specified array.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayConcat",
        function: behaviorConcat,
        parameters: [
            { type: PropertyValueType.None, name: "ary1" },
            { type: PropertyValueType.None, name: "ary2" },
        ],
        category: "array",
        description: "Concatenate two arrays, returning the result.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayRemove",
        function: behaviorRemove,
        parameters: [
            { type: PropertyValueType.None, name: "ary" },
            { type: PropertyValueType.Num, name: "index" },
            { type: PropertyValueType.Num, name: "number" },
        ],
        category: "array",
        description:
            "Remove the specified range of items from an array, returning the result.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayCopyElements",
        function: behaviorCopyElements,
        parameters: [
            { type: PropertyValueType.None, name: "ary" },
            { type: PropertyValueType.Num, name: "index" },
            { type: PropertyValueType.Num, name: "number" },
        ],
        category: "array",
        description:
            "Copy elements of an array, returning a new array with the extracted elements.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arraySort",
        function: behaviorSort,
        parameters: [{ type: PropertyValueType.None, name: "ary" }],
        category: "array",
        description: "Sort the elements of an array in place.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "arrayReverse",
        function: behaviorReverse,
        parameters: [{ type: PropertyValueType.None, name: "ary" }],
        category: "array",
        description: "Reverse the elements of an array in place.",
    });
}

function behaviorPop(ary) {
    return ary.pop();
}

function behaviorPush(ary, value) {
    ary.push(value);
}

function behaviorShift(ary) {
    return ary.shift();
}

function behaviorUnshift(ary, value) {
    return ary.unshift(value);
}

function behaviorConcat(ary1, ary2) {
    return ary1.concat(ary2);
}

function behaviorRemove(ary, idx, num) {
    return ary.slice(idx, idx + num);
}

function behaviorCopyElements(ary, idx, num) {
    if (num <= 0 || idx < 0 || idx + num > ary.length) {
        throw new Error("Invalid arguments to extract.");
    }
    var rary = [];
    for (let i = idx; i < idx + num; i++) {
        rary.push(ary[i]);
    }
    return rary;
}

function behaviorSort(ary) {
    return ary.sort();
}

function behaviorReverse(ary) {
    return ary.reverse();
}

export { initArrayBehaviors };
