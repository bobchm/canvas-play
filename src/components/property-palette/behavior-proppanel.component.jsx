import "./behavior-styles.css";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const BehaviorListPropertyPanel = ({
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
        <div className="behavior-container">
            <Stack
                className="container"
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
                sx={{ paddingBottom: "5px" }}
            >
                <Typography display="block" variant="button" mt={0} mb={0}>
                    Behaviors
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
            <ScriptEditor
                behavior={behavior}
                onClose={handleCloseBhvrEditor}
                open={isBhvrEditorOpen}
                appManager={appManager}
            />
        </div>
    );
};

export default BehaviorListPropertyPanel;
