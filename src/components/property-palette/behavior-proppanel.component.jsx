import "./behavior-styles.css";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import ScriptEditor from "../script-editor/script-editor.component";

const BehaviorPropertyPanel = ({
    propOption,
    propUpdateCallback,
    appManager,
}) => {
    const [behavior, setBehavior] = useState(propOption.current || []);
    const [isBhvrEditorOpen, setIsBhvrEditorOpen] = useState(false);

    function handleEditBehavior() {
        setIsBhvrEditorOpen(true);
    }

    function handleCloseBhvrEditor(newBehavior) {
        setIsBhvrEditorOpen(false);
        if (newBehavior) {
            setBehavior(newBehavior);
            propUpdateCallback(propOption.type, newBehavior);
        }
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
                sx={{ paddingBottom: "5px" }}
            >
                <Typography display="block" variant="button" mt={0} mb={0}>
                    Behavior
                </Typography>
                <div className="behavior-label">{behavior.source}</div>
                <Button
                    variant="outlined"
                    sx={{
                        color: "black",
                        borderColor: "black",
                    }}
                    onClick={handleEditBehavior}
                >
                    Edit Behavior
                </Button>
            </Stack>
            {isBhvrEditorOpen && (
                <ScriptEditor
                    behavior={behavior}
                    onClose={handleCloseBhvrEditor}
                    open={isBhvrEditorOpen}
                    appManager={appManager}
                />
            )}
        </Paper>
    );
};

export default BehaviorPropertyPanel;
