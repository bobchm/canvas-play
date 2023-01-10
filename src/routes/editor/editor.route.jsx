import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FlipToFrontRoundedIcon from "@mui/icons-material/FlipToFrontRounded";
import FlipToBackRoundedIcon from "@mui/icons-material/FlipToBackRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";

import PlayCanvas from "../../components/play-canvas/play-canvas.component";
import ObjectPalette from "../../components/object-palette/object-palette.component";
import PropertyPalette from "../../components/property-palette/property-palette.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import ButtonBar from "../../components/button-bar/button-bar.component";
import ListModal from "../../components/list-modal/list-modal.component";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import ScriptRepl from "../../components/repl/repl.component";
import FileSaver from "file-saver";
import FileNamer from "../../components/file-namer/file-namer.component";
import FilePicker from "../../components/file-picker/file-picker.component";

import ApplicationManager from "../../app/managers/application-manager";
import confirmationBox from "../../utils/confirm-box";
import { defaultPageSpec, jsonDeepCopy } from "../../utils/app-utils";
import { EditMode } from "./edit-modes";
import { combineProperties } from "../../app/constants/property-types";

import { ReactComponent as DuplicateIcon } from "./duplicate.svg";

import SvgIcon from "@mui/material/SvgIcon";
import { BehaviorManager } from "../../app/behaviors/behavior-behaviors";
import { ExecutionMode } from "../../app/scripting/canvas-exec";

const drawerWidth = 100;
const propsWidth = 300;
const appBarHeight = 64;
const buttonBarHeight = 30;
const aboveCanvasHeight = appBarHeight + buttonBarHeight;
const pageExtension = ".page.json";

const appName = "Canvas Play";
var suspendSelectionCallback = false;

const ArrowXMove = 5;
const ArrowYMove = 5;

