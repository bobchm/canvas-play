import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const TextPropertyPanel = ({
    propOption,
    propUpdateCallback,
    focusHandler,
}) => {
    const [value, setValue] = React.useState(propOption.current || "");

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "azure",
                border: 1,
                boderColor: "black",
            }}
        >
            <Grid container justifyContent="Center">
                <TextField
                    sx={{
                        backgroundColor: "azure",
                        color: "black",
                        mt: 1,
                        mb: 1,
                        width: "90%",
                    }}
                    value={value}
                    label={propOption.type.name}
                    onFocus={() => (focusHandler ? focusHandler(true) : null)}
                    onBlur={() => (focusHandler ? focusHandler(false) : null)}
                    onChange={(e) => {
                        propUpdateCallback(propOption.type, e.target.value);
                        setValue(e.target.value);
                    }}
                />
            </Grid>
        </Paper>
    );
};

export default TextPropertyPanel;
