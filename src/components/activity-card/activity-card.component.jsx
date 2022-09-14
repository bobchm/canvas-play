import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ActivityCard({ image, name, description, actions }) {
    return (
        <Card sx={{ margin: "20px", maxWidth: 345 }}>
            <CardMedia component="img" height="140" image={image} alt="name" />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
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
    );
}
