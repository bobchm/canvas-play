import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";
import {
    getAngle,
    rotateTo,
    rotateBy,
    getPosition,
    getDimensions,
    moveTo,
    moveBy,
    setDimensions,
    animatePosition,
    animateDimensions,
    animateAngle,
    animateOpacity,
} from "../../utils/canvas";

export const AnimationType = {
    Normal: "normal", // don't add field
    Bounce: "bounce", // easeOutBounce
    Elastic: "elastic", // easeOutElastic
    Smooth: "smooth", // easeOutExpo
};

export const AnimationTypes = [
    { name: "Normal", value: AnimationType.Normal },
    { name: "Bounce", value: AnimationType.Bounce },
    { name: "Elastic", value: AnimationType.Elastic },
    { name: "Smooth", value: AnimationType.Smooth },
];

function initScreenObjectBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "getObjectProperty",
        function: behaviorGetProperty,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Text, name: "property" },
        ],
        category: "screen object",
        description:
            "Get the value of an property of the specified screen object.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "setObjectProperty",
        function: behaviorSetProperty,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Text, name: "property" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "screen object",
        description:
            "Set the value of an propert of the specified screen object.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getObject",
        function: behaviorGetScreenObject,
        parameters: [{ type: PropertyValueType.Text, name: "id" }],
        category: "screen object",
        description: "Get screen object with the specified id.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getMyPage",
        function: behaviorGetMyPage,
        parameters: [],
        category: "screen object",
        description: "Get page that the calling screen object is on.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getCurrentPage",
        function: behaviorGetCurrentPage,
        parameters: [],
        category: "screen object",
        description: "Get the currently active page.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getAngle",
        function: behaviorGetAngle,
        parameters: [{ type: PropertyValueType.ScreenObject, name: "object" }],
        category: "screen object",
        description: "Get the angle of the specified object.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "rotateTo",
        function: behaviorRotateTo,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "angle" },
        ],
        category: "screen object",
        description: "Rotate the object to the specified angle.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "rotateBy",
        function: behaviorRotateBy,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "dAngle" },
        ],
        category: "screen object",
        description: "Rotate the object by the specified angle.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getPosition",
        function: behaviorGetPosition,
        parameters: [{ type: PropertyValueType.ScreenObject, name: "object" }],
        category: "screen object",
        description: "Get the position of the specified object.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getDimensions",
        function: behaviorGetDimensions,
        parameters: [{ type: PropertyValueType.ScreenObject, name: "object" }],
        category: "screen object",
        description:
            "Get the dimensions (x, y, width, height) of the specified object.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "setDimensions",
        function: behaviorSetDimensions,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "x" },
            { type: PropertyValueType.Number, name: "y" },
            { type: PropertyValueType.Number, name: "width" },
            { type: PropertyValueType.Number, name: "height" },
        ],
        category: "screen object",
        description: "Move the object to the specified position.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "moveTo",
        function: behaviorMoveTo,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "x" },
            { type: PropertyValueType.Number, name: "y" },
        ],
        category: "screen object",
        description: "Move the object to the specified position.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "moveBy",
        function: behaviorMoveBy,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "dx" },
            { type: PropertyValueType.Number, name: "dy" },
        ],
        category: "screen object",
        description: "Move the object by the specified x and y amounts.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "animatePosition",
        function: behaviorAnimatePosition,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "x" },
            { type: PropertyValueType.Number, name: "y" },
            { type: PropertyValueType.Number, name: "msecs" },
            { type: PropertyValueType.AnimationType, name: "type" },
        ],
        category: "screen object",
        description: "Animate the object to the specified position.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "animateDimensions",
        function: behaviorAnimateDimensions,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "x" },
            { type: PropertyValueType.Number, name: "y" },
            { type: PropertyValueType.Number, name: "width" },
            { type: PropertyValueType.Number, name: "height" },
            { type: PropertyValueType.Number, name: "msecs" },
            { type: PropertyValueType.AnimationType, name: "type" },
        ],
        category: "screen object",
        description: "Animate the object to have the specified dimensions.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "animateAngle",
        function: behaviorAnimateAngle,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "angle" },
            { type: PropertyValueType.Number, name: "msecs" },
            { type: PropertyValueType.AnimationType, name: "type" },
        ],
        category: "screen object",
        description: "Animate the object to the specified angle.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "animateOpacity",
        function: behaviorAnimateOpacity,
        parameters: [
            { type: PropertyValueType.ScreenObject, name: "object" },
            { type: PropertyValueType.Number, name: "opacity" },
            { type: PropertyValueType.Number, name: "msecs" },
            { type: PropertyValueType.AnimationType, name: "type" },
        ],
        category: "screen object",
        description: "Animate the object to the specified opacity.",
    });
}

function behaviorGetProperty(obj, attribute) {
    return obj.getProperty(attribute);
}

function behaviorSetProperty(obj, attribute, value) {
    return obj.setProperty(
        BehaviorManager.appManager.getScreenManager(),
        attribute,
        value
    );
}

function behaviorGetScreenObject(id) {
    var page = behaviorGetMyPage();
    if (!page) {
        console.log("getScreenObject-page is null");
        return null;
    }

    var obj = page.getChildFromId(id);
    console.log("getScreenObject-object");
    console.log(obj);
    return obj;
}

function behaviorGetMyPage() {
    var self = BehaviorManager.getSelf();
    if (!self) return null;

    return self.getPage();
}

function behaviorGetCurrentPage() {
    return BehaviorManager.appManager.getScreenManager().getCurrentPage();
}

function behaviorGetAngle(obj) {
    return getAngle(obj.getCanvasObj());
}

function behaviorRotateTo(obj, angle) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    rotateTo(cnv, obj.getCanvasObj(), angle);
}

function behaviorRotateBy(obj, dAngle) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    rotateBy(cnv, obj.getCanvasObj(), dAngle);
}

function behaviorGetPosition(obj) {
    return getPosition(obj.getCanvasObj());
}

function behaviorGetDimensions(obj) {
    return getDimensions(obj.getCanvasObj());
}

function behaviorSetDimensions(obj, x, y, width, height) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    setDimensions(cnv, obj.getCanvasObj(), x, y, width, height);
}

function behaviorMoveTo(obj, x, y) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    moveTo(cnv, obj.getCanvasObj(), x, y);
}

function behaviorMoveBy(obj, dx, dy) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    moveBy(cnv, obj.getCanvasObj(), dx, dy);
}

function behaviorAnimatePosition(obj, x, y, msecs, animType) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    animatePosition(cnv, obj.getCanvasObj(), x, y, msecs, animType);
}

function behaviorAnimateDimensions(obj, x, y, width, height, msecs, animType) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    animateDimensions(
        cnv,
        obj.getCanvasObj(),
        x,
        y,
        width,
        height,
        msecs,
        animType
    );
}

function behaviorAnimateAngle(obj, angle, msecs, animType) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    animateAngle(cnv, obj.getCanvasObj(), angle, msecs, animType);
}

function behaviorAnimateOpacity(obj, opacity, msecs, animType) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    animateOpacity(cnv, obj.getCanvasObj(), opacity / 100, msecs, animType);
}

export { initScreenObjectBehaviors };
