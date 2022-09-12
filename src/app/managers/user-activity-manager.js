import {
    getAllUsers,
    getUser,
    addUser,
    deleteUser,
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

    #pageHash;

    constructor() {
        // we will grab the page data associated with the userName in the future
        // right now, just initialize to having one blank page
        this.#pageHash = new Map();
    }

    getCurrentUserInfo() {
        if (!this.#currentUserName) return null;

        return getUser(this.#currentUserName);
    }

    setUser(userName) {
        var user = getUser(userName);
        if (!user) {
            throw new Error(`Unknown user: ${userName}`);
        }
        this.#pageHash.clear();
        this.#currentUserName = userName;
        this.#currentUserId = user._id;
        this.#currentActivityId = null;
    }

    setActivity(activityName) {
        var user = getUser(this.#currentUserName);
        if (!user) {
            throw new Error(`Unknown user: ${this.#currentUserName}`);
        }
        for (let i = 0; i < user.activities.length; i++) {
            var activity = getActivity(user.activities[i]);
            if (activity && activity.name === activityName) {
                this.#currentActivityId = activity._id;
                for (let j = 0; j < activity.pages.length; j++) {
                    var page = getPage(activity.pages[i]);
                    if (page) {
                        this.#pageHash.set(page.name, page);
                    }
                }
                return;
            }
        }
        throw new Error(`Unknown user: ${this.#currentUserName}`);
    }

    addUserActivity(activity) {
        return addActivity(this.#currentUserId, activity);
    }

    deleteUserActivity(activityId) {
        if (activityId === this.#currentActivityId) {
            throw new Error("Cannot delete the current activity");
        }
        deleteActivity(this.#currentUserId, activityId);
    }

    hasUserPage(name) {
        return this.getUserPage(name) !== undefined;
    }

    getUserPage(name) {
        return this.#pageHash.get(name);
    }

    addUserPage(spec) {
        var id = addPage(this.#currentActivityId, spec);
        if (id) {
            this.#pageHash.set(spec.name, getPage(id));
        }
    }

    modifyUserPage(spec) {
        if (this.hasPage(spec.name)) {
            updatePage(spec);
            this.#pageHash.set(spec.name, spec);
        }
    }

    removePage(name) {
        var spec = this.getUserPage(name);
        if (spec) {
            deletePage(this.#currentActivityId, spec._id);
            this.#pageHash.delete(name);
        }
    }
}

export default UserActivityManager;
