import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const BooleanPropertyPanel = ({ propOption, propUpdateCallback }) => {
    const [value, setValue] = React.useState(propOption.current || false);

    return (
        <Paper
            variant="outlined"
            sx={{
                backgroundColor: "azure",
                border: 1,
                boderColor: "black",
            }}
        >
            <Grid container justifyContent="Left">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={value}
                            onChange={(event) => {
                                propUpdateCallback(
                                    propOption.type,
                                    event.target.checked
                                );
                                setValue(event.target.checked);
                            }}
                            sx={{
                                "& .MuiSvgIcon-root": { fontSize: 40 },
                                paddingLeft: "20px",
                            }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                            {propOption.type.name}
                        </Typography>
                    }
                />
            </Grid>
        </Paper>
    );
};

export default BooleanPropertyPanel;
