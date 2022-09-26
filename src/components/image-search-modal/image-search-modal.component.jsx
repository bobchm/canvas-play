import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Pagination from "@mui/material/Pagination";

import UnsplashImageService from "../../utils/unsplash-image-service";

const PAGE_SZ = 20;

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
    const [numPages, setNumPages] = useState(10);
    const [curPage, setCurPage] = useState(1);

    useEffect(() => {
        setImageService(new UnsplashImageService());
    }, []);

    function searchCallback({ totalPages, results }) {
        setNumPages(totalPages);
        setImageData(results);
    }

    function handleEnter() {
        setCurPage(1);
        doSearch(1);
    }

    function doSearch(nthPage) {
        if (imageService && inputText.length > 0) {
            imageService.doSearch(
                inputText,
                [],
                nthPage,
                PAGE_SZ,
                searchCallback
            );
        }
    }

    function clearState() {
        setInputText("");
        setImageData([]);
    }

    function handlePageChange(e, n) {
        setCurPage(n);
        doSearch(n);
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
                            handleEnter();
                        }
                    }}
                />

                <List
                    className="card-list"
                    sx={{
                        position: "relative",
                        overflow: "auto",
                        height: "78%",
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
                {imageData.length > 0 && (
                    <Pagination
                        count={numPages}
                        sx={{ mt: "10px" }}
                        page={curPage}
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                )}
            </Paper>
        </Modal>
    );
}
