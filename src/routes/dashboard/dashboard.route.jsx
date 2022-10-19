import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import confirmationBox from "../../utils/confirm-box";
import { defaultPageSpec } from "../../utils/app-utils";
import { ttsSpeak } from "../../utils/textToSpeech";
import ApplicationManager from "../../app/managers/application-manager";

import ActivityCard from "../../components/activity-card/activity-card.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import SettingsModal from "../../components/settings-modal/settings-modal.component";

import "./dashboard.styles.scss";

const initUserName = "bobchm@gmail.com";
const appName = "Canvas Play";
const aspectRatio = 4 / 3;

var width = window.innerWidth;
var height = window.innerHeight - 64;

const Dashboard = () => {
    const [userName, setUserName] = useState(initUserName);
    const [applicationManager, setApplicationManager] = useState(
        new ApplicationManager()
    );
    const [activities, setActivities] = useState([]);
    const [isActivityCreateOpen, setIsActivityCreateOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
                aspectRatio: activity.aspectRatio,
            });
        }
    }

    function playActivity(activity) {
        console.log("Play: ", activity);
        ttsSpeak("We're about to play!");
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

    function handleAddActivity() {
        setIsActivityCreateOpen(true);
    }

    function handleOpenSettings() {
        console.log("in open settings");
        applicationManager.getUserActivityManager().openSettingsChange();
        setIsSettingsOpen(true);
        console.log("lleaving open setyings");
    }

    function settingsCloseCallback() {
        setIsSettingsOpen(false);
        applicationManager.getUserActivityManager().closeSettingsChange();
    }

    async function handleCreateActivity(name) {
        setIsActivityCreateOpen(false);
        if (!name || name.length === 0) return;
        var uaManager = applicationManager.getUserActivityManager();
        var spec = {
            name: name,
            pages: [],
            home: null,
            aspectRatio: aspectRatio,
        };
        var actId = await uaManager.addUserActivity(spec);
        if (!actId) return;
        // add a placeholder home page
        var pgId = await uaManager.addUserPageToActivity(
            actId,
            defaultPageSpec("Home")
        );
        if (!pgId) return;
        var activity = await uaManager.getActivityFromId(actId);
        if (activity) {
        }

        activity.home = pgId;
        await uaManager.updateActivity(activity);
        initializeCurrentUser();
    }

    function handleCancelCreateActivity(name) {
        setIsActivityCreateOpen(false);
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
                            image="https://howtodrawforkids.com/wp-content/uploads/2022/05/9-easy-monkey-drawing-tutorial.jpg"
                            description="This is my favorite activity!"
                            actions={activityActions}
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
                    uaManager={applicationManager.getUserActivityManager()}
                />
            </Container>
        </div>
    );
};

export default Dashboard;
