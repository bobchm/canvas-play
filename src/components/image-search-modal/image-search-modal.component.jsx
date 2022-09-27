import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

import { ImageServiceType } from "../../utils/image-service";
import UnsplashImageService from "../../utils/unsplash-image-service";
import PixabayImageService from "../../utils/pixabay-image-service";

const PAGE_SZ = 10;

const imageServices = [
    { name: "Pixabay", service: ImageServiceType.Pixabay },
    { name: "Unsplash", service: ImageServiceType.Unsplash },
];

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
    const [imageTypes, setImageTypes] = useState([]);
    const [imageType, setImageType] = useState("");

    useEffect(() => {
        setupImageService(ImageServiceType.Pixabay);
    }, []);

    function setupImageService(serviceName) {
        var imgService;
        switch (serviceName) {
            case ImageServiceType.Unsplash:
                imgService = new UnsplashImageService();
                break;
            case ImageServiceType.Pixabay:
                imgService = new PixabayImageService();
                break;
            default:
                imgService = null;
        }
        if (!imgService) return null;

        if (imgService.hasImageTypes()) {
            var imgTypes = imgService.getImageTypes();
            setImageType(imgTypes.length > 0 ? imgTypes[0] : "");
            setImageTypes(imgTypes);
        } else {
            setImageTypes([]);
            setImageType("");
        }
        setImageService(imgService);
        return imgService;
    }

    function searchCallback({ totalPages, results }) {
        setNumPages(totalPages);
        setImageData(results);
    }

    function handleEnter() {
        setCurPage(1);
        doSearch(imageService, 1, imageType);
    }

    function handleChangeImageType(e) {
        var imgType = e.target.value;
        setImageType(imgType);
        doSearch(imageService, 1, imgType);
    }

    function handleChangeImageService(e) {
        var newService = setupImageService(e.target.value);
        if (newService) {
            doSearch(newService, 1, imageType);
        }
    }

    function doSearch(service, nthPage, imgType) {
        if (service && inputText.length > 0) {
            service.doSearch(
                inputText,
                imgType,
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
        doSearch(imageService, n, imageType);
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
                sx={{ width: "80%", height: "95%", margin: "10px" }}
            >
                <Stack
                    className="container"
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ margin: "2% 2% 2% 2%", height: "100%" }}
                    spacing={2}
                >
                    <Typography variant="h3" align="center">
                        {question}
                    </Typography>
                    <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="center"
                        spacing={2}
                        sx={{ width: "100%" }}
                    >
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
                            sx={{ width: "95%" }}
                            onKeyPress={(ev) => {
                                if (ev.key === "Enter") {
                                    handleEnter();
                                }
                            }}
                        />
                        <Select
                            id="demo-simple-select"
                            value={imageService?.getType()}
                            onChange={handleChangeImageService}
                        >
                            {imageServices.map((imgService, idx) => (
                                <MenuItem key={idx} value={imgService.service}>
                                    {imgService.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {imageService && imageService.hasImageTypes() && (
                            <Select
                                id="demo-simple-select"
                                value={imageType}
                                onChange={handleChangeImageType}
                            >
                                {imageTypes.map((imgType, idx) => (
                                    <MenuItem key={idx} value={imgType}>
                                        {imgType}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </Stack>
                    <List
                        className="card-list"
                        sx={{
                            overflow: "auto",
                            height: "100%",
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
                            sx={{ mt: "5px", paddingBottom: "3px" }}
                            page={curPage}
                            variant="outlined"
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    )}
                </Stack>
            </Paper>
        </Modal>
    );
}
