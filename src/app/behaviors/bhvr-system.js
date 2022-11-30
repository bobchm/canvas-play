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

export { initSystemBehaviors };