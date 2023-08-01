import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

function CategoryButton ({category}) {
    return (

        <Box 
            component={NavLink}
            to={""+category.category_id}
            style={({ isActive }) => {
                return {
                    backgroundColor: isActive ? "#e4d7ec" : "white", 
                    color: "black",
                    textDecoration: "none",
                };
            }}
            sx={{
                backgroundColor: "white",
                border: "1px solid #caccce",
                borderRadius: "10px",
                display: "flex",
                gap: 0,
                height: "40px",
                justifyContent: "space-between",
                margin: "8px auto 0 auto",
                padding: 0,
                width: 9/10
            }}
        >
            <Box 
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Typography
                    sx={{ 
                        textAlign: "left",
                        padding: "8px 0 8px 10px",
                        "&:hover": { color: "#551b8c", fontWeight: "bold" },
                    }}
                >
                    {category.name}
                </Typography>
            </Box>
        </Box>
    )
}

export default CategoryButton;