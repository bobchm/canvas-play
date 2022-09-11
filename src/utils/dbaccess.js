import contentURL from "./contentURL";

// get all users
async function getAllUsers() {
    const response = await fetch(contentURL("user/"));

    if (!response.ok) {
        console.log(`An error occured: ${response.statusText}`);
        return null;
    }

    return await response.json();
}

// get a single user based on username
async function getUser(username) {
    const response = await fetch(contentURL(`user/${username}`));

    if (!response.ok) {
        console.log(`An error has occured: ${response.statusText}`);
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
        return;
    });
    return response.json();
}

// update user based on object
async function DBUpdateUser(user) {
    await fetch(contentURL(`user/update/${user._id}`), {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// delete a user from MongoDB based on id
async function DBDeleteUser(id) {
    await fetch(contentURL(`user/${id}`), {
        method: "DELETE",
    });
}

async function deleteUser(id) {
    var user = await getUser(id);
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
    const response = await fetch(contentURL(`activity/${id}`));

    if (!response.ok) {
        console.log(`An error has occured: ${response.statusText}`);
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
    return response.json();
}

async function addActivity(userid, activity) {
    const newActivity = await DBAddActivity(activity);
    if (!newActivity) return null;
    const newId = newActivity._id;

    var user = await getUser(userid);
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
    var user = await getUser(userId);
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
        console.log(`An error has occured: ${response.statusText}`);
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
    return response.json();
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
        body: JSON.stringify([page]),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// delete a page from MongoDB based on id
async function DBDeletePage(id) {
    await fetch(contentURL(`page/${id}`), {
        method: "DELETE",
    });
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
    addUser,
    deleteUser,
    getActivity,
    addActivity,
    deleteActivity,
    getPage,
    addPage,
    updatePage,
    deletePage,
};
