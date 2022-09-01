import PageManager from "./page-manager";
import ScreenManager from "./screen-manager";

class ApplicationManager {
    #pageManager;
    #screenManager;

    constructor(userName, screenSpec) {
        this.#pageManager = new PageManager(userName);
        this.#screenManager = new ScreenManager(screenSpec);
    }

    getPageManager() {
        return this.#pageManager;
    }

    getScreenManager() {
        return this.#screenManager;
    }
}

export default ApplicationManager;
