import React, { useEffect } from "react";

export const BehaviorListItem = ({ item }) => {
    function callback(e) {
        console.log("here I am");
    }

    return (
        <li onMouseUp={callback}>
            <span>{item}</span>
            {/* <ReorderIcon dragControls={dragControls} /> */}
        </li>
    );
};
