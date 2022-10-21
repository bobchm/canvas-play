import AccessMethod from "./access-method";
import { AccessType } from "../constants/access-types";
import { InputEvent } from "../../utils/input-events";

class MousePause extends AccessMethod {
    #currentTimeout = null;

    constructor(appManager) {
        super(appManager);
        this.doSelection = this.doSelection.bind(this);
    }

    getMethodType() {
        return AccessType.MousePause;
    }

    handleInput(eventType, eventData, scrObj) {
        if (!scrObj || !scrObj.isSelectable()) return;

        switch (eventType) {
            case InputEvent.ObjectMouseEnter:
                var appManager = this.getAppManager();
                scrObj.highlight(
                    appManager,
                    appManager.getSetting("mousePauseHighlightType")
                );
                this.#currentTimeout = setTimeout(
                    () => this.doSelection(appManager, scrObj),
                    appManager.getSetting("mousePauseHoldTime")
                );
                break;
            case InputEvent.ObjectMouseExit:
                if (this.#currentTimeout) {
                    clearTimeout(this.#currentTimeout);
                    this.#currentTimeout = null;
                }
                scrObj.unhighlight(
                    appManager,
                    appManager.getSetting("mousePauseHighlightType")
                );
                break;
            default: // ignore the rest
        }
        return;
    }

    doSelection(appManager, scrObj) {
        this.#currentTimeout = null;
        scrObj.unhighlight(
            appManager,
            appManager.getSetting("mousePauseHighlightType")
        );
        scrObj.select(appManager);
    }
}

export default MousePause;
