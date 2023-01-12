import { PropertyType } from "../constants/property-types";
import ContainerScreenObject from "./container-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";
import { BackgroundImageStyle } from "../../utils/canvas-constants";
import {
    BehaviorManager,
    blankBehavior,
} from "../behaviors/behavior-behaviors";

class PageScreenObject extends ContainerScreenObject {
    #name;
    #backgroundColor;
    #backgroundImage;
    #backgroundImageStyle;
    #openBehavior;
    #closeBehavior;
    #variables;

    constructor(_screenMgr, _parent, _spec) {
        const {
            backgroundColor = "white",
            backgroundImage = "",
            backgroundImageStyle = BackgroundImageStyle.Center,
            name = "",
            openBehavior = blankBehavior,
            closeBehavior = blankBehavior,
            variables = {},
        } = _spec;

        super(_screenMgr, _parent, _spec);

        this.#name = name;
        this.#backgroundColor = backgroundColor;
        this.#backgroundImage = backgroundImage;
        this.#backgroundImageStyle = backgroundImageStyle;
        this.#openBehavior = openBehavior;
        this.#closeBehavior = closeBehavior;
        this.#variables = variables;
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
            openBehavior: this.#openBehavior,
            closeBehavior: this.#closeBehavior,
            variables: this.#variables,
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
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
        if (selectedObjects.length === 1) {
            thisProps.push({
                type: PropertyType.OpenBehavior,
                current: this.#openBehavior,
            });
            thisProps.push({
                type: PropertyType.CloseBehavior,
                current: this.#closeBehavior,
            });
        }
        return thisProps.concat(superProps);
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
            case PropertyType.OpenBehavior:
                this.#openBehavior = value;
                BehaviorManager.popStackFrame();

                break;
            case PropertyType.CloseBehavior:
                this.#closeBehavior = value;
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        switch (type) {
            case "name":
                return this.#name;
            case "backgroundColor":
                return this.#backgroundColor;
            case "backgroundImage":
                return this.#backgroundImage;
            case "backgroundImageStyle":
                return this.#backgroundImageStyle;
            case "openBehavior":
                return this.#openBehavior;
            case "closeBehavior":
                return this.#closeBehavior;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "name":
                this.setEditProperty(screenMgr, PropertyType.Name, value);
                break;
            case "backgroundColor":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.BackgroundColor,
                    value
                );
                break;
            case "backgroundImage":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.BackgroundImageSource,
                    value
                );
                break;
            case "backgroundImageStyle":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.BackgroundImageStyle,
                    value
                );
                break;
            case "openBehavior":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.OpenBehavior,
                    value
                );
                break;
            case "closeBehavior":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.CloseBehavior,
                    value
                );
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }

    getName() {
        return this.#name;
    }

    isPage() {
        return true;
    }
}

export default PageScreenObject;
