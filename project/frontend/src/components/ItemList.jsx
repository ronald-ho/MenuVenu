import React from "react";
import { useParams } from "react-router-dom";
import ItemListItem from "./ItemListItem";
import { apiCall } from "../helpers/helpers";
import { get_items } from "../helpers/loaderfunctions";

function ItemList() {
    const params = useParams();
    console.log(params);

    const [items, setItems] = React.useState([]);
    
    React.useEffect(() => {
        const getItems = async () => {
            const activeCategoryItems = await get_items(params);
            setItems(activeCategoryItems);
        }
        getItems();
    }, [params]);

    return (
        <>
            {items.map((item) => <ItemListItem key={item.item_id} item={item} />)}
        </>
    )
}

export default ItemList;