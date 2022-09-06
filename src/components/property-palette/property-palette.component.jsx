import React from "react";
import Box from "@mui/material/Box";

import TextPropertyPanel from "./text-proppanel.component";
import ColorPropertyPanel from "./color-proppanel.component";
import "./property-palette.styles.scss";
import { PropertyValueType } from "../../app/constants/property-types";

const PropertyPalette = ({ top, width, options, propUpdateCallback }) => {
    const selectPanel = (option, propUpdateCallback) => {
        switch (option.type.valueType) {
            case PropertyValueType.Text:
                return (
                    <TextPropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
            case PropertyValueType.Color:
                return (
                    <ColorPropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
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
                <div key={idx} className="prop-panel-item">
                    {selectPanel(option, propUpdateCallback)}
                </div>
            ))}
        </Box>
    );
};

export default PropertyPalette;
