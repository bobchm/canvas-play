import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { addText } from "../../utils/canvas";
import { ScreenObjectType } from "../constants/screen-object-types";
import { ForkLeft } from "@mui/icons-material";

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
            style.styles.includes("italic") ? "itealic" : "normal"
        );
        cobj.set("underline", style.styles.includes("underline"));
        cobj.set("linethrough", style.styles.includes("strikethrough"));
        cobj.set("textAlign", style.alignment);
        cobj.set("fontSize", style.fontSize);
        cobj.set("fontFamily", style.fontFamily);
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
        var thisProps = [
            {
                type: PropertyType.TextColor,
                current: this.getCanvasObj().fill,
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
            case PropertyType.TextStyle:
                this.setTextStyle(value);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }
}

export default TextScreenObject;
