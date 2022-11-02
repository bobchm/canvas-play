import { initSpeechBehaviors } from "./bhvr-speech";
import { initNavigationBehaviors } from "./bhvr-navigation";

export class BehaviorManager {
    static bhvrClasses = {};

    static initialize() {
        initSpeechBehaviors();
        initNavigationBehaviors();
    }

    static addBehavior(cls) {
        var key = cls.id;
        if (!cls.id) {
            throw new Error("Missing behavior class key");
        }
        if (this.bhvrClasses.hasOwnProperty(key)) {
            throw new Error("Duplicate behavior class: " + key);
        }
        this.bhvrClasses[key] = cls;
    }

    static behaviorsForCategory(category) {
        var catClasses = [];
        var classKeys = Object.keys(this.bhvrClasses);
        classKeys.forEach((key) => {
            var cls = this.bhvrClasses[key];
            if (cls.category === category) {
                catClasses.push(cls);
            }
        });
        return catClasses;
    }

    static toJSON(inBhvrs) {
        var outBhvrs = [];
        for (let i = 0; i < inBhvrs.length; i++) {
            outBhvrs.push(inBhvrs[i].toJSON());
        }
        return outBhvrs;
    }

    static instantiate(owner, bhvrSpecs) {
        var outBhvrs = [];
        for (let i = 0; i < bhvrSpecs.length; i++) {
            var spec = bhvrSpecs[i];
            var cls = this.bhvrClasses[spec.id];
            if (cls) {
                var instance = new cls(owner, spec);
                if (instance) {
                    outBhvrs.push(instance);
                }
            }
        }
        return outBhvrs;
    }
}

export class BhvrOperator {}
