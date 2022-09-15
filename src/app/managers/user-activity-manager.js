import {
    getUser,
    getActivity,
    addActivity,
    deleteActivity,
    getPage,
    addPage,
    updatePage,
    deletePage,
} from "../../utils/dbaccess";

class UserActivityManager {
    #currentUserName = null;
    #currentUserId = null;
    #currentActivityId = null;

    #homePage = null;

    #pageHash;

    constructor() {
        // we will grab the page data associated with the userName in the future
        // right now, just initialize to having one blank page
        this.#pageHash = new Map();
    }

    async getCurrentUserInfo() {
        if (!this.#currentUserName)
            throw new Error("getCurrentUserInfo: no curren user");
        return await getUser(this.#currentUserName);
    }

    async setUser(userName) {
        var user = await getUser(userName);
        if (!user) {
            throw new Error(`Unknown user: ${userName}`);
        }
        this.#pageHash.clear();
        this.#currentUserName = userName;
        this.#currentUserId = user._id;
        this.#currentActivityId = null;
        return;
    }

    async setActivity(activityName) {
        var user = await getUser(this.#currentUserName);
        if (!user) {
            throw new Error(`Unknown user: ${this.#currentUserName}`);
        }
        for (let i = 0; i < user.activities.length; i++) {
            var activity = await getActivity(user.activities[i]);
            if (activity && activity.name === activityName) {
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
                break;
            }
        }
        return;
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

    async addUserPage(spec) {
        var id = await addPage(this.#currentActivityId, spec);
        if (id) {
            var page = await getPage(id);
            if (page) {
                this.#pageHash.set(spec.name, page);
            }
        }
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
}

export default UserActivityManager;
