import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import UnsplashImageService from "../../utils/unsplash-image-service";

export default function ImageSearchModal({
    open,
    question,
    textLabel,
    inputType = "text",
    selectionCallback,
    cancelCallback,
}) {
    const [inputText, setInputText] = useState("");
    const [imageData, setImageData] = useState([]);
    const [imageService, setImageService] = useState(null);

    useEffect(() => {
        setImageService(new UnsplashImageService());
    }, []);

    function searchCallback(results) {
        setImageData(results);
    }

    function doSearch() {
        if (imageService && inputText.length > 0) {
            imageService.doSearch(inputText, [], searchCallback);
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={() => cancelCallback()}>
                <DialogTitle>{question}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={textLabel}
                        type={inputType}
                        fullWidth
                        variant="standard"
                        onChange={(event) => setInputText(event.target.value)}
                        onKeyPress={(ev) => {
                            if (ev.key === "Enter") {
                                doSearch();
                            }
                        }}
                    />

                    <div className="card-list">
                        {imageData.map((pic) => (
                            <div className="card" key={pic.id}>
                                <img
                                    className="card--image"
                                    alt={pic.alt_description}
                                    src={pic.urls.full}
                                    width="50%"
                                    height="50%"
                                    onClick={(e) =>
                                        selectionCallback(e.target.src)
                                    }
                                ></img>
                            </div>
                        ))}{" "}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
