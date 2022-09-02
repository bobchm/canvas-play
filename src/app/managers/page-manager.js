class PageManager {
    #pageHash;

    constructor(userName) {
        // we will grab the page data associated with the userName in the future
        // right now, just initialize to having one blank page
        this.#pageHash = new Map();
        this.#pageHash.set("Home", {
            id: "#HomePage",
            backgroundColor: "alabaster",
            children: [],
            name: "Home",
        });
    }

    hasPage(name) {
        return this.getPage(name) !== undefined;
    }

    getPage(name) {
        return this.#pageHash(name);
    }

    addPage(name, spec) {
        this.#pageHash.set(name, spec);
    }

    modifyPage(name, spec) {
        if (this.hasPage(name)) {
            this.#pageHash.set(name, spec);
        }
    }

    removePage(name) {
        this.#pageHash.delete(name);
    }
}

export default PageManager;
