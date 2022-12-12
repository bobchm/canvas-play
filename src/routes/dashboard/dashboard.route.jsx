import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import confirmationBox from "../../utils/confirm-box";
import { defaultActivitySpec, defaultPageSpec } from "../../utils/app-utils";
import ApplicationManager from "../../app/managers/application-manager";

import ActivityCard from "../../components/activity-card/activity-card.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import SettingsModal from "../../components/settings-modal/settings-modal.component";

import "./dashboard.styles.scss";
import { updateActivity } from "../../utils/dbaccess";

const initUserName = "bobchm@gmail.com";
const heightOffset = 64;
const appName = "Canvas Play";
const defaultVSize = { width: 2000, height: 1500 };

const Dashboard = () => {
    const [userName, setUserName] = useState(initUserName);
    const [applicationManager, setApplicationManager] = useState(
        () => new ApplicationManager()
    );
    const [activities, setActivities] = useState([]);
    const [isActivityCreateOpen, setIsActivityCreateOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight - heightOffset);

    const navigate = useNavigate();

    const appBarMenuItems = [
        { label: "Add Activity", callback: handleAddActivity },
    ];

    const accountMenuItems = [
        { label: "Settings", callback: handleOpenSettings },
    ];

    const activityActions = [
        { label: "Play", action: playActivity },
        { label: "Edit", action: editActivity },
        { label: "Delete", action: deleteAnActivity },
    ];

    useEffect(() => {
        setupForUser(userName);

        function handleResize() {
            // console.log(
            //     "(Dashboard) resized to: ",
            //     window.innerWidth,
            //     "x",
            //     window.innerHeight
            // );

            setWidth(window.innerWidth);
            setHeight(window.innerHeight - heightOffset);
        }

        window.addEventListener("resize", handleResize);

        return (_) => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function setupForUser(name) {
        await applicationManager.setUser(name);
        initializeCurrentUser();
    }

    function addToActivities(activity) {
        setActivities((current) => [...current, activity]);
    }

    async function initializeCurrentUser() {
        var uaManager = applicationManager.getUserActivityManager();

        const user = await uaManager.getCurrentUserInfo();
        if (!user) {
            throw new Error(`Unknown user: ${userName}`);
        }
        setActivities([]);
        for (let i = 0; i < user.activities.length; i++) {
            const activity = await uaManager.getActivityFromId(
                user.activities[i]
            );
            addToActivities({
                name: activity.name,
                _id: activity._id,
                vSize: activity.vSize,
                image: activity.image,
                description: activity.description,
            });
        }
    }

    function playActivity(activity) {
        navigate(
            `/play?userName=${userName}&activityName=${activity}&caller=dashboard`
        );
    }

    function editActivity(activity) {
        navigate(`/edit?userName=${userName}&activityName=${activity}`);
    }

    function activityIdFromName(name) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].name === name) return activities[i]._id;
        }
        return null;
    }

    async function deleteAnActivity(activity) {
        if (await confirmationBox()) {
            var uaManager = applicationManager.getUserActivityManager();
            var user = await uaManager.getCurrentUserInfo();
            if (!user) {
                throw new Error(`Unknown user: ${userName}`);
            }
            var actId = activityIdFromName(activity);
            if (actId) {
                await uaManager.deleteUserActivity(actId);
                initializeCurrentUser();
            }
        }
    }

    function handleOpenSettings() {
        applicationManager.getUserActivityManager().openSettingsChange();
        setIsSettingsOpen(true);
    }

    function settingsCloseCallback() {
        setIsSettingsOpen(false);
        applicationManager.getUserActivityManager().closeSettingsChange();
    }

    function handleAddActivity() {
        setIsActivityCreateOpen(true);
    }

    async function handleCreateActivity(name) {
        setIsActivityCreateOpen(false);
        if (!name || name.length === 0) return;
        var uaManager = applicationManager.getUserActivityManager();

        var actId = await uaManager.addUserActivity(
            defaultActivitySpec(name, defaultVSize)
        );
        if (!actId) return;

        // add a placeholder home page
        var pgId = await uaManager.addUserPageToActivity(
            actId,
            defaultPageSpec("Home")
        );
        if (!pgId) return;
        var activity = await uaManager.getActivityFromId(actId);
        activity.home = pgId;
        await uaManager.updateActivity(activity);
        initializeCurrentUser();
    }

    function handleCancelCreateActivity(name) {
        setIsActivityCreateOpen(false);
    }

    async function handleActivityChange(
        name,
        newName,
        newDescription,
        newImage
    ) {
        var uam = applicationManager.getUserActivityManager();
        var activity = await uam.getActivity(name);
        if (
            !activity ||
            (newName === activity.name &&
                newDescription === activity.description &&
                newImage === activity.image)
        ) {
            return false;
        }

        activity.name = newName;
        activity.description = newDescription;
        activity.image = newImage;

        updateActivity(activity);
        return true;
    }

    return (
        <div>
            <CanvasAppBar
                title={appName}
                menuActions={appBarMenuItems}
                accountActions={accountMenuItems}
            />
            <Container
                className="dashboard-container"
                sx={{ width: width, height: height }}
            >
                <Typography variant="h2" align="center">
                    Activities for {userName}
                </Typography>
                <List className="dashboard-list">
                    {activities.map((activity, idx) => (
                        <ActivityCard
                            key={idx}
                            name={activity.name}
                            image={activity.image}
                            description={activity.description}
                            actions={activityActions}
                            changeCallback={handleActivityChange}
                        />
                    ))}
                </List>
                <TextInputModal
                    open={isActivityCreateOpen}
                    question="Create New Activity?"
                    contentText="Enter the name of your new activity."
                    textLabel="Activity Name"
                    yesLabel="Create"
                    yesCallback={handleCreateActivity}
                    noLabel="Cancel"
                    noCallback={handleCancelCreateActivity}
                />
                <SettingsModal
                    open={isSettingsOpen}
                    closeCallback={settingsCloseCallback}
                    appManager={applicationManager}
                />
            </Container>
        </div>
    );
};

export default Dashboard;
