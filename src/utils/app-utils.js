import PageScreenObject from "../app/screen-objects/page-screen-object";
import { CurrentActivityVersion, CurrentPageVersion } from "./dbaccess";
import { blankBehavior } from "../app/behaviors/behavior-behaviors";
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from "lz-string";

export function defaultPageSpec(name) {
    var page = new PageScreenObject(null, null, {
        id: `#${name}`,
        backgroundColor: "white",
        name: name,
        children: [],
        openBehavior: blankBehavior,
        closeBehavior: blankBehavior,
        variables: {},
    });

    return {
        name: name,
        content: page.toJSON(),
        version: CurrentPageVersion,
    };
}

function inflatePage(cPage) {
    var iString = decompressFromEncodedURIComponent(cPage.content);
    return {
        name: cPage.name,
        content: JSON.parse(iString),
        version: cPage.version,
    };
}

function deflatePage(iPage) {
    var stringified = JSON.stringify(iPage.content);
    var cContent = compressToEncodedURIComponent(stringified);
    var iLength = stringified.length;
    var cLength = cContent.length;
    console.log(
        `page compression: ${
            (cLength / iLength) * 100
        }% - (${iLength} vs. ${cLength})`
    );
    return {
        name: iPage.name,
        content: cContent,
        version: CurrentPageVersion,
    };
}

export function postLoadPage(page) {
    var version = pageVersion(page);
    if (version.major > 0 || version.minor > 0) {
        return page;
    }

    return page;
}

export function preSavePage(page) {
    return page;
}

export function pageVersion(page) {
    var majMin = page.version.split(".");
    return {
        major: parseInt(majMin[0]),
        minor: parseInt(majMin[1]),
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
        variables: {},
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
