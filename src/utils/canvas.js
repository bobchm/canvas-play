import { fabric } from "fabric";
import { SymbolButton } from "./symbol-button";
import { colorCloserToBlack } from "./colors";
import { defaultImageData, errorImageData } from "./image-defaults";
import FileSaver from "file-saver";

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

const addSymbolButton = (cnv, label, spec) => {
    const symBtn = new SymbolButton(label, spec, () => refresh(cnv));
    finishObjectAdd(cnv, symBtn);
    return symBtn;
};

const getImageSource = (image) => {
    return image.getSrc();
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
    return new Promise((resolve, reject) => {
        var origWd = image.width * image.scaleX;
        var origHgt = image.height * image.scaleY;
        if (src === null) {
            setDefaultImage(cnv, image, origWd, origHgt);
            resolve(image);
            return;
        }
        image.setSrc(src, function (img) {
            // error isn't explicitly signalled - check image width and height
            if (img.width === 0 || img.height === 0) {
                setErrorImage(cnv, image, origWd, origHgt);
                reject(new Error("Error setting image source"));
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
            img.src = src;
            img.setCoords();
            cnv.renderAll();
            resolve(image);
        });
    });
};

async function setImageSourceA(cnv, image, src) {
    await setImageSource(cnv, image, src);
}

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

function isImageEmbedded(image) {
    if (image.get("type") === "image") {
        var src = getImageSource(image);
        return src && src.startsWith("data:image");
    }
    return false;
}

function embedImage(cnv, image) {
    if (!isImageEmbedded(image)) {
        var url = getImageSource(image);
        fetch(url)
            .then(function (response) {
                if (response.ok) {
                    return response.blob();
                }
            })
            .then(function (myBlob) {
                var a = new FileReader();
                a.onload = function (e) {
                    setImageSource(cnv, image, e.target.result);
                };
                a.readAsDataURL(myBlob);
            });
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
    addSymbolButton,
    getImageSource,
    setImageSource,
    setImageSourceA,
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
    isImageEmbedded,
    embedImage,
};
