import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const PercentPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [value, setValue] = React.useState(propOption.current || 50);

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "azure",
                border: 1,
                boderColor: "black",
            }}
        >
            <Stack
                className="container"
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
            >
                <Slider
                    sx={{ width: "80%", marginTop: "40px" }}
                    aria-label={propOption.type.name}
                    min={0}
                    max={100}
                    value={value}
                    // marks={marks}
                    valueLabelDisplay="on"
                    onChange={(e, newValue) => {
                        propUpdateCallback(propOption.type, newValue);
                        setValue(newValue);
                    }}
                />
                <Typography>Opacity</Typography>
            </Stack>
        </Paper>
    );
};

export default PercentPropertyPanel;
