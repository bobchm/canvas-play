import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import PlayCanvas from "./components/play-canvas/play-canvas.component";
import ObjectPalette from "./components/object-palette/object-palette.component";
import PropertyPalette from "./components/property-palette/property-palette.component";
import CanvasAppBar from "./components/CanvasAppBar/canvas-appbar.component";

import ApplicationManager from "./app/managers/application-manager";
import { AppMode } from "./app/constants/app-modes";

const drawerWidth = 100;
const propsWidth = 200;
const appBarHeight = 64;

const initAppManager = initAppForNow();

const canvasSpec = {
    id: "canvas",
    left: 0,
    top: appBarHeight,
    width: window.innerWidth - (drawerWidth + propsWidth),
    height: window.innerHeight - appBarHeight,
    backgroundColor: "azure",
    doSelection: true,
};

function initAppForNow() {
    var appMgr = new ApplicationManager("bobchm@gmail.com");
    appMgr.getUserActivityManager.setActivity("First Activity");
    appMgr.openPage("Home");
    return appMgr;
}

const App = () => {
    const [title, setTitle] = useState("Canvas Play");
    const [appManager] = useState(initAppManager);
    const [appMode, setAppMode] = useState(AppMode.Select);
    const [editProperties, setEditProperties] = useState([]);

    const appBarMenuItems = [
        { label: "Add Page", callback: handleAddPage },
        { label: "Open Page", callback: handleOpenPage },
        { label: "Delete Page", callback: handleDeletePage },
        { label: "--divider--" },
        { label: "Add Activity", callback: handleAddActivity },
        { label: "Open Activity", callback: handleOpenActivity },
        { label: "Delete Activity", callback: handleDeleteActivity },
    ];

    useEffect(() => {
        var scrMgr = appManager.getScreenManager();
        scrMgr.setSelectionCallback(handleSelectionChange);
        scrMgr.setModeChangeCallback(handleProgrammaticModeChange);
        appManager.openPage("Home");
        handleSelectionChange([]);
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
    }

    function handleAddPage() {}

    function handleOpenPage() {}

    function handleDeletePage() {}

    function handleAddActivity() {}

    function handleOpenActivity() {}

    function handleDeleteActivity() {}

    return (
        <div>
            <CanvasAppBar actions={appBarMenuItems} title={title} />
            <Box sx={{ display: "flex" }}>
                <ObjectPalette
                    top={appBarHeight}
                    width={drawerWidth}
                    modeCallback={handleUserModeChange}
                    mode={appMode}
                />
                <div style={{ marginTop: appBarHeight }}>
                    <PlayCanvas spec={canvasSpec} appManager={appManager} />
                </div>
                <PropertyPalette
                    top={appBarHeight}
                    width={propsWidth}
                    options={editProperties}
                    propUpdateCallback={handlePropValueChange}
                />
            </Box>
        </div>
    );
};

export default App;
