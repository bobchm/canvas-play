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
}

export default ScreenObject;
