import { PropertyType } from "../constants/property-types";
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
                this.getCanvasObj().set("fill", value);
                break;
            case PropertyType.LineColor:
                this.getCanvasObj().set("stroke", value);
                break;
            default:
                super.setEditProperty(type, value);
        }
    }
}

export default CircleScreenObject;
