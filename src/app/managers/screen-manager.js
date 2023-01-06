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
    selectAllObjects,
    deleteSelectedObjects,
    bringToFront,
    sendToBack,
    moveBy,
    moveSelectionBy,
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

const sprayXSpacingDefault = 20;
const sprayYSpacingDefault = 20;

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
    #sprayRegistry = [];
    #sprayExtent = { col: 0, row: 0 };
    #settingsCallback;
    #messageCallback = null;
    #copyBuffer = [];

    constructor(settingsCallback) {
        this.addObjectOnMousedown = this.addObjectOnMousedown.bind(this);
        this.scrMgrSelectionCallback = this.scrMgrSelectionCallback.bind(this);
        this.setModified = this.setModified.bind(this);
        this.inputCallback = this.inputCallback.bind(this);
        this.sprayTrackMouse = this.sprayTrackMouse.bind(this);
        this.#settingsCallback = settingsCallback;
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

    setMessageCallback(callback) {
        this.#messageCallback = callback;
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

    moveSelectionBy(dx, dy) {
        if (this.#currentPage && this.#selectedObjects) {
            moveSelectionBy(this.#canvas, dx, dy);
        }
    }

    copySelection() {
        if (this.#currentPage && this.#selectedObjects) {
            this.#copyBuffer = [];
            var selObjs = this.#selectedObjects;
            for (let i = 0; i < selObjs.length; i++) {
                this.#copyBuffer.push(selObjs[i].toJSON());
            }
        }
    }

    cutSelection() {
        this.copySelection();
        this.deleteSelectedObjects();
    }

    pasteBuffer(offx = 0, offy = 0) {
        if (
            this.#currentPage &&
            this.#copyBuffer &&
            this.#copyBuffer.length > 0
        ) {
            var parent = this.#currentPage;
            for (let i = 0; i < this.#copyBuffer.length; i++) {
                var newObj = this.createFromSpec(parent, this.#copyBuffer[i]);
                if (offx != 0 || offy != 0) {
                    moveBy(this.#canvas, newObj.getCanvasObj(), offx, offy);
                }
            }
        }
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

    selectAll() {
        selectAllObjects(this.#canvas);
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
        this.showMessage("");
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

    showMessage(msg) {
        if (this.#messageCallback) {
            this.#messageCallback(msg);
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
                this.showMessage("Select where you'd like to place the object");
                disableSelection(this.#canvas);
                setMousedownCallback(this.#canvas, this.addObjectOnMousedown);
                break;
            case "Spray":
                this.setSelection([]);
                disableSelection(this.#canvas);
                this.#sprayMouseDown = false;
                enableMouseTracking(this.#canvas, this.sprayTrackMouse);
                this.showMessage("Select the object you want to copy");
                break;

            default:
        }
        this.#appMode = mode;
    }

    sprayTrackMouse(eventType, x, y) {
        switch (eventType) {
            case InputEvent.MouseDown:
                this.showMessage("");
                var cnvObj = objectAtXY(this.#canvas, x, y);
                if (cnvObj) {
                    this.#sprayObject = this.#canvasObjToScreen(
                        this.#currentPage,
                        cnvObj
                    );
                }
                if (!this.#sprayObject) {
                    if (this.#modeChangeCallback) {
                        this.#modeChangeCallback(EditMode.Select);
                    }
                } else {
                    this.showMessage("Sweep the area you want to spray into");
                    this.#sprayMouseDown = true;
                    this.#sprayRegistry = [];
                    this.#sprayExtent = { col: 0, row: 0 };
                }
                break;
            case InputEvent.MouseMove:
                if (this.#sprayMouseDown) {
                    this.updateSpray(x, y);
                }
                break;
            case InputEvent.MouseUp:
                this.showMessage("");
                if (this.#modeChangeCallback) {
                    this.#modeChangeCallback(EditMode.Select);
                }
                this.#sprayMouseDown = false;
                this.#sprayRegistry = [];
                this.#sprayExtent = { col: 0, row: 0 };
                break;
            default:
        }
    }

    getSpraySpacing() {
        var xSpace, ySpace;
        if (this.#settingsCallback) {
            xSpace = this.#settingsCallback("sprayXSpacing");
            ySpace = this.#settingsCallback("sprayYSpacing");
        } else {
            xSpace = sprayXSpacingDefault;
            ySpace = sprayYSpacingDefault;
        }
        return { xSpace: xSpace, ySpace: ySpace };
    }

    calcSprayAdditions(mx, my, { x, y, width, height }) {
        var vsSz = this.getVScreenSize();
        var { xSpace, ySpace } = this.getSpraySpacing();

        mx = Math.max(0, mx);
        mx = Math.min(mx, vsSz.width - 1);
        my = Math.max(0, my);
        my = Math.min(my, vsSz.height - 1);

        var ncols, nrows;
        if (mx < x) {
            ncols = Math.trunc((mx - x) / (width + xSpace));
        } else if (mx > x + width) {
            ncols = Math.trunc((mx - (x + width)) / (width + xSpace));
        } else {
            ncols = 0;
        }

        if (my < y) {
            nrows = Math.trunc((my - y) / (height + ySpace));
        } else if (my > y + height) {
            nrows = Math.trunc((my - (y + height)) / (height + ySpace));
        } else {
            nrows = 0;
        }

        return { nrows: nrows, ncols: ncols };
    }

    sprayDeleteRows(srow, erow) {
        if (srow > erow) {
            var temp = srow;
            srow = erow;
            erow = temp;
        }

        for (let row = srow; row <= erow; row++) {
            for (let i = 0; i < this.#sprayRegistry.length; i++) {
                var reg = this.#sprayRegistry[i];
                if (reg && reg.row === row) {
                    this.deleteObject(reg.obj);
                    this.#sprayRegistry[i] = null;
                }
            }
        }
    }

    sprayDeleteCols(scol, ecol) {
        if (scol > ecol) {
            var temp = scol;
            scol = ecol;
            ecol = temp;
        }

        for (let col = scol; col <= ecol; col++) {
            for (let i = 0; i < this.#sprayRegistry.length; i++) {
                var reg = this.#sprayRegistry[i];
                if (reg && reg.col === col) {
                    this.deleteObject(reg.obj);
                    this.#sprayRegistry[i] = null;
                }
            }
        }
    }

    sprayDeleteUpdate(pcols, prows, ncols, nrows) {
        if (
            (pcols < 0 && ncols >= 0) ||
            (pcols > 0 && ncols <= 0) ||
            (prows < 0 && nrows >= 0) ||
            (prows > 0 && nrows <= 0)
        ) {
            // delete everything
            this.sprayDeleteRows(0, prows);
            this.sprayDeleteCols(0, pcols);
            return { pcols: 0, prows: 0 };
        }

        if ((pcols <= 0 && ncols <= pcols) || (pcols >= 0 && ncols >= pcols)) {
            // no columns to delete
            if (
                (prows <= 0 && nrows <= prows) ||
                (prows >= 0 && nrows >= prows)
            ) {
                // nothing to delete
                return { pcols: pcols, prows: prows };
            }

            // have to be rows to delete
            this.sprayDeleteRows(prows, nrows);
            return { pcols: pcols, prows: nrows };
        }

        // there are colums to delete
        this.sprayDeleteCols(pcols, ncols);

        if ((prows <= 0 && nrows <= prows) || (prows >= 0 && nrows >= prows)) {
            // no rows to delete
            return { pcols: ncols, prows: prows };
        }

        // rows too
        this.sprayDeleteRows(prows, nrows);
        return { pcols: ncols, prows: nrows };
    }

    addToSprayRegistry(col, row, obj) {
        this.#sprayRegistry.push({ row: row, col: col, obj: obj });
    }

    inSprayRegistry(col, row) {
        for (let i = 0; i < this.#sprayRegistry.length; i++) {
            var reg = this.#sprayRegistry[i];
            if (reg && reg.col === col && reg.row === row) {
                return true;
            }
        }
        return false;
    }

    updateSpray(x, y) {
        var prevcols = this.#sprayExtent.col;
        var prevrows = this.#sprayExtent.row;
        var dims = getDimensions(this.#sprayObject.getCanvasObj());
        var { ncols, nrows } = this.calcSprayAdditions(x, y, dims);
        if (ncols === prevcols && nrows === prevrows) return;
        this.sprayDeleteUpdate(prevcols, prevrows, ncols, nrows);

        for (let ccnt = 0; ccnt <= Math.abs(ncols); ccnt++) {
            for (let rcnt = 0; rcnt <= Math.abs(nrows); rcnt++) {
                if (rcnt !== 0 || ccnt !== 0) {
                    var col = Math.sign(ncols) * ccnt;
                    var row = Math.sign(nrows) * rcnt;
                    if (!this.inSprayRegistry(col, row)) {
                        this.createSprayObject(dims, col, row);
                    }
                }
            }
        }
        this.#sprayExtent = { col: ncols, row: nrows };
    }

    createSprayObject({ x, y, width, height }, col, row) {
        var { xSpace, ySpace } = this.getSpraySpacing();
        var offx = col * (width + xSpace);
        var offy = row * (height + ySpace);
        var newObj = this.cloneObject(this.#sprayObject);
        moveBy(this.#canvas, newObj.getCanvasObj(), offx, offy);
        this.addToSprayRegistry(col, row, newObj);
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
