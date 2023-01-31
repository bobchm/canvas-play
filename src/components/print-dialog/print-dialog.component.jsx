import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import TaggedAutocomplete from "../tagged-autocomplete/tagged-autocomplete.component";

export default function PrintDialog({
    open,
    question,
    confirmCallback,
    cancelCallback,
}) {
    const [fileName, setFileName] = useState("");

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
                    <TaggedAutocomplete />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => cancelCallback()}>Cancel</Button>
                    <Button onClick={() => confirmCallback(fileName)}>
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
