import { createApi } from "unsplash-js";
import ImageService from "./image-service";

class UnsplashImageService extends ImageService {
    #unsplash;

    constructor() {
        super();
        var key = process.env.REACT_APP_UNSPLASH_API_KEY;
        var test = process.env.REACT_APP_TEST;
        console.log(key);
        console.log(test);
        this.#unsplash = createApi({ accessKey: key });
    }

    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return [];
    }

    doSearch(query, imageTypes, callback) {
        this.#unsplash.search
            .getPhotos({
                query: query,
            })
            .then((result) => {
                console.log(result);
            });
    }
}

export default UnsplashImageService;
