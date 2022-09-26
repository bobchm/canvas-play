import React from "react";
import Button from "@mui/material/Button";
import ImageSearchModal from "../image-search-modal/image-search-modal.component";
import TextInputModal from "../text-input-modal/text-input-modal.component";

const ImageSourcePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
    const [isEntryModalOpen, setIsEntryModalOpen] = React.useState(false);

    const handleSearchButtonClick = (event) => {
        setIsSearchModalOpen(true);
    };

    const handleEntryButtonClick = (even) => {
        setIsEntryModalOpen(true);
    };

    const handleChangeLocationFromSearch = (newLocation) => {
        propUpdateCallback(propOption.type, newLocation);
        setIsSearchModalOpen(false);
    };

    const handleChangeLocationFromEntry = (newLocation) => {
        propUpdateCallback(propOption.type, newLocation);
        setIsEntryModalOpen(false);
    };

    const handleCancelLocationFromSearch = () => {
        setIsSearchModalOpen(false);
    };

    const handleCancelLocationFromEntry = () => {
        setIsEntryModalOpen(false);
    };

    return (
        <div>
            <Button
                sx={{
                    width: "100%",
                    color: "black",
                    borderColor: "black",
                    textTransform: "none",
                    backgroundColor: "azure",
                }}
                onClick={handleEntryButtonClick}
                variant="outlined"
            >
                Enter Image URL
            </Button>
            <Button
                sx={{
                    width: "100%",
                    color: "black",
                    borderColor: "black",
                    textTransform: "none",
                    backgroundColor: "azure",
                    mt: "10px",
                }}
                onClick={handleSearchButtonClick}
                variant="outlined"
            >
                Image Search
            </Button>
            <ImageSearchModal
                open={isSearchModalOpen}
                question="Image Search"
                textLabel="Search Term"
                selectionCallback={handleChangeLocationFromSearch}
                cancelCallback={handleCancelLocationFromSearch}
            />
            <TextInputModal
                open={isEntryModalOpen}
                question="Image Location"
                contentText="Enter the URL of the image."
                textLabel="URL"
                yesLabel="OK"
                yesCallback={handleChangeLocationFromEntry}
                noLabel="Cancel"
                noCallback={handleCancelLocationFromEntry}
            />
        </div>
    );
};

export default ImageSourcePropertyPanel;
