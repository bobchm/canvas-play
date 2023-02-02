import { fabric } from "fabric";
import { SymbolButton } from "./symbol-button";
import { ContainerBox } from "./container-box";
import { colorCloserToBlack } from "./colors";
import { defaultImageData, errorImageData } from "./image-defaults";
import { InputEvent } from "./input-events";
import FileSaver from "file-saver";
import {
    BackgroundImageStyle,
    OverlayHighlightFill,
    cachingImages,
    setCachingImages,
    addCanvasPromise,
    doWaitForCanvasPromises,
    getBase64FromUrl,
} from "./canvas-shared";
import { openPDF, writeSVGtoPDF, savePDF } from "./pdf";

var objIdCtr = 0;

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
    _focusChangeCallback
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

    // adding the following fields to canvas
    cnv.containerWidth = _width;
    cnv.containerHeight = _height;
    cnv.focusChangeCallback = _focusChangeCallback;
    cnv.highlightImageFilter = new fabric.Image.filters.Brightness({
        brightness: -0.3,
    });
    cnv.onScreen = true;

    cnv.isDragging = false;
    if (_modifiedCallback) {
        cnv.on({
            "object:modified": (event) => {
                if (
                    event.action === "drag" &&
                    event.target &&
                    event.target.canvas &&
                    event.target.canvas.isDragging
                ) {
                    event.target.canvas.isDragging = false;
                }
                _modifiedCallback(event);
            },
        });
    }
    cnv.on({
        "object:moving": (event) => {
            if (
                event.target &&
                event.target.canvas &&
                !event.target.canvas.isDragging
            ) {
                event.target.canvas.isDragging = true;
                bringToFront(event.target.canvas, event.target);
            }
            childrenWithParents(event);
        },
    });

    if (_allowZoom) {
        cnv.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = cnv.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            cnv.setDimensions({
                width: cnv.containerWidth * zoom,
                height: cnv.containerHeight * zoom,
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

    cnv.preserveObjectStacking = true;
    setSelectionColor(cnv);
    return cnv;
}

function initPrintCanvas(
    _id,
    _left,
    _top,
    _width,
    _height,
    _bkgColor,
    _doCacheImages
) {
    var fakeCanvas = document.createElement("canvas");
    fakeCanvas.width = _width;
    fakeCanvas.height = _height;
    var cnv = new fabric.Canvas(fakeCanvas, {
        left: _left,
        top: _top,
        width: _width,
        height: _height,
        backgroundColor: _bkgColor,
        renderOnAddRemove: true,
    });

    cnv.preserveObjectStacking = true;
    cnv.onScreen = false;
    setCachingImages(cnv, _doCacheImages);
    return cnv;
}

async function waitForCanvasPromises(cnv) {
    await doWaitForCanvasPromises(cnv);
}

function objectsFromEventTarget(target) {
    if (!target.type || target.type !== "activeSelection") {
        return {
            objects: [target],
            offx: 0,
            offy: 0,
        };
    } else {
        return {
            objects: target._objects,
            offx: target.left + target.width / 2,
            offy: target.top + target.height / 2,
        };
    }
}

function enableInputCallback(cnv, inputCallback) {
    cnv.on({
        "mouse:up": function (opt) {
            handleInputEvent(InputEvent.MouseUp, opt, inputCallback, null);
        },
        "mouse:down": function (opt) {
            handleInputEvent(InputEvent.MouseDown, opt, inputCallback, null);
        },
    });
}

function disableInputCallback(cnv, inputCallback) {
    cnv.off({
        "mouse:up": function (opt) {
            handleInputEvent(InputEvent.MouseUp, opt, inputCallback, null);
        },
        "mouse:down": function (opt) {
            handleInputEvent(InputEvent.MouseDown, opt, inputCallback, null);
        },
    });
}

function objectAtXY(cnv, x, y) {
    var zoom = cnv.getZoom();
    var pt = new fabric.Point(x * zoom, y * zoom);
    var objects = cnv.getObjects();
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].containsPoint(pt)) {
            return objects[i];
        }
    }
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].containsPoint(pt, null, true)) {
            return objects[i];
        }
    }
    return null;
}

function isContainer(obj) {
    return "children" in obj;
}

