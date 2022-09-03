import ScreenObject from "./screen-object";
import { addRect } from "../../utils/canvas";

class RectScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _spec) {
        const {
            id = "",
            left = 0,
            top = 0,
            width = 10,
            height = 10,
            fillColor = "white",
            lineColor = "black",
        } = _spec;
        super(_parent, id);
        this.setCanvasObj(
            addRect(_screenMgr.getCanvas(), {
                left: left,
                top: top,
                width: width,
                height: height,
                fill: fillColor,
                stroke: lineColor,
                selectable: false,
                hoverCursor: "default",
                // lockMovementX: true,
                // lockMovementY: true,
                // hasControls: false,
                // hasRotatingPoing: false,
            })
        );
    }
}

export default RectScreenObject;
