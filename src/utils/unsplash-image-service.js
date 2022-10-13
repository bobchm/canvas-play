import { createApi } from "unsplash-js";
import ImageService, { ImageServiceType } from "./image-service";

class UnsplashImageService extends ImageService {
    #unsplash;

    constructor() {
        super();
        this.#unsplash = createApi({
            accessKey: process.env.REACT_APP_UNSPLASH_API_KEY,
        });
        console.log(process.env.REACT_APP_UNSPLASH_API_KEY);
    }

    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return [];
    }

    getType() {
        return ImageServiceType.Unsplash;
    }

    convertResults(numPages, results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result.id,
                url: result.urls.regular,
                thumbnail: result.urls.thumb,
                description: result.description,
                source: "Unsplash",
                tags: result.tags.map((tag) => tag.title),
                author: result.user.name,
            });
        }
        return { totalPages: numPages, results: formatted };
    }

    doSearch(query, imageTypes, nthPage, pageSz, callback) {
        console.log("calling unsplash.search");
        this.#unsplash.search
            .getPhotos({
                query: query,
                page: nthPage,
                per_page: pageSz,
            })
            .then((result) => {
                console.log("unsplash.doSearch good results");
                console.log("typeof result");
                console.log(typeof result);
                console.log(result.response);
                callback(
                    this.convertResults(
                        result.response.total_pages,
                        result.response.results
                    )
                );
            })
            .catch((err) => {
                console.log("unsplash.doSearch error: ", err);
            });
    }
}

export default UnsplashImageService;
