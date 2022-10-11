import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

import { ImageServiceType } from "../../utils/image-service";
import UnsplashImageService from "../../utils/unsplash-image-service";
import PixabayImageService from "../../utils/pixabay-image-service";
import OpenSymbolsImageService from "../../utils/opensymbols-image-service";
import ArasaacImageService from "../../utils/arasaac-image-service";
import ImageCard from "../image-card/image-card.component";

import { BackgroundImageStyle } from "../../utils/canvas";

const PAGE_SZ = 20;

const imageServices = [
    { name: "Pixabay", service: ImageServiceType.Pixabay },
    { name: "Unsplash", service: ImageServiceType.Unsplash },
    // { name: "OpenSymbols", service: ImageServiceType.OpenSymbols },
    { name: "ARASAAC", service: ImageServiceType.ARASAAC },
];

const backgroundStyles = [
    { name: "Center", style: BackgroundImageStyle.Center },
    { name: "Stretch", style: BackgroundImageStyle.Stretch },
];

export const ImageSearchNoImage = "imageSearchNoImage";

export default function ImageSearchModal({
    open,
    question,
    textLabel,
    inputType = "text",
    selectionCallback,
    cancelCallback,
    preferredService = ImageServiceType.Unsplash,
    allowNoImage = false,
    allowStretchCenter = false,
}) {
    const [inputText, setInputText] = useState("");
    const [imageData, setImageData] = useState([]);
    const [numPages, setNumPages] = useState(10);
    const [curPage, setCurPage] = useState(1);
    const [imageTypes, setImageTypes] = useState([]);
    const [imageType, setImageType] = useState("");
    const [imageService, setImageService] = useState(null);
    const [backgroundStyle, setBackgroundStyle] = useState(
        BackgroundImageStyle.Center
    );

    useEffect(() => {
        setupImageService(preferredService);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preferredService]);

    function setupImageService(serviceName) {
        var imgService;
        switch (serviceName) {
            case ImageServiceType.Unsplash:
                imgService = new UnsplashImageService();
                break;
            case ImageServiceType.Pixabay:
                imgService = new PixabayImageService();
                break;
            case ImageServiceType.OpenSymbols:
                imgService = new OpenSymbolsImageService();
                break;
            case ImageServiceType.ARASAAC:
                imgService = new ArasaacImageService();
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

    function handleChangeBackgroundStyle(e) {
        setBackgroundStyle(e.target.value);
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

    function valueForState(url) {
        if (!allowStretchCenter) return url;

        return { url: url, style: backgroundStyle };
    }

    function handleSelectImage(e, url) {
        clearState();
        selectionCallback(valueForState(url));
    }

    function handleNoImage(e) {
        clearState();
        selectionCallback(valueForState(ImageSearchNoImage));
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
                        {allowNoImage && (
                            <Button variant="outlined" onClick={handleNoImage}>
                                No Image
                            </Button>
                        )}
                        {allowStretchCenter && (
                            <Select
                                id="stretch-center-select"
                                value={backgroundStyle}
                                onChange={handleChangeBackgroundStyle}
                            >
                                {backgroundStyles.map((bkgStyle, idx) => (
                                    <MenuItem key={idx} value={bkgStyle.style}>
                                        {bkgStyle.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
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
                        sx={{
                            overflow: "auto",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexFlow: "row wrap",
                        }}
                    >
                        {imageData.map((pic) => (
                            <ImageCard
                                key={pic.id}
                                image={pic}
                                callback={handleSelectImage}
                            />
                        ))}
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
