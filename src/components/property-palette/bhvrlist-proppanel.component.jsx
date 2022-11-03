import "./bhvrlist-styles.css";
import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
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

    function handleDragEnd(fromIndex, toIndex) {
        console.log(`${fromIndex} ==> ${toIndex}`);
        if (fromIndex >= 0 && toIndex >= 0) {
            var oldBhvrs = bhvrs;
            var removed = oldBhvrs.splice(fromIndex, 1);
            oldBhvrs.splice(toIndex, 0, ...removed);
            setBhvrs(oldBhvrs);
            setItems(itemsFromBehaviors(oldBhvrs));
        }
    }

    function handleDelete(idx) {
        var oldBhvrs = bhvrs;
        oldBhvrs.splice(idx, 1);
        setBhvrs(oldBhvrs);
        setItems(itemsFromBehaviors(oldBhvrs));
    }

    function handleAddBehavior() {
        setIsBhvrPickerOpen(true);
    }

    function handleCloseBhvrPicker(bhvrName) {
        setIsBhvrPickerOpen(false);
        if (bhvrName && bhvrName.length > 0) {
            var cls = BehaviorManager.behaviorFromName(bhvrName);
            if (cls) {
                var bhvr = BehaviorManager.instantiate(objects[0], {
                    id: cls.id,
                });
                var newBhvrs = [...bhvrs, bhvr];
                setBhvrs(newBhvrs);
                setItems(itemsFromBehaviors(newBhvrs));
            }
        }
    }

    return (
        <div className="behavior-container">
            <Grid container justifyContent="Center">
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
                <Button variant="outlined" onClick={handleAddBehavior}>
                    Add Behavior
                </Button>
            </Grid>
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
