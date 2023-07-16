import React from "react";
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import ItemListItem from "./ItemListItem";
import { get_items } from "../helpers/loaderfunctions";
import AddItemPopUp from "./AddItemPopUp";

function ItemList() {
    const params = useParams();
    console.log(params);

    const [items, setItems] = React.useState([]);
    const [openAddItem, setOpenAddItem] = React.useState(false);
    
    React.useEffect(() => {
        const getItems = async () => {
            const activeCategoryItems = await get_items(params);
            setItems(activeCategoryItems);
        }
        getItems();
    }, [params]);

    return (
        <>
            <Box sx={{ height: "68vh", padding: "0 0 5px 0", overflow: "auto" }}>
                {items.map((item) => <ItemListItem key={item.item_id} categoryId={params.categoryid} item={item} />)}
            </Box>
            <Box sx={{borderTop: 1}}>
                <Button 
                    onClick={() => {
                        setOpenAddItem(true);
                    }}
                    sx={{ margin: "10px" }} 
                    color="success" 
                    variant="outlined"
                >
                    <Add /> New Menu Item
                </Button>
            </Box>
            {openAddItem && <AddItemPopUp open={openAddItem} setOpen={setOpenAddItem} categoryId={params.categoryid} />}
        </>
    )
}

export default ItemList;