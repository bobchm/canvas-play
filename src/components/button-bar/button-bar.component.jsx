import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

export default function ButtonBar({ top, height, buttons }) {
    return (
        <Box
            display="flex"
            justifyContent="flex-end"
            sx={{
                top: `${top}px`,
                left: "0px",
                width: "100%",
                height: `${height}px`,
                bgcolor: "red",
                border: 1,
                borderColor: "black",
            }}
        >
            {buttons.map((button, idx) => (
                <IconButton onClick={button.callback}>{button.icon}</IconButton>
            ))}
        </Box>
    );
}
