import { PropertyType } from "../constants/property-types";
class ScreenObject {
    #id;
    #parent = null;
    #canvasObj = null;

    constructor(_screenMgr, _parent, _spec) {
        var { id = "" } = _spec;
        if (!id || id.length === 0) {
            // we'll fix this at some point
            id = `${Date.now()}`;
        }
        this.#id = id;
        this.#parent = _parent;
        _parent?.addChild(this);
    }

    toJSON() {
        return { id: this.#id };
    }

    getId() {
        return this.#id;
    }

    getCanvasObj() {
        return this.#canvasObj;
    }

    setCanvasObj(cobj) {
        this.#canvasObj = cobj;
    }

    getParent() {
        return this.#parent;
    }

    setParent(_parent) {
        this.#parent = _parent;
    }

    hasChildren() {
        return false;
    }

    getChildren() {
        return [];
    }

    getEditProperties() {
        return [
            {
                type: PropertyType.Id,
                current: this.#id,
            },
        ];
    }

    async setEditProperty(screenMgr, type, value) {
        if (type === PropertyType.Id) {
            this.#id = value;
        }
    }

    highlight(appManager, highlightType) {
        return;
    }

    unhighlight(appManager, highlightType) {
        return;
    }

    isSelectable() {
        return false;
    }

    select(appManager) {
        return;
    }

    getProperty(property) {
        return null;
    }

    async setProperty(screenMgr, property, value) {
        return;
    }
}

export default ScreenObject;
