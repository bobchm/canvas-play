import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import FileSaver from "file-saver";
import TextInputModal from "../../components/text-input-modal/text-input-modal.component";
import confirmationBox from "../../utils/confirm-box";
import { defaultActivitySpec, defaultPageSpec } from "../../utils/app-utils";
import ApplicationManager from "../../app/managers/application-manager";

import ActivityCard from "../../components/activity-card/activity-card.component";
import CanvasAppBar from "../../components/canvas-appbar/canvas-appbar.component";
import SettingsModal from "../../components/settings-modal/settings-modal.component";
import SimplePopMenu from "../../components/simple-pop-menu/simple-pop-menu.component";
import ScriptEditor from "../../components/script-editor/script-editor.component";
import FileNamer from "../../components/file-namer/file-namer.component";
import FilePicker from "../../components/file-picker/file-picker.component";
import PrintDialog from "../../components/print-dialog/print-dialog.component";
import "./dashboard.styles.scss";
import {
    BehaviorManager,
    blankBehavior,
} from "../../app/behaviors/behavior-behaviors";
import { getActivity, getPage, updateActivity } from "../../utils/dbaccess";
import { ExecutionMode } from "../../app/scripting/canvas-exec";
import ScreenManager from "../../app/managers/screen-manager";
import { openPDF, addPDFpage, writeSVGtoPDF, savePDF } from "../../utils/pdf";

const initUserName = "bobchm@gmail.com";
const heightOffset = 64;
const appName = "Canvas Play";
const defaultVSize = { width: 2000, height: 1500 };
const activityExtension = ".act.json";

