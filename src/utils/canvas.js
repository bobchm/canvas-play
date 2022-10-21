import { fabric } from "fabric";
import { SymbolButton } from "./symbol-button";
import { colorCloserToBlack } from "./colors";
import { defaultImageData, errorImageData } from "./image-defaults";
import { InputEvent } from "./input-events";
import FileSaver from "file-saver";

var objIdCtr = 0;
var containerWidth, containerHeight;

export const BackgroundImageStyle = {
    Center: "center",
    Stretch: "stretch",
    Tile: "tile", // not implemented yet - need to create the tiled image and then assign that
};

function initCanvas(
    _id,
    _left,
    _top,
    _width,
    _height,
    _bkgColor,
    _doSelection,
    _allowZoom,
    _modifiedCallback,
    _inputCallback
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
    containerWidth = _width;
    containerHeight = _height;

    if (_modifiedCallback) {
        cnv.on({
            "object:moved": _modifiedCallback,
            "object:modified": _modifiedCallback,
        });
    }

    if (_inputCallback) {
        cnv.on({
            "mouse:up": function (opt) {
                handleInputEvent(InputEvent.MouseUp, opt, _inputCallback, null);
            },
        });
    }

    if (_allowZoom) {
        cnv.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = cnv.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            cnv.setDimensions({
                width: containerWidth * zoom,
                height: containerHeight * zoom,
            });
            cnv.setZoom(zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
        // cnv.on("mouse:move", function (opt) {
        //     var e = opt.e;
        //     console.log(e.x, ".", e.y);
        // });
    }

    setSelectionColor(cnv);
    return cnv;
}

function handleInputEvent(eventType, eventData, callback, scrObj) {
    var data;
    switch (eventType) {
        case InputEvent.MouseDown:
        case InputEvent.MouseUp:
            data = {
                x: eventData.pointer.x,
                y: eventData.pointer.y,
            };
            break;
        default:
            data = {};
    }
    callback(eventType, data, scrObj);
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

function getBackgroundImage(cnv) {
    return cnv.backgroundImage;
}

function clearBackgroundImage(cnv) {
    cnv.setBackgroundImage(null, cnv.renderAll.bind(cnv));
}

function calcBkgImageScaling(cnv, img, bkgStyle) {
    var widthFactor = cnv.width / img.width;
    var heightFactor = cnv.height / img.height;
    var x, y;
    if (bkgStyle === BackgroundImageStyle.Center) {
        var minFactor = Math.min(widthFactor, heightFactor);
        x = (cnv.width - minFactor * img.width) / 2;
        y = (cnv.height - minFactor * img.height) / 2;
        widthFactor = minFactor;
        heightFactor = minFactor;
    } else {
        // style === BackgroundImageStyle.Stretch
        x = 0;
        y = 0;
    }
    return {
        x: x,
        y: y,
        widthFactor: widthFactor,
        heightFactor: heightFactor,
    };
}

function setBackgroundImageURL(cnv, _imageURL, bkgStyle) {
    fabric.Image.fromURL(_imageURL, function (img) {
        var scaling = calcBkgImageScaling(cnv, img, bkgStyle);
        cnv.setBackgroundImage(img, cnv.renderAll.bind(cnv), {
            left: scaling.x,
            top: scaling.y,
            scaleX: scaling.widthFactor,
            scaleY: scaling.heightFactor,
        });
    });
}

function setBackgroundImageStyle(cnv, bkgStyle) {
    if (cnv.backgroundImage) {
        var scaling = calcBkgImageScaling(cnv, cnv.backgroundImage, bkgStyle);
        cnv.backgroundImage.set({
            left: scaling.x,
            top: scaling.y,
            scaleX: scaling.widthFactor,
            scaleY: scaling.heightFactor,
        });
    }
}

function refresh(cnv) {
    cnv.renderAll();
}

function clearCanvas(cnv) {
    cnv.clear();
    cnv.renderAll();
}

function resizeCanvas(cnv, width, height) {
    cnv.setDimensions({
        width: width,
        height: height,
    });
    containerWidth = width;
    containerHeight = height;
}

function finishObjectAdd(cnv, obj, scrObj, inputCallback) {
    obj.id = getObjectId();
    obj.selectable = cnv.selection;
    obj.hoverCursor = cnv.selection ? "move" : "default";
    if (inputCallback) {
        obj.on({
            mousedown: function (opt) {
                handleInputEvent(
                    InputEvent.ObjectMouseDown,
                    opt,
                    inputCallback,
                    scrObj
                );
            },
            mouseup: function (opt) {
                handleInputEvent(
                    InputEvent.ObjectMouseUp,
                    opt,
                    inputCallback,
                    scrObj
                );
            },
            mouseover: function (opt) {
                handleInputEvent(
                    InputEvent.ObjectMouseEnter,
                    opt,
                    inputCallback,
                    scrObj
                );
            },
            mouseout: function (opt) {
                handleInputEvent(
                    InputEvent.ObjectMouseExit,
                    opt,
                    inputCallback,
                    scrObj
                );
            },
        });
    }
    cnv.add(obj);
}

const addRect = (cnv, spec, scrObj, inputCallback) => {
    const rect = new fabric.Rect(spec);
    finishObjectAdd(cnv, rect, scrObj, inputCallback);
    return rect;
};

const addCircle = (cnv, spec, scrObj, inputCallback) => {
    const circle = new fabric.Circle(spec);
    finishObjectAdd(cnv, circle, scrObj, inputCallback);
    return circle;
};

const addTriangle = (cnv, spec, scrObj, inputCallback) => {
    const triangle = new fabric.Triangle(spec);
    finishObjectAdd(cnv, triangle, scrObj, inputCallback);
    return triangle;
};

const addText = (cnv, text, spec, scrObj, inputCallback) => {
    const textObj = new fabric.IText(text, spec);
    finishObjectAdd(cnv, textObj, scrObj, inputCallback);
    return textObj;
};

const addImage = (cnv, spec, scrObj, inputCallback) => {
    const imageObj = new fabric.Image("");
    imageObj.set(spec);
    finishObjectAdd(cnv, imageObj, scrObj, inputCallback);
    return imageObj;
};

const addSymbolButton = (cnv, label, spec, scrObj, inputCallback) => {
    const symBtn = new SymbolButton(label, spec, () => refresh(cnv));
    finishObjectAdd(cnv, symBtn, scrObj, inputCallback);
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
    getBackgroundImage,
    clearBackgroundImage,
    setBackgroundImageURL,
    setBackgroundImageStyle,
    setSelectedObject,
    removeObject,
    deleteSelectedObjects,
    refresh,
    clearCanvas,
    resizeCanvas,
    createThumbnail,
    saveToFile,
    isImageEmbedded,
    embedImage,
};
