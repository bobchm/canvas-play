import { fabric } from "fabric";
import { colorCloserToBlack } from "./colors";
import errorImage from "./assets/error.png";
import defaultImage from "./assets/mountains.png";

const defaultData =
    "data:image/png;base64,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";

var objIdCtr = 0;

function initCanvas(
    _id,
    _left,
    _top,
    _width,
    _height,
    _bkgColor,
    _doSelection,
    _modifiedCallback
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

    if (_modifiedCallback) {
        cnv.on({
            "object:moved": _modifiedCallback,
            "object:modified": _modifiedCallback,
        });
    }

    setSelectionColor(cnv);
    return cnv;
}

function setSelectionColor(cnv) {
    var borderColor = colorCloserToBlack(cnv.backgroundColor)
        ? "white"
        : "black";
    fabric.Object.prototype.set({
        borderColor: borderColor,
        borderScaleFactor: 2,
        borderDashArray: [5, 5],
        cornerColor: borderColor,
    });
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
    cnv.discardActiveObject();
    cnv.renderAll();
    cnv.selection = false;
    cnv.interactive = false;
    var objects = cnv.getObjects();
    for (let i = 0; i < objects.length; i++) {
        var obj = objects[i];
        obj.selectable = false;
        obj.hoverCursor = "default";
    }
}

function enableSelection(cnv) {
    cnv.selection = true;
    cnv.interactive = true;
    var objects = cnv.getObjects();
    for (let i = 0; i < objects.length; i++) {
        var obj = objects[i];
        obj.selectable = true;
        obj.hoverCursor = "move";
    }
}

function setSelectedObject(cnv, obj) {
    cnv.setActiveObject(obj);
    cnv.renderAll();
}

function getObjectId() {
    return `#object-${objIdCtr++}`;
}

function getBackgroundColor(cnv) {
    return cnv.backgroundColor;
}

function setBackgroundColor(cnv, _bkgColor) {
    cnv.backgroundColor = _bkgColor;
    setSelectionColor(cnv);
    cnv.renderAll();
}

function finishObjectAdd(cnv, obj) {
    obj.id = getObjectId();
    obj.selectable = cnv.selection;
    obj.hoverCursor = cnv.selection ? "move" : "default";
    cnv.add(obj);
}

function refresh(cnv) {
    cnv.renderAll();
}

function clearCanvas(cnv) {
    cnv.clear();
    cnv.renderAll();
}

const addRect = (cnv, spec) => {
    const rect = new fabric.Rect(spec);
    finishObjectAdd(cnv, rect);
    return rect;
};

const addCircle = (cnv, spec) => {
    const circle = new fabric.Circle(spec);
    finishObjectAdd(cnv, circle);
    return circle;
};

const addTriangle = (cnv, spec) => {
    const triangle = new fabric.Triangle(spec);
    cnv.add(triangle);
    triangle.id = getObjectId();
    return triangle;
};

const addText = (cnv, text, spec) => {
    const textObj = new fabric.IText(text, spec);
    cnv.add(textObj);
    textObj.id = getObjectId();
    return textObj;
};

const addImage = (cnv, spec) => {
    const imageObj = new fabric.Image("");
    imageObj.set(spec);
    cnv.add(imageObj);
    imageObj.id = getObjectId();
    return imageObj;
};

const getImageSource = (image) => {
    return image.src;
};

const setErrorImage = (cnv, image, wd, hgt) => {
    image.setSrc(errorImage, function (img) {
        // error isn't explicitly signalled - check image width and height
        img.set({
            left: image.left,
            top: image.top,
            // scaleX: origWd / img.width,
            // scaleY: origHgt / img.height,
        });
        const widthFactor = wd / img.width;
        const heightFactor = hgt / img.height;
        const minFactor = Math.min(widthFactor, heightFactor);
        img.scale(minFactor);
        img.setCoords();
        cnv.renderAll();
    });
};

const setDefaultImage = (cnv, image, wd, hgt) => {
    image.setSrc(defaultData, function (img) {
        // error isn't explicitly signalled - check image width and height
        img.set({
            left: image.left,
            top: image.top,
            // scaleX: origWd / img.width,
            // scaleY: origHgt / img.height,
        });
        const widthFactor = wd / img.width;
        const heightFactor = hgt / img.height;
        const minFactor = Math.min(widthFactor, heightFactor);
        img.scale(minFactor);
        img.setCoords();
        cnv.renderAll();
    });
};

const setImageSource = (cnv, image, src) => {
    var origWd = image.width * image.scaleX;
    var origHgt = image.height * image.scaleY;
    if (src === null) {
        setDefaultImage(cnv, image, origWd, origHgt);
        return;
    }
    image.setSrc(src, function (img) {
        // error isn't explicitly signalled - check image width and height
        if (img.width === 0 || img.height === 0) {
            setErrorImage(cnv, image, origWd, origHgt);
            return;
        }
        img.set({
            left: image.left,
            top: image.top,
            // scaleX: origWd / img.width,
            // scaleY: origHgt / img.height,
        });
        const widthFactor = origWd / img.width;
        const heightFactor = origHgt / img.height;
        const minFactor = Math.min(widthFactor, heightFactor);
        img.scale(minFactor);
        img.setCoords();
        cnv.renderAll();
    });
};

const addImageFromURL = (cnv, url, left, top, width, height, callbk) => {
    fabric.Image.fromURL(url, (img) => {
        img.set({
            left: left,
            top: top,
            // Scale image to fit width / height ?
        });
        img.id = getObjectId();
        img.scaleToHeight(height);
        img.scaleToWidth(width);
        cnv.add(img);
        callbk(img);
    });
};

function removeObject(cnv, obj) {
    cnv.remove(obj);
}

function deleteSelectedObjects(cnv) {
    var active = cnv.getActiveObject();
    if (active) {
        cnv.remove(active);
        if (active.type === "activeSelection") {
            active.getObjects().forEach((x) => cnv.remove(x));
            cnv.discardActiveObject().renderAll();
        }
    }
}

export {
    initCanvas,
    addRect,
    addCircle,
    addTriangle,
    addText,
    addImage,
    addImageFromURL,
    getImageSource,
    setImageSource,
    clearSelectionCallback,
    setSelectionCallback,
    clearMousedownCallback,
    setMousedownCallback,
    disableSelection,
    enableSelection,
    getBackgroundColor,
    setBackgroundColor,
    setSelectedObject,
    removeObject,
    deleteSelectedObjects,
    refresh,
    clearCanvas,
};