const Editor = () => {
    const [title, setTitle] = useState(appName);
    const [appManager] = useState(() => new ApplicationManager());
    const [appMode, setAppMode] = useState(EditMode.Select);
    const [userName, setUserName] = useState("");
    const [activityName, setActivityName] = useState("");
    const [editProperties, setEditProperties] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isPagePickerOpen, setIsPagePickerOpen] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [pagePickerCallback, setPagePickerCallback] = useState(null);
    const [isAddPageOpen, setIsAddPageOpen] = useState(false);
    const [copyPageSource, setCopyPageSource] = useState(null);
    const [isCopyPageOpen, setIsCopyPageOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchParams] = useSearchParams();
    const [paletteHeight, setPaletteHeight] = useState(
        canvasHeight(window.innerHeight)
    );
    const [isReplOpen, setIsReplOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editMessage, setEditMessage] = useState("");
    const [hasCopyBuffer, setHasCopyBuffer] = useState(false);

    const navigate = useNavigate();

    const canvasSpec = {
        id: "canvas",
        left: 8,
        top: 0,
        width: canvasWidth(window.innerWidth),
        height: canvasHeight(window.innerHeight),
        backgroundColor: "aliceblue",
        doSelection: true,
        doObjectEvents: false,
    };

    const appBarMenuItems = [
        { label: "Add Page", callback: handleAddPage },
        { label: "Open Page", callback: handleOpenPage },
        { label: "Copy Page", callback: handleCopyPage },
        { label: "Delete Page", callback: handleDeletePage },
        { label: "Import Page", callback: handleImportPage },
        { label: "Export Page", callback: handleExportPage },
        {
            label: "REPL",
            callback: handleOpenRepl,
        },
    ];

    const leftButtonBarSpec = [
        {
            icon: <ArrowBackRoundedIcon />,
            callback: handleBackToActivities,
            text: "Back to Activity Center",
        },
        {
            icon: <PlayArrowRoundedIcon />,
            callback: handlePlay,
            text: "Play Page",
        },
    ];

    const rightButtonBarSpec = [
        {
            icon: <FlipToFrontRoundedIcon />,
            callback: handleBringToFront,
            text: "Bring to Front",
            isEnabled: hasSelection,
        },
        {
            icon: <FlipToBackRoundedIcon />,
            callback: handleSendToBack,
            text: "Send To Back",
            isEnabled: hasSelection,
        },
        {
            text: "--divider--",
        },
        {
            icon: <UndoRoundedIcon />,
            callback: handleUndo,
            text: "Undo",
        },
        {
            icon: <RedoRoundedIcon />,
            callback: handleRedo,
            text: "Redo",
        },
        {
            text: "--divider--",
        },
        {
            icon: <ContentCutRoundedIcon />,
            callback: handleCutSelection,
            text: "Cut Selection",
            isEnabled: hasSelection,
        },
        {
            icon: <ContentCopyRoundedIcon />,
            callback: handleCopySelection,
            text: "Copy Selection",
            isEnabled: hasSelection,
        },
        {
            icon: <ContentPasteRoundedIcon />,
            callback: handlePasteBuffer,
            text: "Paste",
            isEnabled: () => hasCopyBuffer,
        },
        {
            icon: (
                <SvgIcon>
                    <DuplicateIcon />
                </SvgIcon>
            ),
            callback: handleDuplicate,
            text: "Duplicate Selection",
            isEnabled: hasSelection,
        },
        {
            icon: <DeleteRoundedIcon />,
            callback: handleDeleteSelection,
            text: "Delete Selection",
            isEnabled: hasSelection,
        },
        {
            text: "--divider--",
        },
        {
            icon: <SaveRoundedIcon />,
            callback: handleSavePage,
            text: "Save Page",
            isEnabled: () => isModified,
        },
    ];

    const hotKeys = [
        {
            // Delete selection
            shift: false,
            ctrlCmd: false,
            key: "Delete",
            fn: handleDeleteSelection,
        },
        {
            // move selection left
            shift: false,
            ctrlCmd: false,
            key: "ArrowLeft",
            fn: () => handleMoveSelection(-1, 0),
        },
        {
            // move selection right
            shift: false,
            ctrlCmd: false,
            key: "ArrowRight",
            fn: () => handleMoveSelection(1, 0),
        },
        {
            // move selection up
            shift: false,
            ctrlCmd: false,
            key: "ArrowUp",
            fn: () => handleMoveSelection(0, -1),
        },
        {
            // move selection down
            shift: false,
            ctrlCmd: false,
            key: "ArrowDown",
            fn: () => handleMoveSelection(0, 1),
        },
        {
            // Select all
            shift: false,
            ctrlCmd: true,
            key: "a",
            fn: () => appManager.getScreenManager().selectAll(),
        },
        {
            // copy selection
            shift: false,
            ctrlCmd: true,
            key: "c",
            fn: handleCopySelection,
        },
        {
            // print
            shift: false,
            ctrlCmd: true,
            key: "p",
            fn: () => setEditMessage("Print not implemented yet"),
        },
        {
            // save
            shift: false,
            ctrlCmd: true,
            key: "s",
            fn: handleSavePage,
        },
        {
            // paste
            shift: false,
            ctrlCmd: true,
            key: "v",
            fn: handlePasteBuffer,
        },
        {
            // cut selection
            shift: false,
            ctrlCmd: true,
            key: "x",
            fn: handleCutSelection,
        },
        {
            // redo
            shift: false,
            ctrlCmd: true,
            key: "y",
            fn: handleRedo,
        },
        {
            // undo
            shift: false,
            ctrlCmd: true,
            key: "z",
            fn: handleUndo,
        },
    ];

    useEffect(() => {
        var uName = searchParams.get("userName");
        var aName = searchParams.get("activityName");
        initAppForNow(appManager, uName, aName, searchParams.get("startPage"));
        setUserName(uName);
        setActivityName(aName);

        function handleResize() {
            // console.log(
            //     "(Edit) resized to: ",
            //     window.innerWidth,
            //     "x",
            //     window.innerHeight
            // );

            // set a minimum height
            if (canvasHeight(window.innerHeight) > 300) {
                appManager.resizeScreenRegion(
                    canvasWidth(window.innerWidth),
                    canvasHeight(window.innerHeight)
                );

                setPaletteHeight(canvasHeight(window.innerHeight));
            }
        }

        window.addEventListener("resize", handleResize);

        return (_) => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function handleKeydown(ev) {
            //ev.preventDefault();
            let key;
            if (!ev.shift && !ev.ctrlKey & !ev.metaKey) {
                key = ev.key;
            } else {
                key = String.fromCharCode(ev.which).toLowerCase();
            }
            for (let i = 0; i < hotKeys.length; i++) {
                var hotKey = hotKeys[i];
                if (
                    hotKey.shift === ev.shiftKey &&
                    hotKey.ctrlCmd === (ev.ctrlKey || ev.metaKey) &&
                    hotKey.key === key
                ) {
                    hotKey.fn();
                    return;
                }
            }
        }

        window.addEventListener("keydown", handleKeydown, true);
        return (_) => {
            window.removeEventListener("keydown", handleKeydown, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModified]);

    function canvasWidth(winWidth) {
        return winWidth - (drawerWidth + propsWidth);
    }

    function canvasHeight(winHeight) {
        return winHeight - aboveCanvasHeight;
    }

    function initAppForNow(appMgr, userName, activityName, startPage) {
        BehaviorManager.setExecutionMode(ExecutionMode.Edit);
        appMgr.getScreenManager().setMessageCallback(setEditMessage);
        var userMgr = appManager.getUserActivityManager();
        appMgr.setUser(userName).then((response) => {
            appMgr.setActivity(activityName).then((resp) => {
                var scrMgr = appManager.getScreenManager();

                var page = startPage
                    ? userMgr.getUserPage(startPage)
                    : userMgr.getHomePage();
                if (page === null) {
                    page = userMgr.getNthPage(0);
                }
                if (page) {
                    appMgr.openPage(page.name);
                }
                scrMgr.setSelectionCallback(handleSelectionChange);
                scrMgr.setModeChangeCallback(handleUserModeChange);
                scrMgr.setModifiedCallback(() => markChanged(true));
                handleSelectionChange([]);
                markChanged(false);
                setIsLoaded(true);
            });
        });
    }

    function addToEditProperties(dest, src) {
        for (let i = 0; i < dest.length; i++) {
            if (dest[i].type === src.type) {
                combineProperties(dest[i], src);
                return;
            }
        }
        dest.push(src);
    }

    function handleSelectionChange(objs) {
        if (!suspendSelectionCallback) {
            var props = [];
            if (!objs || objs.length <= 0) {
                var page = appManager.getScreenManager().getCurrentPage();
                if (page) {
                    objs = [page];
                }
            }
            if (objs && objs.length > 0) {
                for (let i = 0; i < objs.length; i++) {
                    var objProps = objs[i].getEditProperties(objs);
                    for (let j = 0; j < objProps.length; j++) {
                        addToEditProperties(props, objProps[j]);
                    }
                }
            }
            setEditProperties(props);
        }
    }

    function handleUserModeChange(mode) {
        setAppMode(mode);
        appManager.getScreenManager().setMode(mode);
    }

    function refreshLocalProperties(propType, value) {
        if (editProperties) {
            for (let i = 0; i < editProperties.length; i++) {
                if (editProperties[i].type === propType) {
                    editProperties[i].current = value;
                }
            }
        }
    }

    // this needs to be async because some of the property setters need to call asynchronous functions but we
    // need to wait until they are complete to update the property panel
    async function handlePropValueChange(propType, value) {
        await appManager
            .getScreenManager()
            .setSelectionProperties(propType, value);

        // does changing this property value force us to reevaluate all properties?
        if (propType.forceReset) {
            handleSelectionChange(
                appManager.getScreenManager().getSelectedObjects()
            );
        } else {
            refreshLocalProperties(propType, value);
        }
        markChanged(true);
    }

    function handleAddPage() {
        setIsAddPageOpen(true);
    }

    function handleDoAddPage(name) {
        setIsAddPageOpen(false);
        if (!name || name.length === 0) return;

        // add the page
        appManager.getUserActivityManager().addUserPage(defaultPageSpec(name));
    }

    function handleCancelDoAddPage(name) {
        setIsAddPageOpen(false);
    }

    function handleCopyPage() {
        let pageNames = getAllPages();

        setPageList(pageNames);
        setPagePickerCallback(() => handleSelectingCopyPage);
        setIsPagePickerOpen(true);
    }

    async function handleSelectingCopyPage(pageName) {
        setIsPagePickerOpen(false);
        if (!pageName) return;
        if (
            isModified &&
            (await confirmationBox(
                "You made changes. Would you like to save them?"
            ))
        ) {
            handleSavePage();
        }
        setCopyPageSource(pageName);
        setIsCopyPageOpen(true);
    }

    function handleDoCopyPageName(name) {
        setIsCopyPageOpen(false);
        if (!name || name.length === 0) return;

        var uam = appManager.getUserActivityManager();
        if (uam.hasUserPage(name)) {
            alert("That page name is already in use.");
            return;
        }

        // add the page
        uam.copyUserPage(copyPageSource, name);
    }

    function handleCancelCopyPageName(name) {
        setIsCopyPageOpen(false);
    }

    function getAllPages() {
        let uam = appManager.getUserActivityManager();
        let pageNameList = [];
        let nPages = uam.getNumPages();
        for (let n = 0; n < nPages; n++) {
            let page = uam.getNthPage(n);
            pageNameList.push(page.name);
        }
        return pageNameList;
    }

    function getAllPagesButCurrent() {
        let curPage = appManager.getScreenManager().getCurrentPage();
        let uam = appManager.getUserActivityManager();
        let pageNameList = [];
        let nPages = uam.getNumPages();
        for (let n = 0; n < nPages; n++) {
            let page = uam.getNthPage(n);
            if (page.name !== curPage.getName()) {
                pageNameList.push(page.name);
            }
        }
        return pageNameList;
    }

    function handleOpenPage() {
        let pageNames = getAllPagesButCurrent();

        if (!pageNames || pageNames.length === 0) {
            alert("There are no other pages to open.");
            return;
        }
        setPageList(pageNames);
        setPagePickerCallback(() => handleSelectingOpenPage);
        setIsPagePickerOpen(true);
    }

    async function handleSelectingOpenPage(pageName) {
        setIsPagePickerOpen(false);
        if (!pageName) return;
        if (
            isModified &&
            (await confirmationBox(
                "You made changes. Would you like to save them?"
            ))
        ) {
            handleSavePage();
        }
        appManager.openPage(pageName);
        handleSelectionChange([]);
        markChanged(false);
    }

    function handleDeletePage() {
        let pageNames = getAllPagesButCurrent();

        if (!pageNames || pageNames.length === 0) {
            alert("There are no other pages to delete.");
            return;
        }
        setPageList(pageNames);
        setPagePickerCallback(() => handleSelectingDeletePage);
        setIsPagePickerOpen(true);
    }

    async function handleSelectingDeletePage(pageName) {
        setIsPagePickerOpen(false);
        if (!pageName) return;

        if (
            await confirmationBox(
                `Are you sure you want to delete '${pageName}'?`
            )
        ) {
            // delete the page
            appManager.getUserActivityManager().removeUserPage(pageName);
        }
    }

    function handleImportPage() {
        setIsImportOpen(true);
    }
    function handleCompleteImport(fileName) {
        setIsImportOpen(false);
        const fileReader = new FileReader();
        fileReader.readAsText(fileName, "UTF-8");
        fileReader.onload = (e) => {
            var pageJSON = JSON.parse(e.target.result);
            importPage(pageJSON);
        };
    }

    async function importPage(spec) {
        ensureUniquePageName(spec);

        var uam = appManager.getUserActivityManager();
        var actId = uam.getCurrentActivityId();

        await uam.addUserPageToActivity(actId, spec);
    }

    function handleCancelImport() {
        setIsImportOpen(false);
    }

    function handleExportPage() {
        setIsExportOpen(true);
    }

    function ensureUniquePageName(spec) {
        var uam = appManager.getUserActivityManager();
        if (!uam.hasUserPage(spec.name)) return;

        var ctr = 0;
        while (ctr < 100) {
            var name = `${spec.name}${ctr}`;
            if (!uam.hasUserPage(name)) {
                spec.name = name;
                spec.content.name = name;
                spec.content.id = "#" + name;
                return;
            }
            ctr += 1;
        }
        throw new Error("Failure to create page");
    }

    function getPageJSON(spec) {
        var newSpec = jsonDeepCopy(spec);
        delete newSpec._id;
        return newSpec;
    }

    async function handleExportConfirm(fileName) {
        setIsExportOpen(false);

        if (
            isModified &&
            (await confirmationBox(
                "You made changes. Would you like to save them?"
            ))
        ) {
            handleSavePage();
        }

        // get the page
        var pgName = appManager.getScreenManager().getCurrentPageName();
        var json = await getPageJSON(
            appManager.getUserActivityManager().getUserPage(pgName)
        );
        if (json) {
            fileName += ".page.json";
            let blob = new Blob([JSON.stringify(json, null, 4)], {
                type: "application/json",
                name: fileName,
            });
            FileSaver.saveAs(blob, fileName);
        }
    }

    async function handleExportCancel(fileName) {
        setIsExportOpen(false);
    }

    async function handleOpenRepl() {
        setIsReplOpen(true);
    }

    async function handleCloseRepl() {
        setIsReplOpen(false);
    }

    async function handleBackToActivities() {
        if (
            isModified &&
            (await confirmationBox(
                "You made changes. Would you like to save them?"
            ))
        ) {
            handleSavePage();
        }
        navigate("/");
    }

    function currentPageName() {
        return appManager.getScreenManager().getCurrentPageName();
    }

    function handleBringToFront() {
        appManager.getScreenManager().bringSelectionToFront();
        markChanged(true);
    }

    function handleSendToBack() {
        appManager.getScreenManager().sendSelectionToBack();
        markChanged(true);
    }

    function handleDuplicate() {
        appManager.getScreenManager().duplicateSelection(50, 50);
        markChanged(true);
    }

    async function handlePlay() {
        if (
            isModified &&
            (await confirmationBox(
                "You made changes. Would you like to save them?"
            ))
        ) {
            handleSavePage();
        }

        navigate(
            `/play?userName=${userName}&activityName=${activityName}&startPage=${currentPageName()}&caller=editor`
        );
    }

    function handleSavePage() {
        if (isModified) {
            var screenMgr = appManager.getScreenManager();
            var page = screenMgr.getCurrentPage();
            if (page) {
                // Object selection sometimes embeds the objects in a selection frame and alters their
                // positions. Need to clear selection, save, and then reselect.
                suspendSelectionCallback = true;
                var selectedObjects = screenMgr.getSelectedObjects();
                screenMgr.setSelection([]);

                var content = page.toJSON();
                var spec = appManager
                    .getUserActivityManager()
                    .getUserPage(page.getName());
                spec.content = content;
                appManager.getUserActivityManager().modifyUserPage(spec);
                markChanged(false);
                screenMgr.setSelection(selectedObjects);
                suspendSelectionCallback = false;
                //appManager.getScreenManager().screenToFile("zqe.png");
            }
        }
    }

    function hasSelection() {
        return appManager.getScreenManager().hasSelectedObjects();
    }

    function handleDeleteSelection() {
        if (hasSelection) {
            appManager.getScreenManager().deleteSelectedObjects();
            markChanged(true);
        }
    }

    function handleCutSelection() {
        if (hasSelection()) {
            appManager.getScreenManager().cutSelection();
            markChanged(true);
            setHasCopyBuffer(true);
        }
    }

    function handleCopySelection() {
        if (hasSelection()) {
            appManager.getScreenManager().copySelection();
            setHasCopyBuffer(true);
        }
    }

    function handlePasteBuffer() {
        if (hasCopyBuffer) {
            appManager.getScreenManager().pasteBuffer();
            markChanged(true);
        }
    }

    function handleRedo() {
        setEditMessage("Redo not implemented yet");
    }

    function handleUndo() {
        setEditMessage("Undo not implemented yet");
    }

    function handleMoveSelection(xDir, yDir) {
        if (hasSelection) {
            appManager
                .getScreenManager()
                .moveSelectionBy(xDir * ArrowXMove, yDir * ArrowYMove);
            markChanged(true);
        }
    }

    function markChanged(isChanged) {
        setIsModified(isChanged);
        resetTitle(isChanged);
    }

    function resetTitle(isChanged) {
        var newTitle = appName;
        if (appManager.getScreenManager().getCurrentPage()) {
            newTitle +=
                " -- " +
                appManager.getScreenManager().getCurrentPage().getName();
        }
        if (isChanged) {
            newTitle += "*";
        }
        setTitle(newTitle);
    }

    return (
        <div>
            <CanvasAppBar
                isLoaded={isLoaded}
                menuActions={appBarMenuItems}
                title={title}
            />
            <ButtonBar
                top="0px"
                height={buttonBarHeight}
                leftButtons={leftButtonBarSpec}
                rightButtons={rightButtonBarSpec}
                message={editMessage}
            />
            <Box
                sx={{
                    display: "flex",
                    top: "0px",
                    backgroundColor: "aliceblue",
                }}
            >
                <ObjectPalette
                    top={0}
                    width={drawerWidth}
                    modeCallback={handleUserModeChange}
                    mode={appMode}
                />
                <div style={{ margin: "auto" }}>
                    <PlayCanvas spec={canvasSpec} appManager={appManager} />
                </div>
                <PropertyPalette
                    top={0}
                    left={window.innerWidth - propsWidth}
                    width={propsWidth}
                    height={paletteHeight}
                    options={editProperties}
                    propUpdateCallback={handlePropValueChange}
                    appManager={appManager}
                />
                <ListModal
                    title="Select Page"
                    elements={pageList}
                    onClose={pagePickerCallback}
                    open={isPagePickerOpen}
                />
                <TextInputModal
                    open={isCopyPageOpen}
                    question="Copy Page"
                    contentText="Enter the name of your new page."
                    textLabel="Page Name"
                    yesLabel="Copy"
                    yesCallback={handleDoCopyPageName}
                    noLabel="Cancel"
                    noCallback={handleCancelCopyPageName}
                />{" "}
                <TextInputModal
                    open={isAddPageOpen}
                    question="Add New Page?"
                    contentText="Enter the name of your new page."
                    textLabel="Page Name"
                    yesLabel="Add"
                    yesCallback={handleDoAddPage}
                    noLabel="Cancel"
                    noCallback={handleCancelDoAddPage}
                />
                {isReplOpen && (
                    <ScriptRepl onClose={handleCloseRepl} open={isReplOpen} />
                )}
                {isImportOpen && (
                    <FilePicker
                        open={isImportOpen}
                        question="Import Page?"
                        contentText="Select file"
                        confirmLabel="Confirm"
                        confirmCallback={handleCompleteImport}
                        cancelLabel="Cancel"
                        cancelCallback={handleCancelImport}
                    />
                )}
                {isExportOpen && (
                    <FileNamer
                        open={isExportOpen}
                        question="Export Page?"
                        extension={pageExtension}
                        confirmLabel="Confirm"
                        confirmCallback={handleExportConfirm}
                        cancelLabel="Cancel"
                        cancelCallback={handleExportCancel}
                    />
                )}
            </Box>
        </div>
    );
};

export default Editor;
