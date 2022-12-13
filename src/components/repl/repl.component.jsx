import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AccordionMenu from "../accordion-menu/accordion-menu.component";

import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

export default function ScriptRepl({ open, onClose }) {
    const [inputScript, setInputScript] = useState("");
    const [runningScript, setRunningScript] = useState("");
    const [selectionStart, setSelectionStart] = React.useState();
    const updateSelectionStart = () =>
        setSelectionStart(inputRef.current.selectionStart);

    const inputRef = React.useRef();
    const outputRef = React.useRef();

    function handleClose() {
        onClose();
        return;
    }

    function onFunctionSelection(fnName) {
        var fnSpec = BehaviorManager.functionFromName(fnName);
        var insert = fnName + "(";
        if (fnSpec.params) {
            for (let i = 0; i < fnSpec.params.length; i++) {
                var param = fnSpec.params[i];
                if (i > 0) {
                    insert += ", ";
                }
                insert += "<" + param.name + ">";
            }
        }
        insert += ")";
        var source = inputScript;
        var newSource =
            source.slice(0, selectionStart) +
            insert +
            source.slice(selectionStart);
        setInputScript(newSource);
        inputRef.current.focus();
    }

    function handleEnter() {
        if (inputScript.length) {
            var value = BehaviorManager.runSource(inputScript);
            var newRunning =
                runningScript + "\n> " + inputScript + "\n" + value;
            setRunningScript(newRunning);
        }
        setInputScript("");
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
            <Paper sx={{ width: "50%", height: "auto", margin: "10px" }}>
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ margin: "2% 2% 2% 2%", height: "100%" }}
                    spacing={2}
                >
                    <Typography variant="h3" align="center">
                        REPL
                    </Typography>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{ paddingBottom: "5px", width: "100%" }}
                    >
                        <AccordionMenu
                            items={BehaviorManager.categorizedFunctionNames()}
                            callback={onFunctionSelection}
                        />
                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            spacing={2}
                            sx={{ paddingBottom: "5px", width: "100%" }}
                        >
                            <TextField
                                value={runningScript}
                                sx={{ height: "100%" }}
                                label={"Script"}
                                multiline
                                fullWidth
                                minRows={10}
                                maxRows={10}
                                outputRef={outputRef}
                            />
                            <TextField
                                value={inputScript}
                                sx={{ height: "100%" }}
                                onSelect={updateSelectionStart}
                                onChange={(e) => {
                                    setInputScript(e.target.value);
                                    updateSelectionStart();
                                }}
                                onKeyPress={(ev) => {
                                    if (ev.key === "Enter") {
                                        handleEnter();
                                    }
                                }}
                                label={"Script"}
                                fullWidth
                                inputRef={inputRef}
                            />
                        </Stack>
                    </Stack>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "black",
                            borderColor: "black",
                            paddingBottom: "5px",
                        }}
                        onClick={() => handleClose()}
                    >
                        Close
                    </Button>
                </Stack>
            </Paper>
        </Modal>
    );
}
