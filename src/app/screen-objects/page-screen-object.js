import { PropertyType } from "../constants/property-types";
import ContainerScreenObject from "./container-screen-object";

class PageScreenObject extends ContainerScreenObject {
    #children = [];
    #name;
    #backgroundColor;

    constructor(_screenMgr, _parent, _spec) {
        const {
            id = "",
            backgroundColor = "white",
            children = [],
            name = "",
        } = _spec;

        super(_parent, id);

        this.#name = name;
        this.#backgroundColor = backgroundColor;
        _screenMgr.setBackgroundColor(backgroundColor);
        this.#children = this.createChildren(children);
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
        console.log("get: ", this.#name);
        return superProps.concat(thisProps);
    }

    setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.BackgroundColor:
                this.#backgroundColor = value;
                screenMgr.setBackgroundColor(value);
                break;
            case PropertyType.Name:
                console.log("set: ", value);
                this.#name = value;
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }
}

export default PageScreenObject;
