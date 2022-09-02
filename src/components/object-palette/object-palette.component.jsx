import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

import RectScreenObject from "../../app/screen-objects/rect-screen-object";
import CircleScreenObject from "../../app/screen-objects/circle-screen-object";

const ObjectPalette = ({ width, screenMgr }) => {
    const onSelectSquare = (scrMgr) => {
        var page = scrMgr.getCurrentPage();
        if (page) {
            new RectScreenObject(scrMgr, page, {
                left: 10,
                top: 10,
                width: 100,
                height: 100,
                fillColor: "red",
            });
        }
    };

    const onSelectCircle = (scrMgr) => {
        var page = scrMgr.getCurrentPage();
        if (page) {
            new CircleScreenObject(scrMgr, page, {
                left: 50,
                top: 50,
                radius: 50,
                fillColor: "green",
            });
        }
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: width,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: width,
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
                        onClick={() => onSelectSquare(screenMgr)}
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
                        onClick={() => onSelectCircle(screenMgr)}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <PanoramaFishEyeIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default ObjectPalette;
