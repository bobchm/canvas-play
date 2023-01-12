import "./bhvrlist-styles.css";
import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import ListModal from "../list-modal/list-modal.component";
import BhvrEditModal from "./bhvredit-proppanel.component";
import ScriptEditor from "../script-editor/script-editor.component";
import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

function itemsFromBehavior(bhvr) {
    return bhvr.compiled.map((node) => BehaviorManager.sourceFromNode(node));
}

const maxItemSize = 24;

const BehaviorListPropertyPanel = ({
    inBehavior,
    behaviorCallback,
    appManager,
    focusHandler,
}) => {
    const [behavior, setBehavior] = useState(inBehavior || []);
    //const [items, setItems] = useState(itemsFromBehavior(inBehavior));
    const [isFunctionPickerOpen, setIsFunctionPickerOpen] = useState(false);
    const [editedFunctionIdx, setEditedFunctionIdx] = useState(-1);
    const [editedArgs, setEditedArgs] = useState([]);
    const [areArgumentsOpen, setAreArgumentsOpen] = useState(false);
    const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);

    function handleDragEnd(fromIndex, toIndex) {
        if (fromIndex >= 0 && toIndex >= 0) {
            // do the reordering on the compiled nodes
            var bhvrNodes = behavior.compiled;
            var removed = bhvrNodes.splice(fromIndex, 1);
            bhvrNodes.splice(toIndex, 0, ...removed);

            // establish the new behavior
            var newBehavior = BehaviorManager.behaviorFromCompiled(bhvrNodes);
            setBehavior(newBehavior);
            //setItems(itemsFromBehavior(newBehavior));
            behaviorCallback(newBehavior);
        }
    }

    function handleDelete(idx) {
        var bhvrNodes = behavior.compiled;
        bhvrNodes.splice(idx, 1);
        var newBehavior = BehaviorManager.behaviorFromCompiled(bhvrNodes);
        setBehavior(newBehavior);
        //setItems(itemsFromBehavior(newBehavior));
        behaviorCallback(newBehavior);
    }

    function handleAddFunction() {
        setIsFunctionPickerOpen(true);
        if (focusHandler) focusHandler(true);
    }

    function handleCloseFunctionPicker(fnName) {
        setIsFunctionPickerOpen(false);
        if (focusHandler) focusHandler(false);
        if (fnName && fnName.length > 0) {
            var newBehavior = BehaviorManager.appendFunctionToBehavior(
                behavior,
                fnName
            );
            if (newBehavior) {
                setBehavior(newBehavior);
                //setItems(itemsFromBehavior(newBehavior));
                behaviorCallback(newBehavior);
            }
        }
    }

    function handleEdit(idx) {
        var args = BehaviorManager.getFunctionArgumentDescriptions(
            behavior,
            idx
        );
        if (args) {
            setEditedFunctionIdx(idx);
            setEditedArgs(args);
            setAreArgumentsOpen(true);
            if (focusHandler) focusHandler(true);
        }
    }

    function handleEditCompleted(args) {
        setAreArgumentsOpen(false);
        if (focusHandler) focusHandler(false);
        if (args) {
            var newBehavior = BehaviorManager.setFunctionArguments(
                behavior,
                editedFunctionIdx,
                args
            );
            setEditedFunctionIdx(null);
            setEditedArgs(null);
            if (newBehavior) {
                setBehavior(newBehavior);
                //setItems(itemsFromBehavior(newBehavior));
                behaviorCallback(newBehavior);
            }
        }
    }

    function handleEditScript() {
        setIsScriptEditorOpen(true);
        if (focusHandler) focusHandler(true);
    }

    function handleCloseBhvrEditor(newBehavior) {
        setIsScriptEditorOpen(false);
        if (focusHandler) focusHandler(false);
        if (newBehavior) {
            setBehavior(newBehavior);
            behaviorCallback(newBehavior);
        }
    }

    function prepForDisplay(item) {
        if (!item || item.length < maxItemSize) return item;
        return item.substring(0, maxItemSize) + "...";
    }

    var items = itemsFromBehavior(behavior);

    return (
        <div>
            <Stack
                className="container"
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
                sx={{ paddingBottom: "5px" }}
            >
                {items.length > 0 && (
                    <ReactDragListView
                        onDragEnd={handleDragEnd}
                        nodeSelector="li"
                        handleSelector="a"
                        style={{ width: "280px" }}
                    >
                        {items.map((item, idx) => (
                            <li className="bhvr-li" key={idx}>
                                <a href="#" style={{ color: "#000000" }}>
                                    <MenuRoundedIcon />
                                </a>
                                <span className="bhvr-text">
                                    {prepForDisplay(item)}
                                </span>
                                <span className="bhvr-icons">
                                    {BehaviorManager.hasFunctionArguments(
                                        behavior,
                                        idx
                                    ) ? (
                                        <IconButton
                                            style={{ padding: "1px" }}
                                            onClick={(e) => handleEdit(idx)}
                                        >
                                            <EditRoundedIcon />
                                        </IconButton>
                                    ) : (
                                        ""
                                    )}
                                    <IconButton
                                        style={{ padding: "1px" }}
                                        onClick={(e) => handleDelete(idx)}
                                    >
                                        <DeleteRoundedIcon />
                                    </IconButton>
                                </span>
                            </li>
                        ))}
                    </ReactDragListView>
                )}
                <Stack
                    className="container"
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
                        onClick={handleAddFunction}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "black",
                            borderColor: "black",
                        }}
                        onClick={handleEditScript}
                    >
                        Edit
                    </Button>
                </Stack>
            </Stack>
            <ListModal
                title="Select Behavior"
                elements={BehaviorManager.allFunctionNames()}
                onClose={handleCloseFunctionPicker}
                open={isFunctionPickerOpen}
            />
            {areArgumentsOpen && (
                <BhvrEditModal
                    bhvrArgs={editedArgs}
                    appManager={appManager}
                    closeCallback={handleEditCompleted}
                />
            )}
            {isScriptEditorOpen && (
                <ScriptEditor
                    behavior={behavior}
                    onClose={handleCloseBhvrEditor}
                    open={isScriptEditorOpen}
                    appManager={appManager}
                />
            )}
        </div>
    );
};

export default BehaviorListPropertyPanel;
