import { BehaviorManager } from "./behavior-behaviors";
import { BhvrDataType, BhvrCategory } from "./bhvr-base-types";
import { BhvrBase } from "./bhvr-base-types";
import { PropertyType, PropertyValueType } from "../constants/property-types";
import { ttsSpeak } from "../../utils/textToSpeech";

function initSpeechBehaviors() {
    BehaviorManager.addBehavior(SpeakLabel);
    BehaviorManager.addBehavior(SpeakText);
}

export class SpeakLabel extends BhvrBase {
    static id = "BhvrSpeakLabel";
    static category = BhvrCategory.Speech;
    static name = "Speak Label";
    static description = "Speak the label of this screen object.";
    static argSpecs = [];
    static rvalue = BhvrDataType.Boolean;

    constructor(owner, args) {
        super(owner, SpeakLabel);
    }

    getDisplay() {
        return "speakLabel()";
    }

    execute(appManager) {
        var owner = this.getOwner();
        if (owner) {
            var label = owner.getProperty(PropertyType.ButtonLabel);
            if (label) {
                ttsSpeak(label);
            }
        }
    }
}

export class SpeakText extends BhvrBase {
    static id = "BhvrSpeakText";
    static category = BhvrCategory.Speech;
    static name = "Speak Text";
    static description = "Speak the specified text.";
    static argSpecs = [
        {
            name: "text",
            type: PropertyValueType.Text,
            description: "The text to be spoken.",
        },
    ];
    static rvalue = BhvrDataType.Boolean;

    #text = null;

    constructor(owner, args) {
        super(owner, SpeakText);
        this.#text = args.text || "";
    }

    toJSON() {
        var superSpec = super.toJSON();
        var spec = {
            text: this.#text,
        };
        return { ...superSpec, ...spec };
    }

    getDisplay() {
        var text = this.#text;
        if (!text) text = "";
        return 'speakText("' + text + '")';
    }

    execute(appManager) {
        if (this.#text) {
            ttsSpeak(this.#text);
        }
    }
}

export { initSpeechBehaviors };
