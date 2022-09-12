import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
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
        <Box sx={{ flex: 1, flexGrow: 1 }}>
            {/* <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            > */}
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={openMenu}
                >
                    <MenuIcon />
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton color="inherit" edge="end">
                    <AccountCircleRoundedIcon />
                </IconButton>
            </Toolbar>
            {/* </AppBar> */}
        </Box>
    );
}
