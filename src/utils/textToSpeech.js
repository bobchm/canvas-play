import WebSpeechTTSService from "./WebSpeech-tts-service";

var ttsServices = [];
var ttsCurrentService = null;

function ttsIsInitialized() {
    return ttsServices.length > 0;
}

function ttsInit(serviceName, voice, volume, rate, pitch) {
    if (!ttsIsInitialized()) {
        // initialize each supported TTS service
        var service = new WebSpeechTTSService();
        service.init(serviceName, voice, volume, rate, pitch);
        ttsServices.push({ name: service.getServiceName(), service: service });
        if (service.getServiceName() === serviceName) {
            ttsCurrentService = service;
        }
    } else {
        ttsSetVoice(serviceName, voice, volume, rate, pitch);
    }
}

function ttsGetVoices() {
    var voices = [];
    for (let i = 0; i < ttsServices.length; i++) {
        var theseVoices = ttsServices[i].service.getVoices();
        if (theseVoices) {
            voices = [...voices, ...theseVoices];
        }
    }
    return voices;
}

function ttsGetVoice() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    return ttsCurrentService.getVoice();
}

function ttsSetVoice(serviceName, voice, volume, rate, pitch) {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    if (ttsCurrentService.getServiceName() === serviceName) {
        ttsCurrentService.setVoice(voice);
    } else {
        var service = serviceFromName(serviceName);
        if (!service) {
            throw new Error("Unknown service name");
        }
        service.makeActive(voice, volume, rate, pitch);
    }
}

function ttsGetVolume() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    return ttsCurrentService.getVolume();
}

function ttsSetVolume(vol) {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.setVolume(vol);
}

function ttsGetRate() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    return ttsCurrentService.getRate();
}

function ttsSetRate(rate) {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.setRate(rate);
}

function ttsGetPitch() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    return ttsCurrentService.getPitch();
}

function ttsSetPitch(pitch) {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.setPitch(pitch);
}

function ttsSpeak(text) {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.speak(text);
}

function ttsPauseSpeech() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.pauseSpeech();
}

function ttsResumeSpeech() {
    if (!ttsCurrentService) {
        throw new Error("There is no current voice service.");
    }
    ttsCurrentService.resumeSpeech();
}

function serviceFromName(serviceName) {
    return ttsServices.find(
        (service) => service.getServiceName() === serviceName
    );
}

export {
    ttsIsInitialized,
    ttsInit,
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
