import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";
import {
    ttsSetPitch,
    ttsSetRate,
    ttsSetVolume,
} from "../../utils/textToSpeech";

function initSystemBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "getSystemSetting",
        function: behaviorGetSetting,
        parameters: [{ type: PropertyValueType.Text, name: "setting" }],
        category: "system",
        description: "Get the value of the specified system setting.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "setSystemSetting",
        function: behaviorSetSetting,
        parameters: [
            { type: PropertyValueType.Text, name: "setting" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "system",
        description: "Set the value of the specified system setting.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "ActivityHasKV",
        function: behaviorHasActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns a boolean indicating whether or not the current activity has a key/value pair with the specificed key.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "ActivityGetKV",
        function: behaviorGetActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns the value of a key/value pair from the current activity.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "ActivityPutKV",
        function: behaviorPutActivityKV,
        parameters: [
            { type: PropertyValueType.Text, name: "key" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "system",
        description:
            "Set the value of a key/value pair from the current activity.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "ActivityRemoveKV",
        function: behaviorRemoveActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Remove the specified key/value pair from the current activity.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "PageHasKV",
        function: behaviorHasPageKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns a boolean indicating whether or not the current page has a key/value pair with the specificed key.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "PageGetKV",
        function: behaviorGetPageKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns the value of a key/value pair from the current page.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "PagePutKV",
        function: behaviorPutPageKV,
        parameters: [
            { type: PropertyValueType.Text, name: "key" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "system",
        description: "Set the value of a key/value pair from the current page.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "PageRemoveKV",
        function: behaviorRemovePageKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Remove the specified key/value pair from the current page.",
    });
}

function behaviorGetSetting(setting) {
    return BehaviorManager.appManager.getSetting(setting);
}

function behaviorSetSetting(setting, value) {
    BehaviorManager.appManager.setSetting(setting, value);

    // many settings need further action for them to take effect immediately
    switch (setting) {
        case "ttsVolume":
            ttsSetVolume(value);
            break;
        case "ttsRate":
            ttsSetRate(value);
            break;
        case "ttsPitch":
            ttsSetPitch(value);
            break;
        case "accessMethod":
            BehaviorManager.appManager.setAccessMethod(value);
            break;

        default:
    }
}

function behaviorHasActivityKV(key) {
    return BehaviorManager.appManager.getUserManager().hasActivityVariable(key);
}

function behaviorGetActivityKV(key) {
    return BehaviorManager.appManager.getUserManager().getActivityVariable(key);
}

function behaviorPutActivityKV(key, value) {
    return BehaviorManager.appManager
        .getUserManager()
        .putActivityVariable(key, value);
}

function behaviorRemoveActivityKV(key) {
    return BehaviorManager.appManager
        .getUserManager()
        .removeActivityVariable(key);
}

function behaviorHasPageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserManager()
        .hasPageVariable(currentPage, key);
}

function behaviorGetPageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserManager()
        .getPageVariable(currentPage, key);
}

function behaviorPutPageKV(key, value) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserManager()
        .putPageVariable(currentPage, key, value);
}

function behaviorRemovePageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserManager()
        .removePageVariable(currentPage, key);
}

export { initSystemBehaviors };
