import "./bhvrlist-styles.css";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { BehaviorListItem } from "./bhvritem-proppanel.component";
import { Reorder } from "framer-motion";

function itemsFromBehaviors(bhvrs) {
    return bhvrs.map((bhvr) => bhvr.getDisplay());
}

const BehaviorListPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [bhvrs, setBhvrs] = useState(propOption.current || []);
    const [items, setItems] = useState(itemsFromBehaviors(bhvrs));

    function handleReorder(newItems) {
        var oldBhvrs = bhvrs;
        var newBhvrs = [];

        for (let i = 0; i < newItems; i++) {
            var item = newItems[i];
            for (let j = 0; j < oldBhvrs; j++) {
                if (oldBhvrs[j].getDisplay() === item) {
                    newBhvrs.push(oldBhvrs[j]);
                    oldBhvrs = oldBhvrs.splice(j, 1);
                    break;
                }
            }
        }
        setBhvrs(newBhvrs);
        setItems(itemsFromBehaviors(newItems));
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "red",
                border: 1,
                boderColor: "black",
                display: "flex",
            }}
        >
            <Reorder.Group axis="y" onReorder={setItems} values={items}>
                {items.map((item) => (
                    <BehaviorListItem key={item} item={item} />
                ))}
            </Reorder.Group>
        </Paper>
    );
};

export default BehaviorListPropertyPanel;