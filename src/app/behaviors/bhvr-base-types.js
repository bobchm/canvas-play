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
    static argSpecs;
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

    getArguments() {
        return null;
    }

    hasArguments() {
        return false;
    }

    makeArguments(values) {
        // deep copy argument descriptor
        var args = JSON.parse(JSON.stringify(this.argSpecs));
        var keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            var key = keys[i];
            for (let j = 0; j < args.length; j++) {
                var arg = args[j];
                if (key === arg.name) {
                    arg["value"] = values[key];
                    break;
                }
            }
        }
        return args;
    }

    toJSON() {
        return { id: this.cls.id };
    }

    execute(appManager) {}
}
