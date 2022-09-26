export const ImageRefType = {
    URL: "URL",
    SymRef: "SymRef",
};

class ImageService {
    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return [];
    }

    doSearch(text, imageTypes, nthPage, pageSz, callback) {
        callback([]);
    }
}

export default ImageService;
