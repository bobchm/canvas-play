import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
    AccessType,
    AccessHighlightType,
} from "../../app/constants/access-types";

const accessMethodOptions = [
    { name: "Touch Enter", value: AccessType.TouchEnter },
    { name: "Touch Exit", value: AccessType.TouchExit },
    { name: "Mouse Pause", value: AccessType.MousePause },
];

const highlightOptions = [
    { name: "None", value: AccessHighlightType.None },
    { name: "Shrink", value: AccessHighlightType.Shrink },
    { name: "Overlay", value: AccessHighlightType.Overlay },
    {
        name: "Shrink and Overlay",
        value: AccessHighlightType.ShrinkAndOverlay,
    },
];

export default function AccessSettings({ appManager }) {
    const [accessMethod, setAccessMethod] = useState(
        appManager.getSetting("accessMethod")
    );
    const [touchEnterHighlight, setTouchEnterHighlight] = useState(
        appManager.getSetting("touchEnterHighlightType")
    );
    const [touchEnterHold, setTouchEnterHold] = useState(
        appManager.getSetting("touchEnterHoldTime")
    );
    const [touchExitHighlight, setTouchExitHighlight] = useState(
        appManager.getSetting("touchExitHighlightType")
    );
    const [mousePauseHighlight, setMousePauseHighlight] = useState(
        appManager.getSetting("mousePauseHighlightType")
    );
    const [mousePauseDwell, setMousePauseDwell] = useState(
        appManager.getSetting("mousePauseDwellTime")
    );

    const handleTouchEnterHoldTimeChange = (e, newValue) => {
        setTouchEnterHold(newValue);
        appManager.setSetting("touchEnterHoldTime", newValue);
    };

    const handleMousePauseDwellTimeChange = (e, newValue) => {
        setMousePauseDwell(newValue);
        appManager.setSetting("mousePauseDwellTime", newValue);
    };

    const handleTouchEnterHighlightChange = (newValue) => {
        setTouchEnterHighlight(newValue);
        appManager.setSetting("touchEnterHighlightType", newValue);
    };

    const handleTouchExitHighlightChange = (newValue) => {
        setTouchExitHighlight(newValue);
        appManager.setSetting("touchExitHighlightType", newValue);
    };

    const handleMousePauseHighlightChange = (newValue) => {
        setMousePauseHighlight(newValue);
        appManager.setSetting("mousePauseHighlightType", newValue);
    };

    const handleAccessMethodChange = (newValue) => {
        setAccessMethod(newValue);
        appManager.setSetting("accessMethod", newValue);
        appManager.setAccessMethod(newValue);
    };

    function touchEnterOptions() {
        return (
            <Stack spacing={10} direction="row" sx={{ mt: 20 }}>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Select
                        aria-label="touch-enter-highlight"
                        id="touch-enter-highlight"
                        value={touchEnterHighlight}
                        label="Highlight"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleTouchEnterHighlightChange(e.target.value)
                        }
                    >
                        {highlightOptions.map((opt, idx) => (
                            <MenuItem key={idx} value={opt.value}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography gutterBottom>Highlight</Typography>
                </Stack>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mt: 10, mb: 1 }}
                    alignItems="center"
                >
                    <Slider
                        aria-label="hold-time"
                        min={0}
                        max={5000}
                        value={touchEnterHold}
                        valueLabelDisplay="on"
                        onChange={handleTouchEnterHoldTimeChange}
                        sx={{ width: "200px" }}
                    />
                    <Typography gutterBottom>Hold Time</Typography>
                </Stack>
            </Stack>
        );
    }

    function touchExitOptions() {
        return (
            <Stack spacing={10} direction="row" sx={{ mt: 20 }}>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Select
                        aria-label="touch-exit-highlight"
                        id="touch-exit-highlight"
                        value={touchExitHighlight}
                        label="Highlight"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleTouchExitHighlightChange(e.target.value)
                        }
                    >
                        {highlightOptions.map((opt, idx) => (
                            <MenuItem key={idx} value={opt.value}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography gutterBottom>Highlight</Typography>
                </Stack>
            </Stack>
        );
    }

    function mousePauseOptions() {
        return (
            <Stack spacing={10} direction="row" sx={{ mt: 20 }}>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Select
                        aria-label="mouse-pause-highlight"
                        id="mouse-pause-highlight"
                        value={mousePauseHighlight}
                        label="Highlight"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleMousePauseHighlightChange(e.target.value)
                        }
                    >
                        {highlightOptions.map((opt, idx) => (
                            <MenuItem key={idx} value={opt.value}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography gutterBottom>Highlight</Typography>
                </Stack>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mt: 10, mb: 1 }}
                    alignItems="center"
                >
                    <Slider
                        aria-label="mouse-pause-dwell-time"
                        min={0}
                        max={5000}
                        value={mousePauseDwell}
                        valueLabelDisplay="on"
                        onChange={handleMousePauseDwellTimeChange}
                        sx={{ width: "200px" }}
                    />
                    <Typography gutterBottom>Dwell Time</Typography>
                </Stack>
            </Stack>
        );
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "azure",
                border: 1,
                boderColor: "black",
                height: "100%",
            }}
        >
            <Grid container justifyContent="Center">
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ margin: 1 }}
                    alignItems="center"
                >
                    <Stack spacing={2} direction="row" sx={{ mt: 1, mb: 5 }}>
                        <h1>Access Method Settings</h1>
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{ mt: 10, mb: 20 }}>
                        <Stack
                            spacing={2}
                            direction="column"
                            sx={{ mb: 1 }}
                            alignItems="center"
                        >
                            <Select
                                aria-label="access-method"
                                id="access-method"
                                value={accessMethod}
                                label="Access Method"
                                sx={{
                                    width: "200px",
                                    fontSize: 13,
                                    height: 40,
                                    mt: 1,
                                    mb: 1,
                                }}
                                onChange={(e, child) =>
                                    handleAccessMethodChange(e.target.value)
                                }
                            >
                                {accessMethodOptions.map((opt, idx) => (
                                    <MenuItem key={idx} value={opt.value}>
                                        {opt.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography gutterBottom>Language</Typography>
                        </Stack>
                    </Stack>
                    {accessMethod === AccessType.TouchEnter &&
                        touchEnterOptions()}
                    {accessMethod === AccessType.TouchExit &&
                        touchExitOptions()}
                    {accessMethod === AccessType.MousePause &&
                        mousePauseOptions()}
                </Stack>
            </Grid>
        </Paper>
    );
}
