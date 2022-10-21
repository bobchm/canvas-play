import AccessMethod from "./access-method";
import { AccessType } from "../constants/access-types";
import { InputEvent } from "../../utils/input-events";

class TouchEnter extends AccessMethod {
    #currentTimeout = null;

    constructor(appManager) {
        super(appManager);
        this.doSelection = this.doSelection.bind(this);
    }

    getMethodType() {
        return AccessType.TouchEnter;
    }

    handleInput(eventType, eventData, scrObj) {
        if (!scrObj || !scrObj.isSelectable()) return;

        switch (eventType) {
            case InputEvent.ObjectMouseDown:
                var appManager = this.getAppManager();
                var t_o = appManager.getSetting("touchEnterHoldTime");
                if (t_o <= 0) {
                    this.doSelection(scrObj, false);
                }
                scrObj.highlight(
                    appManager.getSetting("touchEnterHighlightType")
                );
                this.#currentTimeout = setTimeout(
                    () => this.doSelection(scrObj, true),
                    t_o
                );
                break;
            case InputEvent.ObjectMouseUp:
            case InputEvent.ObjectMouseExit:
                if (this.#currentTimeout) {
                    clearTimeout(this.#currentTimeout);
                    this.#currentTimeout = null;
                }
                scrObj.unhighlight(
                    this.getAppManager().getSetting("touchEnterHighlightType")
                );
                break;
            default: // ignore the rest
        }
        return;
    }

    doSelection(scrObj, doUnhighlight) {
        this.#currentTimeout = null;
        if (doUnhighlight) {
            scrObj.unhighlight(
                this.getAppManager().getSetting("touchEnterHighlightType")
            );
        }
        scrObj.select();
    }
}

export default TouchEnter;
