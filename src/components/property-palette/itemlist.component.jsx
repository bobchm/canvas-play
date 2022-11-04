import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

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
            <Stack
                className="container"
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
                sx={{ paddingBottom: "5px", paddingTop: "10px" }}
            >
                <FormControl style={{ minWidth: 120 }}>
                    <InputLabel htmlFor="selected-language">{title}</InputLabel>
                    <Select
                        aria-label="font-family"
                        id={title}
                        value={value}
                        label={title}
                        sx={{
                            fontSize: 13,
                            height: 40,
                            mt: elementSpacing,
                            mb: elementSpacing,
                            ml: elementSpacing,
                            mr: elementSpacing,
                        }}
                        onChange={(e, child) => updateValue(e.target.value)}
                    >
                        {items.map((item, idx) => (
                            <MenuItem key={idx} value={item.value}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </Paper>
    );
};

export default ItemListPropertyPanel;
