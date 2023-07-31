import { Box, Card, Chip, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function ItemPreview({ item }) {
    return (
        <Card 
            component={Link} to={"../order/" + item.id} 
            sx={{ 
                border: "1px solid #caccce",
                height: "200px",
                margin: "5px", 
                padding: "5px",
                width: "200px"
            }}
        >
            <Typography>{item.name}</Typography>
            {item.image && <img src={item.image} alt={item.name} style={{maxWidth: "100px", maxHeight: "100px"}}/>}
            <Typography>${item.price}</Typography>
            {item.points_to_redeem && <Typography>{item.points_to_redeem} MV Points</Typography>}
            {item.calories && <Typography>{item.calories} Cal</Typography>}
            {item.ingredients.map((i) => ( <Chip label={i} /> ))}
        </Card>
    )
}

export default ItemPreview;