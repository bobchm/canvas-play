import { fabric } from "fabric";
import { colorCloserToBlack } from "./colors";
import FileSaver from "file-saver";

const defaultImageData =
    "data:image/png;base64,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";
const errorImageData =
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
    image.setSrc(errorImageData, function (img) {
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
    image.setSrc(defaultImageData, function (img) {
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
        if (callbk) {
            callbk(img);
        }
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

function createThumbnail(cnv, width, height, callback) {
    cnv.getElement().toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        fabric.Image.fromURL(url, (img) => {
            img.set({
                left: 0,
                top: 0,
                // Scale image to fit width / height ?
            });
            img.id = getObjectId();
            img.scaleToHeight(height);
            img.scaleToWidth(width);
            if (callback) {
                callback(img);
            }
        });
    });
}

function saveToFile(cnv, filename) {
    cnv.getElement().toBlob(function (blob) {
        FileSaver.saveAs(blob, filename);
    });
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
    createThumbnail,
    saveToFile,
};
