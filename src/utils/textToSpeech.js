// global speech synthesis instance
var ttsManager = null;
var ttsVoices = [];

const languageTags = [
    "af",
    "am",
    "ar",
    "arn",
    "as",
    "az",
    "ba",
    "be",
    "bg",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "co",
    "cs",
    "cy",
    "da",
    "de",
    "dsb",
    "dv",
    "el",
    "en",
    "es",
    "et",
    "eu",
    "fa",
    "fi",
    "fil",
    "fo",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gsw",
    "gu",
    "ha",
    "he",
    "hi",
    "hr",
    "hsb",
    "hu",
    "hy",
    "id",
    "ig",
    "ii",
    "is",
    "it",
    "iu",
    "ja",
    "ka",
    "kk",
    "kl",
    "km",
    "kn",
    "ko",
    "kok",
    "ky",
    "lb",
    "lo",
    "lt",
    "lv",
    "mi",
    "mk",
    "ml",
    "mn",
    "moh",
    "mr",
    "ms",
    "mt",
    "my",
    "nb",
    "ne",
    "nl",
    "nn",
    "no",
    "nso",
    "oc",
    "or",
    "pa",
    "pl",
    "prs",
    "ps",
    "pt",
    "quc",
    "quz",
    "rm",
    "ro",
    "ru",
    "rw",
    "sa",
    "sah",
    "se",
    "si",
    "sk",
    "sl",
    "sma",
    "smj",
    "smn",
    "sms",
    "sq",
    "sr",
    "sv",
    "sw",
    "syr",
    "ta",
    "te",
    "tg",
    "th",
    "tk",
    "tn",
    "tr",
    "tt",
    "tzm",
    "ug",
    "uk",
    "ur",
    "uz",
    "vi",
    "wo",
    "xh",
    "yo",
    "zh",
    "zu",
];

function ttsInit() {
    if (!ttsManager) {
        ttsManager = new SpeechSynthesisUtterance();

        window.speechSynthesis.onvoiceschanged = () => {
            ttsVoices = window.speechSynthesis.getVoices();
            ttsManager.voice = ttsVoices[0];
        };
    }
}

function ttsGetLanguageTags() {
    return languageTags;
}

function ttsGetLanguage() {
    return ttsManager.lang;
}

function ttsSetLanguage(langTag) {
    if (!languageTags.includes(langTag)) {
        throw new Error("Invalid language tag for ttsSetLanguage");
    }
    ttsManager.lang = langTag;
}

function ttsGetVoices() {
    return ttsVoices;
}

function ttsGetVoice() {
    return ttsManager.voice;
}

function ttsSetVoice(voice) {
    ttsManager.voice = voice;
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
    ttsManager.text = text;
    window.speechSynthesis.speak(ttsManager);
}

function ttsPauseSpeech() {
    window.speechSynthesis.pause();
}

function ttsResumeSpeech() {
    window.speechSynthesis.resume();
}

export {
    ttsInit,
    ttsGetLanguageTags,
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
