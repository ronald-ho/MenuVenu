import { Box, IconButton, Typography } from "@mui/material";
import { Delete, DragHandle, Edit } from '@mui/icons-material';
import React from "react";
import ItemInfoPopUp from "./ItemInfoPopUp";
import UpdateItemPopUp from "./UpdateItemPopUp";
import DeleteItemPopUp from "./DeleteItemPopUp";

function ItemListItem ({ categoryId, item }) {
    // Make DragHandle clickable
    const [openItemInfo, setOpenItemInfo] = React.useState(false);
    const [openUpdateItem, setOpenUpdateItem] = React.useState(false);
    const [openDeleteItem, setOpenDeleteItem] = React.useState(false);
    
    return (
        <>
            <Box  
                onClick={() => setOpenItemInfo(true)}
                sx={{
                    border: 1,
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    height: "40px",
                    justifyContent: "space-between",
                    margin: "5px auto 0 auto",
                    padding: "0",
                    width: "43vw"
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
                    <Typography sx={{ "&:hover": { color: "#551b8c", fontWeight: "bold" }, cursor: "pointer" }}>{item.name}</Typography>
                </Box>
                <Box>
                    <IconButton 
                        aria-label="edit"  
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenUpdateItem(true);
                        }}
                    > 
                        <Edit sx={{ color: "black" }} />
                    </IconButton>
                    <IconButton 
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenDeleteItem(true);
                        }}
                    >
                        <Delete color="error"/>
                    </IconButton>
                </Box>
            </Box> 
            {openItemInfo && <ItemInfoPopUp open={openItemInfo} setOpen={setOpenItemInfo} item={item} />}
            {openUpdateItem && <UpdateItemPopUp open={openUpdateItem} setOpen={setOpenUpdateItem} categoryId={categoryId} item={item} />}
            {openDeleteItem && <DeleteItemPopUp open={openDeleteItem} setOpen={setOpenDeleteItem} categoryId={categoryId} item={item} />}
        </>
    )
}

export default ItemListItem;