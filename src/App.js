import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { fabric } from "fabric";

const drawerWidth = 100;
const appBarHeight = 64;

const App = () => {
    const canvas = useRef(null);
    const [title, setTitle] = useState("No selection");

    useEffect(() => {
        canvas.current = initCanvas();

        // destroy fabric on unmount
        return () => {
            canvas.current.dispose();
            canvas.current = null;
        };
    }, []);

    function describeSelection(objs) {
        var str = "";
        for (var i = 0; i < objs.length; i++) {
            if (i > 0) {
                str += " and ";
            }
            str += objs[i].type;
        }
        setTitle(str);
    }

    function handleSelectionCreated(obj) {
        describeSelection(obj.selected);
    }

    function handleSelectionUpdated(obj) {
        var objs = canvas.current.getActiveObjects();
        describeSelection(objs);
    }

    function handleSelectionClear(obj) {
        setTitle("No selection");
    }

    function initCanvas() {
        var cnv = new fabric.Canvas("canvas", {
            top: appBarHeight,
            height: window.innerHeight - appBarHeight,
            width: window.innerWidth - drawerWidth,
            backgroundColor: "azure",
            selection: true,
            renderOnAddRemove: true,
        });
        cnv.on({
            "selection:updated": handleSelectionUpdated,
            "selection:created": handleSelectionCreated,
            "selection:cleared": handleSelectionClear,
        });
        return cnv;
    }

    const onSelectSquare = (cnv) => {
        const rect = new fabric.Rect({
            left: 10,
            top: 10,
            width: 100,
            height: 100,
            fill: "red",
        });
        cnv.add(rect);
    };

    const onSelectCircle = (cnv) => {
        const circle = new fabric.Circle({
            left: 50,
            top: 50,
            radius: 50,
            fill: "green",
        });
        cnv.add(circle);
    };

    const onSelectTriangle = (cnv) => {
        const triangle = new fabric.Triangle({
            left: 100,
            top: 100,
            width: 50,
            height: 80,
            fill: "blue",
        });
        cnv.add(triangle);
    };

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
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <List>
                            <ListItem
                                key={1}
                                disablePadding
                                onClick={() => onSelectSquare(canvas.current)}
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CropSquareIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem
                                key={2}
                                disablePadding
                                onClick={() => onSelectCircle(canvas.current)}
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PanoramaFishEyeIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem
                                key={3}
                                disablePadding
                                onClick={() => onSelectTriangle(canvas.current)}
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ChangeHistoryIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <div style={{ marginTop: appBarHeight }}>
                    <canvas id="canvas" />
                </div>
            </Box>
        </div>
    );
};

export default App;
