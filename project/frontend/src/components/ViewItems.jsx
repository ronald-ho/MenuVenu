import React from "react";
import { useLoaderData } from "react-router-dom";
import ItemPreview from "./ItemPreview";

function ViewItems() {
    const items = useLoaderData();

    return (
        <div style={{textAlign: 'center', display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", alignContent: "flex-start"}}>
            {items.map((item) => <ItemPreview key={item.item_id} item={item} />)}
        </div>
    )
}

export default ViewItems;