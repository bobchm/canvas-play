import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

export default function ButtonBar({
    top,
    height,
    leftButtons = [],
    rightButtons = [],
}) {
    return (
        <Box
            // display="flex"
            // justifyContent="flex-end"

            component="span"
            //m={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                top: top,
                left: "0px",
                width: "100%",
                height: `${height}px`,
                bgcolor: "white",
                border: 1,
                borderColor: "black",
                boxSizing: "border-box",
            }}
        >
            {leftButtons.map((button, idx) => (
                <IconButton
                    key={idx}
                    onClick={button.callback}
                    edge="end"
                    title={button.tooltip}
                    sx={{ marginLeft: "2px" }}
                >
                    {button.icon}
                </IconButton>
            ))}
            <div>
                {rightButtons.map((button, idx) => (
                    <IconButton
                        key={idx}
                        onClick={button.callback}
                        edge="end"
                        title={button.tooltip}
                        sx={{ marginRight: "2px" }}
                    >
                        {button.icon}
                    </IconButton>
                ))}
            </div>
        </Box>
    );
}
