import { Button } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

function CategoryButton ({category}) {
    return (
        <>
        <NavLink to={""+category.category_id} style={({ isActive }) => {
            return {
                fontWeight: isActive ? "bold" : "",
                margin: "10px"
            };
        }}>
            <Button variant="contained" sx={{margin: "10px"}}>
                {category.name}
            </Button>
        </NavLink>
        <br/>
        </>
    )
}

export default CategoryButton;