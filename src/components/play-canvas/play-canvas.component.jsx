import React, { useRef, useEffect } from "react";

const PlayCanvas = ({ id, appManager }) => {
    const canvas = useRef(null);

    useEffect(() => {
        if (appManager && appManager.getScreenManager()) {
            canvas.current = appManager.getScreenManager().getCanvas();
        }
    }, []);

    return <canvas id={id} />;
};

export default PlayCanvas;
