import { initSpeechBehaviors } from "./bhvr-speech";
import { initNavigationBehaviors } from "./bhvr-navigation";

export class BehaviorManager {
    static bhvrClasses = {};
    static bhvrNames = [];

    static initialize() {
        this.bhvrClasses = [];
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

    static allBehaviorNames() {
        if (this.bhvrNames.length === 0) {
            var classKeys = Object.keys(this.bhvrClasses);
            classKeys.forEach((key) => {
                var cls = this.bhvrClasses[key];
                this.bhvrNames.push(cls.name);
            });
        }
        return this.bhvrNames;
    }

    static behaviorFromName(name) {
        var classKeys = Object.keys(this.bhvrClasses);
        for (let i = 0; i < classKeys.length; i++) {
            var cls = this.bhvrClasses[classKeys[i]];
            if (cls.name === name) {
                return cls;
            }
        }
        return null;
    }

    static toJSON(inBhvrs) {
        var outBhvrs = [];
        for (let i = 0; i < inBhvrs.length; i++) {
            outBhvrs.push(inBhvrs[i].toJSON());
        }
        return outBhvrs;
    }

    static instantiateBehaviors(owner, bhvrSpecs) {
        var outBhvrs = [];
        for (let i = 0; i < bhvrSpecs.length; i++) {
            var spec = bhvrSpecs[i];
            var cls = this.bhvrClasses[spec.id];
            if (cls) {
                var instance = new cls(owner, spec);
                instance.cls = cls;
                if (instance) {
                    outBhvrs.push(instance);
                }
            }
        }
        return outBhvrs;
    }
}

export class BhvrOperator {}
