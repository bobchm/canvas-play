import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";

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
        description: "Gethe currently active page.",
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
    return BehaviorManager.getScreenManager().getCurrentPage();
}

export { initScreenObjectBehaviors };
