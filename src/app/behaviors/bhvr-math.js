import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";

function initMathBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "abs",
        function: behaviorAbs,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the absolute value of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "acos",
        function: behaviorAcos,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse cosine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "acosh",
        function: behaviorAcosh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse hyperbolic cosine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "asin",
        function: behaviorAsin,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse sine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "asinh",
        function: behaviorAsinh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse hyperbolic sine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "atan",
        function: behaviorAtan,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse tangent of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "atanh",
        function: behaviorAtanh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the inverse hyperbolic tangent of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "ceil",
        function: behaviorCeil,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return x rounded up to its nearest integer",
    });

    BehaviorManager.addBuiltInFunction({
        name: "cos",
        function: behaviorCos,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the cosine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "cosh",
        function: behaviorCosh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the hyperbolic cosine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "exp",
        function: behaviorExp,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the value of e to the x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "floor",
        function: behaviorFloor,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return x rounded down to its nearest integer",
    });

    BehaviorManager.addBuiltInFunction({
        name: "log",
        function: behaviorLog,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the natural logarithm of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "max",
        function: behaviorMax,
        parameters: [
            { type: PropertyValueType.Num, name: "x" },
            { type: PropertyValueType.Num, name: "y" },
        ],
        category: "math",
        description: "Return the maximum of x and y",
    });

    BehaviorManager.addBuiltInFunction({
        name: "min",
        function: behaviorMin,
        parameters: [
            { type: PropertyValueType.Num, name: "x" },
            { type: PropertyValueType.Num, name: "y" },
        ],
        category: "math",
        description: "Return the minimum of x and y",
    });

    BehaviorManager.addBuiltInFunction({
        name: "random",
        function: behaviorRandom,
        parameters: [],
        category: "math",
        description: "Return a random number between 0 and 1",
    });

    BehaviorManager.addBuiltInFunction({
        name: "randomRange",
        function: behaviorRandomRange,
        parameters: [
            { type: PropertyValueType.Num, name: "low" },
            { type: PropertyValueType.Num, name: "high" },
        ],
        category: "math",
        description: "Return a random number in the range between low and high",
    });

    BehaviorManager.addBuiltInFunction({
        name: "round",
        function: behaviorRound,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return x rounded to its nearest integer",
    });

    BehaviorManager.addBuiltInFunction({
        name: "sign",
        function: behaviorSign,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Returns -1 if x is negative, 0 if zero, 1 if positive",
    });

    BehaviorManager.addBuiltInFunction({
        name: "sin",
        function: behaviorSin,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the sine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "sinh",
        function: behaviorSinh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the hyperbolic sine of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "sqrt",
        function: behaviorSqrt,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the square root of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "tan",
        function: behaviorTan,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the tangent of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "tanh",
        function: behaviorTanh,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Return the hyperbolic tangent of x",
    });

    BehaviorManager.addBuiltInFunction({
        name: "trunc",
        function: behaviorTrunc,
        parameters: [{ type: PropertyValueType.Num, name: "x" }],
        category: "math",
        description: "Returns the integer part of x.",
    });
}

function behaviorAbs(x) {
    return Math.abs(x);
}

function behaviorAcos(x) {
    return Math.acos(x);
}

function behaviorAcosh(x) {
    return Math.acosh(x);
}

function behaviorAsin(x) {
    return Math.asin(x);
}

function behaviorAsinh(x) {
    return Math.asinh(x);
}

function behaviorAtan(x) {
    return Math.atan(x);
}

function behaviorAtanh(x) {
    return Math.atanh(x);
}

function behaviorCeil(x) {
    return Math.ceil(x);
}

function behaviorCos(x) {
    return Math.cos(x);
}

function behaviorCosh(x) {
    return Math.cosh(x);
}

function behaviorExp(x) {
    return Math.exp(x);
}

function behaviorFloor(x) {
    return Math.floor(x);
}

function behaviorLog(x) {
    return Math.log(x);
}

function behaviorMax(x, y) {
    return Math.max(x, y);
}

function behaviorMin(x, y) {
    return Math.min(x, y);
}

function behaviorRandom() {
    return Math.random();
}

function behaviorRandomRange(low, high) {
    if (low === high) return low;
    if (low > high) {
        var temp = low;
        low = high;
        high = temp;
    }
    return Math.random() * (high - low) + low;
}

function behaviorRound(x) {
    return Math.round(x);
}

function behaviorSign(x) {
    return Math.sign(x);
}

function behaviorSin(x) {
    return Math.sin(x);
}

function behaviorSinh(x) {
    return Math.sinh(x);
}

function behaviorSqrt(x) {
    return Math.sqrt(x);
}

function behaviorTan(x) {
    return Math.tan(x);
}

function behaviorTanh(x) {
    return Math.tanh(x);
}

function behaviorTrunc(x) {
    return Math.trunc(x);
}

export { initMathBehaviors };
