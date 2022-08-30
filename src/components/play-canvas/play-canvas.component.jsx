import React, { useRef, useEffect } from "react";
import { initCanvas } from "../../utils/canvas";

const PlayCanvas = (props) => {
    const canvas = useRef(null);
    const {
        id,
        top,
        left,
        width,
        height,
        backgroundColor,
        doSelection,
        onSelection,
        getCanvas,
    } = props;

    useEffect(() => {
        canvas.current = initCanvas(
            id,
            left,
            top,
            width,
            height,
            backgroundColor,
            doSelection,
            onSelection,
            getCanvas
        );

        // destroy fabric on unmount
        return () => {
            canvas.current.dispose();
            canvas.current = null;
        };
    }, []);

    return <canvas id={id} />;
};

export default PlayCanvas;
