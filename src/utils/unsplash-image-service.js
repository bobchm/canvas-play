import { createApi } from "unsplash-js";
import ImageService from "./image-service";

class UnsplashImageService extends ImageService {
    #unsplash;

    constructor() {
        super();
        this.#unsplash = createApi({
            accessKey: process.env.REACT_APP_UNSPLASH_API_KEY,
        });
    }

    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return [];
    }

    convertResults(results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result.id,
                url: result.urls.regular,
                thumbnail: result.urls.thumb,
                description: result.description,
                tags: result.tags.map((tag) => tag.title),
                author: result.user.name,
            });
        }
        return formatted;
    }

    doSearch(query, imageTypes, callback) {
        this.#unsplash.search
            .getPhotos({
                query: query,
                page: 1,
                per_page: 20,
            })
            .then((result) => {
                callback(this.convertResults(result.response.results));
            });
    }
}

export default UnsplashImageService;
