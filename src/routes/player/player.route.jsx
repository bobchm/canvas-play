import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import PlayCanvas from "../../components/play-canvas/play-canvas.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import ButtonBar from "../../components/button-bar/button-bar.component";
import SettingsModal from "../../components/settings-modal/settings-modal.component";

import ApplicationManager from "../../app/managers/application-manager";

const appBarHeight = 64;
const buttonBarHeight = 30;
const aboveCanvasHeight = appBarHeight + buttonBarHeight;

const appName = "Canvas Play";

const Player = () => {
    const [title, setTitle] = useState(appName);
    const [appManager] = useState(() => new ApplicationManager());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const canvasSpec = {
        id: "canvas",
        left: 8,
        top: 0,
        width: canvasWidth(window.innerWidth),
        height: canvasHeight(window.innerHeight),
        backgroundColor: "aliceblue",
        doSelection: false,
    };

    const accountMenuItems = [
        { label: "Settings", callback: handleOpenSettings },
    ];

    const leftButtonBarSpec = [
        {
            icon: <ArrowBackRoundedIcon />,
            callback: handleBackToActivities,
            tooltip: "Back to Activity Center",
        },
    ];

    useEffect(() => {
        initAppForNow(
            appManager,
            searchParams.get("userName"),
            searchParams.get("activityName"),
            searchParams.get("startPage")
        );

        function handleResize() {
            console.log(
                "(Play) resized to: ",
                window.innerWidth,
                "x",
                window.innerHeight
            );

            appManager.resizeScreenRegion(
                canvasWidth(window.innerWidth),
                canvasHeight(window.innerHeight)
            );
        }

        window.addEventListener("resize", handleResize);

        return (_) => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function canvasWidth(winWidth) {
        return winWidth;
    }

    function canvasHeight(winHeight) {
        return winHeight - aboveCanvasHeight;
    }

    function initAppForNow(appMgr, userName, activityName, startPage) {
        var userMgr = appMgr.getUserActivityManager();
        var screenMgr = appMgr.getScreenManager();
        appMgr.setUser(userName, true).then((response) => {
            // establish access method since this is play mode - this is all too dependent on order
            // we're doing it here so it happens after settings are set up but before any screen objects are added
            screenMgr.enableAccessMethod(appMgr);
            appMgr.setActivity(activityName).then((resp) => {
                var page = startPage
                    ? userMgr.getUserPage(startPage)
                    : userMgr.getHomePage();
                if (page === null) {
                    page = userMgr.getNthPage(0);
                }
                if (page) {
                    appMgr.openPage(page.name);
                }
                resetTitle();
                setIsLoaded(true);
            });
        });
    }

    async function handleBackToActivities() {
        navigate("/");
    }

    function resetTitle() {
        var newTitle = appName;
        if (appManager.getScreenManager().getCurrentPage()) {
            newTitle +=
                " -- " +
                appManager.getScreenManager().getCurrentPage().getName();
        }
        setTitle(newTitle);
    }

    function handleOpenSettings() {
        appManager.getUserActivityManager().openSettingsChange();
        setIsSettingsOpen(true);
    }

    function settingsCloseCallback() {
        setIsSettingsOpen(false);
        appManager.getUserActivityManager().closeSettingsChange();
    }

    return (
        <div>
            <CanvasAppBar
                isLoaded={isLoaded}
                accountActions={accountMenuItems}
                title={title}
            />
            <ButtonBar
                top="0px"
                height={buttonBarHeight}
                leftButtons={leftButtonBarSpec}
            />
            <Box
                sx={{
                    display: "flex",
                    top: "0px",
                    backgroundColor: "aliceblue",
                }}
            >
                <div style={{ margin: "auto" }}>
                    <PlayCanvas spec={canvasSpec} appManager={appManager} />
                </div>
            </Box>
            <SettingsModal
                open={isSettingsOpen}
                closeCallback={settingsCloseCallback}
                appManager={appManager}
            />
        </div>
    );
};

export default Player;
