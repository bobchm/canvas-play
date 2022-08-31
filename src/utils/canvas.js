import { fabric } from "fabric";

var objIdCtr = 0;
var selectionCallback = null;

function initCanvas(
    _id,
    _left,
    _top,
    _width,
    _height,
    _bkgColor,
    _doSelection
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

    return cnv;
}

function doSelectionCallback(cnv) {
    if (selectionCallback) {
        selectionCallback(cnv.getActiveObjects());
    }
}

function setSelectionCallback(cnv, callbk) {
    cnv.on({
        "selection:updated": () => doSelectionCallback(cnv),
        "selection:created": () => doSelectionCallback(cnv),
        "selection:cleared": () => doSelectionCallback(cnv),
    });
}

function clearSelectionCallback(cnv, callbk) {
    cnv.off({
        "selection:updated": () => doSelectionCallback(cnv),
        "selection:created": () => doSelectionCallback(cnv),
        "selection:cleared": () => doSelectionCallback(cnv),
    });
}

function getObjectId() {
    return `#object-${objIdCtr++}`;
}

const addRect = (cnv, spec) => {
    const rect = new fabric.Rect(spec);
    rect.id = getObjectId();
    cnv.add(rect);
};

const addCircle = (cnv, spec) => {
    const circle = new fabric.Circle(spec);
    circle.id = getObjectId();
    cnv.add(circle);
};

const addTriangle = (cnv, spec) => {
    const triangle = new fabric.Triangle(spec);
    cnv.add(triangle);
    triangle.id = getObjectId();
};

export {
    initCanvas,
    addRect,
    addCircle,
    addTriangle,
    clearSelectionCallback,
    setSelectionCallback,
};
