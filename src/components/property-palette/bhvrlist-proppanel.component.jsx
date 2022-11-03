import "./bhvrlist-styles.css";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { BehaviorListItem } from "./bhvritem-proppanel.component";
import ReactDragListView from "react-drag-listview";

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
            <ReactDragListView
                onDragEnd={handleDragEnd}
                nodeSelector="li"
                handleSelector="a"
            >
                {items.map((item, idx) => (
                    <li key={idx}>
                        {item}
                        <a href="#">Drag</a>
                    </li>
                ))}
            </ReactDragListView>
        </Paper>
    );
};

export default BehaviorListPropertyPanel;
