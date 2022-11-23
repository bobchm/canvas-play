import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { selectPropertyPanel } from "./property-palette.component";

import "./property-palette.styles.scss";
import { jsonDeepCopy } from "../../utils/app-utils";

const BhvrEditModal = ({ bhvrArgs, appManager, closeCallback }) => {
    const [bArgs, setBArgs] = useState(bhvrArgs);

    function argUpdateCallback({ name }, newValue) {
        var newArgs = jsonDeepCopy(bArgs);
        for (let i = 0; i < newArgs.length; i++) {
            if (newArgs[i].name === name) {
                newArgs[i].value = newValue;
                break;
            }
        }
        setBArgs(newArgs);
    }

    function argToPropPanel(arg) {
        return {
            type: { name: arg.name, valueType: arg.valueType },
            current: arg.value,
        };
    }

    return (
        <Modal
            open={true}
            onClose={() => {
                closeCallback(null);
            }}
            style={{
                alignItems: "center",
                justifyContent: "center",
                left: "35%",
                top: "20%",
                width: "30%",
                height: "fit-content",
            }}
        >
            <Paper sx={{ width: "80%", height: "80%" }}>
                <Stack
                    className="container"
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={2}
                    sx={{ paddingBottom: "5px" }}
                >
                    <Typography variant="button" noWrap={true}>
                        Behavior Arguments
                    </Typography>
                    {bArgs.map((arg, idx) => (
                        <Stack
                            className="container"
                            direction="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            spacing={2}
                            sx={{ paddingBottom: "5px" }}
                            key={idx}
                        >
                            <div className="prop-panel-item">
                                {selectPropertyPanel(
                                    argToPropPanel(arg),
                                    argUpdateCallback,
                                    appManager
                                )}
                            </div>
                            <Typography
                                display="block"
                                variant="body1"
                                mt={0}
                                mb={0}
                                noWrap={true}
                            >
                                {arg.name}
                            </Typography>
                        </Stack>
                    ))}
                    <Stack
                        className="container"
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{ paddingBottom: "5px" }}
                    >
                        <Button
                            variant="outlined"
                            sx={{
                                color: "black",
                                borderColor: "black",
                            }}
                            onClick={() => closeCallback(bArgs)}
                        >
                            OK
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "black",
                                borderColor: "black",
                            }}
                            onClick={() => closeCallback(null)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Modal>
    );
};

export default BhvrEditModal;