function containerForObject(cnv, childObj, offx, offy) {
    var dims = getDimensions(childObj);
    var x = offx + dims.x + dims.width / 2;
    var y = offy + dims.y + dims.height / 2;
    var zoom = cnv.getZoom();
    var pt = new fabric.Point(x * zoom, y * zoom);
    var objects = cnv.getObjects();
    for (let i = 0; i < objects.length; i++) {
        var obj = objects[i];
        if (obj !== childObj && isContainer(obj) && obj.containsPoint(pt)) {
            return obj;
        }
    }
    return null;
}

function childrenWithParents(event) {
    if (event.target && isContainer(event.target)) {
        var zoom = event.target.canvas.getZoom();
        var x = event.e.movementX / zoom;
        var y = event.e.movementY / zoom;
        for (let i = 0; i < event.target.children.length; i++) {
            var child = event.target.children[i];
            child.set("left", child.left + x);
            child.set("top", child.top + y);
            child.setCoords();
        }
    }
}

function enableMouseTracking(cnv, inputCallback) {
    cnv.on({
        "mouse:up": function (eventData) {
            var zoom = cnv.getZoom();
            inputCallback(
                InputEvent.MouseUp,
                eventData.pointer.x / zoom,
                eventData.pointer.y / zoom
            );
        },
        "mouse:move": function (eventData) {
            var zoom = cnv.getZoom();
            inputCallback(
                InputEvent.MouseMove,
                eventData.pointer.x / zoom,
                eventData.pointer.y / zoom
            );
        },
        "mouse:down": function (eventData) {
            var zoom = cnv.getZoom();
            inputCallback(
                InputEvent.MouseDown,
                eventData.pointer.x / zoom,
                eventData.pointer.y / zoom
            );
        },
    });
}

