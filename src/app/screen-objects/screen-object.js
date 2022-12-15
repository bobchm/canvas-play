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

    isPage() {
        return false;
    }

    getPage() {
        var obj = this;
        while (obj) {
            if (obj.isPage()) {
                return obj;
            }
            obj = obj.getParent();
        }
        return null;
    }

    getChildFromId(id, doRecur) {
        if (!this.hasChildren()) return null;
        var children = this.getChildren();
        for (let i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.getId() === id) return child;
            if (doRecur) {
                child = child.getChildFromId(id, true);
                if (child) return child;
            }
        }
        return null;
    }

    getEditProperties(selectedObjects) {
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

    getProperty(type) {
        if (type === "id") {
            return this.#id;
        }
        return null;
    }

    setProperty(screenMgr, type, value) {
        if (type === "id") {
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

    select() {
        return;
    }

    async setProperty(screenMgr, property, value) {
        return;
    }
}

export default ScreenObject;
