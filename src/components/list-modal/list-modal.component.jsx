import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function ListModal({ title, elements, onClose, open }) {
    const handleClose = () => {
        onClose(null);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <List sx={{ pt: 0 }}>
                {elements.map((element, idx) => (
                    <ListItem
                        button
                        onClick={() => handleListItemClick(element)}
                        key={idx}
                    >
                        <ListItemText primary={element} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}