function disableMouseTracking(cnv, inputCallback) {
    cnv.off({
        "mouse:up": null,
        "mouse:move": null,
        "mouse:down": null,
    });
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
    cnv.on("mouse:down", (options) => {
        var zoom = cnv.getZoom();
        options.pointer.x /= zoom;
        options.pointer.y /= zoom;
        callbk(options);
    });
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

function setSelectedObjects(cnv, objs) {
    cnv.discardActiveObject();
    if (objs && objs.length > 0) {
        if (objs.length > 1) {
            var sel = new fabric.ActiveSelection(objs, {
                canvas: cnv,
            });
            cnv.setActiveObject(sel);
        } else {
            cnv.setActiveObject(objs[0]);
        }
    }
    cnv.requestRenderAll();
}

function selectAllObjects(cnv) {
    setSelectedObjects(cnv, cnv.getObjects());
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
    fabric.Image.fromURL(
        _imageURL,
        function (img) {
            var scaling = calcBkgImageScaling(cnv, img, bkgStyle);
            cnv.setBackgroundImage(
                img,
                cnv.renderAll.bind(cnv),
                {
                    left: scaling.x,
                    top: scaling.y,
                    scaleX: scaling.widthFactor,
                    scaleY: scaling.heightFactor,
                },
                { crossOrigin: "anonymous" }
            );
        },
        { crossOrigin: "anonymous" }
    );
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
    cnv.containerWidth = width;
    cnv.containerHeight = height;
}

function setZoom(cnv, zoom) {
    cnv.setZoom(zoom);
}

function addChildObject(parent, child) {
    if (parent) {
        if (!isContainer(parent)) {
            throw new Error(`Bad parent object (${parent})`);
        }
        if (!parent.children.includes(child)) {
            parent.children.push(child);
        }
    }
}

function removeChildObject(child) {
    if (child.parent) {
        child.parent.children = child.parent.children.filter(
            (obj) => obj !== child
        );
    }
}

function reparentObject(child, newParent) {
    removeChildObject(child);
    addChildObject(newParent, child);
    child.parent = newParent;
}

function finishObjectAdd(cnv, parent, obj, scrObj, inputCallback) {
    obj.id = getObjectId();
    obj.parent = parent;
    if (parent) {
        addChildObject(parent, obj);
    }
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

const addRect = (cnv, parent, spec, scrObj, inputCallback) => {
    const rect = new fabric.Rect(spec);
    finishObjectAdd(cnv, parent, rect, scrObj, inputCallback);
    return rect;
};

const addCircle = (cnv, parent, spec, scrObj, inputCallback) => {
    const circle = new fabric.Circle(spec);
    finishObjectAdd(cnv, parent, circle, scrObj, inputCallback);
    return circle;
};

const addTriangle = (cnv, parent, spec, scrObj, inputCallback) => {
    const triangle = new fabric.Triangle(spec);
    finishObjectAdd(cnv, parent, triangle, scrObj, inputCallback);
    return triangle;
};

const addText = (cnv, parent, text, spec, scrObj, inputCallback) => {
    const textObj = new fabric.IText(text, spec);
    if (cnv.focusChangeCallback) {
        textObj.on({
            "editing:entered": () => cnv.focusChangeCallback(true),
            "editing:exited": () => cnv.focusChangeCallback(false),
        });
    }
    finishObjectAdd(cnv, parent, textObj, scrObj, inputCallback);
    return textObj;
};

const cacheImageData = (imageObj, data) => {
    imageObj.src = data;
    imageObj._element.src = data;
};

const addImage = (cnv, parent, spec, scrObj, inputCallback) => {
    const imageObj = new fabric.Image("");
    imageObj.set(spec);
    finishObjectAdd(cnv, parent, imageObj, scrObj, inputCallback);
    if (!cnv.onScreen) {
        imageObj._element = document.createElement("img");
        imageObj._element.width = imageObj.width;
        imageObj._element.height = imageObj.height;
        imageObj._element.crossOrigin = "anonymous";
        imageObj._element.src = imageObj.src;
        if (cachingImages(cnv) && !isImageEmbedded(imageObj)) {
            var promise = getBase64FromUrl(
                imageObj.src,
                cacheImageData,
                imageObj
            );
            addCanvasPromise(cnv, promise);
        }
    }
    return imageObj;
};

const addSymbolButton = (
    cnv,
    parent,
    label,
    shape,
    spec,
    scrObj,
    inputCallback
) => {
    const symBtn = new SymbolButton(cnv, label, shape, spec, () =>
        refresh(cnv)
    );
    finishObjectAdd(cnv, parent, symBtn, scrObj, inputCallback);
    return symBtn;
};

const addContainerBox = (
    cnv,
    parent,
    title,
    shape,
    spec,
    scrObj,
    inputCallback
) => {
    const box = new ContainerBox(title, shape, spec);
    finishObjectAdd(cnv, parent, box, scrObj, inputCallback);
    return box;
};

const addHotSpot = (cnv, parent, spec, scrObj, inputCallback) => {
    const newPath = new fabric.Path(spec.path);
    newPath.set({
        type: "hotspot",
        fill: "rgba(0,0,0,0)",
        stroke: spec.stroke,
        strokeWidth: 3,
        strokeDashArray: [5, 5],
    });
    finishObjectAdd(cnv, parent, newPath, scrObj, inputCallback);
    return newPath;
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
        image.setSrc(
            src,
            function (img) {
                // error isn't explicitly signalled - check image width and height
                if (img.width === 0 || img.height === 0) {
                    setErrorImage(cnv, image, origWd, origHgt);
                    reject(new Error("Error setting image source"));
                    return;
                }
                img.set({
                    left: image.left,
                    top: image.top,
                });
                const widthFactor = origWd / img.width;
                const heightFactor = origHgt / img.height;
                const minFactor = Math.min(widthFactor, heightFactor);
                img.scale(minFactor);
                img.src = src;
                img.setCoords();
                cnv.renderAll();
                resolve(image);
            },
            { crossOrigin: "anonymous" }
        );
    });
};

async function setImageSourceA(cnv, image, src) {
    await setImageSource(cnv, image, src);
}

function removeObject(cnv, obj) {
    removeChildObject(obj);
    cnv.remove(obj);
}

function deleteSelectedObjects(cnv) {
    var active = cnv.getActiveObject();
    if (active) {
        cnv.remove(active);
        if (active.type === "activeSelection") {
            active.getObjects().forEach((x) => {
                removeChildObject(x);
                cnv.remove(x);
            });
            cnv.discardActiveObject().renderAll();
        }
    }
}

function bringToFront(cnv, obj) {
    obj.bringToFront();
    if (isContainer(obj)) {
        // bring children to front - assumes order of children matches z-order
        for (let i = 0; i < obj.children.length; i++) {
            bringToFront(cnv, obj.children[i]);
        }
    }
    cnv.renderAll();
}

