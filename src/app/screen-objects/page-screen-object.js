import { PropertyType } from "../constants/property-types";
import ContainerScreenObject from "./container-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";
import { BackgroundImageStyle } from "../../utils/canvas";

class PageScreenObject extends ContainerScreenObject {
    #name;
    #backgroundColor;
    #backgroundImage;
    #backgroundImageStyle;

    constructor(_screenMgr, _parent, _spec) {
        const {
            backgroundColor = "white",
            backgroundImage = "",
            backgroundImageStyle = BackgroundImageStyle.Center,
            name = "",
        } = _spec;

        super(_screenMgr, _parent, _spec);

        this.#name = name;
        this.#backgroundColor = backgroundColor;
        this.#backgroundImage = backgroundImage;
        this.#backgroundImageStyle = backgroundImageStyle;
        _screenMgr?.setBackgroundColor(backgroundColor);
        if (backgroundImage && backgroundImage.length) {
            _screenMgr?.setBackgroundImage(
                backgroundImage,
                backgroundImageStyle
            );
        }
    }

    toJSON() {
        var superSpec = super.toJSON();
        var spec = {
            type: ScreenObjectType.Page,
            name: this.#name,
            backgroundColor: this.#backgroundColor,
            backgroundImage: this.#backgroundImage,
            backgroundImageStyle: this.#backgroundImageStyle,
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties() {
        var superProps = super.getEditProperties();
        var thisProps = [
            {
                type: PropertyType.Name,
                current: this.#name,
            },
            {
                type: PropertyType.BackgroundColor,
                current: this.#backgroundColor,
            },
            {
                type: PropertyType.BackgroundImageSource,
                current: "",
            },
            {
                type: PropertyType.BackgroundImageStyle,
                current: this.#backgroundImageStyle,
            },
        ];
        return superProps.concat(thisProps);
    }

    async setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.BackgroundColor:
                this.#backgroundColor = value;
                screenMgr.setBackgroundColor(value);
                break;
            case PropertyType.Name:
                this.#name = value;
                break;
            case PropertyType.BackgroundImageSource:
                this.#backgroundImage = value;
                screenMgr.setBackgroundImage(value, this.#backgroundImageStyle);
                break;
            case PropertyType.BackgroundImageStyle:
                this.#backgroundImageStyle = value;
                screenMgr.setBackgroundImageStyle(value);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getName() {
        return this.#name;
    }
}

export default PageScreenObject;
