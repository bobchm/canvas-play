import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function ImageCard({ image, callback }) {
    function imageLabel(img) {
        var text = "";
        if (img.description && img.description.length > 0) {
            text += img.description + " ";
        }
        if (img.source && img.source.length > 0) {
            text += "from " + img.source + " ";
        }
        if (img.author && img.author.length > 0) {
            text += "(" + img.author + ")";
        }
        return text;
    }
    return (
        <Paper
            onClick={(e) => callback(e)}
            sx={{
                margin: "10px",
                width: "30%",
                height: "30%",
                overflow: "hidden",
                textAlign: "center",
            }}
        >
            <img
                key={image.id}
                alt={image.description}
                src={image.url}
                width="auto%"
                height="80%"
                onClick={(e) => callback(e)}
            />
            <Typography gutterBottom variant="p" component="div">
                {imageLabel(image)}
            </Typography>
        </Paper>
    );
}
