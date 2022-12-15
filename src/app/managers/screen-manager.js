import PageScreenObject from "../screen-objects/page-screen-object";
import RectScreenObject from "../screen-objects/rect-screen-object";
import CircleScreenObject from "../screen-objects/circle-screen-object";
import TextScreenObject from "../screen-objects/text-screen-object";
import ImageScreenObject from "../screen-objects/image-screen-object";
import SymbolButtonScreenObject from "../screen-objects/symbol-button-screen-object";
import AccessManager from "./access-manager";
import { InputEvent } from "../../utils/input-events";
import {
    BehaviorManager,
    blankBehavior,
} from "../behaviors/behavior-behaviors";

import {
    initCanvas,
    clearSelectionCallback,
    setSelectionCallback,
    getBackgroundColor,
    setBackgroundColor,
    clearBackgroundImage,
    setBackgroundImageURL,
    setBackgroundImageStyle,
    clearMousedownCallback,
    setMousedownCallback,
    disableSelection,
    enableSelection,
    enableInputCallback,
    objectAtXY,
    enableMouseTracking,
    disableMouseTracking,
    setSelectedObject,
    setSelectedObjects,
    deleteSelectedObjects,
    bringToFront,
    sendToBack,
    moveBy,
    removeObject,
    refresh,
    resizeCanvas,
    setZoom,
    clearCanvas,
    saveToFile,
    addRect,
    addCircle,
    addImage,
    addSymbolButton,
    addText,
    getDimensions,
} from "../../utils/canvas";

import { defaultImageData } from "../../utils/image-defaults";
import { ScreenObjectType } from "../constants/screen-object-types";
import { SymBtnShape } from "../../utils/symbol-button";
import { EditMode } from "../../routes/editor/edit-modes";

const sprayXOffset = 20;
const sprayYOffset = 20;

class ScreenManager {
    #canvas = null;
    #currentPage = null;
    #appMode = EditMode.Select;
    #selectionCallback = null;
    #modeChangeCallback = null;
    #modifiedCallback = null;
    #selectedObjects = null;
    #screenRegion;
    #activitySize;
    #handleInputEvents = false;
    #accessManager = null;
    #sprayMouseDown = false;
    #sprayObject = null;

    constructor() {
        this.addObjectOnMousedown = this.addObjectOnMousedown.bind(this);
        this.scrMgrSelectionCallback = this.scrMgrSelectionCallback.bind(this);
        this.setModified = this.setModified.bind(this);
        this.inputCallback = this.inputCallback.bind(this);
        this.sprayTrackMouse = this.sprayTrackMouse.bind(this);
    }

    getCanvas() {
        return this.#canvas;
    }

    getCurrentPage() {
        return this.#currentPage;
    }

    getCurrentPageName() {
        return this.#currentPage.getName();
    }

    getVScreenSize() {
        return this.#activitySize;
    }

    openPage(pageSpec) {
        if (this.#currentPage) {
            this.closeCurrentPageBehavior();
        }

        clearCanvas(this.#canvas);
        this.#currentPage = new PageScreenObject(this, null, pageSpec);

        if (this.#currentPage) {
            this.openCurrentPageBehavior();
        }
    }

    openCurrentPageBehavior() {
        // push the page stack frame, run open page behavior
        BehaviorManager.executeWithStackFrame(
            "page",
            this.#currentPage.getProperty("openBehavior")
        );
    }

    closeCurrentPageBehavior() {
        // run close page behavior, pop page stack frame
        BehaviorManager.execute(this.#currentPage.getProperty("closeBehavior"));
        BehaviorManager.popStackFrame();
    }

    rerunPageBehavior() {
        // this is specifically for the case where we have edited activity behavior, have run those, and need to do
        //   page open behaviors now
        this.openCurrentPageBehavior();
    }

    changePageOpenBehaviors() {
        // this case is for when just the page open behaviors have been changed - pop the current page stack
        //     frame, rerun the behaviors
        BehaviorManager.popStackFrame();
        this.openCurrentPageBehavior();
    }

    #canvasObjToScreen(scrObj, cnvObj) {
        if (scrObj.getCanvasObj(scrObj) === cnvObj) {
            return scrObj;
        }

        var children = scrObj.getChildren();
        for (let i = 0; i < children.length; i++) {
            var child = this.#canvasObjToScreen(children[i], cnvObj);
            if (child) {
                return child;
            }
        }
        return null;
    }

    #canvasObjsToScreen(page, cnvObjs) {
        var screenObjs = [];
        for (let i = 0; i < cnvObjs.length; i++) {
            var scrObj = this.#canvasObjToScreen(page, cnvObjs[i]);
            if (scrObj) {
                screenObjs.push(scrObj);
            }
        }
        return screenObjs;
    }

