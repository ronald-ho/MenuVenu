import { Box, IconButton, Typography } from "@mui/material";
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";
import { NavLink } from "react-router-dom";
import UpdateCategoryPopUp from "./UpdateCategoryPopUp";
import DeleteCategoryPopUp from "./DeleteCategoryPopUp";

function CategoryListItem ({ category }) {
    // Maybe add :hover in external stylesheet for active category
    // Make DragHandle clickable
    const [openUpdateCategory, setOpenUpdateCategory] = React.useState(false);
    const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);

    return (
        <>
            <Box  
                sx={{
                    border: 1,
                    borderRadius: "10px",
                    display: "flex",
                    height: "40px",
                    justifyContent: "space-between",
                    margin: "5px auto 0 auto",
                    padding: "0",
                    width: "19vw"
                }}
            >
                <Box 
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px"
                    }}
                >
                    <DragHandle color="secondary" />
                    <Typography
                        component={NavLink}
                        to={""+category.category_id}
                        style={({ isActive }) => {
                            return {
                                color: "black",
                                fontWeight: isActive ? "bold" : "",
                                textDecoration: "none",
                            };
                        }}
                    >
                        {category.name}
                    </Typography>
                </Box>
                <Box>
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
                />
            }
            {openDeleteCategory && 
                <DeleteCategoryPopUp 
                    open={openDeleteCategory} 
                    setOpen={setOpenDeleteCategory}
                    category={category}
                />
            }
        </>
    )
}

export default CategoryListItem;