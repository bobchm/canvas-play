import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FilePicker({
    open,
    question,
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
                    <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="center"
                        spacing={2}
                        sx={{ width: "100%" }}
                    >
                        <input
                            type="file"
                            onChange={(e) => setFileName(e.target.files[0])}
                        />
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
