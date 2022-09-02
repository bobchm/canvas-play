import ScreenObject from "./screen-object";

class ContainerScreenObject extends ScreenObject {
    #children = [];

    addChild(_child) {
        this.#children.push(_child);
    }

    removeChild(_child) {
        this.#children = this.#children.filter((child) => child === _child);
    }

    createChildren(_specArray) {
        // not implemented yet
        return [];
    }

    getChildren() {
        return this.#children;
    }

    hasChildren() {
        return this.#children.length > 0;
    }
}

export default ContainerScreenObject;
