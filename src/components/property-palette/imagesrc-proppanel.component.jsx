import React from "react";
import Button from "@mui/material/Button";
import ImageSearchModal from "../image-search-modal/image-search-modal.component";
import { ImageServiceType } from "../../utils/image-service";

const ImageSourcePropertyPanel = ({
    propOption,
    propUpdateCallback,
    focusHandler,
}) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

    const handleSearchButtonClick = (event) => {
        setIsSearchModalOpen(true);
        focusHandler(true);
    };

    const handleChangeLocationFromSearch = (newLocation) => {
        propUpdateCallback(propOption.type, newLocation);
        setIsSearchModalOpen(false);
        focusHandler(false);
    };

    const handleCancelLocationFromSearch = () => {
        setIsSearchModalOpen(false);
        focusHandler(false);
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
                preferredService={ImageServiceType.Unsplash}
            />
        </div>
    );
};

export default ImageSourcePropertyPanel;
