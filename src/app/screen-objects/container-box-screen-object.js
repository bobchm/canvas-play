import { PropertyType } from "../constants/property-types";
import ContainerScreenObject from "./container-screen-object";
import { getTextStyle, setTextStyle } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";

class ContainerBoxScreenObject extends ContainerScreenObject {
    #title;
    #shape;

    constructor(_screenMgr, _parent, _title, _shape, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#title = _title;
        this.#shape = _shape;
        this.setCanvasObj(
            _screenMgr.addContainerBox(
                this,
                _parent,
                _title,
                _shape,
                _spec.shapeSpec
            )
        );

        this.constructChildren(_screenMgr, _spec);
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.ContainerBox,
            title: this.#title,
            shape: this.#shape,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [
            {
                type: PropertyType.BoxTitle,
                current: this.#title,
            },
            {
                type: PropertyType.FillColor,
                current: this.getCanvasObj().fill,
            },
            {
                type: PropertyType.LineColor,
                current: this.getCanvasObj().stroke,
            },
            {
                type: PropertyType.TextColor,
                current: this.getCanvasObj().textColor,
            },
            {
                type: PropertyType.TextStyle,
                current: getTextStyle(this.getCanvasObj()),
            },
            {
                type: PropertyType.BoxShape,
                current: this.getCanvasObj().getShape(),
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
            case PropertyType.BoxTitle:
                this.#title = value;
                this.getCanvasObj().setTitle(screenMgr.getCanvas(), value);
                break;
            case PropertyType.FillColor:
                this.getCanvasObj().set("fill", value);
                break;
            case PropertyType.LineColor:
                this.getCanvasObj().set("stroke", value);
                break;
            case PropertyType.TextColor:
                this.getCanvasObj().setTextColor(value);
                break;
            case PropertyType.TextStyle:
                setTextStyle(this.getCanvasObj(), value);
                break;
            case PropertyType.BoxShape:
                this.#shape = value;
                this.getCanvasObj().setShape(value);
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
            case "title":
                return this.#title;
            case "fillColor":
                return this.getCanvasObj().fill;
            case "borderColor":
                return this.getCanvasObj().stroke;
            case "textColor":
                return this.getCanvasObj().textColor;
            case "textStyle":
                return this.getTextStyle();
            case "boxShape":
                return this.getCanvasObj().getShape();
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "title":
                this.setEditProperty(screenMgr, PropertyType.BoxTitle, value);
                break;
            case "fillColor":
                this.setEditProperty(screenMgr, PropertyType.FillColor, value);
                break;
            case "borderColor":
                this.setEditProperty(screenMgr, PropertyType.LineColor, value);
                break;
            case "textColor":
                this.setEditProperty(screenMgr, PropertyType.TextColor, value);
                break;
            case "textStyle":
                this.setEditProperty(screenMgr, PropertyType.TextStyle, value);
                break;
            case "boxShape":
                this.setEditProperty(screenMgr, PropertyType.BoxShape, value);
                break;
            case "opacity":
                this.setEditProperty(screenMgr, PropertyType.Opacity, value);
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }
}

export default ContainerBoxScreenObject;
