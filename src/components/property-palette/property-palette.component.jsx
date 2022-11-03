import React from "react";
import Box from "@mui/material/Box";

import TextPropertyPanel from "./text-proppanel.component";
import ColorPropertyPanel from "./color-proppanel.component";
import PercentPropertyPanel from "./percent-proppanel.component";
import TextStylePropertyPanel from "./textstyle-proppanel.component";
import ImageSourcePropertyPanel from "./imagesrc-proppanel.component";
import SymbolSourcePropertyPanel from "./symbolsrc-proppanel.component";
import BackgroundSourcePropertyPanel from "./bkgimagesrc-proppanel.component";
import EmbedImagePropertyPanel from "./embedimage-proppanel-component";
import ButtonShapePropertyPanel from "./button-shape.component";
import BackgroundImageStylePropertyPanel from "./bkgimagestyle-proppanel.component";
import BehaviorListPropertyPanel from "./bhvrlist-proppanel.component";

import "./property-palette.styles.scss";
import { PropertyValueType } from "../../app/constants/property-types";

var ctr = 0;

export const selectPropertyPanel = (option, propUpdateCallback, objects) => {
    switch (option.type.valueType) {
        case PropertyValueType.Text:
            return (
                <TextPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.Color:
            return (
                <ColorPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.Percent:
            return (
                <PercentPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.TextStyle:
            return (
                <TextStylePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.ImageSource:
            return (
                <ImageSourcePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.SymBtnImageSource:
            return (
                <SymbolSourcePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.BackgroundImageSource:
            return (
                <BackgroundSourcePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.EmbedImage:
            return (
                <EmbedImagePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.ButtonShape:
            return (
                <ButtonShapePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.BackgroundImageStyle:
            return (
                <BackgroundImageStylePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );
        case PropertyValueType.BehaviorList:
            return (
                <BehaviorListPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    objects={objects}
                />
            );

        default:
            return <h1>No Matching Panel Element</h1>;
    }
};

const PropertyPalette = ({
    top,
    left,
    width,
    height,
    options,
    propUpdateCallback,
}) => {
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
                    {selectPropertyPanel(option, propUpdateCallback)}
                </div>
            ))}
        </Box>
    );
};

export default PropertyPalette;
