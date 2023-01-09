import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

export default function ButtonBar({
    top,
    height,
    leftButtons = [],
    rightButtons = [],
    message = "",
}) {
    function isButtonEnabled(enableFn) {
        if (!enableFn) return true;

        return enableFn();
    }

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
            <Box display="flex">
                {leftButtons.map((button, idx) =>
                    button.text === "--divider--" ? (
                        <Divider
                            key={idx}
                            orientation="vertical"
                            variant="middle"
                            flexItem
                        />
                    ) : (
                        <IconButton
                            key={idx}
                            onClick={button.callback}
                            edge="end"
                            title={button.text}
                            disabled={!isButtonEnabled(button.isEnabled)}
                            sx={{ marginLeft: "2px" }}
                        >
                            {button.icon}
                        </IconButton>
                    )
                )}
            </Box>
            <p>{message}</p>
            <Box display="flex">
                {rightButtons.map((button, idx) =>
                    button.text === "--divider--" ? (
                        <Divider
                            key={idx}
                            orientation="vertical"
                            variant="middle"
                            flexItem
                        />
                    ) : (
                        <IconButton
                            key={idx}
                            onClick={button.callback}
                            edge="end"
                            title={button.text}
                            disabled={!isButtonEnabled(button.isEnabled)}
                            sx={{ marginRight: "2px" }}
                        >
                            {button.icon}
                        </IconButton>
                    )
                )}
            </Box>
        </Box>
    );
}
