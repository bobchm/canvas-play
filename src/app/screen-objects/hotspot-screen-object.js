import { PropertyType } from "../constants/property-types";
import SelectableScreenObject from "./selectable-screen-object";
import { ScreenObjectType } from "../constants/screen-object-types";
import { BehaviorManager } from "../behaviors/behavior-behaviors";
import { ExecutionMode } from "../scripting/canvas-exec";

class HotSpotScreenObject extends SelectableScreenObject {
    #visibleInPlay;

    constructor(_screenMgr, _parent, _behavior, _visible, _spec) {
        super(_screenMgr, _parent, _behavior, _spec);
        this.#visibleInPlay = _visible;
        this.setCanvasObj(
            _screenMgr.addHotSpot(this, _parent, _spec.shapeSpec)
        );

        // if we're in play mode and we don't have the visible flag set, make invisible
        if (
            BehaviorManager.getExecutionMode() === ExecutionMode.Play &&
            !this.#visibleInPlay
        ) {
            this.getCanvasObj().set("opacity", 0);
        }
    }

    toJSON() {
        var superSpec = super.toJSON();
        var cobj = this.getCanvasObj();
        var spec = {
            type: ScreenObjectType.HotSpot,
            shapeSpec: cobj.toJSON(),
            visible: this.#visibleInPlay,
        };
        return { ...superSpec, ...spec };
    }

    getEditProperties(selectedObjects) {
        var superProps = super.getEditProperties(selectedObjects);
        var thisProps = [
            {
                type: PropertyType.Visible,
                current: this.#visibleInPlay,
            },
            {
                type: PropertyType.LineColor,
                current: this.getCanvasObj().stroke,
            },
        ];
        return thisProps.concat(superProps);
    }

    async setEditProperty(screenMgr, type, value) {
        switch (type) {
            case PropertyType.LineColor:
                this.getCanvasObj().set("stroke", value);
                break;
            case PropertyType.Visible:
                this.#visibleInPlay = value;
                break;
            default:
                super.setEditProperty(screenMgr, type, value);
        }
    }

    getProperty(type) {
        switch (type) {
            case "borderColor":
                return this.getCanvasObj().stroke;
            case "visible":
                return this.#visibleInPlay;
            default:
                return super.getProperty(type);
        }
    }

    async setProperty(screenMgr, type, value) {
        switch (type) {
            case "borderColor":
                this.setEditProperty(screenMgr, PropertyType.LineColor, value);
                break;
            case "visible":
                this.setEditProperty(screenMgr, PropertyType.Visible, value);
                break;
            default:
                super.setProperty(screenMgr, type, value);
        }
    }
}

export default HotSpotScreenObject;
