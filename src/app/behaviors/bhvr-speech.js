import { BehaviorManager } from "./behavior-behaviors";
import { BhvrDataType, BhvrCategory } from "./bhvr-base-types";
import { BhvrBase } from "./bhvr-base-types";
import { PropertyType } from "../constants/property-types";
import { ttsSpeak } from "../../utils/textToSpeech";

function initSpeechBehaviors() {
    BehaviorManager.addBehavior(SpeakLabel);
}

class SpeakLabel extends BhvrBase {
    static id = "BhvrSpeakLabel";
    static category = BhvrCategory.Speech;
    static name = "Speak Label";
    static description = "Speak the label of this screen object.";
    static argSpecs = [];
    static rvalue = BhvrDataType.Boolean;

    constructor(owner) {
        super(owner, SpeakLabel);
    }

    toJSON() {}

    execute() {
        var owner = this.getOwner();
        if (owner) {
            var label = owner.getPropert(PropertyType.ButtonLabel);
            if (label) {
                ttsSpeak(label);
            }
        }
    }
}

export { initSpeechBehaviors };
