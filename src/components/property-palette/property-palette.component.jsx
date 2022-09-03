import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PropertyPalette = ({ left, top, width, options }) => {
    console.log(options);
    return (
        <Box
            sx={{
                mt: `${top}px`,
                width: width,
                bgcolor: "background.paper",
            }}
        >
            {options.map((option, idx) => (
                <Typography key={idx} variant="h6" noWrap component="div">
                    {option.type.name}
                </Typography>
            ))}
        </Box>
    );
};

export default PropertyPalette;
