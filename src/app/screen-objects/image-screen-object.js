import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { addImage, setImageSource } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";

class ImageScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _spec) {
        super(_screenMgr, _parent, _spec);
        this.setCanvasObj(addImage(_screenMgr.getCanvas(), _spec.shapeSpec));
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.Image,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
        var thisProps = [
            {
                type: PropertyType.Opacity,
                current: this.getCanvasObj().opacity * 100,
            },
        ];
        return superProps.concat(thisProps);
    }

    setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.Opacity:
                var newValue = value / 100;
                this.getCanvasObj().set("opacity", newValue);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    setSource(screenMgr, source) {
        setImageSource(screenMgr.getCanvas(), this.getCanvasObj(), source);
    }
}

export default ImageScreenObject;
