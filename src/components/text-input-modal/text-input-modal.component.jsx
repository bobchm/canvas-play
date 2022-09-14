import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function TextInputModal({
    open,
    question,
    contentText = null,
    textLabel,
    inputType = "text",
    yesLabel,
    yesCallback,
    noLabel,
    noCallback,
}) {
    const [inputText, setInputText] = useState("");

    return (
        <div>
            <Dialog open={open} onClose={() => noCallback(inputText)}>
                <DialogTitle>{question}</DialogTitle>
                <DialogContent>
                    {contentText !== null && (
                        <DialogContentText>{contentText}</DialogContentText>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={textLabel}
                        type={inputType}
                        fullWidth
                        variant="standard"
                        onChange={(event) => setInputText(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => noCallback(inputText)}>
                        {noLabel}
                    </Button>
                    <Button onClick={() => yesCallback(inputText)}>
                        {yesLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
