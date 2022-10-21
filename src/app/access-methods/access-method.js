class AccessMethod {
    #appManager;

    constructor(appManager) {
        this.#appManager = appManager;
    }

    getMethodType() {
        return null;
    }

    getAppManager() {
        return this.#appManager;
    }

    handleInput(eventType, eventData, scrObj) {
        return;
    }
}

export default AccessMethod;
