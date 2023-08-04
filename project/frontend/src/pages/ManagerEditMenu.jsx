import React from "react";
import { Outlet, useLoaderData, useLocation, useParams } from "react-router-dom";
import { Alert, Box, Button, Typography } from "@mui/material";
import { Add } from '@mui/icons-material';
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiCall } from "../helpers/helpers";
import BouncingArrow from "../components/BouncingArrow";
import AddItemPopUp from "../components/AddItemPopUp";

function ManagerEditMenu ({ setmode }) {
    const params = useParams();
    const location = useLocation();
  
    const [categories, setCategories] = React.useState(useLoaderData());
    const [allIngredients, setAllIngredients] = React.useState([]);
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
    const [openAddItem, setOpenAddItem] = React.useState(false);

    const isCategoryPath = location.pathname.startsWith("/managereditmenu/") && !!params.categoryid;

    React.useEffect(() => {
        const getAllIngredients = async () => {
            const data = await apiCall("menu/ingredients", "GET", {});
            if (data.ingredients) {
                console.log(data.ingredients);
                setAllIngredients(data.ingredients);
            }
        }

        getAllIngredients();
    }, []);

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
        <Box 
            sx={{
                backgroundColor: "white",
                border: "1px solid #caccce",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                height: "83vh",
                margin: "10px auto",
                textAlign: "center",
                width: 3/4
            }}
        >
            <Box 
                sx={{
                    backgroundColor: "white",
                    borderBottom: "1px solid #caccce", 
                    borderRadius: "15px 15px 0 0",
                    height: "60px",
                    display: "flex"
                }}
            >
                <Box 
                    sx={{ 
                        borderRight: "1px solid #caccce", 
                        width: 1/3 
                    }}
                >          
                    <Typography 
                        sx={{ 
                            borderBottom: "1px solid black", 
                            color: "#7a49a5", 
                            fontSize: "25px", 
                            fontWeight: 700,
                            padding: "12px 0" 
                        }}
                    >
                        CATEGORIES
                    </Typography>
                </Box>
                <Box sx={{ width: 2/3 }}>
                    <Typography 
                        sx={{ 
                            borderBottom: "1px solid #caccce", 
                            color: "#7a49a5", 
                            fontSize: "25px", 
                            fontWeight: 700,
                            padding: "12px 0" 
                        }}
                    >
                        MENU ITEMS
                    </Typography>
                </Box>
            </Box>
            <Box 
                sx={{
                    backgroundColor: "white",
                    display: 'flex', 
                    flex: 1,
                    height: '65vh'
                }}
            >
                <Box 
                    sx={{ 
                        borderRight: "1px solid #caccce", 
                        display: "flex", 
                        flex: 1, 
                        width: 1/3 
                    }}
                >          
                    {categories.length === 0 ? (
                        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: 2/3 }}>
                                <Box sx={{ display: 'flex', flex: 1 }}>
                                    <Alert severity="info" aria-label='infoAlert' sx={{ margin: 'auto', textAlign: 'left', width: 3/4 }}>
                                        To get started with building your menu, click the button below to add your first category.
                                    </Alert> 
                                </Box>
                                <BouncingArrow />
                            </Box>
                        </Box>
                    ) : (
                        <DragDropContext onDragEnd={newposition}>
                            <Droppable droppableId="categories">
                                {(provided) => (
                                    <Box 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef} 
                                        sx={{   
                                            flex: 1,
                                            overflow: "auto"
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
                    )}
                </Box>  
                <Box sx={{ display: "flex", flexDirection: "column", width: 2/3 }}>
                    <Outlet />
                    {location.pathname === '/managereditmenu' && categories.length === 0 &&
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <Alert severity="info" aria-label='infoAlert' sx={{ margin: 'auto', textAlign: 'left', width: 3/4 }}>
                                Once you have added a category, you will be able to add items to it here.
                            </Alert> 
                        </Box>
                    }
                    {location.pathname === '/managereditmenu' && categories.length !== 0 && !isCategoryPath &&
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <Alert severity="info" aria-label='infoAlert' sx={{ margin: 'auto', textAlign: 'left', width: 3/4 }}>
                                Click a category in the CATEGORIES column to view, add, update or delete menu items.
                                You can also edit the name of a category or delete it. 
                            </Alert> 
                        </Box>
                    }
                </Box>
            </Box>
            <Box 
                sx={{
                    backgroundColor: "white",
                    borderRadius: "0 0 15px 15px",
                    display: "flex",
                    height: '60px'
                }}
            >
                <Box sx={{ borderRight: "1px solid #caccce", borderTop: "1px solid #caccce", width: 1/3 }}>
                    <Button onClick={() => setOpenAddCategory(true)} sx={{ margin: "12.5px" }} color="success" variant="outlined">
                        <Add /> New Category
                    </Button>
                </Box>
                {isCategoryPath &&
                    <Box sx={{ borderTop: "1px solid #caccce", width: 2/3 }}>
                        <Button 
                            onClick={() => { setOpenAddItem(true) }}
                            sx={{ margin: "12.5px" }} 
                            color="success" 
                            variant="outlined"
                        >
                            <Add /> New Menu Item
                        </Button>
                    </Box>
                }
            </Box>
            {openAddCategory && <AddCategoryPopUp open={openAddCategory} setOpen={setOpenAddCategory} setCategories={setCategories} />}
            {openAddItem && <AddItemPopUp open={openAddItem} setOpen={setOpenAddItem} categoryId={params.categoryid} allIngredients={allIngredients} />}
        </Box>
    )
}

export default ManagerEditMenu;