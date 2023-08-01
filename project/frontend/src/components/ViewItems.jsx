import React from "react";
import { useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import ItemPreview from "./ItemPreview";

function ViewItems() {
    const items = useLoaderData();

    return (
        <Box 
            sx={{
                textAlign: 'center', 
                display: 'flex', 
                flexBasis: 'auto',
                flexWrap: 'wrap', 
                height: '83vh', 
                justifyContent: 'center',
                margin: '10px',
                overflow: 'auto',
                width: 65/100, 
            }}
        >
            {items.map((item) => <ItemPreview key={item.item_id} item={item} />)}
        </Box>
    )
}

export default ViewItems;