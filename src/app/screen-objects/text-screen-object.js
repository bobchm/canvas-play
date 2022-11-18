import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";

class TextScreenObject extends ScreenObject {
    #text;

    constructor(_screenMgr, _parent, _text, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#text = _text;
        this.setCanvasObj(_screenMgr.addText(this, _text, _spec.shapeSpec));
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
                : "left", // left, center, right - value of textAlign field,
            fontSize: cobj.fontSize,
            fontFamily: cobj.fontFamily,
        };
    }

    setTextStyle(style) {
        var cobj = this.getCanvasObj();
        cobj.set(
            "fontWeight",
            style.styles.includes("bold") ? "bold" : "normal"
        );
        cobj.set(
            "fontStyle",
            style.styles.includes("italic") ? "italic" : "normal"
        );
        cobj.set("underline", style.styles.includes("underline"));
        cobj.set("linethrough", style.styles.includes("strikethrough"));
        cobj.set("textAlign", style.alignment);
        cobj.set("fontSize", style.fontSize);
        cobj.set("fontFamily", style.fontFamily);
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
                current: this.getTextStyle(),
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
                this.setTextStyle(value);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        switch (type) {
            case "text":
                return this.#text;
            case "backgroundColor":
                return this.getCanvasObj().textBackgroundColor;
            case "textColor":
                return this.getCanvasObj().fill;
            case "textStyle":
                return this.getTextStyle();
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "text":
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
