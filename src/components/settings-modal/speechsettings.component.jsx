import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
    ttsGetVolume,
    ttsGetRate,
    ttsGetPitch,
    ttsGetVoice,
    ttsGetVoices,
} from "../../utils/textToSpeech";

const getLanguages = (voices) => {
    var langList = [];
    voices.forEach((voice) => {
        if (!langList.includes(voice.lang)) {
            langList.push(voice.lang);
        }
    });
    langList.sort();
    return langList;
};

const getCurrentLanguage = (voices, curVoice) => {
    var matchVoice = voices.find((thisVoice) => thisVoice.name === curVoice);
    if (!matchVoice) return "None";
    return matchVoice.lang;
};

const voicesFromLang = (voices, newLang) => {
    var voiceList = [];
    voices.forEach((voice) => {
        if (voice.lang === newLang) {
            voiceList.push(voice.name);
        }
    });
    return voiceList;
};

export default function SpeechSettings({ uaManager }) {
    const [volume, setVolume] = useState(ttsGetVolume());
    const [rate, setRate] = useState(ttsGetRate());
    const [pitch, setPitch] = useState(ttsGetPitch());
    const [voices] = useState(ttsGetVoices());
    const [langs] = useState(getLanguages(voices));
    const [voice, setVoice] = useState(ttsGetVoice().name);
    const [lang, setLang] = useState(getCurrentLanguage(voices, voice));
    const [langVoices, setLangVoices] = useState(voicesFromLang(voices, lang));

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    const handleRateChange = (event, newValue) => {
        setRate(newValue);
    };

    const handlePitchChange = (event, newValue) => {
        setPitch(newValue);
    };

    const handleLangChange = (newValue) => {
        setLang(newValue);
        var newVoices = voicesFromLang(voices, newValue);
        if (!newVoices || newVoices.length === 0) {
            throw new Error("No voices for language -- shouldn't happen");
        }
        setLangVoices(newVoices);
        setVoice(newVoices[0]);
    };

    const handleVoiceChange = (newValue) => {
        setVoice(newValue);
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "azure",
                border: 1,
                boderColor: "black",
            }}
        >
            <Grid container justifyContent="Center">
                <Stack spacing={2} direction="row" sx={{ mb: 1 }}></Stack>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Select
                        aria-label="font-family"
                        id="lang"
                        value={lang}
                        label="Language"
                        sx={{
                            width: "200px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleLangChange(e.target.value)
                        }
                    >
                        {langs.map((thisLang, idx) => (
                            <MenuItem key={idx} value={thisLang}>
                                {thisLang}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography gutterBottom>Language</Typography>
                </Stack>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Select
                        aria-label="font-family"
                        id="voice"
                        value={voice}
                        label="Voice"
                        sx={{
                            width: "400px",
                            fontSize: 13,
                            height: 40,
                            mt: 1,
                            mb: 1,
                        }}
                        onChange={(e, child) =>
                            handleVoiceChange(e.target.value)
                        }
                    >
                        {langVoices.map((thisVoice, idx) => (
                            <MenuItem key={idx} value={thisVoice}>
                                {thisVoice}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography gutterBottom>Voice</Typography>
                </Stack>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }}>
                    <Stack
                        spacing={2}
                        direction="column"
                        sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <Slider
                            aria-label="Volume"
                            min={0}
                            max={100}
                            value={volume}
                            valueLabelDisplay="on"
                            onChange={handleVolumeChange}
                            sx={{ width: "200px" }}
                        />
                        <Typography gutterBottom>Volume</Typography>
                    </Stack>
                    <Stack
                        spacing={2}
                        direction="column"
                        sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <Slider
                            aria-label="Rate"
                            min={0}
                            max={100}
                            value={rate}
                            valueLabelDisplay="on"
                            onChange={handleRateChange}
                            sx={{ width: "200px" }}
                        />
                        <Typography gutterBottom>Rate</Typography>
                    </Stack>
                    <Stack
                        spacing={2}
                        direction="column"
                        sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <Slider
                            aria-label="Pitch"
                            min={0}
                            max={100}
                            value={pitch}
                            valueLabelDisplay="on"
                            onChange={handlePitchChange}
                            sx={{ width: "200px" }}
                        />
                        <Typography gutterBottom>Pitch</Typography>
                    </Stack>
                </Stack>
            </Grid>
        </Paper>
    );
}
