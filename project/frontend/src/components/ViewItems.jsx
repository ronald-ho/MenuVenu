import React from "react";
import { useLoaderData } from "react-router-dom";
import ItemButton from "./ItemButton";

function ViewItems() {
    const items = useLoaderData();

    return (
        <div style={{textAlign: 'center', display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            {items.map((item) => <ItemButton key={item.item_id} item={item} />)}
        </div>
    )
}

export default ViewItems;