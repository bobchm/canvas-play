import TTSService from "./tts-service";
import { mapRange } from "./app-utils";

const serviceName = "Web Speech API";
const lowPitch = 0;
const hiPitch = 2;
const lowRate = 0.1;
const hiRate = 4;
const lowVolume = 0;
const hiVolume = 1;

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
                if (this.#voiceFallenBackFrom) {
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
        if (!this.#voices) return null;
        var rvoices = this.#voices.map((voice) => {
            return { service: serviceName, name: voice.name, lang: voice.lang };
        });
        return rvoices;
    }

    fullVoiceFromName(name) {
        if (!this.#voices) return null;
        return this.#voices.find((tvoice) => tvoice.name === name);
    }

    getVoice() {
        if (!this.#speech) return null;
        return this.#speech.voice;
    }

    setVoice(name) {
        if (!this.#voices || this.#voices.length === 0 || !this.#speech) {
            this.#voiceFallenBackFrom = name;
            if (this.#speech) {
                this.#speech.voice = null;
            }
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
        if (!this.#speech) return 0;
        return Math.round(
            mapRange(this.#speech.volume, lowVolume, hiVolume, 0, 100)
        );
    }

    setVolume(ivol) {
        if (this.#speech) {
            var vol = mapRange(ivol, 0, 100, lowVolume, hiVolume);
            if (vol < lowVolume || vol > hiVolume) {
                throw new Error("Invalid volume for ttsSetVolume");
            }
            this.#speech.volume = vol;
        }
    }

    getRate() {
        if (!this.#speech) return 0;
        return Math.round(mapRange(this.#speech.rate, lowRate, hiRate, 0, 100));
    }

    setRate(irate) {
        if (this.#speech) {
            var rate = mapRange(irate, 0, 100, lowRate, hiRate);
            if (rate < lowRate || rate > hiRate) {
                throw new Error("Invalid rate for ttsSetRate");
            }
            this.#speech.rate = rate;
        }
    }

    getPitch() {
        if (!this.#speech) return 0;
        return Math.round(
            mapRange(this.#speech.pitch, lowPitch, hiPitch, 0, 100)
        );
    }

    setPitch(ipitch) {
        if (this.#speech) {
            var pitch = mapRange(ipitch, 0, 100, lowPitch, hiPitch);
            if (pitch < lowPitch || pitch > hiPitch) {
                throw new Error("Invalid pitch for ttsSetPitch");
            }
            this.#speech.pitch = pitch;
        }
    }

    speak(text) {
        if (this.#speech) {
            window.speechSynthesis.cancel();
            this.#speech.text = text;
            window.speechSynthesis.speak(this.#speech);
        }
    }

    pauseSpeech() {
        window.speechSynthesis.pause();
    }

    resumeSpeech() {
        window.speechSynthesis.resume();
    }
}

export default WebSpeechTTSService;
