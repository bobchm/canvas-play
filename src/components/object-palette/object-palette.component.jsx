import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import NorthWestRoundedIcon from "@mui/icons-material/NorthWestRounded";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

import { AppMode } from "../../app/constants/app-modes";

const options = [
    {
        icon: <NorthWestRoundedIcon />,
        label: "",
        mode: AppMode.Select,
    },
    {
        icon: <CropSquareIcon />,
        label: "",
        mode: AppMode.AddRectangle,
    },
    {
        icon: <PanoramaFishEyeIcon />,
        label: "",
        mode: AppMode.AddCircle,
    },
];

const ObjectPalette = ({ top, width, modeCallback, mode }) => {
    var useValue = 0;
    for (let i = 0; i < options.length; i++) {
        if (options[i].mode === mode) {
            useValue = i;
            break;
        }
    }

    return (
        <Box
            sx={{
                mt: `${top}px`,
                width: width,
                bgcolor: "background.paper",
            }}
        >
            <Tabs
                value={useValue}
                onChange={(e, newValue) => {
                    modeCallback(options[newValue].mode);
                }}
                orientation="vertical"
            >
                {options.map((option, idx) => (
                    <Tab key={idx} icon={option.icon} label={option.label} />
                ))}
            </Tabs>
        </Box>
    );
};

export default ObjectPalette;
