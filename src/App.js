import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { fabric } from "fabric";

const drawerWidth = 100;

const App = () => {
    const [canvas, setCanvas] = useState("");

    useEffect(() => {
        var cnv = initCanvas();
        console.log("canvas: ", cnv);
        setCanvas(cnv);
    }, []);

    function initCanvas() {
        return new fabric.Canvas("canvas", {
            height: window.innerHeight,
            width: window.innerWidth - drawerWidth,
            backgroundColor: "azure",
            renderOnAddRemove: true,
        });
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
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Clipped drawer
                    </Typography>
                </Toolbar>
            </AppBar> */}
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
                            onClick={() => onSelectSquare(canvas)}
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
                            onClick={() => onSelectCircle(canvas)}
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
                            onClick={() => onSelectTriangle(canvas)}
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
            <canvas id="canvas" />
        </Box>
    );
};

export default App;
