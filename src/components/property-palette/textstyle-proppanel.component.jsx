import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughRoundedIcon from "@mui/icons-material/FormatStrikethroughRounded";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const TextStylePropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [textStyle, setTextStyle] = useState(propOption.current);
    const sizeOptions = [
        "8",
        "9",
        "10",
        "11",
        "12",
        "14",
        "16",
        "18",
        "20",
        "24",
        "28",
        "32",
        "36",
        "40",
        "44",
        "48",
        "54",
        "60",
        "66",
        "72",
        "80",
    ];
    const familyOptions = [
        "Arial",
        "Brush Script MT",
        "Courier New",
        "Garamond",
        "Georgia",
        "Helvetica",
        "Tahoma",
        "Times New Roman",
        "Trebuchet MS",
    ];
    const elementSpacing = 1;

    function updateStyle(update) {
        var newValue = { ...textStyle, ...update };
        propUpdateCallback(propOption.type, newValue);
        setTextStyle(newValue);
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
                    id="font-family"
                    value={textStyle.fontFamily}
                    label="Family"
                    sx={{
                        width: "90%",
                        fontSize: 13,
                        height: 40,
                        mt: elementSpacing,
                    }}
                    onChange={(e, child) =>
                        updateStyle({ fontFamily: e.target.value })
                    }
                >
                    {familyOptions.map((family, idx) => (
                        <MenuItem key={idx} value={family}>
                            {family}
                        </MenuItem>
                    ))}
                </Select>

                <Autocomplete
                    disablePortal
                    disableClearable
                    id="font-size"
                    options={sizeOptions}
                    value={textStyle.fontSize.toString()}
                    onChange={(e, newValue) =>
                        updateStyle({ fontSize: parseInt(newValue) })
                    }
                    sx={{
                        width: "90%",
                        mt: elementSpacing,
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Size" size="small" />
                    )}
                />
                <ToggleButtonGroup
                    value={textStyle.alignment}
                    exclusive
                    onChange={(e, newValue) =>
                        updateStyle({ alignment: newValue })
                    }
                    aria-label="text alignment"
                    sx={{ mt: elementSpacing }}
                >
                    <ToggleButton
                        size="small"
                        value="left"
                        aria-label="left aligned"
                    >
                        <FormatAlignLeftIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="center"
                        aria-label="centered"
                    >
                        <FormatAlignCenterIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="right"
                        aria-label="right aligned"
                    >
                        <FormatAlignRightIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    value={textStyle.styles}
                    onChange={(e, newValue) =>
                        updateStyle({ styles: newValue })
                    }
                    aria-label="text formatting"
                    sx={{ mt: elementSpacing, mb: elementSpacing }}
                >
                    <ToggleButton size="small" value="bold" aria-label="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="italic"
                        aria-label="italic"
                    >
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="underline"
                        aria-label="underline"
                    >
                        <FormatUnderlinedIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="strikethrough"
                        aria-label="strikethrough"
                    >
                        <FormatStrikethroughRoundedIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        </Paper>
    );
};

export default TextStylePropertyPanel;
