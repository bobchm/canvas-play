import ImageService, { ImageServiceType } from "./image-service";

class OpenSymbolsImageService extends ImageService {
    #accessToken =
        "token::44-1:bed9a4f9c3:1664644156:7bad1be29162e20dd2e94390:52f1ace817f6e2ef035c8b154128c2ec8f30f79a81658affba562da0165a4303cdff9aaa096ae3f0ffffa12c2808f1b3654ab5de7cb7611484a72a34af5d5e1c";

    constructor() {
        super();
        //this.cacheAccessToken();
    }

    cacheAccessToken() {
        var formdata = new FormData();
        formdata.append("secret", "3750619249b899e7cb9d6a98");

        var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };

        fetch("https://www.opensymbols.org/api/v2/token", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    this.#accessToken = null;
                    return null;
                }
                return response.json();
            })
            .then((json) => {
                if (json) {
                    this.#accessToken = json.access_token;
                }
            })
            .catch((error) => {
                console.log(error);
                return;
            });
    }

    hasImageTypes() {
        return false;
    }

    getImageTypes() {
        return []; // does have "photo", "illustration", "vector", "all"
    }

    getType() {
        return ImageServiceType.OpenSymbols;
    }

    convertResults(totalHits, pageSz, results) {
        var formatted = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            formatted.push({
                id: result.id,
                url: result.image_url,
                thumbnail: null,
                description: "", // no description
                source: result.repo_key,
                tags: [], // comma-separated
                author: result.author,
            });
        }
        return { totalPages: 1, results: formatted };
    }

    buildQuery(qry, imageType, nthPage, pageSz) {
        // q = qry, imageTypes we'll skip for now, nthPage = page, pageSz = per_page, key
        var URL =
            "https://www.opensymbols.org/api/v2/symbols/?acc_token=" +
            encodeURIComponent(this.#accessToken) +
            "&q=" +
            encodeURIComponent(qry) +
            "&locale=en";
        return URL;
    }

    regetTokenAndRetryQuery(fullQry, callback) {
        this.cacheAccessToken();
        fetch(fullQry)
            .then((response) => {
                if (!response.ok) return null;
                return response.json();
            })
            .then((json) => {
                if (json) {
                    callback(this.convertResults(json.length, -1, json));
                }
            });
    }

    doSearch(query, imageType, nthPage, pageSz, callback) {
        var fetchQry = this.buildQuery(query, imageType, nthPage, pageSz);
        fetch(fetchQry)
            .then((response) => {
                if (response.ok) return response.json();
                if (response.status === 401) {
                    this.regetTokenAndRetryQuery(fetchQry, callback);
                }
            })
            .then((json) =>
                callback(this.convertResults(json.totalHits, pageSz, json.hits))
            );
    }
}

export default OpenSymbolsImageService;
