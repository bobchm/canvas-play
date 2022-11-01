export class BehaviorManager {
    static bhvrClasses = {};

    static initialize() {}

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
}

export class BhvrOperator {}
