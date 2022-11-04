import { jsonDeepCopy } from "../../utils/app-utils";

export const BhvrDataType = {
    Function: "function",
    Boolean: "boolean",
    Number: "number",
    String: "string",
    ScreenObject: "screen-object",
    Color: "color",
    Date: "date",
    DateTime: "date-time",
    FontFamily: "font-family",
    Image: "image",
};

export const BhvrCategory = {
    Navigation: "navigation",
    Speech: "speech",
};

export class BhvrBase {
    static id;
    static category;
    static name;
    static description;
    static argSpecs = [];
    static rvalue;
    #cls;
    #owner;

    constructor(owner, cls) {
        this.#cls = cls;
        this.#owner = owner;
    }

    getClass() {
        return this.#cls;
    }

    getOwner() {
        return this.#owner;
    }

    getDisplay() {
        return this.name;
    }

    hasArguments() {
        return this.cls.argSpecs && this.cls.argSpecs.length;
    }

    getArguments() {
        if (!this.hasArguments()) return null;

        // deep copy argument descriptor
        var args = jsonDeepCopy(this.cls.argSpecs);
        for (let i = 0; i < args.length; i++) {
            var arg = args[i];
            arg["value"] = this[arg.key];
        }
        return args;
    }

    setArguments(args) {
        if (this.hasArguments()) {
            var argSpecs = this.cls.argSpecs;
            for (let i = 0; i < argSpecs.length; i++) {
                var argSpec = argSpecs[i];
                this[argSpec.key] = args[argSpec.key];
            }
        }
    }

    toJSON() {
        var json = { id: this.cls.id };
        if (this.hasArguments()) {
            var argSpecs = this.cls.argSpecs;
            for (let i = 0; i < argSpecs.length; i++) {
                var argSpec = argSpecs[i];
                json[argSpec.name] = this[argSpec.key];
            }
        }
        return json;
    }

    execute(appManager) {}
}
