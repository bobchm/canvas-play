import React, { useRef, useEffect } from "react";

const PlayCanvas = ({ spec, appManager }) => {
    const canvas = useRef(null);

    useEffect(() => {
        if (appManager && appManager.getScreenManager()) {
            console.log("createCanvas");
            canvas.current = appManager.getScreenManager().createCanvas(spec);
        }
    });
    return <canvas id={spec.id} />;
};

export default PlayCanvas;
