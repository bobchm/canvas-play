import { PropertyType } from "../constants/property-types";
import SelectableScreenObject from "./selectable-screen-object";
import {
    highlightShrink,
    unhighlightShrink,
    refresh,
    getTextStyle,
    setTextStyle,
} from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";
import { AccessHighlightType } from "../constants/access-types";

class SymbolButtonScreenObject extends SelectableScreenObject {
    #label;
    #shape;

    constructor(_screenMgr, _parent, _label, _shape, _behavior, _spec) {
        super(_screenMgr, _parent, _behavior, _spec);
        this.#label = _label;
        this.#shape = _shape;
        this.setCanvasObj(
            _screenMgr.addSymbolButton(
                this,
                _parent,
                _label,
                _shape,
                _spec.shapeSpec
            )
        );
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.SymbolButton,
            label: this.#label,
            shape: this.#shape,
            shapeSpec: cobj.toJSON(),
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [
            {
                type: PropertyType.ButtonLabel,
                current: this.#label,
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
                type: PropertyType.SymbolButtonImageSource,
                current: this.getCanvasObj().getImageSource(),
            },
            {
                type: PropertyType.EmbedImage,
                current: this.getCanvasObj().isImageEmbedded(),
            },
            {
                type: PropertyType.ButtonShape,
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
            case PropertyType.ButtonLabel:
                this.#label = value;
                this.getCanvasObj().setLabel(screenMgr.getCanvas(), value);
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
            case PropertyType.SymbolButtonImageSource:
                var cnv = screenMgr.getCanvas();
                await this.getCanvasObj().setImageSource(value, () =>
                    refresh(cnv)
                );
                break;
            case PropertyType.EmbedImage:
                this.getCanvasObj().embedImage(screenMgr.getCanvas());
                break;
            case PropertyType.ButtonShape:
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
            case "label":
                return this.#label;
            case "fillColor":
                return this.getCanvasObj().fill;
            case "borderColor":
                return this.getCanvasObj().stroke;
            case "textColor":
                return this.getCanvasObj().textColor;
            case "textStyle":
                return getTextStyle(this.getCanvasObj());
            case "imageSource":
                return this.getCanvasObj().getImageSource();
            case "buttonShape":
                return this.getCanvasObj().getShape();
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "label":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.ButtonLabel,
                    value
                );
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
            case "imageSource":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.SymbolButtonImageSource,
                    value
                );
                break;
            case "buttonShape":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.ButtonShape,
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

    highlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                highlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.Overlay:
                this.getCanvasObj().overlay(appManager.getCanvas());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                this.getCanvasObj().overlay(appManager.getCanvas());
                highlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            default:
        }
    }

    unhighlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                unhighlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.Overlay:
                this.getCanvasObj().unOverlay(appManager.getCanvas());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                this.getCanvasObj().unOverlay(appManager.getCanvas());
                unhighlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            default:
        }
    }
}

export default SymbolButtonScreenObject;
