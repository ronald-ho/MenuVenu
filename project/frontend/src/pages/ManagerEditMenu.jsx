import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Add } from '@mui/icons-material';
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiCall } from "../helpers/helpers";

function ManagerEditMenu () {
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
   
    return (
        <Box 
            sx={{
                backgroundColor: "white",
                border: "1px solid #caccce",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "row",
                height: "83vh",
                margin: "10px auto",
                textAlign: "center",
                width: 3/4
            }}
        >
            <Box 
                sx={{ 
                    borderRadius: "15px 0 0 15px", 
                    borderRight: "1px solid #caccce", 
                    display: "flex", 
                    flexDirection: "column", 
                    width: 1/3 
                }}
            >          
                <Typography 
                    sx={{ 
                        borderBottom: "1px solid #caccce", 
                        borderRadius: "15px 0 0 0", 
                        color: "#7a49a5", 
                        fontSize: "25px", 
                        padding: "12px 0" 
                    }}
                >
                    CATEGORIES
                </Typography>
                <DragDropContext onDragEnd={newposition}>
                    <Droppable droppableId="categories">
                        {(provided) => (
                            <Box 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                sx={{   
                                    flex: 1,
                                    overflow: "auto", 
                                    padding: "0 0 5px 0",   
                                }}
                            >
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
                <Box sx={{ borderRadius: "0 0 0 15px", borderTop: "1px solid #caccce", height: "60px" }}>
                    <Button onClick={() => setOpenAddCategory(true)} sx={{ margin: "12.5px" }} color="success" variant="outlined">
                        <Add /> New Category
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", width: 2/3 }}>
                <Typography 
                    sx={{ 
                        borderBottom: "1px solid #caccce", 
                        borderRadius: "15px 0 0 0", 
                        color: "#7a49a5", 
                        fontSize: "25px", 
                        padding: "12px 0" 
                    }}
                >
                    MENU ITEMS
                </Typography>
                <Outlet />
            </Box>
            {openAddCategory && <AddCategoryPopUp open={openAddCategory} setOpen={setOpenAddCategory} setCategories={setCategories} />}
        </Box>
    )
}

export default ManagerEditMenu;