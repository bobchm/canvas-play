import ImageService from "./image-service";

class PixabayImageService extends ImageService {
    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return []; // does have "photo", "illustration", "vector", "all"
    }

    tags2tags(intags) {
        var tags = intags.trim();
        if (tags.length <= 0) return [];
        return intags.split(",").map((element) => element.trim());
    }

    convertResults(numPages, results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result.id,
                url: result.imageURL,
                thumbnail: result.previewURL,
                description: "", // no description
                tags: this.tags2tags(result.tags), // comma-separated
                author: result.user,
            });
        }
        return { totalPages: numPages, results: formatted };
    }

    buildQuery(qry, imageTypes, nthPage, pageSz) {
        // q = qry, imageTypes we'll skip for now, nthPage = page, pageSz = per_page, key
        var API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
        var URL =
            "https://pixabay.com/api/?key=" +
            API_KEY +
            "&q=" +
            encodeURIComponent(qry) +
            "&page=" +
            encodeURIComponent(nthPage) +
            "&per_page=" +
            encodeURIComponent(pageSz);
        return URL;
    }

    doSearch(query, imageTypes, nthPage, pageSz, callback) {
        var fetchQry = this.buildQuery(query, imageTypes, nthPage, pageSz);
        fetch(fetchQry)
            .then((response) => response.json())
            .then((json) =>
                callback(this.convertResults(json.totalPages, json.hits))
            );
    }
}

export default PixabayImageService;
