import contentURL from "./contentURL";

// get all users
async function getAllUsers() {
    const response = await fetch(contentURL("user/")).catch((error) => {
        console.log(error);
        return null;
    });

    if (!response.ok) {
        console.log(`An error occured in getAllUsers: ${response.statusText}`);
        return null;
    }

    return await response.json();
}

// get a single user based on username
async function getUser(username) {
    const response = await fetch(contentURL(`user/${username}`)).catch(
        (error) => {
            console.log(error);
            return null;
        }
    );

    if (!response.ok) {
        console.log(`An error has occured in getUser: ${response.statusText}`);
        return null;
    }

    return response.json();
}

// get a single user based on username
async function getUserFromId(id) {
    const response = await fetch(contentURL(`userid/${id}`)).catch((error) => {
        console.log(error);
        return null;
    });

    if (!response.ok) {
        console.log(
            `An error has occured in getUserFromId: ${response.statusText}`
        );
        return null;
    }

    return response.json();
}

// add user to the database from object
async function addUser(user) {
    const response = await fetch(contentURL("user/add"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    }).catch((error) => {
        console.log(error);
        return null;
    });

    if (!response.ok) {
        console.log(`An error has occured in addUser: ${response.statusText}`);
        return null;
    } else {
        var json = await response.json();
        return json.ops[0];
    }
}

async function changeUserSettings(userid, settings) {
    var user = await getUserFromId(userid);
    if (!user) {
        throw new Error("Unknown user in changeUserSettings");
    }
    user.settings = settings;
    await DBUpdateUser(user);
}

// update user based on object
async function DBUpdateUser(user) {
    const response = await fetch(contentURL(`user/update/${user._id}`), {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        },
    }).catch((error) => {
        console.log(error);
        return;
    });

    if (!response.ok) {
        console.log(
            `An error has occured in DBUpdateUser: ${response.statusText}`
        );
        return null;
    }
}

// delete a user from MongoDB based on id
async function DBDeleteUser(id) {
    const response = await fetch(contentURL(`user/${id}`), {
        method: "DELETE",
    }).catch((error) => {
        console.log(error);
        return;
    });
    if (!response.ok) {
        console.log(
            `An error has occured in DBDeleteUser: ${response.statusText}`
        );
    }
}

async function deleteUser(id) {
    var user = await getUserFromId(id);
    if (!user) {
        console.log(`Error finding user: ${id}`);
        return;
    }

    for (let i = 0; i < user.activities; i++) {
        await DBDeleteActivityAndPages(user.activities[i]);
    }
    await DBDeleteUser(id);
}

// get an activity from id
async function getActivity(id) {
    const response = await fetch(contentURL(`activity/${id}`)).catch(
        (error) => {
            console.log(error);
            return null;
        }
    );

    if (!response.ok) {
        console.log(
            `An error has occured in getActivity: ${response.statusText}`
        );
        return null;
    }

    return response.json();
}

// add a new activity
async function DBAddActivity(activity) {
    const response = await fetch(contentURL("activity/add"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
    }).catch((error) => {
        console.log(error);
        return;
    });
    var json = await response.json();
    return json.ops[0];
}

async function addActivity(userid, activity) {
    const newActivity = await DBAddActivity(activity);
    if (!newActivity) return null;
    const newId = newActivity._id;

    var user = await getUserFromId(userid);
    if (!user) {
        DBDeleteActivity(newId);
        return null;
    }
    user.activities.push(newId);
    await DBUpdateUser(user);
    return newId;
}

// update activity based on object
async function DBUpdateActivity(activity) {
    await fetch(contentURL(`activity/update/${activity._id}`), {
        method: "POST",
        body: JSON.stringify(activity),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// update page based on object
async function updateActivity(activity) {
    DBUpdateActivity(activity);
}

// delete an activity from MongoDB based on id
async function DBDeleteActivity(id) {
    await fetch(contentURL(`activity/${id}`), {
        method: "DELETE",
    });
}

async function DBDeleteActivityAndPages(activityId) {
    var activity = await getActivity(activityId);
    if (activity) {
        for (let i = 0; i < activity.pages.length; i++) {
            await DBDeletePage(activity.pages[i]);
        }
    }
    DBDeleteActivity(activityId);
}

async function deleteActivity(userId, activityId) {
    var user = await getUserFromId(userId);
    if (!user) {
        console.log(`Error finding user: ${userId}`);
        return;
    }
    user.activities = user.activities.filter((id) => id !== activityId);
    DBUpdateUser(user);

    await DBDeleteActivityAndPages(activityId);
}

// get a page from id
async function getPage(id) {
    const response = await fetch(contentURL(`page/${id}`));

    if (!response.ok) {
        console.log(`An error has occured in getPage: ${response.statusText}`);
        return null;
    }

    return response.json();
}

// add a new page
async function DBAddPage(page) {
    const response = await fetch(contentURL("page/add"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
    }).catch((error) => {
        console.log(error);
        return;
    });

    if (!response.ok) {
        console.log(
            `An error has occured in DBAddPage: ${response.statusText}`
        );
        return null;
    }

    var json = await response.json();
    return json.ops[0];
}

async function addPage(activityId, page) {
    const newPage = await DBAddPage(page);
    if (!newPage) return null;
    const newId = newPage._id;

    var activity = await getActivity(activityId);
    if (!activity) {
        DBDeletePage(newId);
        return null;
    }
    activity.pages.push(newId);
    await DBUpdateActivity(activity);
    return newId;
}

// update page based on object
async function updatePage(page) {
    await fetch(contentURL(`page/update/${page._id}`), {
        method: "POST",
        body: JSON.stringify(page),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.log(
                    `Error in updatePage: ${page.name} - status: ${response.status}`
                );
            }
        })
        .catch((error) => {
            console.log("Error in updatePage: ", error);
        });
}

// delete a page from MongoDB based on id
async function DBDeletePage(id) {
    const response = await fetch(contentURL(`page/${id}`), {
        method: "DELETE",
    }).catch((error) => {
        console.log(error);
        return;
    });

    if (!response.ok) {
        console.log(`Error in DBDeletePage: ${response.status}`);
    }
}

async function deletePage(activityId, pageId) {
    var activity = await getActivity(activityId);
    if (!activity) {
        console.log(`Error finding activity: ${activity}`);
        return;
    }
    activity.pages = activity.pages.filter((id) => id !== pageId);
    DBUpdateActivity(activity);

    await DBDeletePage(pageId);
}

export {
    getAllUsers,
    getUser,
    getUserFromId,
    addUser,
    changeUserSettings,
    deleteUser,
    getActivity,
    addActivity,
    updateActivity,
    deleteActivity,
    getPage,
    addPage,
    updatePage,
    deletePage,
};
