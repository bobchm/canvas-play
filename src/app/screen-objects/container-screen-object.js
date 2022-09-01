import ScreenObject from "./screen-object";

class ContainerScreenObject extends ScreenObject {
    #children = [];

    constructor(_parent, _id) {
        super(_id, _parent);
    }

    addChild(_child) {
        this.#children.push(_child);
    }

    removeChild(_child) {
        this.#children = this.#children.filter((child) => child === _child);
    }

    createChildren(_specArray) {
        // not implemented yet
    }
}

export default ContainerScreenObject;