function moveInFrontOf(cnv, frontObj, backObj) {
    // remove object
    cnv._objects = cnv._objects.filter((obj) => obj !== frontObj);
    var idx = cnv._objects.indexOf(backObj);
    cnv._objects.splice(idx + 1, 0, frontObj);
}

function sendToBack(cnv, obj) {
    if (!obj.parent) {
        obj.sendToBack();
    } else {
        // move behind all siblings of parent container
        moveInFrontOf(cnv, obj, obj.parent);
    }

    // if a container, move children directly above it
    if (isContainer(obj)) {
        var children = obj.children.reverse();
        for (let i = 0; i < children.length; i++) {
            sendToBack(cnv, children[i]);
        }
    }
    cnv.renderAll();
}

// fabric.Image.prototype.getSvgSrc = function () {
//     return this.toDataURLforSVG();
// };

fabric.Image.prototype.toDataURLforSVG = function (options) {
    var el = fabric.util.createCanvasElement();
    el.width = this._element.naturalWidth || this._element.width;
    el.height = this._element.naturalHeight || this._element.height;
    el.getContext("2d").drawImage(this._element, 0, 0);
    var data = el.toDataURL(options);
    return data;
};

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

function getAngle(obj) {
    return obj.angle;
}

function rotateTo(cnv, obj, angle) {
    angle %= 360;
    obj.rotate(angle);
    cnv.renderAll();
}

function rotateBy(cnv, obj, dAngle) {
    var angle = (getAngle(obj) + dAngle) % 360;
    rotateTo(cnv, obj, angle);
}

function getPosition(obj) {
    return { x: obj.left, y: obj.top };
}

function getDimensions(obj) {
    return {
        x: obj.left,
        y: obj.top,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
    };
}

function setDimensions(cnv, obj, x, y, width, height) {
    obj.left = x;
    obj.top = y;
    obj.width = width;
    obj.height = height;
    obj.scaleX = 1.0;
    obj.scaleY = 1.0;
    obj.setCoords(true);
    cnv.renderAll();
}

function moveTo(cnv, obj, x, y) {
    obj.left = x;
    obj.top = y;
    obj.setCoords(true);
    cnv.renderAll();
}

function moveBy(cnv, obj, dx, dy) {
    moveTo(cnv, obj, obj.left + dx, obj.top + dy);
}

function moveSelectionBy(cnv, dx, dy) {
    var activeObj = cnv.getActiveObject();
    moveBy(cnv, activeObj, dx, dy);
}

function xlateOptions(cnv, dur, animType) {
    var options = {
        duration: dur,
        onChange: cnv.renderAll.bind(cnv),
    };
    switch (animType) {
        case "bounce":
            options.easing = fabric.util.ease["easeOutBounce"];
            break;
        case "elastic":
            options.easing = fabric.util.ease["easeOutElastic"];
            break;
        case "smooth":
            options.easing = fabric.util.ease["easeOutExpo"];
            break;
        default:
    }
    return options;
}

function animatePosition(cnv, obj, x, y, dur, animType) {
    obj.animate({ left: x, top: y }, xlateOptions(cnv, dur, animType));
}

function animateDimensions(cnv, obj, x, y, width, height, dur, animType) {
    obj.animate(
        { left: x, top: y, width: width, height: height },
        xlateOptions(cnv, dur, animType)
    );
}

function animateAngle(cnv, obj, angle, dur, animType) {
    obj.animate("angle", angle, xlateOptions(cnv, dur, animType));
}

function animateOpacity(cnv, obj, opacity, dur, animType) {
    obj.animate("opacity", opacity, xlateOptions(cnv, dur, animType));
}

function freeFormCreated(cnv, opt, callback) {
    var json = opt.path.toJSON();
    cnv.remove(opt.path);
    callback(json);
}

function beginFreeform(cnv, doneCallback) {
    cnv.isDrawingMode = true;
    cnv.discardActiveObject(); //select none
    cnv.requestRenderAll();
    cnv.on("path:created", (opt) => freeFormCreated(cnv, opt, doneCallback));
}

function endFreeform(cnv, doneCallback) {
    cnv.isDrawingMode = false;
    cnv.discardActiveObject(); //select none
    cnv.requestRenderAll();
    cnv.off("path:created", (opt) => freeFormCreated(cnv, opt, doneCallback));
}

