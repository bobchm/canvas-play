import ContainerScreenObject from "./container-screen-object";

class PageScreenObject extends ContainerScreenObject {
    #children = [];
    #name;

    constructor(_screenMgr, _parent, _spec) {
        const {
            id = "",
            backgroundColor = "white",
            children = [],
            name = "",
        } = _spec;

        super(_parent, id);

        this.#name = name;
        _screenMgr.setBackgroundColor(backgroundColor);
        this.#children = this.createChildren(children);
    }
}

export default PageScreenObject;
