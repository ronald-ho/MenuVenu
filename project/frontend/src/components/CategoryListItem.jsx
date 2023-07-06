import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material"
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";
import { NavLink } from "react-router-dom";

function CategoryListItem ({ category }) {
    // ""+category.category_id
    return (
        <>
            <Test
                onClick={() => {
                    console.log("lol");
                }}
                sx={{
                    border: 1,
                    borderRadius: 0,
                    cursor: "pointer",  
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
                    <Typography>{category}</Typography>
                </Box>
                <Box>
                    <IconButton aria-label="edit"><Edit sx={{ color: "black" }} /></IconButton>
                    <IconButton aria-label="delete"><Delete color="error"/></IconButton>
                </Box>
            </Test> 
        </>
    )
}

const Test = styled(Box)({
    border: 1,
    borderRadius: 0,
    cursor: "pointer",  
    display: "flex",
    height: "40px",
    justifyContent: "space-between",
    margin: "0 0 2px 0",
    padding: "0",
    width: "20vw",
    '&:hover': {
        color: "blue",
        fontWeight: "bold"
    },
    '&:active': {
        fontWeight: "bold"
    }
});

export default CategoryListItem;