import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";

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

    function clearState() {
        setInputText("");
        setImageData([]);
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                clearState();
                cancelCallback();
            }}
            style={{
                left: "10%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                className="card-container"
                sx={{ width: "80%", height: "90%", margin: "10px" }}
            >
                <Typography variant="h2" align="center">
                    {question}
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={textLabel}
                    type={inputType}
                    variant="standard"
                    onChange={(event) => {
                        clearState();
                        setInputText(event.target.value);
                    }}
                    sx={{ margin: "2%", width: "95%" }}
                    onKeyPress={(ev) => {
                        if (ev.key === "Enter") {
                            doSearch();
                        }
                    }}
                />

                <List
                    className="card-list"
                    sx={{
                        position: "relative",
                        overflow: "auto",
                        height: "80%",
                        paddingLeft: "8%",
                    }}
                >
                    {imageData.map((pic) => (
                        <img
                            key={pic.id}
                            className="card--image"
                            alt={pic.description}
                            src={pic.url}
                            width="30%"
                            onClick={(e) => {
                                clearState();
                                selectionCallback(e.target.src);
                            }}
                        />
                    ))}{" "}
                </List>
            </Paper>
        </Modal>
    );
}
