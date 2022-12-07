import {
    getUser,
    changeUserSettings,
    getActivity,
    addActivity,
    deleteActivity,
    updateActivity,
    getPage,
    addPage,
    updatePage,
    deletePage,
} from "../../utils/dbaccess";

import { delay } from "../../utils/app-utils";

import { settingsDefaults } from "./settings-defaults";

import { ttsInit } from "../../utils/textToSpeech";
import {
    BehaviorManager,
    blankBehavior,
} from "../behaviors/behavior-behaviors";
import { clearStackTo } from "../scripting/canvas-exec";

class UserActivityManager {
    #currentUserName = null;
    #currentUserId = null;
    #currentActivityId = null;

    #homePage = null;

    #settings = {};

    #inSettingsChange = false;
    #settingsAreModified = false;

    #pageHash;

    #activityVariables = {};
    #areActivityVariablesDirty = false;
    #dirtyPages = [];

    constructor() {
        // we will grab the page data associated with the userName in the future
        // right now, just initialize to having one blank page
        this.#pageHash = new Map();
    }

    async getCurrentUserInfo() {
        if (!this.#currentUserName)
            throw new Error("getCurrentUserInfo: no current user");
        return await getUser(this.#currentUserName);
    }

    async setUser(userName) {
        // doing retries here as this is typically the first access of the database and it needs to spin up sometimes
        var nRetries = 5;
        var user = null;
        while (nRetries-- > 0) {
            user = await getUser(userName);
            if (user) break;
            console.log("retrying ...");
            await delay(1000);
        }
        if (!user) {
            throw new Error(`Unknown user: ${userName}`);
        }

        this.initSettings(user);
        this.#pageHash.clear();
        this.#currentUserName = userName;
        this.#currentUserId = user._id;
        this.#currentActivityId = null;

        this.initServicesForUser();
        return;
    }

    async getActivityFromId(id) {
        return await getActivity(id);
    }

    async getActivity(activityName) {
        var user = await getUser(this.#currentUserName);
        if (!user) {
            throw new Error(`Unknown user: ${this.#currentUserName}`);
        }
        for (let i = 0; i < user.activities.length; i++) {
            var activity = await getActivity(user.activities[i]);
            if (activity && activity.name === activityName) {
                return activity;
            }
        }
        return;
    }

    async getCurrentActivity() {
        return await this.getActivityFromId(this.#currentActivityId);
    }

    async updateActivity(activity) {
        await updateActivity(activity);
    }

    async updateCurrentActivityBehavior(newBehavior) {
        var activity = await this.getCurrentActivity();
        if (activity) {
            activity.behavior = newBehavior;
            await updateActivity(activity);

            // need to clear the execution stack down to and including the activity level and return
            //   the new behavior and the page behavior
            clearStackTo("activity", true);
            BehaviorManager.executeWithStackFrame("activity", newBehavior);
        }
    }

    async setActivity(activityName) {
        var user = await getUser(this.#currentUserName);
        if (!user) {
            throw new Error(`Unknown user: ${this.#currentUserName}`);
        }
        for (let i = 0; i < user.activities.length; i++) {
            var activity = await getActivity(user.activities[i]);
            if (activity && activity.name === activityName) {
                this.clearActivity();
                this.#currentActivityId = activity._id;
                for (let j = 0; j < activity.pages.length; j++) {
                    var page = await getPage(activity.pages[j]);
                    if (page) {
                        this.#pageHash.set(page.name, page);
                        if (activity.home === page._id) {
                            this.#homePage = page.name;
                        }
                    }
                }
                BehaviorManager.executeWithStackFrame(
                    "activity",
                    activity.behavior || blankBehavior
                );
                return activity;
            }
        }
        return null;
    }

    async closeActivity() {
        if (this.#currentActivityId) {
            if (this.#areActivityVariablesDirty) {
                var activity = await this.getActivityFromId(
                    this.#currentActivityId
                );
                if (activity) {
                    activity.variables = this.#activityVariables;
                    await this.updateActivity(activity);
                }
            }

            for (let i = 0; i < this.#dirtyPages.length; i++) {
                var page = this.getUserPage(this.#dirtyPages[i]);
                if (page) {
                    await this.modifyUserPage(page);
                }
            }
        }
        this.clearActivity();
    }

    clearActivity() {
        this.#currentActivityId = null;
        this.#activityVariables = {};
        this.#areActivityVariablesDirty = false;
        this.#dirtyPages = [];
    }

    async addUserActivity(activity) {
        return await addActivity(this.#currentUserId, activity);
    }

    async deleteUserActivity(activityId) {
        if (activityId === this.#currentActivityId) {
            throw new Error("Cannot delete the current activity");
        }
        await deleteActivity(this.#currentUserId, activityId);
    }

    hasUserPage(name) {
        return this.getUserPage(name) !== undefined;
    }

    getUserPage(name) {
        return this.#pageHash.get(name);
    }

    getNumPages() {
        return this.#pageHash.size;
    }

    getNthPage(n) {
        var i = 0;
        for (const value of this.#pageHash.values()) {
            if (i++ === n) return value;
        }
        return null;
    }

    getHomePage() {
        if (!this.#homePage) return null;
        return this.getUserPage(this.#homePage);
    }

    initSettings(user) {
        if (user.hasOwnProperty("settings")) {
            this.#settings = user.settings;
        }

        for (const property in settingsDefaults) {
            if (!this.#settings.hasOwnProperty(property)) {
                this.#settings[property] = settingsDefaults[property];
            }
        }
    }

    initServicesForUser(doAccess) {
        // enable text-to-speech (other things will end up here)
        ttsInit(
            this.getSetting("ttsService"),
            this.getSetting("ttsVoice"),
            this.getSetting("ttsVolume"),
            this.getSetting("ttsRate"),
            this.getSetting("ttsPitch")
        );
    }

    getSetting(settingName) {
        if (!this.#settings.hasOwnProperty(settingName)) {
            throw new Error(`Unknown setting: ${settingName}`);
        }
        return this.#settings[settingName];
    }

    setSetting(settingName, value) {
        this.#settings[settingName] = value;
        this.#settingsAreModified = true;
        this.saveSettings();
    }

    openSettingsChange() {
        this.#inSettingsChange = true;
    }

    closeSettingsChange() {
        this.#inSettingsChange = false;
        this.saveSettings();
    }

    saveSettings() {
        if (!this.#inSettingsChange) {
            changeUserSettings(this.#currentUserId, this.#settings);
            this.#settingsAreModified = false;
        }
    }

    async addUserPage(spec) {
        var id = await addPage(this.#currentActivityId, spec);
        if (id) {
            var page = await getPage(id);
            if (page) {
                this.#pageHash.set(spec.name, page);
            }
        }
    }

    async addUserPageToActivity(actId, spec) {
        return await addPage(actId, spec);
    }

    async modifyUserPage(spec) {
        if (this.hasUserPage(spec.name)) {
            await updatePage(spec);
            this.#pageHash.set(spec.name, spec);
        }
    }

    async removeUserPage(name) {
        var spec = this.getUserPage(name);
        if (spec) {
            this.#pageHash.delete(name);
            await deletePage(this.#currentActivityId, spec._id);
        }
    }

    hasActivityVariable(varName) {
        return this.#activityVariables.hasOwnProperty(varName);
    }

    getActivityVariable(varName) {
        if (!this.hasActivityVariable(varName)) return null;
        return this.#activityVariables[varName];
    }

    puttActivityVariable(varName, value) {
        if (this.hasActivityVariable(varName)) {
            this.#activityVariables[varName] = value;
        }
    }

    removeActivityVariable(varName) {
        if (this.hasActivityVariable(varName)) {
            delete this.#activityVariables[varName];
        }
    }

    hasPageVariable(pageName, varName) {
        var page = this.getUserPage(pageName);
        if (page) {
            return page.variables.hasOwnProperty(varName);
        }
        return false;
    }

    getPageVariable(pageName, varName) {
        var page = this.getUserPage(pageName);
        if (page) {
            return page.variables[varName];
        }
        return null;
    }

    putPageVariable(pageName, varName, value) {
        var page = this.getUserPage(pageName);
        if (page) {
            page.variables[varName] = value;
        }
    }

    removePageVariable(pageName, varName) {
        var page = this.getUserPage(pageName);
        if (page) {
            delete page.variables[varName];
        }
    }
}

export default UserActivityManager;
