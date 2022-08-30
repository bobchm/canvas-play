import React, { useRef, useEffect } from "react";
import { fabric } from "fabric";

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
            getCanvas
        );

        // destroy fabric on unmount
        return () => {
            canvas.current.dispose();
            canvas.current = null;
        };
    }, []);

    function initCanvas(
        _id,
        _left,
        _top,
        _width,
        _height,
        _bkgColor,
        _doSelection,
        _getCanvas
    ) {
        var cnv = new fabric.Canvas(_id, {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            backgroundColor: _bkgColor,
            selection: _doSelection,
            renderOnAddRemove: true,
        });
        cnv.on({
            "selection:updated": () =>
                onSelection(canvas.current.getActiveObjects()),
            "selection:created": () =>
                onSelection(canvas.current.getActiveObjects()),
            "selection:cleared": () =>
                onSelection(canvas.current.getActiveObjects()),
        });

        if (_getCanvas) {
            _getCanvas(cnv);
        }
        return cnv;
    }

    return <canvas id={id} />;
};

export default PlayCanvas;
