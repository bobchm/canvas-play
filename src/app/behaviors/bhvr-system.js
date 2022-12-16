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
        name: "debugAlert",
        function: behaviorDebugAlert,
        parameters: [{ type: PropertyValueType.Text, name: "alert" }],
        category: "system",
        description: "Pop up an inaccessble alert.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getScreenWidth",
        function: behaviorGetScreenWidth,
        parameters: [],
        category: "system",
        description: "Get the width of the (virtual) screen.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "getScreenHeight",
        function: behaviorGetScreenHeight,
        parameters: [],
        category: "system",
        description: "Get the width of the (virtual) screen.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "activityHasKV",
        function: behaviorHasActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns a boolean indicating whether or not the current activity has a key/value pair with the specificed key.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "activityGetKV",
        function: behaviorGetActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns the value of a key/value pair from the current activity.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "activityPutKV",
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
        name: "activityRemoveKV",
        function: behaviorRemoveActivityKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Remove the specified key/value pair from the current activity.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "pageHasKV",
        function: behaviorHasPageKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns a boolean indicating whether or not the current page has a key/value pair with the specificed key.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "pageGetKV",
        function: behaviorGetPageKV,
        parameters: [{ type: PropertyValueType.Text, name: "key" }],
        category: "system",
        description:
            "Returns the value of a key/value pair from the current page.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "pagePutKV",
        function: behaviorPutPageKV,
        parameters: [
            { type: PropertyValueType.Text, name: "key" },
            { type: PropertyValueType.None, name: "value" },
        ],
        category: "system",
        description: "Set the value of a key/value pair from the current page.",
    });

    BehaviorManager.addBuiltInFunction({
        name: "pageRemoveKV",
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

function behaviorDebugAlert(txt) {
    alert(txt);
    return txt;
}

function behaviorGetScreenHeight() {
    var sz = BehaviorManager.appManager.getScreenManager().getVScreenSize();
    return sz.height;
}

function behaviorGetScreenWidth() {
    var sz = BehaviorManager.appManager.getScreenManager().getVScreenSize();
    return sz.width;
}

function behaviorHasActivityKV(key) {
    return BehaviorManager.appManager
        .getUserActivityManager()
        .hasActivityVariable(key);
}

function behaviorGetActivityKV(key) {
    return BehaviorManager.appManager
        .getUserActivityManager()
        .getActivityVariable(key);
}

function behaviorPutActivityKV(key, value) {
    return BehaviorManager.appManager
        .getUserActivityManager()
        .putActivityVariable(key, value);
}

function behaviorRemoveActivityKV(key) {
    return BehaviorManager.appManager
        .getUserActivityManager()
        .removeActivityVariable(key);
}

function behaviorHasPageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserActivityManager()
        .hasPageVariable(currentPage, key);
}

function behaviorGetPageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserActivityManager()
        .getPageVariable(currentPage, key);
}

function behaviorPutPageKV(key, value) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserActivityManager()
        .putPageVariable(currentPage, key, value);
}

function behaviorRemovePageKV(key) {
    var currentPage = BehaviorManager.appManager
        .getScreenManager()
        .getCurrentPageName();
    return BehaviorManager.appManager
        .getUserActivityManager()
        .removePageVariable(currentPage, key);
}

export { initSystemBehaviors };
