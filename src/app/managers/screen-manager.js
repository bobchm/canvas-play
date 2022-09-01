import {
    initCanvas,
    clearSelectionCallback,
    setSelectionCallback,
    setBackgroundColor,
} from "../../utils/canvas";

class ScreenManager {
    #canvas = null;
    #currentPage = null;
    #selectionCallback = null;

    constructor(screenSpec) {
        this.#createCanvas(screenSpec);
    }

    getCanvas() {
        return this.#canvas;
    }

    getCurrentPage() {
        return this.#currentPage;
    }

    setCurrentPage(page) {
        this.#currentPage = page;
    }

    clearSelectionCallback() {
        clearSelectionCallback(this.#canvas, this.#selectionCallback);
        this.#selectionCallback = null;
    }

    setSelectionCallback(callbk) {
        setSelectionCallback(this.#canvas, callbk);
        this.#selectionCallback = callbk;
    }

    setBackgroundColor(_bkgColor) {
        setBackgroundColor(this.#canvas, _bkgColor);
    }

    #createCanvas(screenSpec) {
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
    }
}

export default ScreenManager;
