class ScreenObject {
    #id;
    #parent = null;
    #canvasObj = null;

    constructor(_id, _parent) {
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
}

export default ScreenObject;
