import React from "react";
import Button from "@mui/material/Button";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import Popper from "@mui/material/Popper";
import { SketchPicker, TwitterPicker } from "react-color";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const ColorPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [color, setColor] = React.useState(propOption.current);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClickAway = () => {
        console.log("click away");
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;
    return (
        <div>
            <Button
                sx={{ width: "100%" }}
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
                        <TwitterPicker
                            color={propOption.current}
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
