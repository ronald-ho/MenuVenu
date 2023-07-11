import { Box, IconButton, Typography } from "@mui/material";
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";
import { NavLink } from "react-router-dom";
import UpdateCategoryPopUp from "./UpdateCategoryPopUp";

function CategoryListItem ({ category }) {
    // Maybe add :hover in external stylesheet for active category
    // Make DragHandle clickable
    const [openUpdateCategory, setOpenUpdateCategory] = React.useState(false);

    return (
        <>
            <Box  
                sx={{
                    border: 1,
                    borderRadius: 0,
                    display: "flex",
                    height: "40px",
                    justifyContent: "space-between",
                    margin: "0 0 2px 0",
                    padding: "0",
                    width: "20vw"
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
                        to={""+category}
                        style={({ isActive }) => {
                            return {
                                color: "black",
                                fontWeight: isActive ? "bold" : "",
                                textDecoration: "none",
                            };
                        }}
                    >
                        {category}
                    </Typography>
                </Box>
                <Box>
                    <IconButton aria-label="edit"> 
                        <Edit onClick={() => setOpenUpdateCategory(true)} sx={{ color: "black" }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <Delete color="error"/>
                    </IconButton>
                </Box>
            </Box> 
            {openUpdateCategory && 
                <UpdateCategoryPopUp 
                    open={openUpdateCategory} 
                    setOpen={setOpenUpdateCategory}
                    currCategory={category}
                />
            }
        </>
    )
}

export default CategoryListItem;