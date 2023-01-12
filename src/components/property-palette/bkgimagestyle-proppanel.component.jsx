import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { BackgroundImageStyle } from "../../utils/canvas-constants";

const backgroundStyles = [
    { name: "Center", style: BackgroundImageStyle.Center },
    { name: "Stretch", style: BackgroundImageStyle.Stretch },
];

const BackgroundImageStylePropertyPanel = ({
    propOption,
    propUpdateCallback,
}) => {
    const [style, setStyle] = useState(propOption.current);

    const elementSpacing = 1;

    function updateStyle(newValue) {
        propUpdateCallback(propOption.type, newValue);
        setStyle(newValue);
    }

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
                <Typography variant="button" mt={0} mb={0}>
                    Style
                </Typography>
                <Select
                    aria-label="font-family"
                    id="shape"
                    value={style}
                    label="Style"
                    sx={{
                        width: "90%",
                        fontSize: 13,
                        height: 40,
                        mt: elementSpacing,
                        mb: elementSpacing,
                    }}
                    onChange={(e, child) => updateStyle(e.target.value)}
                >
                    {backgroundStyles.map((style, idx) => (
                        <MenuItem key={idx} value={style.style}>
                            {style.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Paper>
    );
};

export default BackgroundImageStylePropertyPanel;
