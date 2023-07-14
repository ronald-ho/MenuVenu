import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Add } from '@mui/icons-material';
import { apiCall } from "../helpers/helpers";
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";
import AddItemPopUp from "../components/AddItemPopUp";

function ManagerEditMenu () {
    const [categories, setCategories] = React.useState(useLoaderData());
    const [activeCategory, setActiveCategory] = React.useState('');
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
    const [openAddItem, setOpenAddItem] = React.useState(false);

    // React.useEffect(() => {
    //     const get_categories = async () => {
    //         const response = await apiCall("menu/categories", "GET", {});
    //         console.log("DATA")
    //         console.log(response.categories);
    //         if (response.status == 200) {
    //             setCategories(response.categories);
    //             console.log("TEST");
    //             console.log(categories);
    //         } else {
    //             setCategories([]);
    //             console.log("TEST2");
    //             console.log(categories);
    //         }
    //     }  
    //     get_categories();
        
    // }, []);

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
            <Box sx={{ borderRight: 1, width: "21vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0"}}>CATEGORIES</Box>
                <Box sx={{ height: "68vh", padding: "0 0 5px 0", overflowY: "scroll" }}>
                    {categories && categories.map((category) => (
                        <CategoryListItem key={category.category_id} category={category} setCategories={setCategories} />
                    ))}
                </Box>
                <Box sx={{ borderTop: 1 }}>
                    <Button onClick={() => setOpenAddCategory(true)} sx={{ margin: "8px" }} color="success" variant="outlined">
                        <Add /> New Category
                    </Button>
                </Box>
            </Box>
            <Box sx={{ width: "49vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0" }}>MENU ITEMS</Box>
                <Box>
                    <Outlet />
                </Box>
                <Button 
                    onClick={() => {
                        const path = window.location.pathname;
                        const n = path.lastIndexOf('/');
                        const activeCategoryId = path.substring(n + 1);
                        setActiveCategory(activeCategoryId);
                        setOpenAddItem(true);
                    }}
                    sx={{ margin: "10px" }} 
                    color="success" 
                    variant="outlined"
                >
                    <Add /> New Menu Item
                </Button>
            </Box>
            {openAddCategory && <AddCategoryPopUp open={openAddCategory} setOpen={setOpenAddCategory} setCategories={setCategories} />}
            {openAddItem && <AddItemPopUp open={openAddItem} setOpen={setOpenAddItem} categoryId={activeCategory} />}
        </Box>
    )
}

export default ManagerEditMenu;