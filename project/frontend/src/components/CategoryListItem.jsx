import { Box, IconButton, Typography } from "@mui/material";
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";
import { NavLink } from "react-router-dom";
import UpdateCategoryPopUp from "./UpdateCategoryPopUp";
import DeleteCategoryPopUp from "./DeleteCategoryPopUp";

function CategoryListItem ({ category, setCategories}) {
    // Make DragHandle clickable
    const [openUpdateCategory, setOpenUpdateCategory] = React.useState(false);
    const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);
   
    return (
        <>
            <Box  
                sx={{
                    backgroundColor: "white",
                    border: 1,
                    borderRadius: "10px",
                    display: "flex",
                    gap: 0,
                    height: "40px",
                    justifyContent: "space-between",
                    margin: "5px auto 0 auto",
                    padding: "0",
                    width: "23vw"
                }}
            >
                <Box 
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        
                    }}
                >
                    <DragHandle color="secondary" />
                    <Typography
                        sx={{ 
                            textAlign: "left",
                            padding: "8px 0 8px 10px",
                            width: "15.5vw",
                            verticalAlign: "middle",
                            "&:hover": { color: "#551b8c", fontWeight: "bold" } 
                        }}
                        component={NavLink}
                        to={""+category.category_id}
                        style={({ isActive }) => {
                            return {
                                backgroundColor: isActive ? "#e4d7ec" : "white", 
                                color: isActive ? "#551b8c" : "black",
                                fontWeight: isActive ? "bold" : "",
                                textDecoration: "none",
                            };
                        }}
                    >
                        {category.name}
                    </Typography>
                </Box>
                <Box sx={{ width: "80px" }}>
                    <IconButton aria-label="edit"> 
                        <Edit onClick={() => setOpenUpdateCategory(true)} sx={{ color: "black" }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <Delete onClick={() => setOpenDeleteCategory(true)} color="error"/>
                    </IconButton>
                </Box>
            </Box> 
            {openUpdateCategory && 
                <UpdateCategoryPopUp 
                    open={openUpdateCategory} 
                    setOpen={setOpenUpdateCategory}
                    category={category}
                    setCategories={setCategories}
                />
            }
            {openDeleteCategory && 
                <DeleteCategoryPopUp 
                    open={openDeleteCategory} 
                    setOpen={setOpenDeleteCategory}
                    category={category}
                    setCategories={setCategories}
                />
            }
        </>
    )
}

export default CategoryListItem;