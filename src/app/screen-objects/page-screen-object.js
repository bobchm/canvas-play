import ContainerScreenObject from "./container-screen-object";

class PageScreenObject extends ContainerScreenObject {
    #children = [];
    #name;

    constructor(_screenMgr, _parent, _id, _name, _spec) {
        super(_id, _parent);
        this.#name = _name;

        const { _bkgColor = "white", _children = [] } = _spec;
        _screenMgr.setBackgroundColor(_bkgColor);
        this.#children = this.createChildren(_children);
    }
}

export default PageScreenObject;
