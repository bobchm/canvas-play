// global speech synthesis instance
var ttsManager = null;
var ttsVoices = [];

function ttsInit() {
    if (!ttsManager) {
        ttsManager = new SpeechSynthesisUtterance();

        window.speechSynthesis.onvoiceschanged = () => {
            ttsVoices = window.speechSynthesis.getVoices();
            ttsManager.voice = ttsVoices[0];
            ttsSetVolume(1);
            ttsSetRate(1);
            ttsSetPitch(1);
            ttsGetVoices();
            ttsSetVoice("Samantha");
            ttsSpeak("Here I am testing whether speech works or not.");
        };
    }
}

function ttsGetLanguage() {
    return ttsManager.lang;
}

function ttsSetLanguage(langTag) {
    ttsManager.lang = langTag;
}

function ttsGetVoices() {
    var rvoices = ttsVoices.map((voice) => {
        return { name: voice.name, lang: voice.lang };
    });
    return rvoices;
}

function ttsGetVoice() {
    return ttsManager.voice;
}

function ttsSetVoice(name) {
    var ttsVoice = ttsVoices.find((voice) => voice.name === name);
    if (!ttsVoice) {
        throw new Error("Invalid volume for ttsSetVolume");
    }
    ttsManager.voice = ttsVoice;
}

function ttsGetVolume() {
    return ttsManager.volume;
}

function ttsSetVolume(vol) {
    if (vol < 0 || vol > 1) {
        throw new Error("Invalid volume for ttsSetVolume");
    }
    ttsManager.volume = vol;
}

function ttsGetRate() {
    return ttsManager.rate;
}

function ttsSetRate(rate) {
    if (rate < 0.1 || rate > 10) {
        throw new Error("Invalid rate for ttsSetRate");
    }
    ttsManager.rate = rate;
}

function ttsGetPitch() {
    return ttsManager.pitch;
}

function ttsSetPitch(pitch) {
    if (pitch < 0 || pitch > 2) {
        throw new Error("Invalid pitch for ttsSetPitch");
    }
    ttsManager.pitch = pitch;
}

function ttsSpeak(text) {
    var speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.voice = ttsVoices[0];
    ttsManager.text = text;
    window.speechSynthesis.speak(speech);
}

function ttsPauseSpeech() {
    window.speechSynthesis.pause();
}

function ttsResumeSpeech() {
    window.speechSynthesis.resume();
}

export {
    ttsInit,
    ttsGetLanguage,
    ttsSetLanguage,
    ttsGetVoices,
    ttsGetVoice,
    ttsSetVoice,
    ttsGetVolume,
    ttsSetVolume,
    ttsGetRate,
    ttsSetRate,
    ttsGetPitch,
    ttsSetPitch,
    ttsSpeak,
    ttsPauseSpeech,
    ttsResumeSpeech,
};
