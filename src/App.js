import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PlayCanvas from "./components/play-canvas/play-canvas.component";
import ObjectPalette from "./components/object-palette/object-palette.component";
import PropertyPalette from "./components/property-palette/property-palette.component";
import CanvasAppBar from "./components/CanvasAppBar/canvas-appbar.component";

import ApplicationManager from "./app/managers/application-manager";
import { AppMode } from "./app/constants/app-modes";

const drawerWidth = 100;
const propsWidth = 200;
const appBarHeight = 64;
const buttonBarHeight = 30;
const aboveCanvasHeight = appBarHeight + buttonBarHeight;

const appName = "Canvas Play";

const initAppManager = initAppForNow();

function initAppForNow() {
    var appMgr = new ApplicationManager("bobchm@gmail.com");
    appMgr.getUserActivityManager.setActivity("First Activity");
    appMgr.openPage("Home");
    return appMgr;
}

const App = () => {
    const [title, setTitle] = useState(appName);
    const [appManager] = useState(initAppManager);
    const [appMode, setAppMode] = useState(AppMode.Select);
    const [editProperties, setEditProperties] = useState([]);
    const [isModified, setIsModified] = useState(false);

    const canvasSpec = {
        id: "canvas",
        left: 0,
        top: aboveCanvasHeight,
        width: window.innerWidth - (drawerWidth + propsWidth),
        height: window.innerHeight - aboveCanvasHeight,
        backgroundColor: "azure",
        doSelection: true,
    };

    const appBarMenuItems = [
        { label: "Add Page", callback: handleAddPage },
        { label: "Open Page", callback: handleOpenPage },
        { label: "Delete Page", callback: handleDeletePage },
        { label: "--divider--" },
        { label: "Add Activity", callback: handleAddActivity },
        { label: "Open Activity", callback: handleOpenActivity },
        { label: "Delete Activity", callback: handleDeleteActivity },
    ];

    const buttonBarSpec = [
        { icon: <SaveRoundedIcon />, callback: HandleSavePage },
        { icon: <DeleteRoundedIcon />, callback: HandleDeleteSelection },
    ];

    useEffect(() => {
        var scrMgr = appManager.getScreenManager();
        scrMgr.setSelectionCallback(handleSelectionChange);
        scrMgr.setModeChangeCallback(handleProgrammaticModeChange);
        scrMgr.setModifiedCallback(() => markChanged(true));
        appManager.openPage("Home");
        handleSelectionChange([]);
        markChanged(false);
    }, []);

    function addToEditProperties(dest, src) {
        for (let i = 0; i < dest.length; i++) {
            if (dest[i].type === src.type) {
                if (dest[i].current !== src.current) {
                    dest[i].current = null;
                }
                return;
            }
        }
        dest.push(src);
    }

    function handleSelectionChange(objs) {
        var props = [];
        if (!objs || objs.length <= 0) {
            var page = appManager.getScreenManager().getCurrentPage();
            if (page) {
                objs = [page];
            }
        }
        if (objs && objs.length > 0) {
            for (let i = 0; i < objs.length; i++) {
                var objProps = objs[i].getEditProperties();
                for (let j = 0; j < objProps.length; j++) {
                    addToEditProperties(props, objProps[j]);
                }
            }
        }
        setEditProperties(props);
    }

    function handleUserModeChange(mode) {
        setAppMode(mode);
        appManager.getScreenManager().setAppMode(mode);
    }

    function handleProgrammaticModeChange(mode) {
        setAppMode(mode);
    }

    function refreshLocalProperties(propType, value) {
        if (editProperties) {
            for (let i = 0; i < editProperties.length; i++) {
                if (editProperties[i].type === propType) {
                    editProperties[i].current = value;
                }
            }
        }
    }

    function handlePropValueChange(propType, value) {
        appManager.getScreenManager().setSelectionProperties(propType, value);
        refreshLocalProperties(propType, value);
        markChanged(true);
    }

    function handleAddPage() {}

    function handleOpenPage() {}

    function handleDeletePage() {}

    function handleAddActivity() {}

    function handleOpenActivity() {}

    function handleDeleteActivity() {}

    function HandleSavePage() {
        markChanged(false);
    }

    function HandleDeleteSelection() {
        markChanged(true);
    }

    function markChanged(isChanged) {
        setIsModified(isChanged);
        resetTitle();
    }

    function resetTitle() {
        var newTitle = appName;
        if (appManager.getScreenManager().getCurrentPage()) {
            newTitle +=
                " -- " + appManager.getScreenManager.getCurrentPage().getName();
        }
        if (isModified) {
            newTitle += "*";
        }
        setTitle(newTitle);
    }

    return (
        <div>
            <CanvasAppBar actions={appBarMenuItems} title={title} />
            <Box sx={{ display: "flex" }}>
                <ObjectPalette
                    top={aboveCanvasHeight}
                    width={drawerWidth}
                    modeCallback={handleUserModeChange}
                    mode={appMode}
                />
                <div style={{ marginTop: aboveCanvasHeight }}>
                    <PlayCanvas spec={canvasSpec} appManager={appManager} />
                </div>
                <PropertyPalette
                    top={aboveCanvasHeight}
                    width={propsWidth}
                    options={editProperties}
                    propUpdateCallback={handlePropValueChange}
                />
            </Box>
        </div>
    );
};

export default App;
