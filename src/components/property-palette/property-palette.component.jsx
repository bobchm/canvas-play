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
import ItemListPropertyPanel from "./itemlist.component";
import BackgroundImageStylePropertyPanel from "./bkgimagestyle-proppanel.component";
import BehaviorPropertyPanel from "./behavior-proppanel.component";

import "./property-palette.styles.scss";
import { PropertyValueType } from "../../app/constants/property-types";
import { SymbolButtonShapes } from "../../utils/symbol-button";

var ctr = 0;

export const selectPropertyPanel = (
    option,
    propUpdateCallback,
    appManager,
    focusHandler
) => {
    switch (option.type.valueType) {
        case PropertyValueType.Text:
            return (
                <TextPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    focusHandler={focusHandler}
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
                    focusHandler={focusHandler}
                />
            );
        case PropertyValueType.SymBtnImageSource:
            return (
                <SymbolSourcePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    focusHandler={focusHandler}
                />
            );
        case PropertyValueType.BackgroundImageSource:
            return (
                <BackgroundSourcePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    focusHandler={focusHandler}
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
                <ItemListPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    items={SymbolButtonShapes}
                    title={"Shape"}
                />
            );
        case PropertyValueType.BackgroundImageStyle:
            return (
                <BackgroundImageStylePropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                />
            );
        case PropertyValueType.Behavior:
            return (
                <BehaviorPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    appManager={appManager}
                    title={option.type.name}
                    focusHandler={focusHandler}
                />
            );
        case PropertyValueType.Page:
            return (
                <ItemListPropertyPanel
                    propOption={option}
                    propUpdateCallback={propUpdateCallback}
                    items={makePageItems(appManager)}
                    title={"Page"}
                />
            );
        default:
            return <h1>No Matching Panel Element</h1>;
    }
};

function makePageItems(appManager) {
    let uam = appManager.getUserActivityManager();
    let pageItems = [];
    let nPages = uam.getNumPages();
    for (let n = 0; n < nPages; n++) {
        let page = uam.getNthPage(n);
        pageItems.push({ name: page.name, value: page.name });
    }
    return pageItems;
}

const PropertyPalette = ({
    top,
    left,
    width,
    height,
    options,
    propUpdateCallback,
    appManager,
    focusHandler,
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
                    {selectPropertyPanel(
                        option,
                        propUpdateCallback,
                        appManager,
                        focusHandler
                    )}
                </div>
            ))}
        </Box>
    );
};

export default PropertyPalette;
