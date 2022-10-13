import ImageService, { ImageServiceType } from "./image-service";

class PixabayImageService extends ImageService {
    hasImageTypes() {
        return true;
    }

    getImageTypes() {
        return ["all", "photo", "illustration", "vector"]; // does have "photo", "illustration", "vector", "all"
    }

    getType() {
        return ImageServiceType.Pixabay;
    }

    tags2tags(intags) {
        var tags = intags.trim();
        if (tags.length <= 0) return [];
        return tags.split(",").map((element) => element.trim());
    }

    convertResults(totalHits, pageSz, results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result.id,
                url: result.webformatURL,
                thumbnail: result.previewURL,
                description: "", // no description
                source: "Pixabay",
                tags: this.tags2tags(result.tags), // comma-separated
                author: result.user,
            });
        }
        var numPages = Math.ceil(totalHits / pageSz);
        return { totalPages: numPages, results: formatted };
    }

    buildQuery(qry, imageType, nthPage, pageSz) {
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
        if (imageType && imageType.length > 0) {
            URL += "&image_type=" + encodeURIComponent(imageType);
        }
        return URL;
    }

    doSearch(query, imageType, nthPage, pageSz, callback) {
        var fetchQry = this.buildQuery(query, imageType, nthPage, pageSz);
        console.log("pixabay doSearch");
        fetch(fetchQry)
            .then((response) => {
                console.log("OK response");
                return response.json();
            })
            .then((json) => {
                console.log("json: ", json);
                callback(
                    this.convertResults(json.totalHits, pageSz, json.hits)
                );
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    }
}

export default PixabayImageService;
