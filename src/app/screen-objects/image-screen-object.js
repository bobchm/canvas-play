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

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
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

    getProperty(type) {
        switch (type) {
            case "imageSource":
                return this.getSource();
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "imageSource":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.ImageSource,
                    value
                );
                break;
            case "opacity":
                this.setEditProperty(screenMgr, PropertyType.Opacity, value);
                break;
            default:
                super.setProperty(screenMgr, type, value);
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
