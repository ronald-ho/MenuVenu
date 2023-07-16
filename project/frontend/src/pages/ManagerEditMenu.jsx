import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Add } from '@mui/icons-material';
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";

function ManagerEditMenu () {

    const [categories, setCategories] = React.useState(useLoaderData());
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
   
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
                <Box sx={{ height: "68vh", padding: "0 0 5px 0", overflow: "auto" }}>
                    {categories && categories.map((category) => (
                        <CategoryListItem 
                            key={category.category_id} 
                            category={category} 
                            setCategories={setCategories} 
                        />
                    ))}
                </Box>
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