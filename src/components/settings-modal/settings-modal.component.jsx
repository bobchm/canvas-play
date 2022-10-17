import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";

import SpeechSettings from "./speechsettings.component";
import AccessSettings from "./accesssettings.component";

export default function SettingsModal({ open, uaManager, closeCallback }) {
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
            <Tabs
                //value={useValue}
                // onChange={(e, newValue) => {
                //     modeCallback(options[newValue].mode);
                // }}
                orientation="horizontal"
            >
                <Tab key={0} label="Speech">
                    <SpeechSettings uaManager={uaManager} />
                </Tab>
                <Tab key={0} label="Speech">
                    <AccessSettings uaManager={uaManager} />
                </Tab>
            </Tabs>
        </Modal>
    );
}
