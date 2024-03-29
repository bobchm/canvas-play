import { PropertyType } from "../constants/property-types";
import SelectableScreenObject from "./selectable-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";

class RectScreenObject extends SelectableScreenObject {
    constructor(_screenMgr, _parent, _behavior, _spec) {
        super(_screenMgr, _parent, _behavior, _spec);
        this.setCanvasObj(_screenMgr.addRect(this, _parent, _spec.shapeSpec));
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.Rectangle,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
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
        return thisProps.concat(superProps);
    }

    async setEditProperty(screenMgr, type, value) {
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

    getProperty(type) {
        switch (type) {
            case "fillColor":
                return this.getCanvasObj().fill;
            case "borderColor":
                return this.getCanvasObj().stroke;
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "fillColor":
                this.setEditProperty(screenMgr, PropertyType.FillColor, value);
                break;
            case "borderColor":
                this.setEditProperty(screenMgr, PropertyType.LineColor, value);
                break;
            case "opacity":
                this.setEditProperty(screenMgr, PropertyType.Opacity, value);
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }
}

export default RectScreenObject;
