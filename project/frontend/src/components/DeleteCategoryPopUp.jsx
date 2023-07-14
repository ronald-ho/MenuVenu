import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";
import { get_categories } from "../helpers/loaderfunctions";
import { useNavigate } from "react-router-dom";

function DeleteCategoryPopUp ({ open, setOpen, category, setCategories }) {
    const navigate = useNavigate();

    async function handleDelete() {
        const data = await apiCall("menu/category", "DELETE", { 'category_id': category.category_id });
        if (data.status === 200) {
            // make feedback alert like assistance?
            const categories = await get_categories();
            setCategories(categories);   
            navigate('/managereditmenu');
            handleClose();
            console.log("Category deleted");
        } 
        else {
            console.log("Failed to delete category");
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Delete Category"}</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the {category.name} category?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="success">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteCategoryPopUp;