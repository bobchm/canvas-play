import { PropertyType } from "../constants/property-types";
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
            })
        );
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
        var thisProps = [
            {
                type: PropertyType.FillColor,
                current: this.getCanvasObj().fill,
            },
            {
                type: PropertyType.LineColor,
                current: this.getCanvasObj().stroke,
            },
        ];
        return superProps.concat(thisProps);
    }

    setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.FillColor:
                this.getCanvasObj().fill = value;
                break;
            case PropertyType.LineColor:
                this.getCanvasObj().stroke = value;
                break;
            default:
                super.setEditProperty(type, value);
        }
    }
}

export default RectScreenObject;
