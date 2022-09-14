import PageScreenObject from "../screen-objects/page-screen-object";
import RectScreenObject from "../screen-objects/rect-screen-object";
import CircleScreenObject from "../screen-objects/circle-screen-object";

import {
    initCanvas,
    clearSelectionCallback,
    setSelectionCallback,
    getBackgroundColor,
    setBackgroundColor,
    clearMousedownCallback,
    setMousedownCallback,
    disableSelection,
    enableSelection,
    setSelectedObject,
    deleteSelectedObjects,
    refresh,
} from "../../utils/canvas";

import { ScreenObjectType } from "../constants/screen-object-types";

class ScreenManager {
    #canvas = null;
    #currentPage = null;
    #addObjectMode = null;
    #selectionCallback = null;
    #afterAddCallback = null;
    #modifiedCallback = null;
    #selectedObjects = null;

    constructor() {
        this.addObjectOnMousedown = this.addObjectOnMousedown.bind(this);
        this.scrMgrSelectionCallback = this.scrMgrSelectionCallback.bind(this);
        this.setModified = this.setModified.bind(this);
    }

    getCanvas() {
        return this.#canvas;
    }

    getCurrentPage() {
        return this.#currentPage;
    }

    openPage(pageSpec) {
        this.#currentPage = new PageScreenObject(this, null, pageSpec);
    }

    #canvasObjToScreen(scrObj, cnvObj) {
        if (scrObj.getCanvasObj(scrObj) === cnvObj) {
            return scrObj;
        }

        var children = scrObj.getChildren();
        for (let i = 0; i < children.length; i++) {
            var child = this.#canvasObjToScreen(children[i], cnvObj);
            if (child) {
                return child;
            }
        }
        return null;
    }

    #canvasObjsToScreen(page, cnvObjs) {
        var screenObjs = [];
        for (let i = 0; i < cnvObjs.length; i++) {
            var scrObj = this.#canvasObjToScreen(page, cnvObjs[i]);
            if (scrObj) {
                screenObjs.push(scrObj);
            }
        }
        return screenObjs;
    }

    scrMgrSelectionCallback(cnvObjs) {
        if (this.#selectionCallback && this.#currentPage) {
            var scrObjs = this.#canvasObjsToScreen(this.#currentPage, cnvObjs);
            this.#selectionCallback(scrObjs);
            this.#selectedObjects = scrObjs;
        }
    }

    clearSelectionCallback() {
        clearSelectionCallback(this.#canvas);
        this.#selectionCallback = null;
        this.#selectedObjects = null;
    }

    getSelectedObjects() {
        return this.#selectedObjects;
    }

    deleteSelectedObjects() {
        if (this.#currentPage && this.#selectedObjects) {
            for (let i = 0; i < this.#selectedObjects.length; i++) {
                var obj = this.#selectedObjects[i];
                this.#currentPage.removeChild(obj);
            }
            deleteSelectedObjects(this.#canvas);
            refresh(this.#canvas);
            if (this.#selectionCallback) this.#selectionCallback([]);
            this.#selectedObjects = [];
        }
    }

    setSelectionCallback(callbk) {
        setSelectionCallback(this.#canvas, this.scrMgrSelectionCallback);
        this.#selectionCallback = callbk;
    }

    setAfterAddCallback(callbk) {
        // this is only called after adding an object
        this.#afterAddCallback = callbk;
    }

    setModifiedCallback(callbk) {
        // this is only called on modifications on the canvas
        this.#modifiedCallback = callbk;
    }

    getBackgroundColor() {
        return getBackgroundColor(this.#canvas);
    }

    setBackgroundColor(_bkgColor) {
        setBackgroundColor(this.#canvas, _bkgColor);
        this.setModified();
    }

    setModified() {
        if (this.#modifiedCallback) {
            this.#modifiedCallback();
        }
    }

    createCanvas(screenSpec) {
        const { id, top, left, width, height, backgroundColor, doSelection } =
            screenSpec;

        this.#canvas = initCanvas(
            id,
            left,
            top,
            width,
            height,
            backgroundColor,
            doSelection,
            this.setModified
        );
        return this.#canvas;
    }
    addObjectOnMousedown(options) {
        var newObj = null;
        switch (this.#addObjectMode) {
            case "Rectangle":
                if (this.#currentPage) {
                    newObj = new RectScreenObject(this, this.#currentPage, {
                        left: options.pointer.x,
                        top: options.pointer.y,
                        width: 100,
                        height: 100,
                        fillColor: "red",
                    });
                    this.setModified();
                }
                break;
            case "Circle":
                if (this.#currentPage) {
                    newObj = new CircleScreenObject(this, this.#currentPage, {
                        left: options.pointer.x,
                        top: options.pointer.y,
                        radius: 50,
                        fillColor: "green",
                    });
                    this.setModified();
                }
                break;
            default:
                return;
        }
        if (newObj && newObj.getCanvasObj()) {
            if (this.#afterAddCallback) {
                this.#afterAddCallback(newObj);
            }
            setSelectedObject(this.#canvas, newObj.getCanvasObj());
        }
    }

    setAddObjectMode(mode) {
        if (this.#addObjectMode === mode) return;
        if (this.#addObjectMode === null) {
            // need to turn off the selection callback at the canvas level but don't
            // clear here
            clearSelectionCallback(this.#canvas);
        } else {
            clearMousedownCallback(this.#canvas, this.addObjectOnMousedown);
        }
        if (mode === null) {
            // restore any selection callback
            if (this.#selectionCallback) {
                setSelectionCallback(
                    this.#canvas,
                    this.scrMgrSelectionCallback
                );
            }
            enableSelection(this.#canvas);
            this.#addObjectMode = mode;
        } else {
            disableSelection(this.#canvas);
            this.#addObjectMode = mode;
            setMousedownCallback(this.#canvas, this.addObjectOnMousedown);
        }
    }

    setSelectionProperties(propType, value) {
        var objs = this.#selectedObjects;
        var anySet = false;
        if (!objs || objs.length <= 0) {
            var page = this.#currentPage;
            if (page) {
                objs = [page];
            }
        }
        if (objs) {
            for (let i = 0; i < objs.length; i++) {
                var obj = objs[i];
                anySet = true;
                obj.setEditProperty(this, propType, value);
            }
        }
        if (anySet) {
            refresh(this.#canvas);
        }
    }

    createFromSpec(parent, spec) {
        if (!spec) return null;

        switch (spec.type) {
            case ScreenObjectType.Page:
                return new PageScreenObject(this, parent, spec);
            case ScreenObjectType.Rectangle:
                return new RectScreenObject(this, parent, spec);
            case ScreenObjectType.Circle:
                return new CircleScreenObject(this, parent, spec);
            default:
                return null;
        }
    }
}

export default ScreenManager;
