import ScreenObject from "./screen-object";
import { addRect } from "../../utils/canvas";

class RectScreenObject extends ScreenObject {
    constructor(_id, _left, _top, _width, _height, _color) {
        super(_id);
        addRect(cnv, {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            fill: _color,
        });
    }
}

export default RectScreenObject;
