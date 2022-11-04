import PageScreenObject from "../app/screen-objects/page-screen-object";

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
