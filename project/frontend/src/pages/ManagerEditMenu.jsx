import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Add } from '@mui/icons-material';
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiCall } from "../helpers/helpers";

function ManagerEditMenu ({ setmode }) {
    const [categories, setCategories] = React.useState(useLoaderData());
    const [openAddCategory, setOpenAddCategory] = React.useState(false);

    async function newposition(result) {
        if (!result.destination) {
            return;
        }
        const newcategories = Array.from(categories);
        const [draggedcat] = newcategories.splice(result.source.index, 1);
        const body = {
            "category_id": draggedcat.category_id,
            "new_position": result.destination.index+1
        }
        const result1 = await apiCall("menu/category/position", "PUT", body);
        if (result1.status !== 200) {
            console.log("bruh");
        }
        const result2 = await apiCall("menu/categories", "GET", {});
        if (result2.status !== 200) {
            console.log("wtf");
        } else {
            setCategories(result2.categories);
        }
    }

    React.useEffect(() => {
        setmode("manager");
    }, []);
   
    return (
        <Box sx={{
            border: 1,
            borderRadius: "25px",
            display: "flex",
            flexDirection: "row",
            height: "83vh",
            margin: "10px auto 0 auto",
            textAlign: "center",
            width: "70vw"
        }}>
            <Box sx={{ borderRight: 1, width: "25vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0"}}>CATEGORIES</Box>
                <DragDropContext onDragEnd={newposition}>
                    <Droppable droppableId="categories">
                        {(provided) => (<Box {...provided.droppableProps} ref={provided.innerRef} sx={{ height: "68vh", padding: "0 0 5px 0", overflow: "auto" }}>
                            {categories && categories.map((category, index) => (
                                <Draggable key={category.category_id} draggableId={category.category_id.toString()} index={index}>
                                    {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <CategoryListItem  
                                            category={category} 
                                            setCategories={setCategories} 
                                        />
                                    </div>)}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>)}
                    </Droppable>
                </DragDropContext>
                <Box sx={{ borderTop: 1 }}>
                    <Button onClick={() => setOpenAddCategory(true)} sx={{ margin: "8px" }} color="success" variant="outlined">
                        <Add /> New Category
                    </Button>
                </Box>
            </Box>
            <Box sx={{ width: "45vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0" }}>MENU ITEMS</Box>
                <Outlet />
            </Box>
            {openAddCategory && <AddCategoryPopUp open={openAddCategory} setOpen={setOpenAddCategory} setCategories={setCategories} />}
           
        </Box>
    )
}

export default ManagerEditMenu;