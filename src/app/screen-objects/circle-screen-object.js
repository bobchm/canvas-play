import ScreenObject from "./screen-object";
import { addCircle } from "../../utils/canvas";

class CircleScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _spec) {
        const {
            id = "",
            left = 0,
            top = 0,
            radius = 10,
            fillColor = "white",
            lineColor = "black",
        } = _spec;
        super(_parent, id);
        this.setCanvasObj(
            addCircle(_screenMgr.getCanvas(), {
                left: left,
                top: top,
                radius: radius,
                fill: fillColor,
                stroke: lineColor,
            })
        );
    }
}

export default CircleScreenObject;
