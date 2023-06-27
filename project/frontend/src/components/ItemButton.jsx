import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function ItemButton ({item}) {
    return (
        <Box component={Link}>
            {item.name}
        </Box>
    )
}

export default ItemButton;