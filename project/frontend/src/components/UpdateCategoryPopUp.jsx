import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";

function UpdateCategoryPopUp ({ open, setOpen, id, currName }) {
    const [newName, setNewName] = React.useState(currName);
    const [alert, setAlert] = React.useState('');

    async function handleUpdate() {
        if (newName === "") {
            setAlert("Please enter a category name");
            return;
        }

        const data = await apiCall("menu/categories", "PUT", { 'id': id, 'name': newName });
        if (data.category) {
            // make feedback alert like assistance?
            console.log("Category successfully updated");
        } 
        else {
            console.log("Failed to update category");
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
                <DialogTitle>{"Update Category"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Update category name"
                        variant="outlined" 
                        margin="normal"
                        value={newName}
                        onChange={(e) => {
                            setNewName(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color="success">Update</Button>
                </DialogActions>
                {alert && <Alert severity="error" aria-label='errorAlert'>{alert}</Alert>}
            </Dialog>
        </>
    )
}

export default UpdateCategoryPopUp;