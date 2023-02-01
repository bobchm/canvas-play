import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import TaggedAutocomplete from "../tagged-autocomplete/tagged-autocomplete.component";

const orientationOptions = [
    { name: "Landscape", value: "landscape" },
    { name: "Portrait", value: "portrait" },
];

const formatOptions = [
    { name: "Letter", value: "letter" },
    { name: "Legal", value: "legal" },
    { name: "A4", value: "A4" },
];

export default function PrintDialog({
    open,
    question,
    pageOptions,
    confirmCallback,
    cancelCallback,
}) {
    const [fileName, setFileName] = useState("");
    const [printPages, setPrintPages] = useState(null);
    const [allPages, setAllPages] = useState(true);
    const [orientation, setOrientation] = useState("landscape");
    const [format, setFormat] = useState("letter");

    const handleOrientationChange = (newValue) => {
        setOrientation(newValue);
    };

    const handleFormatChange = (newValue) => {
        setFormat(newValue);
    };

    const handlePageNamesChange = (newPages) => {
        setPrintPages(newPages);
    };

    const handlePagesChange = (e, newValue) => {
        setAllPages(newValue === "all");
    };

    return (
        <div>
            <Dialog open={open} onClose={() => cancelCallback()}>
                <DialogTitle>{question}</DialogTitle>
                <DialogContent>
                    <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="center"
                        spacing={2}
                        sx={{ width: "100%" }}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={fileName}
                            type="text"
                            sx={{ width: "70%" }}
                            variant="standard"
                            onChange={(event) =>
                                setFileName(event.target.value)
                            }
                        />
                        <Typography>pdf</Typography>
                    </Stack>
                    <Select
                        id="orientation"
                        value={orientation}
                        label="Orientation"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleOrientationChange(e.target.value)
                        }
                    >
                        {orientationOptions.map((opt, idx) => (
                            <MenuItem key={idx} value={opt.value}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        id="format"
                        value={format}
                        label="Format"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleFormatChange(e.target.value)
                        }
                    >
                        {formatOptions.map((opt, idx) => (
                            <MenuItem key={idx} value={opt.value}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <RadioGroup defaultValue="all" onChange={handlePagesChange}>
                        <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="All Pages"
                        />
                        <FormControlLabel
                            value="selected"
                            control={<Radio />}
                            label="Select Pages"
                        />
                    </RadioGroup>
                    <TaggedAutocomplete
                        tagOptions={pageOptions}
                        tagCallback={handlePageNamesChange}
                        tagsName="Pages"
                        disabled={allPages}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => cancelCallback()}>Cancel</Button>
                    <Button
                        onClick={() =>
                            confirmCallback({
                                filename: fileName + ".pdf",
                                orientation: orientation,
                                format: format,
                                pageList: allPages ? null : printPages,
                            })
                        }
                    >
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
