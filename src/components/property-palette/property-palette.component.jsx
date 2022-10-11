import React from "react";
import Box from "@mui/material/Box";

import TextPropertyPanel from "./text-proppanel.component";
import ColorPropertyPanel from "./color-proppanel.component";
import PercentPropertyPanel from "./percent-proppanel.component";
import TextStylePropertyPanel from "./textstyle-proppanel.component";
import ImageSourcePropertyPanel from "./imagesrc-proppanel.component";
import EmbedImagePropertyPanel from "./embedimage-proppanel-component";
import ButtonShapePropertyPanel from "./button-shape.component";

import "./property-palette.styles.scss";
import { PropertyValueType } from "../../app/constants/property-types";

var ctr = 0;

const PropertyPalette = ({
    top,
    left,
    width,
    height,
    options,
    propUpdateCallback,
}) => {
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
            case PropertyValueType.Percent:
                return (
                    <PercentPropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
            case PropertyValueType.TextStyle:
                return (
                    <TextStylePropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
            case PropertyValueType.ImageSource:
                return (
                    <ImageSourcePropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
            case PropertyValueType.EmbedImage:
                return (
                    <EmbedImagePropertyPanel
                        propOption={option}
                        propUpdateCallback={propUpdateCallback}
                    />
                );
            case PropertyValueType.ButtonShape:
                return (
                    <ButtonShapePropertyPanel
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
                position: "sticky",
                left: left,
                width: width,
                bgcolor: "lightgray",
                border: 1,
                borderColor: "black",
                height: { height },
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                overflowY: "scroll",
                boxSizing: "border-box",
            }}
        >
            {options.map((option, idx) => (
                <div key={ctr++} className="prop-panel-item">
                    {selectPanel(option, propUpdateCallback)}
                </div>
            ))}
        </Box>
    );
};

export default PropertyPalette;
