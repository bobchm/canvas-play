import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";

import SpeechSettings from "./speechsettings.component";
import AccessSettings from "./accesssettings.component";

export default function SettingsModal({ open, appManager, closeCallback }) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

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
            <Paper sx={{ width: "60%", height: "60%" }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    orientation="horizontal"
                >
                    <Tab key={0} label="Speech" />
                    <Tab key={1} label="Access" />
                </Tabs>
                {tabIndex === 0 && <SpeechSettings appManager={appManager} />}
                {tabIndex === 1 && <AccessSettings appManager={appManager} />}
            </Paper>
        </Modal>
    );
}
