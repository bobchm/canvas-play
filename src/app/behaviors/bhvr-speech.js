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

    BehaviorManager.runSource(localFunctionDefinitions());
}

function behaviorSpeakText(text) {
    if (text && text.length) {
        ttsSpeak(text);
    }
    console.log(`speakText(${text})`);
}

function localFunctionDefinitions() {
    return `
    function speakLabel() {
        @category speech
        label = getObjectProperty(self, "label")
        if (label) {
            speakText(label)
        }
    }
    `;
}

export { initSpeechBehaviors };
