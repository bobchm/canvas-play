import TextField from "@mui/material/TextField";

const TextPropertyPanel = ({ propOption, propUpdateCallback }) => {
    return (
        <TextField
            sx={{ width: "100%" }}
            value={propOption.current}
            label={propOption.type.name}
            onChange={(e) => {
                propUpdateCallback(e.target.value);
            }}
        />
    );
};

export default TextPropertyPanel;
