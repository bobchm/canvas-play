import { PropertyType } from "../constants/property-types";
import ContainerScreenObject from "./container-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";

class PageScreenObject extends ContainerScreenObject {
    #name;
    #backgroundColor;

    constructor(_screenMgr, _parent, _spec) {
        const { backgroundColor = "white", name = "" } = _spec;

        super(_screenMgr, _parent, _spec);

        this.#name = name;
        this.#backgroundColor = backgroundColor;
        _screenMgr.setBackgroundColor(backgroundColor);
    }

    toJSON() {
        var superSpec = super.toJSON();
        var spec = {
            type: ScreenObjectType.Page,
            name: this.#name,
            backgroundColor: this.#backgroundColor,
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
        ];
        return superProps.concat(thisProps);
    }

    setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.BackgroundColor:
                this.#backgroundColor = value;
                screenMgr.setBackgroundColor(value);
                break;
            case PropertyType.Name:
                this.#name = value;
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }
}

export default PageScreenObject;
