import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AccordionMenu from "../accordion-menu/accordion-menu.component";

import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

export default function ScriptEditor({ open, appManager, behavior, onClose }) {
    const [bhvr, setBhvr] = useState(behavior);
    const [isModified, setIsModified] = useState(false);
    const [selectionStart, setSelectionStart] = React.useState();
    const updateSelectionStart = () =>
        setSelectionStart(inputRef.current.selectionStart);

    const inputRef = React.useRef();

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
            if (err.token) {
                inputRef.current.setSelectionRange(
                    err.token.offset,
                    err.token.offset
                );
            }
            inputRef.current.focus();
        }
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
        var source = bhvr.source;
        var newSource =
            source.slice(0, selectionStart) +
            insert +
            source.slice(selectionStart);
        setBhvr({ source: newSource, compiled: null });
        inputRef.current.focus();
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
                        Script Editor
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
                        <TextField
                            value={bhvr.source}
                            sx={{ height: "100%" }}
                            onSelect={updateSelectionStart}
                            onChange={(e) => {
                                setIsModified(true);
                                setBhvr({
                                    source: e.target.value,
                                    compiled: null,
                                });
                                updateSelectionStart();
                            }}
                            label={"Script"}
                            multiline
                            fullWidth
                            minRows={10}
                            maxRows={10}
                            inputRef={inputRef}
                            inputProps={{ spellCheck: "false" }}
                        />
                    </Stack>
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
