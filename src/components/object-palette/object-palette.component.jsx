import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import NorthWestRoundedIcon from "@mui/icons-material/NorthWestRounded";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import WysiwygRoundedIcon from "@mui/icons-material/WysiwygRounded";
import { ReactComponent as SymButton } from "./button.svg";
import { ReactComponent as SprayIcon } from "./spray.svg";
import { ReactComponent as IrregularIcon } from "./irregular.svg";
import SvgIcon from "@mui/material/SvgIcon";

import { EditMode } from "../../routes/editor/edit-modes";

const options = [
    {
        icon: <NorthWestRoundedIcon fontSize="large" />,
        label: "",
        mode: EditMode.Select,
    },
    {
        icon: <CropSquareIcon fontSize="large" />,
        label: "",
        mode: EditMode.AddRectangle,
    },
    {
        icon: <PanoramaFishEyeIcon fontSize="large" />,
        label: "",
        mode: EditMode.AddCircle,
    },
    {
        icon: <TextFieldsRoundedIcon fontSize="large" />,
        label: "",
        mode: EditMode.AddText,
    },
    {
        icon: <ImageOutlinedIcon fontSize="large" />,
        label: "",
        mode: EditMode.AddImage,
    },
    {
        icon: (
            <SvgIcon fontSize="large">
                <SymButton />
            </SvgIcon>
        ),
        label: "",
        mode: EditMode.AddSymbolButton,
    },
    {
        icon: (
            <SvgIcon fontSize="large">
                <SprayIcon />
            </SvgIcon>
        ),
        label: "",
        mode: EditMode.Spray,
    },
    {
        icon: (
            <SvgIcon fontSize="large">
                <IrregularIcon />
            </SvgIcon>
        ),
        label: "",
        mode: EditMode.AddHotSpot,
    },
    {
        icon: <WysiwygRoundedIcon fontSize="large" />,
        label: "",
        mode: EditMode.AddContainerBox,
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
                bgcolor: "lightgray",
                border: 1,
                borderColor: "black",
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
