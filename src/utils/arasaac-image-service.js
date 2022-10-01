import ImageService, { ImageServiceType } from "./image-service";

class ArasaacImageService extends ImageService {
    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return []; // does have "photo", "illustration", "vector", "all"
    }

    getType() {
        return ImageServiceType.ARASAAC;
    }

    getURLFromId(id, rez) {
        return `https://static.arasaac.org/pictograms/${id}/${id}_${rez}.png`;
    }

    convertResults(totalHits, pageSz, results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result._id,
                url: this.getURLFromId(result._id, 2500),
                thumbnail: this.getURLFromId(result._id, 300),
                description: result.keywords[0].keyword, // no description
                source: null,
                tags: result.tags, // comma-separated
                author: null,
            });
        }

        return { totalPages: 1, results: formatted };
    }

    buildQuery(qry, imageType, nthPage, pageSz) {
        // q = qry, imageTypes we'll skip for now, nthPage = page, pageSz = per_page, key
        return (
            "https://api.arasaac.org/api/pictograms/en/search/" +
            encodeURIComponent(qry)
        );
    }

    doSearch(query, imageType, nthPage, pageSz, callback) {
        var fetchQry = this.buildQuery(query, imageType, nthPage, pageSz);
        fetch(fetchQry)
            .then((response) => {
                return response.json();
            })
            .then((json) =>
                callback(this.convertResults(json.length, pageSz, json))
            );
    }
}

export default ArasaacImageService;
