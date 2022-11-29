import PageScreenObject from "../app/screen-objects/page-screen-object";
import { CurrentActivityVersion, CurrentPageVersion } from "./dbaccess";
import { blankBehavior } from "../app/behaviors/behavior-behaviors";

export function defaultPageSpec(name) {
    var page = new PageScreenObject(null, null, {
        id: `#${name}`,
        backgroundColor: "white",
        name: name,
        children: [],
    });

    return {
        name: name,
        content: page.toJSON(),
        version: CurrentPageVersion,
    };
}

export function defaultActivitySpec(name, vSize) {
    return {
        name: name,
        pages: [],
        home: null,
        vSize: vSize,
        version: CurrentActivityVersion,
        behavior: blankBehavior,
    };
}

export function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
    return (
        ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow) + toLow
    );
}

export function jsonDeepCopy(json) {
    return JSON.parse(JSON.stringify(json));
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
