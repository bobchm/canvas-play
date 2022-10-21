import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import {
    getImageSource,
    setImageSource,
    setImageSourceA,
    isImageEmbedded,
    embedImage,
} from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";

class ImageScreenObject extends ScreenObject {
    constructor(_screenMgr, _parent, _spec) {
        super(_screenMgr, _parent, _spec);
        this.setCanvasObj(_screenMgr.addImage(this, _spec.shapeSpec));
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
                type: PropertyType.ImageSource,
                current: this.getSource(),
            },
            {
                type: PropertyType.EmbedImage,
                current: isImageEmbedded(this.getCanvasObj()),
            },
            {
                type: PropertyType.Opacity,
                current: this.getCanvasObj().opacity * 100,
            },
        ];
        return superProps.concat(thisProps);
    }

    async setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.ImageSource:
                await setImageSourceA(
                    screenMgr.getCanvas(),
                    this.getCanvasObj(),
                    value
                );
                break;
            case PropertyType.EmbedImage:
                embedImage(screenMgr.getCanvas(), this.getCanvasObj());
                break;
            case PropertyType.Opacity:
                var newValue = value / 100;
                this.getCanvasObj().set("opacity", newValue);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getSource() {
        return getImageSource(this.getCanvasObj());
    }

    setSource(screenMgr, source) {
        setImageSource(screenMgr.getCanvas(), this.getCanvasObj(), source);
    }
}

export default ImageScreenObject;
