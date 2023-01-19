import { PropertyType } from "../constants/property-types";
import SelectableScreenObject from "./selectable-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";
import { getTextStyle, setTextStyle } from "../../utils/canvas";

class TextScreenObject extends SelectableScreenObject {
    #text;

    constructor(_screenMgr, _parent, _text, _behavior, _spec) {
        super(_screenMgr, _parent, _behavior, _spec);
        this.setCanvasObj(
            _screenMgr.addText(this, _parent, _text, _spec.shapeSpec)
        );
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.Text,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    setText(text) {
        var cobj = this.getCanvasObj();
        cobj.set("text", text);
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [
            {
                type: PropertyType.TextColor,
                current: this.getCanvasObj().fill,
            },
            {
                type: PropertyType.BackgroundColor,
                current: this.getCanvasObj().textBackgroundColor,
            },
            {
                type: PropertyType.TextStyle,
                current: getTextStyle(this.getCanvasObj()),
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
            case PropertyType.TextColor:
                this.getCanvasObj().set("fill", value);
                this.getCanvasObj().set("stroke", value);
                break;
            case PropertyType.BackgroundColor:
                this.getCanvasObj().set("textBackgroundColor", value);
                break;
            case PropertyType.Opacity:
                var newValue = value / 100;
                this.getCanvasObj().set("opacity", newValue);
                break;
            case PropertyType.TextStyle:
                setTextStyle(this.getCanvasObj(), value);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        switch (type) {
            case "text":
            case "label":
                var cnvObj = this.getCanvasObj();
                return cnvObj.text;
            case "backgroundColor":
                return this.getCanvasObj().textBackgroundColor;
            case "textColor":
                return this.getCanvasObj().fill;
            case "textStyle":
                return getTextStyle(this.getCanvasObj());
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "text":
            case "label":
                this.setText(value);
                break;
            case "backgroundColor":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.BackgroundColor,
                    value
                );
                break;
            case "textColor":
                this.setEditProperty(screenMgr, PropertyType.TextColor, value);
                break;
            case "textStyle":
                this.setEditProperty(screenMgr, PropertyType.TextStyle, value);
                break;
            case "opacity":
                this.setEditProperty(screenMgr, PropertyType.Opacity, value);
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }
}

export default TextScreenObject;
