import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { refresh } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";
import { ttsSpeak } from "../../utils/textToSpeech";
import { AccessHighlightType } from "../constants/access-types";

class SymbolButtonScreenObject extends ScreenObject {
    #label;
    #shape;

    constructor(_screenMgr, _parent, _label, _shape, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#label = _label;
        this.#shape = _shape;
        this.setCanvasObj(
            _screenMgr.addSymbolButton(this, _label, _shape, _spec.shapeSpec)
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

    getTextStyle() {
        var styles = [];
        var cobj = this.getCanvasObj();
        if (cobj.fontWeight === "bold") styles.push("bold");
        if (cobj.fontStyle === "italic") styles.push("italic");
        if (cobj.underline) styles.push("underline");
        if (cobj.linethrough) styles.push("strikethrough");
        return {
            styles: styles, // array of one or more of 'bold', 'italic', 'underline', 'strikethrough' - bold=fontWeight === 'bold', italic = fontStyle === 'italic'
            // underline = underline === true, strikethrough = linethrough === true
            alignment: ["left", "center", "right"].includes(cobj.textAlign)
                ? cobj.textAlign
                : "center", // left, center, right - value of textAlign field,
            fontSize: cobj.fontSize,
            fontFamily: cobj.fontFamily,
        };
    }

    setTextStyle(style) {
        var cobj = this.getCanvasObj();
        cobj.setFont({
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.styles.includes("bold") ? "bold" : "normal",
            fontStyle: style.styles.includes("italic") ? "italic" : "normal",
            underline: style.styles.includes("underline"),
            linethrough: style.styles.includes("strikethrough"),
            textAlign: style.alignment,
        });
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
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
                current: this.getTextStyle(),
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
        return superProps.concat(thisProps);
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
                this.setTextStyle(value);
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

    highlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                this.getCanvasObj().highlightShrink(appManager.getCanvas());
                break;
            case AccessHighlightType.Overlay:
                this.getCanvasObj().highlightShrink(appManager.getCanvas());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                this.getCanvasObj().highlightShrink(appManager.getCanvas());
                break;
            default:
        }
    }

    unhighlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                this.getCanvasObj().highlightUnshrink(appManager.getCanvas());
                break;
            case AccessHighlightType.Overlay:
                this.getCanvasObj().highlightUnshrink(appManager.getCanvas());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                this.getCanvasObj().highlightUnshrink(appManager.getCanvas());
                break;
            default:
        }
    }

    isSelectable() {
        return true;
    }

    select(appManager) {
        if (this.#label && this.#label.length > 0) {
            ttsSpeak(this.#label);
        }
    }
}

export default SymbolButtonScreenObject;
