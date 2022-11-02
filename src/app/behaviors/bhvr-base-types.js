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

    toJSON() {
        return { id: this.id };
    }

    execute(appManager) {}
}
