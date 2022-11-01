import { BhvrDataType } from "./bhvr-base-types";

export class Behavior {
    #returnType;
    #arguments;
    #description;

    getReturnType() {
        return this.#returnType;
    }

    getArguments() {
        return this.#arguments;
    }

    getDescription() {
        return this.#description;
    }

    execute(args) {
        return;
    }
}

export class BhvrOperator {}
