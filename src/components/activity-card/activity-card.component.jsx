import React, { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ImageSearchModal from "../image-search-modal/image-search-modal.component";

var saveDebounceId = -1;

export default function ActivityCard({
    image,
    name,
    description,
    actions,
    changeCallback,
}) {
    const [curName, setCurName] = useState(name);
    const [activityName, setActivityName] = useState(name); // this is the current name of the activity in the DB
    const [curDescription, setCurDescription] = useState(description);
    const [curImage, setCurImage] = useState(image);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    function debounceSave(newName, newDescription, newImage) {
        if (saveDebounceId >= 0) clearTimeout(saveDebounceId);
        saveDebounceId = setTimeout(
            () => saveActivityToDB(newName, newDescription, newImage),
            3000
        );
    }

    function saveActivityToDB(newName, newDescription, newImage) {
        if (changeCallback(activityName, newName, newDescription, newImage)) {
            setActivityName(newName);
        }
    }

    function handleImageSelection() {
        setIsSearchModalOpen(true);
    }

    function handleNameChange(newName) {
        setCurName(newName);
        debounceSave(newName, curDescription, curImage);
    }

    function handleDescriptionChange(newDescription) {
        setCurDescription(newDescription);
        debounceSave(curName, newDescription, curImage);
    }

    function handleChangeImage(newImage) {
        setIsSearchModalOpen(false);
        setCurImage(newImage);
        saveActivityToDB(curName, curDescription, newImage);
    }

    function handleCancelImage() {
        setIsSearchModalOpen(false);
    }

    return (
        <>
            <Card sx={{ margin: "20px", width: 250 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={curImage}
                    alt="name"
                    sx={{ objectFit: "contain" }}
                    onClick={handleImageSelection}
                />
                <CardContent>
                    <TextField
                        hiddenLabel
                        value={curName}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            style: { fontSize: 32 },
                        }}
                        onChange={(e) => {
                            handleNameChange(e.target.value);
                        }}
                    />
                    <TextField
                        hiddenLabel
                        value={curDescription}
                        variant="standard"
                        multiline={true}
                        maxRows={3}
                        InputProps={{
                            disableUnderline: true,
                            style: { fontSize: 14 },
                        }}
                        onChange={(e) => {
                            handleDescriptionChange(e.target.value);
                        }}
                        sx={{ width: "100%" }}
                    />
                </CardContent>
                <CardActions>
                    {actions.map((action, idx) => (
                        <Button
                            key={idx}
                            onClick={() => action.action(name)}
                            size="small"
                        >
                            {action.label}
                        </Button>
                    ))}
                </CardActions>
            </Card>
            <ImageSearchModal
                open={isSearchModalOpen}
                question="Image Search"
                textLabel="Search Term"
                selectionCallback={handleChangeImage}
                cancelCallback={handleCancelImage}
                allowNoImage={false}
            />
        </>
    );
}
