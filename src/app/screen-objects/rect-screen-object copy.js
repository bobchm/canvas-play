import ScreenObject from "./screen-object";
import { addRect } from "../../utils/canvas";

class RectScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _id, _spec) {
        const {
            _left = 0,
            _top = 0,
            _width = 10,
            _height = 10,
            _fillColor = "white",
            _lineColor = "black",
        } = _spec;
        super(_id, _parent);
        this.setCanvasObj(
            addRect(_screenMgr.getCanvas(), {
                left: _left,
                top: _top,
                width: _width,
                height: _height,
                fill: _fillColor,
                stroke: _lineColor,
            })
        );
    }
}

export default RectScreenObject;
