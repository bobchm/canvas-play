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
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

import { addSquare, addCircle, addTriangle } from "../../utils/canvas";

const ObjectPalette = ({ width, canvas }) => {
    const onSelectSquare = (cnv) =>
        addSquare(cnv, {
            left: 10,
            top: 10,
            width: 100,
            height: 100,
            fill: "red",
        });

    const onSelectCircle = (cnv) =>
        addCircle(cnv, {
            left: 50,
            top: 50,
            radius: 50,
            fill: "green",
        });

    const onSelectTriangle = (cnv) =>
        addTriangle(cnv, {
            left: 100,
            top: 100,
            width: 50,
            height: 80,
            fill: "blue",
        });

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
    );
};

export default ObjectPalette;
