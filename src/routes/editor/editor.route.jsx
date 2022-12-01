import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import PlayCanvas from "../../components/play-canvas/play-canvas.component";
import ObjectPalette from "../../components/object-palette/object-palette.component";
import PropertyPalette from "../../components/property-palette/property-palette.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import ButtonBar from "../../components/button-bar/button-bar.component";
import ListModal from "../../components/list-modal/list-modal.component";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import ScriptEditor from "../../components/script-editor/script-editor.component";

import ApplicationManager from "../../app/managers/application-manager";
import confirmationBox from "../../utils/confirm-box";
import { defaultPageSpec } from "../../utils/app-utils";
import { EditMode } from "./edit-modes";
import { combineProperties } from "../../app/constants/property-types";
import { blankBehavior } from "../../app/behaviors/behavior-behaviors";

const drawerWidth = 100;
const propsWidth = 300;
const appBarHeight = 64;
const buttonBarHeight = 30;
const aboveCanvasHeight = appBarHeight + buttonBarHeight;

const appName = "Canvas Play";

const Editor = () => {
    const [title, setTitle] = useState(appName);
    const [appManager] = useState(() => new ApplicationManager());
    const [appMode, setAppMode] = useState(EditMode.Select);
    const [editProperties, setEditProperties] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isPagePickerOpen, setIsPagePickerOpen] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [pagePickerCallback, setPagePickerCallback] = useState(null);
    const [isAddPageOpen, setIsAddPageOpen] = useState(false);
    const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);
    const [activityBehavior, setActivityBehavior] = useState(blankBehavior);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchParams] = useSearchParams();
    const [paletteHeight, setPaletteHeight] = useState(
        canvasHeight(window.innerHeight)
    );

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
        { label: "Delete Page", callback: handleDeletePage },
        {
            label: "Edit Activity Behavior",
            callback: handleEditActivityBehavior,
        },
    ];

    const leftButtonBarSpec = [
        {
            icon: <ArrowBackRoundedIcon />,
            callback: handleBackToActivities,
            tooltip: "Back to Activity Center",
        },
    ];

    const rightButtonBarSpec = [
        {
            icon: <SaveRoundedIcon />,
            callback: handleSavePage,
            tooltip: "Save Page",
        },
        {
            icon: <DeleteRoundedIcon />,
            callback: handleDeleteSelection,
            tooltip: "Delete Selection",
        },
    ];

    useEffect(() => {
        initAppForNow(
            appManager,
            searchParams.get("userName"),
            searchParams.get("activityName"),
            searchParams.get("startPage")
        );

        function handleResize() {
            console.log(
                "(Edit) resized to: ",
                window.innerWidth,
                "x",
                window.innerHeight
            );

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

    function canvasWidth(winWidth) {
        return winWidth - (drawerWidth + propsWidth);
    }

    function canvasHeight(winHeight) {
        return winHeight - aboveCanvasHeight;
    }

    function initAppForNow(appMgr, userName, activityName, startPage) {
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
                scrMgr.setAfterAddCallback(handleAfterAdd);
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

    function handleUserModeChange(mode) {
        setAppMode(mode);
        appManager.getScreenManager().setAddObjectMode(mode.submode);
    }

    function handleAfterAdd(newObj) {
        setAppMode(EditMode.Select);
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

    async function handleEditActivityBehavior() {
        var uam = appManager.getUserActivityManager();
        var activity = await uam.getCurrentActivity();
        if (activity) {
            setActivityBehavior(activity.behavior || blankBehavior);
            setIsScriptEditorOpen(true);
        }
    }

    async function handleCloseScriptEditor(newBehavior) {
        setIsScriptEditorOpen(false);
        if (newBehavior) {
            var uam = appManager.getUserActivityManager();
            await uam.updateCurrentActivityBehavior(newBehavior);
            appManager.getScreenManager().rerunPageBehavior();
        }
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

    function handleSavePage() {
        if (isModified) {
            var page = appManager.getScreenManager().getCurrentPage();
            if (page) {
                var content = page.toJSON();
                // testCompression(content);
                var spec = appManager
                    .getUserActivityManager()
                    .getUserPage(page.getName());
                spec.content = content;
                appManager.getUserActivityManager().modifyUserPage(spec);
                markChanged(false);
                //appManager.getScreenManager().screenToFile("zqe.png");
            }
        }
    }

    function handleDeleteSelection() {
        appManager.getScreenManager().deleteSelectedObjects();
        markChanged(true);
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
                    open={isAddPageOpen}
                    question="Add New Page?"
                    contentText="Enter the name of your new page."
                    textLabel="Page Name"
                    yesLabel="Add"
                    yesCallback={handleDoAddPage}
                    noLabel="Cancel"
                    noCallback={handleCancelDoAddPage}
                />
                {isScriptEditorOpen && (
                    <ScriptEditor
                        behavior={activityBehavior}
                        onClose={handleCloseScriptEditor}
                        open={isScriptEditorOpen}
                        appManager={appManager}
                    />
                )}
            </Box>
        </div>
    );
};

export default Editor;
