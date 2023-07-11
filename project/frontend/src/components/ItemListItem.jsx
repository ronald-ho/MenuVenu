import { Box, IconButton, Typography } from "@mui/material";
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";

function ItemListItem ({ item }) {
    // Maybe add :hover in external stylesheet
    // Make DragHandle clickable
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
                    width: "49vw"
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
                    <Typography>{item.name}</Typography>
                </Box>
                <Box>
                    <IconButton aria-label="edit"> 
                        <Edit sx={{ color: "black" }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <Delete color="error"/>
                    </IconButton>
                </Box>
            </Box> 
        </>
    )
}

export default ItemListItem;