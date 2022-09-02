import PageScreenObject from "../screen-objects/page-screen-object";
import {
    initCanvas,
    clearSelectionCallback,
    setSelectionCallback,
    setBackgroundColor,
} from "../../utils/canvas";

function selectionCallbackHelper(cnvObjs, scrMgr) {
    scrMgr.scrMgrSelectionCallback(cnvObjs);
}

class ScreenManager {
    #canvas = null;
    #currentPage = null;
    #selectionCallback = null;

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
        setSelectionCallback(this.#canvas, selectionCallbackHelper, this);
        this.#selectionCallback = callbk;
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
}

export default ScreenManager;
