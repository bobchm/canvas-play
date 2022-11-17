import "./bhvrlist-styles.css";
import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import ListModal from "../list-modal/list-modal.component";
import BhvrEditModal from "./bhvredit-proppanel.component";
import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

function itemsFromBehaviors(bhvrs) {
    return bhvrs.map((bhvr) => bhvr.getDisplay());
}

const BehaviorListPropertyPanel = ({
    propOption,
    propUpdateCallback,
    objects,
    appManager,
}) => {
    const [bhvrs, setBhvrs] = useState(propOption.current || []);
    const [items, setItems] = useState(itemsFromBehaviors(bhvrs));
    const [isBhvrPickerOpen, setIsBhvrPickerOpen] = useState(false);
    const [editObject] = useState(objects[0]);
    const [editedBhvr, setEditedBhvr] = useState(null);
    const [editedArgs, setEditedArgs] = useState([]);
    const [areArgumentsOpen, setAreArgumentsOpen] = useState(false);

    function handleDragEnd(fromIndex, toIndex) {
        if (fromIndex >= 0 && toIndex >= 0) {
            var oldBhvrs = bhvrs;
            var removed = oldBhvrs.splice(fromIndex, 1);
            oldBhvrs.splice(toIndex, 0, ...removed);
            setBhvrs(oldBhvrs);
            setItems(itemsFromBehaviors(oldBhvrs));
            propUpdateCallback(propOption.type, oldBhvrs);
        }
    }

    function handleDelete(idx) {
        var oldBhvrs = bhvrs;
        oldBhvrs.splice(idx, 1);
        setBhvrs(oldBhvrs);
        setItems(itemsFromBehaviors(oldBhvrs));
        propUpdateCallback(propOption.type, oldBhvrs);
    }

    function handleAddBehavior() {
        setIsBhvrPickerOpen(true);
    }

    function handleCloseBhvrPicker(bhvrName) {
        setIsBhvrPickerOpen(false);
        if (bhvrName && bhvrName.length > 0) {
            var cls = BehaviorManager.functionFromName(bhvrName);
            if (cls) {
                var instBhvrs = BehaviorManager.instantiateBehaviors(
                    editObject,
                    [
                        {
                            id: cls.id,
                        },
                    ]
                );
                var newBhvrs = [...bhvrs, instBhvrs[0]];
                setBhvrs(newBhvrs);
                setItems(itemsFromBehaviors(newBhvrs));
                propUpdateCallback(propOption.type, newBhvrs);
            }
        }
    }

    function handleEdit(idx) {
        var bhvr = bhvrs[idx];
        var args = bhvr.getArguments();
        if (args) {
            setEditedBhvr(bhvr);
            setEditedArgs(args);
            setAreArgumentsOpen(true);
        }
    }

    function handleEditCompleted(args) {
        setAreArgumentsOpen(false);
        if (args) {
            editedBhvr.setArguments(args);
            setEditedBhvr(null);
            setEditedArgs(null);
            setItems(itemsFromBehaviors(bhvrs));
            propUpdateCallback(propOption.type, bhvrs);
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
                <ReactDragListView
                    onDragEnd={handleDragEnd}
                    nodeSelector="li"
                    handleSelector="a"
                    style={{ width: "280px" }}
                >
                    {items.map((item, idx) => (
                        <li key={idx}>
                            <a href="#" style={{ color: "#000000" }}>
                                <MenuRoundedIcon />
                            </a>
                            <span className="bhvr-text">{item}</span>
                            <span className="bhvr-icons">
                                {bhvrs[idx].hasArguments() ? (
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
                <Button
                    variant="outlined"
                    sx={{
                        color: "black",
                        borderColor: "black",
                    }}
                    onClick={handleAddBehavior}
                >
                    Add Behavior
                </Button>
            </Stack>
            <ListModal
                title="Select Behavior"
                elements={BehaviorManager.allBehaviorNames()}
                onClose={handleCloseBhvrPicker}
                open={isBhvrPickerOpen}
            />
            {areArgumentsOpen && (
                <BhvrEditModal
                    bhvrArgs={editedArgs}
                    appManager={appManager}
                    closeCallback={handleEditCompleted}
                    object={objects}
                />
            )}
        </div>
    );
};

export default BehaviorListPropertyPanel;
