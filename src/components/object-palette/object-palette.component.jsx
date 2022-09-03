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

const ObjectPalette = ({ top, width, modeCallback }) => {
    const [value, setValue] = useState(0);

    return (
        <Box
            sx={{
                mt: `${top}px`,
                width: width,
                bgcolor: "background.paper",
            }}
        >
            <Tabs
                value={value}
                onChange={(e, newValue) => {
                    setValue(newValue);
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
