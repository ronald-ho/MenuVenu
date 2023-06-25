import { Box } from "@mui/material";
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import CategoryButton from "../components/CategoryButton";

function Menu () {
    const categories = useLoaderData();

    return (
        <div style={{display: "flex"}}>
            <Box sx={{border: "1px solid black", margin: "10px", padding: "10px", textAlign: "center"}}>
                {categories.map((category) => <CategoryButton key={category.category_id} category={category}/>)}
            </Box>
            <Outlet />
            {/*rename to table order thing*/}
            <Box>

            </Box>
        </div>
    )
}

export default Menu;