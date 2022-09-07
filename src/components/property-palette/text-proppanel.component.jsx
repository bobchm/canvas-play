import React from "react";
import TextField from "@mui/material/TextField";

const TextPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [value, setValue] = React.useState(propOption.current || "");

    return (
        <TextField
            sx={{
                width: "100%",
                backgroundColor: "antiquewhite",
                color: "black",
            }}
            value={value}
            label={propOption.type.name}
            onChange={(e) => {
                propUpdateCallback(propOption.type, e.target.value);
                setValue(e.target.value);
            }}
        />
    );
};

export default TextPropertyPanel;
