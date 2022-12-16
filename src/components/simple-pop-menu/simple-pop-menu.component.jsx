import React from "react";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

export default function SimplePopMenu({
    menuActions,
    menuAnchor,
    closeCallback,
}) {
    return (
        <Menu
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={() => closeCallback()}
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
                            closeCallback();
                            action.callback(event);
                        }}
                    >
                        <ListItemText>{action.label}</ListItemText>
                    </MenuItem>
                )
            )}
        </Menu>
    );
}
