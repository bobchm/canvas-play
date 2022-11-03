import "./bhvrlist-styles.css";
import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ListModal from "../list-modal/list-modal.component";
import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";

function itemsFromBehaviors(bhvrs) {
    return bhvrs.map((bhvr) => bhvr.getDisplay());
}

const BehaviorListPropertyPanel = ({
    propOption,
    propUpdateCallback,
    objects,
}) => {
    const [bhvrs, setBhvrs] = useState(propOption.current || []);
    const [items, setItems] = useState(itemsFromBehaviors(bhvrs));
    const [isBhvrPickerOpen, setIsBhvrPickerOpen] = useState(false);
    const [editObject] = useState(objects[0]);

    function handleDragEnd(fromIndex, toIndex) {
        console.log(`${fromIndex} ==> ${toIndex}`);
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
            var cls = BehaviorManager.behaviorFromName(bhvrName);
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

    function handleBehaviorSelect(idx) {
        console.log("behavior select");
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
                        <li
                            key={idx}
                            onClick={(e) => handleBehaviorSelect(idx)}
                        >
                            <IconButton onClick={(e) => handleDelete(idx)}>
                                <DeleteRoundedIcon />
                            </IconButton>
                            {item}
                            <a href="#" style={{ color: "#000000" }}>
                                <MenuRoundedIcon />
                            </a>
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
        </div>
    );
};

export default BehaviorListPropertyPanel;
