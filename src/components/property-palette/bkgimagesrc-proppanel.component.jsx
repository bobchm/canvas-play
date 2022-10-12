import React from "react";
import Button from "@mui/material/Button";
import ImageSearchModal, {
    ImageSearchNoImage,
} from "../image-search-modal/image-search-modal.component";
import { ImageServiceType } from "../../utils/image-service";

const BackgroundSourcePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

    const handleSearchButtonClick = (event) => {
        setIsSearchModalOpen(true);
    };

    const handleChangeLocationFromSearch = (newSpec) => {
        if (newSpec.url === ImageSearchNoImage) {
            newSpec.url = null;
        }
        propUpdateCallback(propOption.type, newSpec);
        setIsSearchModalOpen(false);
    };

    const handleCancelLocationFromSearch = () => {
        setIsSearchModalOpen(false);
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
                Background Image
            </Button>
            <ImageSearchModal
                open={isSearchModalOpen}
                question="Image Search"
                textLabel="Search Term"
                selectionCallback={handleChangeLocationFromSearch}
                cancelCallback={handleCancelLocationFromSearch}
                preferredService={ImageServiceType.Unsplash}
                allowNoImage={true}
            />
        </div>
    );
};

export default BackgroundSourcePropertyPanel;