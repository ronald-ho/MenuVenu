import React from "react";
import { Box } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import ItemListItem from "./ItemListItem";

function ItemList() {
    const items = useLoaderData();

    return (
        <Box>
            {items.map((item) => <ItemListItem key={item.item_id} item={item} />)}
        </Box>
    )
}

export default ItemList;