function defHighlightShrink(cnv, obj) {
    obj.svScaleX = obj.scaleX;
    obj.svScaleY = obj.scaleY;
    obj.svLeft = obj.left;
    obj.svTop = obj.top;
    obj.set("left", obj.left + obj.width / 2);
    obj.set("top", obj.top + obj.height / 2);
    obj.set("originX", "center");
    obj.set("originY", "center");
    obj.set("scaleX", obj.scaleX * 0.9);
    obj.set("scaleY", obj.scaleY * 0.9);
    obj.set("dirty", true);
    cnv.renderAll();
}

function defUnhighlightShrink(cnv, obj) {
    if (obj.svLeft) {
        obj.set("left", obj.svLeft);
        obj.set("top", obj.svTop);
        obj.set("originX", "left");
        obj.set("originY", "top");
        obj.set("scaleX", obj.svScaleX);
        obj.set("scaleY", obj.svScaleY);
        obj.set("dirty", true);
        cnv.renderAll();
    }
}

function defHighlightOverlay(cnv, obj) {
    obj.highlightSvFill = obj.fill;
    obj.set("fill", OverlayHighlightFill);
    obj.set("dirty", true);
    cnv.renderAll();
}

function defUnhighlightOverlay(cnv, obj) {
    if (obj.highlightSvFill) {
        obj.set("fill", obj.highlightSvFill);
        obj.set("dirty", true);
        cnv.renderAll();
    }
}

// unfortunately, some object types in Fabric JS behave differently than others
function overlayHotspot(cnv, obj) {
    // check if not visible and make visible if not
    if (obj.opacity === 0) {
        obj.isInvisible = true;
        obj.set("opacity", 1.0);
    } else {
        obj.isInvisible = false;
    }
    defHighlightOverlay(cnv, obj);
}

function unoverlayHotspot(cnv, obj) {
    defUnhighlightOverlay(cnv, obj);
    if (obj.isInvisible) {
        obj.set("opacity", 0);
    }
}

function overlayImage(cnv, obj) {
    obj.filters.push(cnv.highlightImageFilter);
    obj.applyFilters();
    obj.set("dirty", true);
    cnv.renderAll();
}

function unoverlayImage(cnv, obj) {
    obj.filters.pop();
    obj.applyFilters();
    obj.set("dirty", true);
    cnv.renderAll();
}

function shrinkImage(cnv, obj) {
    obj.svScaleX = obj.scaleX;
    obj.svScaleY = obj.scaleY;
    obj.svLeft = obj.left;
    obj.svTop = obj.top;
    obj.set("left", obj.left + obj.width * 0.025);
    obj.set("top", obj.top + obj.height * 0.025);
    obj.set("scaleX", obj.scaleX * 0.9);
    obj.set("scaleY", obj.scaleY * 0.9);
    obj.set("dirty", true);
    cnv.renderAll();
}

function unshrinkImage(cnv, obj) {
    obj.set("left", obj.svLeft);
    obj.set("top", obj.svTop);
    obj.set("scaleX", obj.svScaleX);
    obj.set("scaleY", obj.svScaleY);
    obj.set("dirty", true);
    cnv.renderAll();
}

function shrinkRect(cnv, obj) {
    obj.svLeft = obj.left;
    obj.svTop = obj.top;
    obj.svWidth = obj.width;
    obj.svHeight = obj.height;
    obj.set("left", obj.left + 5);
    obj.set("top", obj.top + 5);
    obj.set("width", obj.width - 10);
    obj.set("height", obj.height - 10);
    obj.set("dirty", true);
    cnv.renderAll();
}

function unshrinkRect(cnv, obj) {
    obj.set("left", obj.svLeft);
    obj.set("top", obj.svTop);
    obj.set("width", obj.svWidth);
    obj.set("height", obj.svHeight);
    obj.set("dirty", true);
    cnv.renderAll();
}

function highlightShrink(cnv, obj) {
    switch (obj.type) {
        case "image":
            shrinkImage(cnv, obj);
            break;
        case "rect":
            shrinkRect(cnv, obj);
            break;
        default:
            defHighlightShrink(cnv, obj);
    }
}

