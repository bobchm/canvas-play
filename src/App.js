import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import PlayCanvas from "./components/play-canvas/play-canvas.component";
import ObjectPalette from "./components/object-palette/object-palette.component";

import ApplicationManager from "./app/managers/application-manager";

const drawerWidth = 100;
const appBarHeight = 64;

const App = () => {
    const [title, setTitle] = useState("No selection");
    const [appManager, setAppManager] = useState(null);

    useEffect(() => {
        var appMgr = new ApplicationManager("fakeusername", {
            left: 0,
            top: appBarHeight,
            width: window.innerWidth - drawerWidth,
            height: window.innerHeight - appBarHeight,
            backgroundColor: "azure",
            doSelection: true,
        });
        setAppManager(appMgr);
    }, []);

    function describeSelection(objs) {
        if (objs === null || objs.length === 0) {
            setTitle("No selection");
        } else {
            var str = "";
            for (var i = 0; i < objs.length; i++) {
                if (i > 0) {
                    str += " and ";
                }
                str += objs[i].type;
            }
            setTitle(str);
        }
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
                <ObjectPalette canvas={canvas} width={drawerWidth} />
                <div style={{ marginTop: appBarHeight }}>
                    <PlayCanvas id="canvas" appManager={appManager} />
                </div>
            </Box>
        </div>
    );
};

export default App;
