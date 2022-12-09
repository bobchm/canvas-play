import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";
import {
    getAngle,
    rotateTo,
    rotateBy,
    getPosition,
    moveTo,
    moveBy,
} from "../../utils/canvas";

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
    if (!page) return null;

    return page.getChildFromId(id);
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

function behaviorMoveTo(obj, x, y) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    moveTo(cnv, obj.getCanvasObj(), x, y);
}

function behaviorMoveBy(obj, dx, dy) {
    var cnv = BehaviorManager.appManager.getScreenManager().getCanvas();
    moveBy(cnv, obj.getCanvasObj(), dx, dy);
}

export { initScreenObjectBehaviors };
