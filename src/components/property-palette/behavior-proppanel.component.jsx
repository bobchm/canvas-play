import "./behavior-styles.css";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import ScriptEditor from "../script-editor/script-editor.component";
import BehaviorListPropertyPanel from "./bhvrlist-proppanel.component";
import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

const BehaviorPropertyPanel = ({
    propOption,
    propUpdateCallback,
    appManager,
    title,
    focusHandler,
}) => {
    const [behavior, setBehavior] = useState(propOption.current || []);
    const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);

    // state for "simple" mode editing

    function handleEditBehavior() {
        setIsScriptEditorOpen(true);
        focusHandler(true);
    }

    function handleCloseBhvrEditor(newBehavior) {
        setIsScriptEditorOpen(false);
        focusHandler(false);

        if (newBehavior) {
            setBehavior(newBehavior);
            propUpdateCallback(propOption.type, newBehavior);
        }
    }

    function isBehaviorSimple() {
        return BehaviorManager.isBehaviorSimple(behavior);
    }

    function simpleBehaviorCallback(newBehavior) {
        setBehavior(newBehavior);
        propUpdateCallback(propOption.type, newBehavior);
    }

    function simpleBehaviorUI() {
        return (
            <BehaviorListPropertyPanel
                inBehavior={behavior}
                behaviorCallback={simpleBehaviorCallback}
                appManager={appManager}
                focusHandler={focusHandler}
            />
        );
    }

    function complexBehaviorUI() {
        return (
            <>
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
            </>
        );
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
                    {title}
                </Typography>
                {isBehaviorSimple() ? simpleBehaviorUI() : complexBehaviorUI()}
            </Stack>
            {isScriptEditorOpen && (
                <ScriptEditor
                    behavior={behavior}
                    onClose={handleCloseBhvrEditor}
                    open={isScriptEditorOpen}
                    appManager={appManager}
                />
            )}
        </Paper>
    );
};

export default BehaviorPropertyPanel;