    scrMgrSelectionCallback(cnvObjs) {
        if (this.#selectionCallback && this.#currentPage) {
            var scrObjs = this.#canvasObjsToScreen(this.#currentPage, cnvObjs);
            this.#selectionCallback(scrObjs);
            this.#selectedObjects = scrObjs;
        }
    }

    setSelection(objs) {
        this.#selectedObjects = objs;
        this.#selectionCallback(objs);
        var cobjs = objs.map((obj) => obj.getCanvasObj());
        setSelectedObjects(this.#canvas, cobjs);
    }

    clearSelectionCallback() {
        clearSelectionCallback(this.#canvas);
        this.#selectionCallback = null;
        this.#selectedObjects = null;
    }

    getSelectedObjects() {
        return this.#selectedObjects;
    }

    deleteSelectedObjects() {
        if (this.#currentPage && this.#selectedObjects) {
            for (let i = 0; i < this.#selectedObjects.length; i++) {
                var obj = this.#selectedObjects[i];
                this.#currentPage.removeChild(obj);
            }
            deleteSelectedObjects(this.#canvas);
            refresh(this.#canvas);
            if (this.#selectionCallback) this.#selectionCallback([]);
            this.#selectedObjects = [];
        }
    }

    deleteObject(obj) {
        var page = obj.getPage();
        if (page) {
            page.removeChild(obj);
        }
        removeObject(this.#canvas, obj.getCanvasObj());
    }

    bringSelectionToFront() {
        if (this.#currentPage && this.#selectedObjects) {
            for (let i = 0; i < this.#selectedObjects.length; i++) {
                var obj = this.#selectedObjects[i];
                this.bringObjectToFront(obj);
            }
        }
    }

    sendSelectionToBack() {
        if (this.#currentPage && this.#selectedObjects) {
            for (let i = 0; i < this.#selectedObjects.length; i++) {
                var obj = this.#selectedObjects[i];
                this.sendObjectToBack(obj);
            }
        }
    }

    bringObjectToFront(obj) {
        bringToFront(this.#canvas, obj.getCanvasObj());
    }

    sendObjectToBack(obj) {
        sendToBack(this.#canvas, obj.getCanvasObj());
    }

    duplicateSelection(offx, offy) {
        if (this.#currentPage && this.#selectedObjects) {
            var clones = [];
            var selObjs = this.#selectedObjects;
            setSelectedObjects(this.#canvas, null);
            for (let i = 0; i < selObjs.length; i++) {
                var obj = selObjs[i];
                var newObj = this.cloneObject(obj);
                moveBy(this.#canvas, newObj.getCanvasObj(), offx, offy);
                clones.push(newObj);
            }
            this.setSelection(clones);
        }
    }

    setSelectionCallback(callbk) {
        setSelectionCallback(this.#canvas, this.scrMgrSelectionCallback);
        this.#selectionCallback = callbk;
    }

    setModifiedCallback(callbk) {
        // this is only called on modifications on the canvas
        this.#modifiedCallback = callbk;
    }

    setModeChangeCallback(callbk) {
        this.#modeChangeCallback = callbk;
    }

    getBackgroundColor() {
        return getBackgroundColor(this.#canvas);
    }

    setBackgroundColor(_bkgColor) {
        setBackgroundColor(this.#canvas, _bkgColor);
        this.setModified();
    }

    clearBackgroundImage() {
        clearBackgroundImage(this.#canvas);
    }

    setBackgroundImage(imageURL, bkgStyle) {
        setBackgroundImageURL(this.#canvas, imageURL, bkgStyle);
    }

    setBackgroundImageStyle(bkgStyle) {
        setBackgroundImageStyle(this.#canvas, bkgStyle);
    }

    setupForActivity(activity) {
        // resize and reposition the canvas to accommodate activity.aspectRatio
        this.#activitySize = activity.vSize;
        this.recalculateCanvas();
    }

    resizeScreenRegion(width, height) {
        this.#screenRegion.width = width;
        this.#screenRegion.height = height;
        this.recalculateCanvas();
    }

    recalculateCanvas() {
        var screenWidth = this.#screenRegion.width;
        var screenHeight = this.#screenRegion.height;
        var screenRatio = screenWidth / screenHeight;
        var activityRatio =
            this.#activitySize.width / this.#activitySize.height;
        var newWidth, newHeight;
        if (screenRatio < activityRatio) {
            newWidth = screenWidth;
            newHeight = newWidth / activityRatio;
        } else {
            newHeight = screenHeight;
            newWidth = newHeight * activityRatio;
        }
        resizeCanvas(this.#canvas, newWidth, newHeight);
        setZoom(this.#canvas, newWidth / this.#activitySize.width);
    }

    setModified() {
        if (this.#modifiedCallback) {
            this.#modifiedCallback();
        }
    }

    inputCallback(eventType, eventData, scrObj) {
        if (this.#accessManager) {
            this.#accessManager.handleInput(eventType, eventData, scrObj);
        }
    }

    createCanvas(appManager, screenSpec) {
        const { id, top, left, width, height, backgroundColor, doSelection } =
            screenSpec;

        this.#canvas = initCanvas(
            id,
            left,
            top,
            width,
            height,
            backgroundColor,
            doSelection,
            false,
            this.setModified
        );
        this.#screenRegion = {
            left: left,
            top: top,
            width: width,
            height: height,
        };
        return this.#canvas;
    }

    disableAccessMethod() {
        this.#canvas.disableInputCallback(this.#canvas, this.inputCallback);
        this.#handleInputEvents = false;
        this.#accessManager = null;
    }

    enableAccessMethod(appManager) {
        this.#handleInputEvents = true;
        enableInputCallback(this.#canvas, this.inputCallback);
        this.#accessManager = new AccessManager(appManager);
        this.#accessManager.setMethod(appManager.getSetting("accessMethod"));
    }

    addObjectOnMousedown(options) {
        var newObj = null;
        switch (this.#appMode.submode) {
            case "Rectangle":
                if (this.#currentPage) {
                    newObj = new RectScreenObject(this, this.#currentPage, {
                        type: ScreenObjectType.Rectangle,
                        shapeSpec: {
                            left: options.pointer.x,
                            top: options.pointer.y,
                            width: 100,
                            height: 100,
                            fill: "red",
                            stroke: "black",
                            opacity: 1.0,
                        },
                    });
                    this.setModified();
                }
                break;
            case "Circle":
                if (this.#currentPage) {
                    newObj = new CircleScreenObject(this, this.#currentPage, {
                        type: ScreenObjectType.Circle,
                        shapeSpec: {
                            left: options.pointer.x,
                            top: options.pointer.y,
                            radius: 50,
                            fill: "green",
                            stroke: "black",
                            opacity: 1.0,
                        },
                    });
                    this.setModified();
                }
                break;
            case "Text":
                if (this.#currentPage) {
                    newObj = new TextScreenObject(
                        this,
                        this.#currentPage,
                        "Enter Text",
                        {
                            type: ScreenObjectType.Text,
                            shapeSpec: {
                                left: options.pointer.x,
                                top: options.pointer.y,
                                fill: "black",
                                stroke: "black",
                                opacity: 1.0,
                            },
                        }
                    );
                    this.setModified();
                }
                break;
            case "Image":
                if (this.#currentPage) {
                    newObj = new ImageScreenObject(this, this.#currentPage, {
                        type: ScreenObjectType.Image,
                        shapeSpec: {
                            left: options.pointer.x,
                            top: options.pointer.y,
                            width: 300,
                            height: 300,
                            opacity: 1.0,
                        },
                    });
                    newObj.setSource(this, null);
                    this.setModified();
                }
                break;
            case "SymbolButton":
                if (this.#currentPage) {
                    newObj = new SymbolButtonScreenObject(
                        this,
                        this.#currentPage,
                        "Label",
                        SymBtnShape.RoundedRect,
                        blankBehavior,
                        {
                            type: ScreenObjectType.SymbolButton,
                            shapeSpec: {
                                left: options.pointer.x,
                                top: options.pointer.y,
                                width: 200,
                                height: 200,
                                fill: "white",
                                stroke: "black",
                                opacity: 1.0,
                                imageSource: defaultImageData,
                            },
                        }
                    );
                    this.setModified();
                }
                break;

            default:
                return;
        }
        if (newObj && newObj.getCanvasObj()) {
            if (this.#modeChangeCallback) {
                this.#modeChangeCallback(EditMode.Select);
            }
            setSelectedObject(this.#canvas, newObj.getCanvasObj());
        }
    }

    setMode(mode) {
        if (this.#appMode === mode) return;
        switch (this.#appMode.mode) {
            case "Select":
                clearSelectionCallback(this.#canvas);
                break;
            case "Add":
                clearMousedownCallback(this.#canvas, this.addObjectOnMousedown);
                break;
            case "Spray":
                disableMouseTracking(this.#canvas, this.sprayTrackMouse);
                break;
            default:
        }
        switch (mode.mode) {
            case "Select":
                // restore any selection callback
                if (this.#selectionCallback) {
                    setSelectionCallback(
                        this.#canvas,
                        this.scrMgrSelectionCallback
                    );
                }
                enableSelection(this.#canvas);
                break;

            case "Add":
                disableSelection(this.#canvas);
                setMousedownCallback(this.#canvas, this.addObjectOnMousedown);
                break;
            case "Spray":
                this.setSelection([]);
                disableSelection(this.#canvas);
                this.#sprayMouseDown = false;
                enableMouseTracking(this.#canvas, this.sprayTrackMouse);
                break;

            default:
        }
        this.#appMode = mode;
    }

    sprayTrackMouse(eventType, x, y) {
        switch (eventType) {
            case InputEvent.MouseDown:
                console.log(`${eventType}-${x}.${y}`);
                this.#sprayObject = objectAtXY(this.#canvas, x, y);
                if (!this.#sprayObject) {
                    if (this.#modeChangeCallback) {
                        this.#modeChangeCallback(EditMode.Select);
                    }
                } else {
                    this.#sprayMouseDown = true;
                }
                break;
            case InputEvent.MouseMove:
                if (this.#sprayMouseDown) {
                    console.log(`${eventType}-${x}.${y}`);
                }
                break;
            case InputEvent.MouseUp:
                this.finishSpray(x, y);
                if (this.#modeChangeCallback) {
                    this.#modeChangeCallback(EditMode.Select);
                }
                break;
            default:
        }
    }

    calcSprayAdditions(mx, my) {
        var vsSz = this.getVScreenSize();
        mx = Math.max(0, mx);
        mx = Math.min(mx, vsSz.width - 1);
        my = Math.max(0, my);
        my = Math.min(my, vsSz.height - 1);

        var { x, y, width, height } = getDimensions(this.#sprayObject);
        var ncols, nrows;
        if (mx < x) {
            ncols = Math.trunc((mx - x) / (width + sprayXOffset));
        } else if (mx > x + width) {
            ncols = Math.trunc((mx - (x + width)) / (width + sprayXOffset));
        } else {
            ncols = 0;
        }

        if (my < y) {
            nrows = Math.trunc((my - y) / (height + sprayYOffset));
        } else if (mx > y + height) {
            nrows = Math.trunc((my - (y + height)) / (height + sprayYOffset));
        } else {
            nrows = 0;
        }

        return { nrows: nrows, ncols: ncols };
    }

    finishSpray(x, y) {
        var { ncols, nrows } = this.calcSprayAdditions(x, y);
        if (ncols === 0 && nrows === 0) return;

        var { x, y, width, height } = getDimensions(this.#sprayObject);
        for (let ccnt = 0; ccnt <= Math.abs(ncols); ccnt++) {
            for (let rcnt = 0; rcnt <= Math.abs(nrows); rcnt++) {
                if (rcnt !== 0 || ccnt !== 0) {
                    var offx = Math.sign(ncols) * ccnt * (width + sprayXOffset);
                    var offy =
                        Math.sign(nrows) * rcnt * (height + sprayYOffset);
                    var scrObj = this.#canvasObjToScreen(
                        this.#currentPage,
                        this.#sprayObject
                    );
                    if (scrObj) {
                        var newObj = this.cloneObject(scrObj);
                        moveBy(this.#canvas, newObj.getCanvasObj(), offx, offy);
                    }
                }
            }
        }
    }

    async setSelectionProperties(propType, value) {
        var objs = this.#selectedObjects;
        var anySet = false;
        if (!objs || objs.length <= 0) {
            var page = this.#currentPage;
            if (page) {
                objs = [page];
            }
        }
        if (objs) {
            for (let i = 0; i < objs.length; i++) {
                var obj = objs[i];
                anySet = true;
                await obj.setEditProperty(this, propType, value);
            }
        }
        if (anySet) {
            refresh(this.#canvas);
        }
    }

    createFromSpec(parent, spec) {
        if (!spec) return null;

        switch (spec.type) {
            case ScreenObjectType.Page:
                return new PageScreenObject(this, parent, spec);
            case ScreenObjectType.Rectangle:
                return new RectScreenObject(this, parent, spec);
            case ScreenObjectType.Circle:
                return new CircleScreenObject(this, parent, spec);
            case ScreenObjectType.Text:
                return new TextScreenObject(this, parent, spec.text, spec);
            case ScreenObjectType.Image:
                var newImage = new ImageScreenObject(this, parent, spec);
                newImage.setSource(this, spec.shapeSpec.src);
                return newImage;
            case ScreenObjectType.SymbolButton:
                return new SymbolButtonScreenObject(
                    this,
                    parent,
                    spec.label,
                    spec.shape || SymBtnShape.RoundedRect,
                    spec.behavior || blankBehavior,
                    spec
                );
            default:
                return null;
        }
    }

    cloneObject(obj) {
        var json = obj.toJSON();
        var parent = obj.getParent();
        return this.createFromSpec(parent, json);
    }

    screenToFile(filename) {
        saveToFile(this.#canvas, filename);
    }

    getAccessMethod() {
        return this.#accessManager ? this.#accessManager.getMethod() : null;
    }

    setAccessMethod(method) {
        if (this.#accessManager) {
            this.#accessManager.setMethod(method);
        }
    }

    addRect(scrObj, spec) {
        return addRect(
            this.#canvas,
            spec,
            scrObj,
            this.#handleInputEvents ? this.inputCallback : null
        );
    }

    addCircle(scrObj, spec) {
        return addCircle(
            this.#canvas,
            spec,
            scrObj,
            this.#handleInputEvents ? this.inputCallback : null
        );
    }

    addImage(scrObj, spec) {
        return addImage(
            this.#canvas,
            spec,
            scrObj,
            this.#handleInputEvents ? this.inputCallback : null
        );
    }

    addSymbolButton(scrObj, label, shape, spec) {
        return addSymbolButton(
            this.#canvas,
            label,
            shape,
            spec,
            scrObj,
            this.#handleInputEvents ? this.inputCallback : null
        );
    }
    addText(scrObj, text, spec) {
        return addText(
            this.#canvas,
            text,
            spec,
            scrObj,
            this.#handleInputEvents ? this.inputCallback : null
        );
    }
}

export default ScreenManager;
