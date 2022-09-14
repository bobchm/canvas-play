import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import confirmationBox from "../../utils/confirm-box";

import ActivityCard from "../../components/activity-card/activity-card.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";

import { getUser, getActivity } from "../../utils/dbaccess";
import "./dashboard.styles.scss";

const initUserName = "bobchm@gmail.com";
const appName = "Canvas Play";

var width = window.innerWidth;
var height = window.innerHeight - 64;

const Dashboard = () => {
    const [userName, setUserName] = useState(initUserName);
    const [activities, setActivities] = useState([]);
    const [isActivityCreateOpen, setIsActivityCreateOpen] = useState(false);

    const navigate = useNavigate();

    const appBarMenuItems = [
        { label: "Add Activity", callback: handleAddActivity },
    ];

    var activityActions = [
        { label: "Play", action: playActivity },
        { label: "Edit", action: editActivity },
        { label: "Delete", action: deleteActivity },
    ];

    useEffect(() => {
        initializeCurrentUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function addToActivities(activity) {
        setActivities((current) => [...current, activity]);
    }

    function initializeCurrentUser() {
        getUser(userName).then((user) => {
            if (!user) {
                throw new Error(`Unknown user: ${userName}`);
            }
            setActivities([]);
            for (let i = 0; i < user.activities.length; i++) {
                getActivity(user.activities[i]).then((activity) =>
                    addToActivities({ name: activity.name, _id: activity._id })
                );
            }
        });
    }

    function playActivity(activity) {
        console.log("Play: ", activity);
    }

    function editActivity(activity) {
        navigate(`/edit?userName=${userName}&activityName=${activity}`);
    }

    async function deleteActivity(activity) {
        if (await confirmationBox()) {
            console.log("Yes");
        } else {
            console.log("No");
        }
    }

    function handleAddActivity() {
        setIsActivityCreateOpen(true);
    }

    function handleCreateActivity(name) {
        setIsActivityCreateOpen(false);
        console.log("create activity: ", name);
    }

    function handleCancelCreateActivity(name) {
        setIsActivityCreateOpen(false);
        console.log("cancel create activity");
    }

    return (
        <div>
            <CanvasAppBar title={appName} actions={appBarMenuItems} />
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
            </Container>
        </div>
    );
};

export default Dashboard;
