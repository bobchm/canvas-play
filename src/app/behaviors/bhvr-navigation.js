import { BehaviorManager } from "./behavior-behaviors";
import { PropertyValueType } from "../constants/property-types";

function initNavigationBehaviors() {
    BehaviorManager.addBuiltInFunction({
        name: "openPage",
        function: behaviorOpenPage,
        parameters: [{ type: PropertyValueType.Page, name: "pageName" }],
        category: "navigation",
        description: "Open the specified page.",
    });
}

function behaviorOpenPage(pgName) {
    BehaviorManager.appManager.openPage(pgName);
}

export { initNavigationBehaviors };
