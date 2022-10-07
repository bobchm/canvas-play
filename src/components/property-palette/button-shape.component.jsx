import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SymbolButtonShapes } from "../../utils/symbol-button";

const ButtonShapePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [shape, setShape] = useState(propOption.current);

    const elementSpacing = 1;

    function updateShape(newValue) {
        propUpdateCallback(propOption.type, newValue);
        setShape(newValue);
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
                <Select
                    aria-label="font-family"
                    id="shape"
                    value={shape}
                    label="Shape"
                    sx={{
                        width: "90%",
                        fontSize: 13,
                        height: 40,
                        mt: elementSpacing,
                    }}
                    onChange={(e, child) => updateShape(e.target.value)}
                >
                    {SymbolButtonShapes.map((shape, idx) => (
                        <MenuItem key={idx} value={shape.value}>
                            {shape.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Paper>
    );
};

export default ButtonShapePropertyPanel;
