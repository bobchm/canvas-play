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
} from "../../utils/canvas";
import { AppMode } from "../constants/app-modes";

class ScreenManager {
    #canvas = null;
    #currentPage = null;
    #selectionCallback = null;
    #modeChangeCallback = null;
    #appMode = AppMode.Select;

    constructor() {
        this.addObjectOnMousedown = this.addObjectOnMousedown.bind(this);
        this.scrMgrSelectionCallback = this.scrMgrSelectionCallback.bind(this);
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
        }
    }

    clearSelectionCallback() {
        clearSelectionCallback(this.#canvas);
        this.#selectionCallback = null;
    }

    setSelectionCallback(callbk) {
        setSelectionCallback(this.#canvas, this.scrMgrSelectionCallback);
        this.#selectionCallback = callbk;
    }

    setModeChangeCallback(callbk) {
        // this is only called on programmatic mode changes
        this.#modeChangeCallback = callbk;
    }

    getBackgroundColor() {
        return getBackgroundColor(this.#canvas);
    }

    setBackgroundColor(_bkgColor) {
        setBackgroundColor(this.#canvas, _bkgColor);
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
            doSelection
        );
        return this.#canvas;
    }

    getAppMode() {
        return this.#appMode;
    }

    addObjectOnMousedown(options) {
        var newObj = null;
        switch (this.#appMode.submode) {
            case "Rectangle":
                if (this.#currentPage) {
                    newObj = new RectScreenObject(this, this.#currentPage, {
                        left: options.pointer.x,
                        top: options.pointer.y,
                        width: 100,
                        height: 100,
                        fillColor: "red",
                    });
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
                }
                break;
            default:
                return;
        }
        if (newObj && newObj.getCanvasObj()) {
            this.setAppMode(AppMode.Select);
            if (this.#modeChangeCallback) {
                this.#modeChangeCallback(AppMode.Select);
            }
            setSelectedObject(this.#canvas, newObj.getCanvasObj());
        }
    }

    setAppMode(mode) {
        if (this.#appMode === mode) return;
        if (this.#appMode === AppMode.Select) {
            // need to turn off the selection callback at the canvas level but don't
            // clear here
            clearSelectionCallback(this.#canvas);
        } else {
            clearMousedownCallback(this.#canvas, this.addObjectOnMousedown);
        }
        if (mode === AppMode.Select) {
            // restore any selection callback
            if (this.#selectionCallback) {
                setSelectionCallback(
                    this.#canvas,
                    this.scrMgrSelectionCallback
                );
            }
            enableSelection(this.#canvas);
            this.#appMode = mode;
        } else {
            disableSelection(this.#canvas);
            this.#appMode = mode;
            setMousedownCallback(this.#canvas, this.addObjectOnMousedown);
        }
    }
}

export default ScreenManager;
