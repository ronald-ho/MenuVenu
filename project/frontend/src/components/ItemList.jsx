import React from "react";
import { useLoaderData } from "react-router-dom";
import ItemListItem from "./ItemListItem";

function ItemList() {
    const items = useLoaderData();

    return (
        <>
            {items.map((item) => <ItemListItem key={item.item_id} item={item} />)}
        </>
    )
}

export default ItemList;