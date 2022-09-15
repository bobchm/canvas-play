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
