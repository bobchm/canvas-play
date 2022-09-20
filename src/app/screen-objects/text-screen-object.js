import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { addText } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";

class TextScreenObject extends ScreenObject {
    #text;

    constructor(_screenMgr, _parent, _text, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#text = _text;
        this.setCanvasObj(
            addText(_screenMgr.getCanvas(), _text, _spec.shapeSpec)
        );
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.Text,
            text: this.#text,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
        var thisProps = [
            {
                type: PropertyType.TextColor,
                current: this.getCanvasObj().fill,
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
            case PropertyType.TextColor:
                this.getCanvasObj().set("fill", value);
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

export default TextScreenObject;
