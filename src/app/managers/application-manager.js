import UserActivityManager from "./user-activity-manager";
import ScreenManager from "./screen-manager";

class ApplicationManager {
    #userActivityManager;
    #screenManager;

    constructor(userName, screenSpec) {
        this.#userActivityManager = new UserActivityManager();
        this.#userActivityManager.setUser(userName);
        this.#screenManager = new ScreenManager(screenSpec);
    }

    getUserActivityManager() {
        return this.#userActivityManager;
    }

    getScreenManager() {
        return this.#screenManager;
    }

    openPage(pageName) {
        var pageSpec = this.#userActivityManager.getUserPage(pageName);
        if (pageSpec) {
            this.#screenManager.openPage(pageSpec);
        }
    }
}

export default ApplicationManager;
