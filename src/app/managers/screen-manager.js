import { initCanvas } from "../../utils/canvas";

class ScreenManager {
    #canvas = null;
    #currentPage = null;

    constructor(screenSpec) {
        this.createCanvas(screenSpec);
    }

    getCanvas() {
        return this.canvas;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setCurrentPage(page) {
        this.currentPage = page;
    }

    #createCanvas(screenSpec) {
        const { id, top, left, width, height, backgroundColor, doSelection } =
            screenSpec;

        this.canvas = initCanvas(
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
