import { AccessType } from "../constants/access-types";
import TouchEnter from "../access-methods/touch-enter";
import TouchExit from "../access-methods/touch-exit";
import MousePause from "../access-methods/mouse-pause";

class AccessManager {
    #currentMethod = null;
    #appManager;

    constructor(appManager) {
        this.#appManager = appManager;
    }

    getMethod() {
        return this.#currentMethod ? this.#currentMethod.getMethodType() : null;
    }

    setMethod(method) {
        switch (method) {
            case AccessType.TouchEnter:
                this.#currentMethod = new TouchEnter(this.#appManager);
                break;
            case AccessType.TouchExit:
                this.#currentMethod = new TouchExit(this.#appManager);
                break;
            case AccessType.MousePause:
                this.#currentMethod = new MousePause(this.#appManager);
                break;
            default:
                this.#currentMethod = null;
        }
    }

    clearMethod() {
        this.#currentMethod = null;
    }

    handleInput(eventType, eventData, scrObj) {
        if (this.#currentMethod) {
            this.#currentMethod.handleInput(eventType, eventData, scrObj);
        }
    }
}

export default AccessManager;
