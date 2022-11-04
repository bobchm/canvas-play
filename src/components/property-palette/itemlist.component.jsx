import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const ItemListPropertyPanel = ({
    propOption,
    propUpdateCallback,
    items,
    title,
}) => {
    const [value, setValue] = useState(propOption.current);

    const elementSpacing = 1;

    function updateValue(newValue) {
        propUpdateCallback(propOption.type, newValue);
        setValue(newValue);
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
                    {title}
                </Typography>
                <Select
                    aria-label="font-family"
                    id={title}
                    value={value}
                    label={title}
                    sx={{
                        minWidth: "90%",
                        fontSize: 13,
                        height: 40,
                        mt: elementSpacing,
                        mb: elementSpacing,
                    }}
                    onChange={(e, child) => updateValue(e.target.value)}
                >
                    {items.map((item, idx) => (
                        <MenuItem key={idx} value={item.value}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Paper>
    );
};

export default ItemListPropertyPanel;
