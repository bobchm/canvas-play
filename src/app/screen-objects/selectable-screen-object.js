import { PropertyType } from "../constants/property-types";
import ScreenObject from "./screen-object";
import { AccessHighlightType } from "../constants/access-types";
import {
    highlightShrink,
    unhighlightShrink,
    highlightOverlay,
    unhighlightOverlay,
} from "../../utils/canvas";
import {
    BehaviorManager,
    isBehaviorBlank,
} from "../behaviors/behavior-behaviors";

class SelectableScreenObject extends ScreenObject {
    #behavior;
    #visibleInPlay;

    constructor(_screenMgr, _parent, _behavior, _spec) {
        super(_screenMgr, _parent, _spec);
        this.#behavior = _behavior;
    }

    toJSON() {
        var superSpec = super.toJSON();
        var spec = {
            behavior: this.#behavior,
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [];

        if (selectedObjects.length === 1) {
            thisProps.push({
                type: PropertyType.SelectionBehavior,
                current: this.#behavior,
            });
        }
        return thisProps.concat(superProps);
    }

    async setEditProperty(screenMgr, type, value) {
        if (type === PropertyType.SelectionBehavior) {
            this.#behavior = value;
        } else {
            super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        if (type === "behavior") {
            return this.#behavior;
        } else {
            return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        if (type === "behavior") {
            this.setEditProperty(
                screenMgr,
                PropertyType.SelectionBehavior,
                value
            );
        } else {
            super.setProperty(screenMgr, type, value);
        }
    }

    highlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                highlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.Overlay:
                highlightOverlay(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                highlightOverlay(appManager.getCanvas(), this.getCanvasObj());
                highlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            default:
        }
    }

    unhighlight(appManager, highlightType) {
        switch (highlightType) {
            case AccessHighlightType.None:
                break;
            case AccessHighlightType.Shrink:
                unhighlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.Overlay:
                unhighlightOverlay(appManager.getCanvas(), this.getCanvasObj());
                break;
            case AccessHighlightType.ShrinkAndOverlay:
                unhighlightOverlay(appManager.getCanvas(), this.getCanvasObj());
                unhighlightShrink(appManager.getCanvas(), this.getCanvasObj());
                break;
            default:
        }
    }

    isSelectable() {
        return !isBehaviorBlank(this.#behavior);
    }

    select() {
        if (!isBehaviorBlank(this.#behavior)) {
            BehaviorManager.executeFromObject(this, this.#behavior);
        }
    }
}

export default SelectableScreenObject;
