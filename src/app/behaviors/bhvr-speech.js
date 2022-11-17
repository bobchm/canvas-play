import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";
import { ttsSpeak } from "../../utils/textToSpeech";

function initSpeechBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "speakText",
        function: behaviorSpeakText,
        parameters: [{ type: PropertyValueType.Text, name: "text" }],
        category: "speech",
        description: "Speak the specified text.",
    });
}

function behaviorSpeakText(text) {
    if (text && text.length) {
        ttsSpeak(text);
    }
}

export { initSpeechBehaviors };
