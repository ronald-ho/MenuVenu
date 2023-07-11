import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";

function DeleteCategoryPopUp ({ open, setOpen, id, name }) {
    async function handleDelete() {
        const data = await apiCall("menu/categories", "DELETE", { 'category_id': id });
        if (data.category) {
            // make feedback alert like assistance?
            console.log("Category deleted");
        } 
        else {
            console.log("Failed to delete category");
        }
    }

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleCancel}
            >
                <DialogTitle>{"Delete Category"}</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the {name} category?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="success">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteCategoryPopUp;