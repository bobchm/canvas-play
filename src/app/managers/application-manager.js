import PageManager from "./page-manager";
import ScreenManager from "./screen-manager";

class ApplicationManager {
    #pageManager;
    #screenManager;

    constructor(userName, screenSpec) {
        console.log("appManager constructor");
        this.#pageManager = new PageManager(userName);
        this.#screenManager = new ScreenManager(screenSpec);
    }

    getPageManager() {
        return this.#pageManager;
    }

    getScreenManager() {
        return this.#screenManager;
    }

    openPage(pageName) {
        var pageSpec = this.#pageManager.getPage(pageName);
        if (pageSpec) {
            this.#screenManager.openPage(pageSpec);
        }
    }
}

export default ApplicationManager;
