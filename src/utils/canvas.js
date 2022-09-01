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

function setSelectionCallback(cnv, callbk) {
    cnv.on({
        "selection:updated": () => callbk(cnv),
        "selection:created": () => callbk(cnv),
        "selection:cleared": () => callbk(cnv),
    });
}

function clearSelectionCallback(cnv, callbk) {
    cnv.off({
        "selection:updated": () => callbk(cnv),
        "selection:created": () => callbk(cnv),
        "selection:cleared": () => callbk(cnv),
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
    setBackgroundColor,
};
