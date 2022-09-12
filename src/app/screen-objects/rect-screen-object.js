import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { addRect } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";

class RectScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _spec) {
        const {
            left = 0,
            top = 0,
            width = 10,
            height = 10,
            fillColor = "white",
            lineColor = "black",
            opacity = 1.0,
        } = _spec;
        super(_screenMgr, _parent, _spec);
        this.setCanvasObj(
            addRect(_screenMgr.getCanvas(), {
                left: left,
                top: top,
                width: width,
                height: height,
                fill: fillColor,
                stroke: lineColor,
                opacity: opacity,
            })
        );
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.Rectangle,
            left: cobj.left,
            top: cobj.top,
            width: cobj.width,
            height: cobj.height,
            fillColor: cobj.fill,
            lineColor: cobj.stroke,
            opacity: cobj.opacity,
        };
        return { ...superSpec, ...spec };
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
            {
                type: PropertyType.Opacity,
                current: this.getCanvasObj().opacity * 100,
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
            case PropertyType.Opacity:
                var newValue = value / 100;
                this.getCanvasObj().set("opacity", newValue);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }
}

export default RectScreenObject;
