import { fabric } from "fabric";

function initCanvas(
    _id,
    _left,
    _top,
    _width,
    _height,
    _bkgColor,
    _doSelection,
    _onSelection,
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
        "selection:updated": () => _onSelection(cnv.getActiveObjects()),
        "selection:created": () => _onSelection(cnv.getActiveObjects()),
        "selection:cleared": () => _onSelection(cnv.getActiveObjects()),
    });

    if (_getCanvas) {
        _getCanvas(cnv);
    }
    return cnv;
}

const addSquare = (cnv, spec) => {
    const rect = new fabric.Rect(spec);
    cnv.add(rect);
};

const addCircle = (cnv, spec) => {
    const circle = new fabric.Circle(spec);
    cnv.add(circle);
};

const addTriangle = (cnv, spec) => {
    const triangle = new fabric.Triangle(spec);
    cnv.add(triangle);
};

export { initCanvas, addSquare, addCircle, addTriangle };
