import React from "react";
import Button from "@mui/material/Button";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import Popper from "@mui/material/Popper";
import { SketchPicker, TwitterPicker } from "react-color";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const ColorPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [color, setColor] = React.useState(propOption.current || "#D3D3D3");

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const presets = [
        "TRANSPARENT",
        "#D0021B",
        "#F5A623",
        "#F8E71C",
        "#8B572A",
        "#7ED321",
        "#417505",
        "#BD10E0",
        "#9013FE",
        "#4A90E2",
        "#50E3C2",
        "#B8E986",
        "#000000",
        "#4A4A4A",
        "#9B9B9B",
        "#FFFFFF",
    ];

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;
    return (
        <div>
            <Button
                sx={{
                    width: "100%",
                    color: "black",
                    borderColor: "black",
                    textTransform: "none",
                    backgroundColor: "azure",
                }}
                aria-describedby={id}
                onClick={handleClick}
                variant="outlined"
                startIcon={
                    <SquareRoundedIcon
                        style={{ fontSize: "50px", color: color }}
                    />
                }
            >
                {propOption.type.name}
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div>
                        <SketchPicker
                            color={color}
                            presetColors={presets}
                            onChange={(color, e) => {
                                propUpdateCallback(propOption.type, color.hex);
                                setColor(color.hex);
                            }}
                        />
                    </div>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default ColorPropertyPanel;
