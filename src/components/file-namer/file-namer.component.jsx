import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export default function FileNamer({
    open,
    question,
    contentText = null,
    extension,
    confirmLabel,
    confirmCallback,
    cancelLabel,
    cancelCallback,
}) {
    const [fileName, setFileName] = useState("");

    return (
        <div>
            <Dialog open={open} onClose={() => cancelCallback()}>
                <DialogTitle>{question}</DialogTitle>
                <DialogContent>
                    {contentText !== null && (
                        <DialogContentText>{contentText}</DialogContentText>
                    )}
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
                        <Typography>{extension}</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => cancelCallback()}>
                        {cancelLabel}
                    </Button>
                    <Button onClick={() => confirmCallback(fileName)}>
                        {confirmLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
