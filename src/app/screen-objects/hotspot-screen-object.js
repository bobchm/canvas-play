import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";
import { AccessHighlightType } from "../constants/access-types";
import { BehaviorManager } from "../behaviors/behavior-behaviors";

class HotSpotScreenObject extends ScreenObject {
    #behavior;

    constructor(_screenMgr, _parent, _behavior, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#behavior = _behavior;
        this.setCanvasObj(_screenMgr.addHotSpot(this, _spec.shapeSpec));
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.HotSpot,
            shapeSpec: cobj.toJSON(),
            behavior: this.#behavior,
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [
            {
                type: PropertyType.Opacity,
                current: this.getCanvasObj().opacity * 100,
            },
        ];
        if (selectedObjects.length === 1) {
            thisProps.push({
                type: PropertyType.SelectionBehavior,
                current: this.#behavior,
            });
        }
        return thisProps.concat(superProps);
    }

    async setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.SelectionBehavior:
                this.#behavior = value;
                break;
            case PropertyType.Opacity:
                var newValue = value / 100;
                this.getCanvasObj().set("opacity", newValue);
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        switch (type) {
            case "opacity":
                return this.getCanvasObj().opacity * 100;
            case "behavior":
                return this.#behavior;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "opacity":
                this.setEditProperty(screenMgr, PropertyType.Opacity, value);
                break;
            case "behavior":
                this.setEditProperty(
                    screenMgr,
                    PropertyType.SelectionBehavior,
                    value
                );
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }

    highlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                break;
            case AccessHighlightType.Overlay:
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                break;
            default:
        }
    }

    unhighlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                break;
            case AccessHighlightType.Overlay:
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                break;
            default:
        }
    }

    isSelectable() {
        return true;
    }

    select() {
        if (this.#behavior) {
            BehaviorManager.executeFromObject(this, this.#behavior);
        }
    }
}

export default HotSpotScreenObject;
