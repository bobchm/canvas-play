import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import PlayCanvas from "./components/play-canvas/play-canvas.component";
import ObjectPalette from "./components/object-palette/object-palette.component";
import PropertyPalette from "./components/property-palette/property-palette.component";

import ApplicationManager from "./app/managers/application-manager";
import { AppMode } from "./app/constants/app-modes";

const drawerWidth = 100;
const propsWidth = 200;
const appBarHeight = 64;

const initAppManager = new ApplicationManager("fakeusername");

const canvasSpec = {
    id: "canvas",
    left: 0,
    top: appBarHeight,
    width: window.innerWidth - (drawerWidth + propsWidth),
    height: window.innerHeight - appBarHeight,
    backgroundColor: "azure",
    doSelection: true,
};

const App = () => {
    const [title, setTitle] = useState("Canvas Play");
    const [appManager] = useState(initAppManager);
    const [appMode, setAppMode] = useState(AppMode.Select);
    const [editProperties, setEditProperties] = useState([]);

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
        var jsonPage = appManager.getScreenManager().getCurrentPage().toJSON();
        console.log(jsonPage);
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

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
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
