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
        "selection:updated": () => callbk(cnv.getActiveObjects()),
        "selection:created": () => callbk(cnv.getActiveObjects()),
        "selection:cleared": () => callbk(cnv.getActiveObjects()),
    });
}

function clearSelectionCallback(cnv, callbk) {
    cnv.off({
        "selection:updated": () => callbk(cnv, null),
        "selection:created": () => callbk(cnv, null),
        "selection:cleared": () => callbk(cnv, null),
    });
}

function clearMousedownCallback(cnv, callbk) {
    cnv.off("mouse:down", callbk);
}

function setMousedownCallback(cnv, callbk) {
    cnv.on("mouse:down", callbk);
}

function disableSelection(cnv) {
    cnv.selection = false;
    cnv.interactive = false;
}

function enableSelection(cnv) {
    cnv.selection = true;
    cnv.interactive = true;
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
    clearMousedownCallback,
    setMousedownCallback,
    disableSelection,
    enableSelection,
    setBackgroundColor,
};
