import { BehaviorManager } from "./behavior-behaviors";
import { BhvrDataType, BhvrCategory } from "./bhvr-base-types";
import { BhvrBase } from "./bhvr-base-types";
import { PropertyValueType } from "../constants/property-types";

function initNavigationBehaviors() {
    BehaviorManager.addBehavior(OpenPage);
}

export class OpenPage extends BhvrBase {
    static id = "BhvrOpenPage";
    static category = BhvrCategory.Navigation;
    static name = "Open Page";
    static description = "Open the specified page.";
    static argSpecs = [
        {
            name: "page",
            type: PropertyValueType.Page,
            description: "The page to be open.",
        },
    ];
    static rvalue = BhvrDataType.Boolean;
    #page = null;

    constructor(owner, args) {
        super(owner, OpenPage);
        this.#page = args.page;
    }

    toJSON() {
        var superSpec = super.toJSON();
        var spec = {
            page: this.#page,
        };
        return { ...superSpec, ...spec };
    }

    getDisplay() {
        var pgName = this.#page;
        if (!pgName) pgName = "";
        return "openPage(" + pgName + ")";
    }

    execute(appManager) {
        if (this.#page) {
            appManager.openPage(this.#page);
        }
    }
}

export { initNavigationBehaviors };
