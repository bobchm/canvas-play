import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

export default function ScriptEditor({ open, appManager, behavior, onClose }) {
    const [bhvr, setBhvr] = useState(behavior);
    const [isModified, setIsModified] = useState(false);

    function handleOK() {
        if (!isModified) {
            onClose(null);
            return;
        }

        // attempt to parse
        try {
            var ast = BehaviorManager.parseSource(bhvr.source);
            onClose({ source: bhvr.source, compiled: ast });
        } catch (err) {
            alert(err);
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                onClose(null);
            }}
            style={{
                left: "10%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper sx={{ width: "80%", height: "95%", margin: "10px" }}>
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ margin: "2% 2% 2% 2%", height: "100%" }}
                    spacing={2}
                >
                    <Typography variant="h3" align="center">
                        Script Editor
                    </Typography>
                    <TextField
                        value={bhvr.source}
                        sx={{ height: "100%" }}
                        onChange={(e) => {
                            setIsModified(true);
                            setBhvr({ source: e.target.value, compiled: null });
                        }}
                        label={"Script"}
                        multiline
                        fullWidth
                        rows={5}
                    />
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{ paddingBottom: "5px" }}
                    >
                        <Button
                            variant="outlined"
                            sx={{
                                color: "black",
                                borderColor: "black",
                            }}
                            onClick={() => handleOK()}
                        >
                            OK
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "black",
                                borderColor: "black",
                            }}
                            onClick={() => onClose(null)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Modal>
    );
}
