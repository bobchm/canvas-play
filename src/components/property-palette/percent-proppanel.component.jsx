import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const PercentPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [value, setValue] = React.useState(propOption.current || 50);

    const marks = [
        {
            value: 0,
            label: "0%",
        },
        {
            value: 25,
            label: "25%",
        },
        {
            value: 50,
            label: "50%",
        },
        {
            value: 75,
            label: "75%",
        },
        {
            value: 100,
            label: "100%",
        },
    ];

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
                <Slider
                    sx={{ width: "80%", marginTop: "10px" }}
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
            </Grid>
        </Paper>
    );
};

export default PercentPropertyPanel;
