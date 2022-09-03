import { PropertyType } from "../constants/property-types";
class ScreenObject {
    #id;
    #parent = null;
    #canvasObj = null;

    constructor(_parent, _id) {
        if (!_id || _id.length === 0) {
            // we'll fix this at some point
            _id = `${Date.now()}`;
        }
        this.#id = _id;
        this.#parent = _parent;
        _parent?.addChild(this);
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

    setEditProperty(screenMgr, type, value) {
        if (type === PropertyType.Id) {
            this.#id = value;
        }
    }
}

export default ScreenObject;
