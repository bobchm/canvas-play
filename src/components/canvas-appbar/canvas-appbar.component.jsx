import React, { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export default function CanvasAppBar({ title, actions }) {
    const [anchor, setAnchor] = useState(null);

    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };

    return (
        <Box sx={{ flex: 1, flexGrow: 1, backgroundColor: "primary.dark" }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    color="inherit"
                    sx={{ mr: 2 }}
                    onClick={openMenu}
                >
                    <MenuIcon sx={{ color: "white" }} />
                </IconButton>
                <Menu
                    open={Boolean(anchor)}
                    anchorEl={anchor}
                    onClose={() => setAnchor(null)}
                    keepMounted
                    // TransitionComponent={Slide}
                    PaperProps={{
                        style: {
                            maxHeight: 40 * 10,
                            width: "20ch",
                        },
                    }}
                >
                    {actions.map((action, idx) =>
                        action.label === "--divider--" ? (
                            <Divider key={idx} />
                        ) : (
                            <MenuItem
                                key={idx}
                                onClick={(event) => action.callback(event)}
                            >
                                <ListItemText>{action.label}</ListItemText>
                            </MenuItem>
                        )
                    )}
                </Menu>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "white", flexGrow: 1 }}
                >
                    {title}
                </Typography>
                <IconButton color="inherit" edge="end">
                    <AccountCircleRoundedIcon sx={{ color: "white" }} />
                </IconButton>
            </Toolbar>
        </Box>
    );
}
