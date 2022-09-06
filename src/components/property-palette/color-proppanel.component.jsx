import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import Popper from "@mui/material/Popper";

const ColorPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;
    return (
        <div>
            <Button
                aria-describedby={id}
                onClick={handleClick}
                variant="outlined"
                startIcon={
                    <SquareRoundedIcon sx={{ color: propOption.current }} />
                }
            >
                {propOption.type.name}
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl}>
                <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
                    The content of the Popper.
                </Box>
            </Popper>
        </div>
    );
};

export default ColorPropertyPanel;
