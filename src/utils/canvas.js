import { fabric } from "fabric";

var objIdCtr = 0;

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

function setSelectionCallback(cnv, callbk, data) {
    cnv.on({
        "selection:updated": () => callbk(cnv.getActiveObjects(), data),
        "selection:created": () => callbk(cnv.getActiveObjects(), data),
        "selection:cleared": () => callbk(cnv.getActiveObjects(), data),
    });
}

function clearSelectionCallback(cnv, callbk) {
    cnv.off({
        "selection:updated": () => callbk(cnv, null),
        "selection:created": () => callbk(cnv, null),
        "selection:cleared": () => callbk(cnv, null),
    });
}

function getObjectId() {
    return `#object-${objIdCtr++}`;
}

function setBackgroundColor(cnv, _bkgColor) {
    cnv.backgroundColor = _bkgColor;
    cnv.renderAll();
}

const addRect = (cnv, spec) => {
    const rect = new fabric.Rect(spec);
    rect.id = getObjectId();
    cnv.add(rect);
    return rect;
};

const addCircle = (cnv, spec) => {
    const circle = new fabric.Circle(spec);
    circle.id = getObjectId();
    cnv.add(circle);
    return circle;
};

const addTriangle = (cnv, spec) => {
    const triangle = new fabric.Triangle(spec);
    cnv.add(triangle);
    triangle.id = getObjectId();
    return triangle;
};

export {
    initCanvas,
    addRect,
    addCircle,
    addTriangle,
    clearSelectionCallback,
    setSelectionCallback,
    setBackgroundColor,
};
