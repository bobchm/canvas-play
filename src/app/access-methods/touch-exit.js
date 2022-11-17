import AccessMethod from "./access-method";
import { AccessType } from "../constants/access-types";
import { InputEvent } from "../../utils/input-events";

class TouchExit extends AccessMethod {
    #isMouseDown = false;

    constructor(appManager) {
        super(appManager);
        this.doSelection = this.doSelection.bind(this);
    }

    getMethodType() {
        return AccessType.TouchExit;
    }

    highlightObject(scrObj) {
        if (scrObj && scrObj.isSelectable()) {
            var appManager = this.getAppManager();
            scrObj.highlight(
                appManager,
                appManager.getSetting("touchExitHighlightType")
            );
        }
    }

    handleInput(eventType, eventData, scrObj) {
        var appManager = this.getAppManager();
        switch (eventType) {
            case InputEvent.ObjectMouseEnter:
                if (this.#isMouseDown) {
                    this.highlightObject(scrObj);
                }
                break;
            case InputEvent.ObjectMouseDown:
                this.highlightObject(scrObj);
                break;
            case InputEvent.ObjectMouseExit:
                if (this.#isMouseDown && scrObj && scrObj.isSelectable()) {
                    scrObj.unhighlight(
                        appManager,
                        appManager.getSetting("touchExitHighlightType")
                    );
                }
                break;
            case InputEvent.ObjectMouseUp:
                if (scrObj && scrObj.isSelectable()) {
                    this.doSelection(appManager, scrObj);
                }
                break;

            case InputEvent.MouseDown:
                this.#isMouseDown = true;
                break;

            case InputEvent.MouseUp:
                this.#isMouseDown = false;
                break;
            default: // ignore the rest
        }
        return;
    }

    doSelection(appManager, scrObj) {
        scrObj.unhighlight(
            appManager,
            appManager.getSetting("touchExitHighlightType")
        );
        scrObj.select();
    }
}

export default TouchExit;
