import React from "react";
import Button from "@mui/material/Button";
import TextInputModal from "../text-input-modal/text-input-modal.component";

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
            <TextInputModal
                open={isModalOpen}
                question="Image Location"
                contentText="Enter the image location."
                yesLabel="Change"
                yesCallback={handleChangeLocation}
                noLabel="Cancel"
                noCallback={handleCancelLocation}
            />
        </div>
    );
};

export default ImageSourcePropertyPanel;
