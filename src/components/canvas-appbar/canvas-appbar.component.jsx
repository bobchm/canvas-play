import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SimplePopMenu from "../simple-pop-menu/simple-pop-menu.component";

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

    const closeMenuMenu = () => {
        setMenuAnchor(null);
    };

    const closeAccountMenu = () => {
        setAccountAnchor(null);
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
                        <SimplePopMenu
                            menuActions={menuActions}
                            menuAnchor={menuAnchor}
                            closeCallback={closeMenuMenu}
                        />
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
                        <SimplePopMenu
                            menuActions={accountActions}
                            menuAnchor={accountAnchor}
                            closeCallback={closeAccountMenu}
                        />
                    </>
                )}
            </Toolbar>
        </Box>
    );
}
