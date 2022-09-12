import UserActivityManager from "./user-activity-manager";
import ScreenManager from "./screen-manager";

class ApplicationManager {
    #userActivityManager;
    #screenManager;

    constructor(userName, screenSpec) {
        this.#userActivityManager = new UserActivityManager();
        this.#screenManager = new ScreenManager(screenSpec);
    }

    async setUser(userName) {
        return await this.#userActivityManager.setUser(userName);
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
            this.#screenManager.openPage(pageSpec.content);
        }
    }
}

export default ApplicationManager;
