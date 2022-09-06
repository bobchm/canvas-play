import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextPropertyPanel from "./text-proppanel.component";
import ColorPropertyPanel from "./color-proppanel.component";
import {
    PropertyType,
    PropertyValueType,
} from "../../app/constants/property-types";

const PropertyPalette = ({ top, width, options, propUpdateCallback }) => {
    const selectPanel = (option, propUpdateCallback) => {
        switch (option.type.valueType) {
            case PropertyValueType.Text:
                return <TextPropertyPanel />;
            case PropertyValueType.Color:
                return <ColorPropertyPanel />;
            default:
                return <h1>No Matching Panel Element</h1>;
        }
    };

    return (
        <Box
            sx={{
                mt: `${top}px`,
                width: width,
                bgcolor: "background.paper",
            }}
        >
            {options.map((option, idx) => (
                <div>{selectPanel(option, propUpdateCallback)}</div>
            ))}
        </Box>
    );
};

export default PropertyPalette;
