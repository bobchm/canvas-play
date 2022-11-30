import UserActivityManager from "./user-activity-manager";
import ScreenManager from "./screen-manager";
import { BehaviorManager } from "../behaviors/behavior-behaviors";

class ApplicationManager {
    #userActivityManager;
    #screenManager;

    constructor(userName, screenSpec) {
        this.#userActivityManager = new UserActivityManager();
        this.#screenManager = new ScreenManager(screenSpec);
        BehaviorManager.initialize(this);
    }

    async setUser(userName) {
        return await this.#userActivityManager.setUser(userName);
    }

    async setActivity(activityName) {
        var activity = await this.#userActivityManager.setActivity(
            activityName
        );
        if (activity) {
            this.#screenManager.setupForActivity(activity);
        }
    }

    resizeScreenRegion(width, height) {
        this.#screenManager.resizeScreenRegion(width, height);
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

    getSetting(settingName) {
        return this.#userActivityManager.getSetting(settingName);
    }

    setSetting(settingName, value) {
        return this.#userActivityManager.setSetting(settingName, value);
    }

    getCanvas() {
        return this.#screenManager.getCanvas();
    }

    getAccessMethod() {
        return this.#screenManager.getAccessMethod();
    }

    setAccessMethod(method) {
        this.#screenManager.setAccessMethod(method);
    }
}

export default ApplicationManager;
