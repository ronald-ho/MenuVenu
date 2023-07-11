import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";

function AddCategoryPopUp ({ open, setOpen }) {
    const [categoryName, setCategoryName] = React.useState('');
    const [alert, setAlert] = React.useState('');

    async function handleAdd() {
        if (categoryName === "") {
            setAlert("Please enter a category name");
            return;
        }

        const data = await apiCall("menu/categories", "POST", { 'name': categoryName });
        if (data.category) {
            // make feedback alert like assistance?
            console.log("Category successfully added");
        } 
        else {
            console.log("Failed to add category");
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
                <DialogTitle>{"Add New Category"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="New category name"
                        variant="outlined" 
                        margin="normal"
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleAdd} variant="contained" color="success">Add</Button>
                </DialogActions>
                {alert && <Alert severity="error" aria-label='errorAlert'>{alert}</Alert>}
            </Dialog>
        </>
    )
}

export default AddCategoryPopUp;