const Dashboard = () => {
    const [userName] = useState(initUserName);
    const [applicationManager] = useState(() => new ApplicationManager());
    const [activities, setActivities] = useState([]);
    const [isActivityCreateOpen, setIsActivityCreateOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight - heightOffset);
    const [otherActivityAnchor, setOtherActivityAnchor] = useState(null);
    const [otherActionActivity, setOtherActionActivity] = useState(null);
    const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);
    const [activityBehavior, setActivityBehavior] = useState(blankBehavior);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printJSON, setPrintJSON] = useState({});
    const [printPageList, setPrintPageList] = useState([]);

    const navigate = useNavigate();

    const appBarMenuItems = [
        { label: "Add Activity", callback: handleAddActivity },
        { label: "Import Activity", callback: handleImportActivity },
    ];

    const accountMenuItems = [
        { label: "Settings", callback: handleOpenSettings },
    ];

    const otherActionMenuItems = [
        { label: "Edit Behavior", callback: handleEditBehavior },
        { label: "Export Activity", callback: handleExport },
        { label: "Print Activity", callback: handlePrint },
    ];

    const activityActions = [
        { label: "Play", action: playActivity },
        { label: "Edit", action: editActivity },
        { label: "Delete", action: deleteAnActivity },
        { label: "...", action: otherActivityActions },
    ];

    useEffect(() => {
        BehaviorManager.setExecutionMode(ExecutionMode.Edit);
        setupForUser(userName);

        function handleResize() {
            // console.log(
            //     "(Dashboard) resized to: ",
            //     window.innerWidth,
            //     "x",
            //     window.innerHeight
            // );

            setWidth(window.innerWidth);
            setHeight(window.innerHeight - heightOffset);
        }

        window.addEventListener("resize", handleResize);

        return (_) => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function setupForUser(name) {
        await applicationManager.setUser(name);
        initializeCurrentUser();
    }

    function addToActivities(activity) {
        setActivities((current) => [...current, activity]);
    }

    function activityExists(actName) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].name === actName) return true;
        }
        return false;
    }

    async function initializeCurrentUser() {
        var uaManager = applicationManager.getUserActivityManager();

        const user = await uaManager.getCurrentUserInfo();
        if (!user) {
            throw new Error(`Unknown user: ${userName}`);
        }
        setActivities([]);
        for (let i = 0; i < user.activities.length; i++) {
            const activity = await uaManager.getActivityFromId(
                user.activities[i]
            );
            addToActivities({
                name: activity.name,
                _id: activity._id,
                vSize: activity.vSize,
                image: activity.image,
                description: activity.description,
            });
        }
    }

    function playActivity(activity, e) {
        navigate(
            `/play?userName=${userName}&activityName=${activity}&caller=dashboard`
        );
    }

    function editActivity(activity, e) {
        navigate(`/edit?userName=${userName}&activityName=${activity}`);
    }

    function activityIdFromName(name) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].name === name) return activities[i]._id;
        }
        return null;
    }

    async function deleteAnActivity(activity, e) {
        if (await confirmationBox()) {
            var uaManager = applicationManager.getUserActivityManager();
            var user = await uaManager.getCurrentUserInfo();
            if (!user) {
                throw new Error(`Unknown user: ${userName}`);
            }
            var actId = activityIdFromName(activity);
            if (actId) {
                await uaManager.deleteUserActivity(actId);
                initializeCurrentUser();
            }
        }
    }

    function otherActivityActions(activity, e) {
        setOtherActivityAnchor(e.currentTarget);
        setOtherActionActivity(activity);
    }

    function closeActivityActions() {
        setOtherActivityAnchor(null);
    }

    function handleOpenSettings() {
        applicationManager.getUserActivityManager().openSettingsChange();
        setIsSettingsOpen(true);
    }

    async function handleEditBehavior() {
        var id = activityIdFromName(otherActionActivity);
        if (!id) return;
        var activity = await getActivity(id);
        if (activity) {
            setActivityBehavior(activity.behavior || blankBehavior);
            setIsScriptEditorOpen(true);
        }
    }

    async function handleCloseScriptEditor(newBehavior) {
        setIsScriptEditorOpen(false);
        if (newBehavior) {
            var id = activityIdFromName(otherActionActivity);
            if (!id) return;
            var activity = await getActivity(id);
            activity.behavior = newBehavior;
            updateActivity(activity);
        }
    }

    function settingsCloseCallback() {
        setIsSettingsOpen(false);
        applicationManager.getUserActivityManager().closeSettingsChange();
    }

    function handleAddActivity() {
        setIsActivityCreateOpen(true);
    }

    async function handleCreateActivity(name) {
        setIsActivityCreateOpen(false);
        if (!name || name.length === 0) return;
        var uaManager = applicationManager.getUserActivityManager();

        var actId = await uaManager.addUserActivity(
            defaultActivitySpec(name, defaultVSize)
        );
        if (!actId) return;

        // add a placeholder home page
        var pgId = await uaManager.addUserPageToActivity(
            actId,
            defaultPageSpec("Home")
        );
        if (!pgId) return;
        var activity = await uaManager.getActivityFromId(actId);
        activity.home = pgId;
        await uaManager.updateActivity(activity);
        initializeCurrentUser();
    }

    function handleCancelCreateActivity(name) {
        setIsActivityCreateOpen(false);
    }

    function handleExport() {
        setIsExportOpen(true);
    }

    async function getActivityJSON(activityId) {
        var activity = await getActivity(activityId);
        if (!activity) return null;

        delete activity._id;

        var pages = [];
        var homePage = null;
        for (let i = 0; i < activity.pages.length; i++) {
            var pageId = activity.pages[i];
            var page = await getPage(pageId);
            if (pageId === activity.home) {
                homePage = page.name;
            }
            delete page._id;
            pages.push(page);
        }
        activity.pages = [];
        activity.home = null;
        return { activity: activity, homePage: homePage, pages: pages };
    }

    async function handleExportConfirm(fileName) {
        setIsExportOpen(false);

        // get the activity
        var id = activityIdFromName(otherActionActivity);
        if (!id) return;
        var json = await getActivityJSON(id);
        if (json) {
            fileName += ".act.json";
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

    function getPrintScreenManager() {
        var scrMgr = new ScreenManager(null);
        scrMgr.createPrintCanvas({
            id: "printo",
            left: 8,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "aliceblue",
        });
        return scrMgr;
    }

    async function printActivity(filename, pageList, orientation, format) {
        var scrMgr = getPrintScreenManager();
        scrMgr.setupForActivity(printJSON.activity);
        var pdfObj = openPDF(orientation, format);
        var printAny = false;
        for (let i = 0; i < printJSON.pages.length; i++) {
            if (!pageList || pageList.includes(printJSON.pages[i])) {
                if (printAny) {
                    addPDFpage(pdfObj, orientation, format);
                }

                scrMgr.openPage(printJSON.pages[i].content);
                await scrMgr.finishCachingImages();
                var svg = scrMgr.getCurrentSVG();
                await writeSVGtoPDF(pdfObj, svg);
                printAny = true;
            }
        }
        savePDF(pdfObj, filename);
    }

    async function cacheActivityInfo() {
        var id = activityIdFromName(otherActionActivity);
        if (!id) {
            return;
        }
        var json = await getActivityJSON(id);
        if (!json || !json.pages || json.pages.length === 0) {
            return;
        }
        setPrintJSON(json);
        var pages = [];
        for (let i = 0; i < json.pages.length; i++) {
            pages.push(json.pages[i].name);
        }
        setPrintPageList(pages);
        return pages;
    }

    async function handlePrint() {
        var pageList = await cacheActivityInfo();
        if (!pageList || pageList.length === 0) {
            alert("This activity has no pages to print");
        } else {
            setIsPrintOpen(true);
        }
    }

    async function handlePrintConfirm(options) {
        setIsPrintOpen(false);
        printActivity(options.filename, options.orientation, options.format);
        setPrintJSON({});
        setPrintPageList([]);
    }

    function handlePrintCancel() {
        setIsPrintOpen(false);
        setPrintJSON({});
        setPrintPageList([]);
    }

    function handleImportActivity() {
        setIsImportOpen(true);
    }

    function handleCompleteImport(fileName) {
        setIsImportOpen(false);
        const fileReader = new FileReader();
        fileReader.readAsText(fileName, "UTF-8");
        fileReader.onload = (e) => {
            var activityJSON = JSON.parse(e.target.result);
            importActivity(activityJSON);
        };
    }

    async function importActivity(spec) {
        var actSpec = spec.activity;
        ensureUniqueActName(actSpec);

        var uam = applicationManager.getUserActivityManager();
        var actId = await uam.addUserActivity(actSpec);
        if (!actId) return;

        // add the pages
        var homePgId = null;
        for (let i = 0; i < spec.pages.length; i++) {
            var page = spec.pages[i];
            var isHome = false;
            if (page.name === spec.homePage) isHome = true;
            var pgId = await uam.addUserPageToActivity(actId, page);
            if (!pgId) return;
            if (isHome) homePgId = pgId;
        }
        var activity = await uam.getActivityFromId(actId);
        activity.home = homePgId;
        await uam.updateActivity(activity);
        initializeCurrentUser();
    }

    function handleCancelImport() {
        setIsImportOpen(false);
    }

    function ensureUniqueActName(spec) {
        if (!activityExists(spec.name)) return;

        var ctr = 0;
        while (ctr < 100) {
            var name = `${spec.name}${ctr}`;
            if (!activityExists(name)) {
                spec.name = name;
                return;
            }
            ctr += 1;
        }
        throw new Error("Failure to create activity");
    }

    async function handleActivityChange(
        name,
        newName,
        newDescription,
        newImage
    ) {
        var uam = applicationManager.getUserActivityManager();
        var activity = await uam.getActivity(name);
        if (
            !activity ||
            (newName === activity.name &&
                newDescription === activity.description &&
                newImage === activity.image)
        ) {
            return false;
        }

        activity.name = newName;
        activity.description = newDescription;
        activity.image = newImage;

        updateActivity(activity);
        return true;
    }

    return (
        <div>
            <CanvasAppBar
                title={appName}
                menuActions={appBarMenuItems}
                accountActions={accountMenuItems}
            />
            <Container
                className="dashboard-container"
                sx={{ width: width, height: height }}
            >
                <Typography variant="h2" align="center">
                    Activities for {userName}
                </Typography>
                <List className="dashboard-list">
                    {activities.map((activity, idx) => (
                        <ActivityCard
                            key={idx}
                            name={activity.name}
                            image={activity.image}
                            description={activity.description}
                            actions={activityActions}
                            changeCallback={handleActivityChange}
                        />
                    ))}
                </List>
                <TextInputModal
                    open={isActivityCreateOpen}
                    question="Create New Activity?"
                    contentText="Enter the name of your new activity."
                    textLabel="Activity Name"
                    yesLabel="Create"
                    yesCallback={handleCreateActivity}
                    noLabel="Cancel"
                    noCallback={handleCancelCreateActivity}
                />
                <SettingsModal
                    open={isSettingsOpen}
                    closeCallback={settingsCloseCallback}
                    appManager={applicationManager}
                />
                <SimplePopMenu
                    menuActions={otherActionMenuItems}
                    menuAnchor={otherActivityAnchor}
                    closeCallback={closeActivityActions}
                />
                {isImportOpen && (
                    <FilePicker
                        open={isImportOpen}
                        question="Import Activity?"
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
                        question="Export Activity?"
                        extension={activityExtension}
                        confirmLabel="Confirm"
                        confirmCallback={handleExportConfirm}
                        cancelLabel="Cancel"
                        cancelCallback={handleExportCancel}
                    />
                )}
                {isScriptEditorOpen && (
                    <ScriptEditor
                        behavior={activityBehavior}
                        onClose={handleCloseScriptEditor}
                        open={isScriptEditorOpen}
                        appManager={applicationManager}
                    />
                )}
                {isPrintOpen && (
                    <PrintDialog
                        open={isPrintOpen}
                        question="Print Activity"
                        pageOptions={printPageList}
                        confirmCallback={handlePrintConfirm}
                        cancelCallback={handlePrintCancel}
                    />
                )}
            </Container>
        </div>
    );
};

export default Dashboard;
