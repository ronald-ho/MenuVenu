import React from "react";
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import ItemListItem from "./ItemListItem";
import { get_items } from "../helpers/loaderfunctions";
import AddItemPopUp from "./AddItemPopUp";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { apiCall } from "../helpers/helpers";

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

    async function newposition(result) {
        if (!result.destination) {
            return;
        }
        const newitems = Array.from(items);
        const [draggeditem] = newitems.splice(result.source.index, 1);
        const body = {
            "item_id": draggeditem.id,
            "new_position": result.destination.index+1
        }
        const result1 = await apiCall("menu/item/position", "PUT", body);
        if (result1.status != 200) {
            console.log("bruh");
        }
        const result2 = await get_items(params);
        if (result2.status != 200) {
            console.log("wtf");
        } else {
            setItems(result2);
        }
    }
 
    return (
        <>
            <DragDropContext onDragEnd={newposition}>
            <Droppable droppableId="items">
                {(provided) => (<Box {...provided.droppableProps} ref={provided.innerRef} sx={{ height: "68vh", padding: "0 0 5px 0", overflow: "auto" }}>
                    {items.map((item, index) => 
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided) => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <ItemListItem categoryId={params.categoryid} item={item} />
                        </div>}
                    </Draggable>)}
                    {provided.placeholder}
                </Box>)}
            </Droppable>
            </DragDropContext>
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