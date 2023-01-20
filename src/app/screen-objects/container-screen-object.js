import ScreenObject from "./screen-object";

class ContainerScreenObject extends ScreenObject {
    #children = [];

    constructor(_screenMgr, _parent, _spec) {
        const { children = [] } = _spec;
        super(_screenMgr, _parent, _spec);

        // create any children from child specs
        for (let i = 0; i < children.length; i++) {
            // have the screen manager create each of the children - parent/child relationships get handled by this process
            _screenMgr.createFromSpec(this, children[i]);
        }
    }

    toJSON() {
        var superSpec = super.toJSON();
        var children = [];
        for (let i = 0; i < this.#children.length; i++) {
            children.push(this.#children[i].toJSON());
        }

        return { ...superSpec, children: children };
    }

    addChild(_child) {
        if (!this.#children.includes(_child)) {
            this.#children.push(_child);
        }
    }

    removeChild(_child) {
        this.#children = this.#children.filter((child) => child !== _child);
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
