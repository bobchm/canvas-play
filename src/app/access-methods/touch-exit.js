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
            scrObj.highlight(appManager.getSetting("touchExitHighlightType"));
        }
    }

    handleInput(eventType, eventData, scrObj) {
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
                        this.getAppManager().getSetting(
                            "touchExitHighlightType"
                        )
                    );
                }
                break;
            case InputEvent.ObjectMouseUp:
                if (scrObj && scrObj.isSelectable()) {
                    this.doSelection(scrObj);
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

    doSelection(scrObj) {
        scrObj.unhighlight(
            this.getAppManager().getSetting("touchExitHighlightType")
        );
        scrObj.select();
    }
}

export default TouchExit;
