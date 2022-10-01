import React from "react";
import Button from "@mui/material/Button";

const EmbedImagePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [isEmbedded, setIsEmbedded] = React.useState(propOption.current);

    const handleClick = (event) => {
        propUpdateCallback(propOption.type, true);
        setIsEmbedded(true);
    };

    return (
        <Button
            sx={{
                width: "100%",
                color: "black",
                borderColor: "black",
                textTransform: "none",
                backgroundColor: "azure",
            }}
            onClick={handleClick}
            variant="outlined"
            disabled={isEmbedded}
        >
            Embed Image
        </Button>
    );
};

export default EmbedImagePropertyPanel;
