import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";

import SpeechSettings from "./speechsettings.component";
import AccessSettings from "./accesssettings.component";

export default function SettingsModal({ open, uaManager, closeCallback }) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    console.log("in settings modal");

    return (
        <Modal
            open={open}
            onClose={() => {
                closeCallback();
            }}
            style={{
                left: "10%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper sx={{ width: "80%", height: "80%" }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    orientation="horizontal"
                >
                    <Tab key={0} label="Speech" />
                    <Tab key={1} label="Access" />
                </Tabs>
                {tabIndex === 0 && <SpeechSettings uaManager={uaManager} />}
                {tabIndex === 1 && <AccessSettings uaManager={uaManager} />}
            </Paper>
        </Modal>
    );
}
