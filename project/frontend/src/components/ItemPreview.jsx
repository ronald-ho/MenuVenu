import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function ItemPreview({ item }) {
    return (
        <Box component={Link} to={"../order/" + item.id} sx={{margin: "5px", border: "1px solid black", borderRadius: "10px", padding: "5px"}}>
            <Typography variant="h3">{item.name}</Typography>
            <img src={item.image} style={{maxWidth: "100px", maxHeight: "100px"}}/>
            <Typography>${item.price}</Typography>
            {item.points_to_redeem && <Typography>{item.points_to_redeem} MV Points</Typography>}
            {item.calories && <Typography>{item.calories} Cal</Typography>}
            {item.points && <Typography>{item.points} MVPoints</Typography>}
        </Box>
    )
}

export default ItemPreview;