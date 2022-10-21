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
                    appManager.getSetting("mousePauseHighlightType")
                );
                this.#currentTimeout = setTimeout(
                    () => this.doSelection(scrObj),
                    appManager.getSetting("mousePauseHoldTime")
                );
                break;
            case InputEvent.ObjectMouseExit:
                if (this.#currentTimeout) {
                    clearTimeout(this.#currentTimeout);
                    this.#currentTimeout = null;
                }
                scrObj.unhighlight(
                    this.getAppManager().getSetting("mousePauseHighlightType")
                );
                break;
            default: // ignore the rest
        }
        return;
    }

    doSelection(scrObj) {
        this.#currentTimeout = null;
        scrObj.unhighlight(
            this.getAppManager().getSetting("mousePauseHighlightType")
        );
        scrObj.select();
    }
}

export default MousePause;
