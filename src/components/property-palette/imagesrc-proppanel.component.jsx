import React from "react";
import Button from "@mui/material/Button";
import ImageSearchModal from "../image-search-modal/image-search-modal.component";

const ImageSourcePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleButtonClick = (event) => {
        setIsModalOpen(true);
    };

    const handleChangeLocation = (newLocation) => {
        propUpdateCallback(propOption.type, newLocation);
        setIsModalOpen(false);
    };

    const handleCancelLocation = () => {
        setIsModalOpen(false);
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
                onClick={handleButtonClick}
                variant="outlined"
            >
                Change Image
            </Button>
            <ImageSearchModal
                open={isModalOpen}
                question="Image Search"
                textLabel="Query"
                selectionCallback={handleChangeLocation}
                cancelCallback={handleCancelLocation}
            />
        </div>
    );
};

export default ImageSourcePropertyPanel;
