import TTSService from "./tts-service";
import { mapRange } from "./app-utils";

const serviceName = "Web Speech API";

class WebSpeechTTSService extends TTSService {
    #voices;
    #speech = null;
    #voiceFallenBackFrom = null;

    init(service, voice, volume, rate, pitch) {
        if (!this.#speech) {
            this.#speech = new SpeechSynthesisUtterance();
            this.#voices = window.speechSynthesis.getVoices();
            if (this.#voices && service === serviceName) {
                this.setVoice(voice);
            }
            this.setVolume(volume);
            this.setRate(rate);
            this.setPitch(pitch);
            window.speechSynthesis.onvoiceschanged = () => {
                this.#voices = window.speechSynthesis.getVoices();

                // did our preferred voice just arrive?
                if (
                    this.#voiceFallenBackFrom &&
                    this.fullVoiceFromName(this.#voiceFallenBackFrom)
                ) {
                    this.setVoice(this.#voiceFallenBackFrom);
                }
            };
        }
    }

    makeActive(voice, volume, rate, pitch) {
        this.setVoice(voice);
        this.setVolume(volume);
        this.setRate(rate);
        this.setPitch(pitch);
    }

    getServiceName() {
        return serviceName;
    }

    getVoices() {
        var rvoices = this.#voices.map((voice) => {
            return { service: serviceName, name: voice.name, lang: voice.lang };
        });
        return rvoices;
    }

    fullVoiceFromName(name) {
        return this.#voices.find((tvoice) => tvoice.name === name);
    }

    getVoice() {
        return this.#speech.voice;
    }

    setVoice(name) {
        if (!this.#voices || this.#voices.length === 0) {
            this.#voiceFallenBackFrom = name;
            this.#speech.voice = null;
            return;
        }
        var voice = this.fullVoiceFromName(name);
        if (!voice) {
            this.#voiceFallenBackFrom = name;
            voice = this.#voices.find((tvoice) => tvoice.lang === "en-US");
            if (!voice) throw new Error("Invalid voice for ttsSetVoice");
        } else {
            this.#voiceFallenBackFrom = null;
        }
        this.#speech.voice = voice;
    }

    getVolume() {
        return Math.round(mapRange(this.#speech.volume, 0, 1, 0, 100));
    }

    setVolume(ivol) {
        var vol = mapRange(ivol, 0, 100, 0, 1);
        if (vol < 0 || vol > 1) {
            throw new Error("Invalid volume for ttsSetVolume");
        }
        this.#speech.volume = vol;
    }

    getRate() {
        return Math.round(mapRange(this.#speech.rate, 0.1, 10, 0, 100));
    }

    setRate(irate) {
        var rate = mapRange(irate, 0, 100, 0.1, 10);
        if (rate < 0.1 || rate > 10) {
            throw new Error("Invalid rate for ttsSetRate");
        }
        this.#speech.rate = rate;
    }

    getPitch() {
        return Math.round(mapRange(this.#speech.pitch, 0, 2, 0, 100));
    }

    setPitch(ipitch) {
        var pitch = mapRange(ipitch, 0, 100, 0, 2);
        if (pitch < 0 || pitch > 2) {
            throw new Error("Invalid pitch for ttsSetPitch");
        }
        this.#speech.pitch = pitch;
    }

    speak(text) {
        window.speechSynthesis.cancel();
        this.#speech.text = text;
        window.speechSynthesis.speak(this.#speech);
    }

    pauseSpeech() {
        window.speechSynthesis.pause();
    }

    resumeSpeech() {
        window.speechSynthesis.resume();
    }
}

export default WebSpeechTTSService;
