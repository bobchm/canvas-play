import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { ttsGetVolume } from "../../utils/textToSpeech";

export default function SpeechSettings({ uaManager }) {
    const [volume, setVolume] = useState(ttsGetVolume());

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    return (
        <Box sx={{ width: 200 }}>
            <Stack
                spacing={2}
                direction="column"
                sx={{ mb: 1 }}
                alignItems="center"
            >
                <Slider
                    aria-label="Volume"
                    value={volume}
                    valueLabelDisplay="on"
                    onChange={handleVolumeChange}
                />
                <Typography gutterBottom>pretto.fr</Typography>
            </Stack>
        </Box>
    );
}
