export const ImageRefType = {
    URL: "URL",
    SymRef: "SymRef",
};

export const ImageServiceType = {
    Pixabay: "pixabay",
    Unsplash: "unsplash",
    OpenSymbols: "opensymbols",
    ARASAAC: "ARASAAC",
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