function unhighlightShrink(cnv, obj) {
    switch (obj.type) {
        case "image":
            unshrinkImage(cnv, obj);
            break;
        case "rect":
            unshrinkRect(cnv, obj);
            break;
        default:
            defUnhighlightShrink(cnv, obj);
    }
}

function highlightOverlay(cnv, obj) {
    switch (obj.type) {
        case "hotspot":
            overlayHotspot(cnv, obj);
            break;
        case "image":
            overlayImage(cnv, obj);
            break;
        default:
            defHighlightOverlay(cnv, obj);
    }
}

function unhighlightOverlay(cnv, obj) {
    switch (obj.type) {
        case "hotspot":
            unoverlayHotspot(cnv, obj);
            break;
        case "image":
            unoverlayImage(cnv, obj);
            break;
        default:
            defUnhighlightOverlay(cnv, obj);
    }
}

function getTextStyle(cobj) {
    var styles = [];
    if (cobj.fontWeight === "bold") styles.push("bold");
    if (cobj.fontStyle === "italic") styles.push("italic");
    if (cobj.underline) styles.push("underline");
    if (cobj.linethrough) styles.push("strikethrough");
    return {
        styles: styles, // array of one or more of 'bold', 'italic', 'underline', 'strikethrough' - bold=fontWeight === 'bold', italic = fontStyle === 'italic'
        // underline = underline === true, strikethrough = linethrough === true
        alignment: ["left", "center", "right"].includes(cobj.textAlign)
            ? cobj.textAlign
            : "center", // left, center, right - value of textAlign field,
        fontSize: cobj.fontSize,
        fontFamily: cobj.fontFamily,
    };
}

function setTextStyle(cobj, style) {
    cobj.setFont({
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.styles.includes("bold") ? "bold" : "normal",
        fontStyle: style.styles.includes("italic") ? "italic" : "normal",
        underline: style.styles.includes("underline"),
        linethrough: style.styles.includes("strikethrough"),
        textAlign: style.alignment,
    });
}

async function canvasToPDF(cnv, filename, orientation, format, openAfterSave) {
    // save to SVG for comparison while debugging
    // canvasToSVGFile(cnv, filename + ".svg");
    try {
        var pdfObj = openPDF(orientation, format);
        var svg = cnv.toSVG();
        await writeSVGtoPDF(pdfObj, svg);
        savePDF(pdfObj, filename, openAfterSave);
    } catch (err) {
        console.log("Error generating PDF");
    }
}

function canvasToSVGFile(cnv, filename) {
    var svgcnv = cnv.toSVG();
    var blob = new Blob([svgcnv], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, filename);
}

function getSVG(cnv) {
    return cnv.toSVG();
}

export {
    initCanvas,
    initPrintCanvas,
    waitForCanvasPromises,
    addRect,
    addCircle,
    addTriangle,
    addText,
    addImage,
    addSymbolButton,
    addContainerBox,
    addHotSpot,
    getImageSource,
    setImageSource,
    setImageSourceA,
    clearSelectionCallback,
    setSelectionCallback,
    clearMousedownCallback,
    setMousedownCallback,
    disableSelection,
    enableSelection,
    disableInputCallback,
    enableInputCallback,
    objectsFromEventTarget,
    objectAtXY,
    containerForObject,
    enableMouseTracking,
    disableMouseTracking,
    getBackgroundColor,
    setBackgroundColor,
    getBackgroundImage,
    clearBackgroundImage,
    setBackgroundImageURL,
    setBackgroundImageStyle,
    setSelectedObject,
    setSelectedObjects,
    selectAllObjects,
    removeObject,
    deleteSelectedObjects,
    bringToFront,
    sendToBack,
    refresh,
    clearCanvas,
    resizeCanvas,
    setZoom,
    reparentObject,
    createThumbnail,
    saveToFile,
    isImageEmbedded,
    embedImage,
    getAngle,
    rotateTo,
    rotateBy,
    getPosition,
    getDimensions,
    setDimensions,
    moveTo,
    moveBy,
    moveSelectionBy,
    animatePosition,
    animateDimensions,
    animateAngle,
    animateOpacity,
    beginFreeform,
    endFreeform,
    highlightShrink,
    unhighlightShrink,
    highlightOverlay,
    unhighlightOverlay,
    getTextStyle,
    setTextStyle,
    canvasToPDF,
    canvasToSVGFile,
    getSVG,
};
