import React, { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export default function CanvasAppBar({
    title,
    isLoaded = true,
    menuActions = [],
    accountActions = [],
}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [accountAnchor, setAccountAnchor] = useState(null);

    const openMenuMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const openAccountMenu = (event) => {
        setAccountAnchor(event.currentTarget);
    };

    return (
        <Box sx={{ flex: 1, flexGrow: 1, backgroundColor: "primary.dark" }}>
            <Toolbar>
                {menuActions.length > 0 && (
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            aria-label="menu"
                            color="inherit"
                            sx={{ mr: 2 }}
                            onClick={openMenuMenu}
                        >
                            <MenuIcon sx={{ color: "white" }} />
                        </IconButton>
                        {menuActions.length > 0 && (
                            <Menu
                                open={Boolean(menuAnchor)}
                                anchorEl={menuAnchor}
                                onClose={() => setMenuAnchor(null)}
                                keepMounted
                                // TransitionComponent={Slide}
                                PaperProps={{
                                    style: {
                                        maxHeight: 40 * 10,
                                        width: "20ch",
                                    },
                                }}
                            >
                                {menuActions.map((action, idx) =>
                                    action.label === "--divider--" ? (
                                        <Divider key={idx} />
                                    ) : (
                                        <MenuItem
                                            key={idx}
                                            onClick={(event) => {
                                                setMenuAnchor(null);
                                                action.callback(event);
                                            }}
                                        >
                                            <ListItemText>
                                                {action.label}
                                            </ListItemText>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        )}
                    </>
                )}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "white", flexGrow: 1 }}
                >
                    {title}
                </Typography>
                {!isLoaded && <CircularProgress style={{ color: "white" }} />}
                {accountActions.length > 0 && (
                    <>
                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={openAccountMenu}
                        >
                            <AccountCircleRoundedIcon sx={{ color: "white" }} />
                        </IconButton>
                        {accountActions.length > 0 && (
                            <Menu
                                open={Boolean(accountAnchor)}
                                anchorEl={accountAnchor}
                                onClose={() => setAccountAnchor(null)}
                                keepMounted
                                // TransitionComponent={Slide}
                                PaperProps={{
                                    style: {
                                        maxHeight: 40 * 10,
                                        width: "20ch",
                                    },
                                }}
                            >
                                {accountActions.map((action, idx) =>
                                    action.label === "--divider--" ? (
                                        <Divider key={idx} />
                                    ) : (
                                        <MenuItem
                                            key={idx}
                                            onClick={(event) => {
                                                setAccountAnchor(null);
                                                action.callback(event);
                                            }}
                                        >
                                            <ListItemText>
                                                {action.label}
                                            </ListItemText>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        )}
                    </>
                )}
            </Toolbar>
        </Box>
    );
}
