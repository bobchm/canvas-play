import React from "react";
import Button from "@mui/material/Button";
import ImageSearchModal, {
    ImageSearchNoImage,
} from "../image-search-modal/image-search-modal.component";
import { ImageServiceType } from "../../utils/image-service";

const SymbolSourcePropertyPanel = ({
    propOption,
    propUpdateCallback,
    focusHandler,
}) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

    const handleSearchButtonClick = (event) => {
        setIsSearchModalOpen(true);
        if (focusHandler) focusHandler(true);
    };

    const handleChangeLocationFromSearch = (newLocation) => {
        if (newLocation === ImageSearchNoImage) {
            newLocation = null;
        }
        propUpdateCallback(propOption.type, newLocation);
        setIsSearchModalOpen(false);
        if (focusHandler) focusHandler(false);
    };

    const handleCancelLocationFromSearch = () => {
        setIsSearchModalOpen(false);
        if (focusHandler) focusHandler(false);
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
                Symbol Search
            </Button>
            <ImageSearchModal
                open={isSearchModalOpen}
                question="Symbol Search"
                textLabel="Search Term"
                selectionCallback={handleChangeLocationFromSearch}
                cancelCallback={handleCancelLocationFromSearch}
                preferredService={ImageServiceType.ARASAAC}
                allowNoImage={true}
            />
        </div>
    );
};

export default SymbolSourcePropertyPanel;
