import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, Table, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";

function AddItemPopUp ({ open, setOpen, categoryId }) {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [image, setImage] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [calories, setCalories] = React.useState('');
    const [alert, setAlert] = React.useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(image);
        if (name === "") {
            setAlert("Please enter an item name");
            return;
        }

        if (price === "" || parseInt(price) === 0) {
            setAlert("Please enter a valid price");
            return;
        }

        const newItem = {
            'category_id': categoryId,
            'name': name,
            'price': price,
            'image': image,
            'description': description,
            // 'calories': calories,
            // 'points': points
            // redeem with, buy to earn
            // dietary tags...
        };

        const data = await apiCall("menu/items", "POST", newItem);
        if (data.item) {
            // make feedback alert like assistance?
            console.log("item successfully added");
        } 
        else {
            console.log("Failed to add item");
        }
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const labelCellStyle = {
        border: 0,
        padding: '5px',
        width: 1/3
    };

    const inputCellStyle = {
        border: 0,
        padding: '5px',
        width: 2/3
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleCancel}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>{"Add New Item"}</DialogTitle>
                <form onSubmit={(e) => handleSubmit(e)}>
                <DialogContent>
                
                    <Table>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Name*</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    onChange={(e) => setName(e.target.value)}
                                    size="small" 
                                    sx={{ width: '254px'}} 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Price*</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    onChange={(e) => setPrice(e.target.value)}
                                    size="small" 
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    sx={{ width: '254px'}} 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Image</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <input 
                                    onChange={(e) => setImage(e.target.value)}
                                    type="file" 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Description</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline 
                                    size="small" 
                                    rows={4} 
                                    sx={{ width: '254px'}} 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Energy</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    size="small" 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">calories</InputAdornment>,
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Buy using</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    size="small" 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Buy to earn</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    size="small" 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Dietary tags</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <FormControlLabel control={<Checkbox />} label="Vegetarian" />
                                <FormControlLabel control={<Checkbox />} label="Nuts" />
                                <FormControlLabel control={<Checkbox />} label="Dairy" />
                                <FormControlLabel control={<Checkbox />} label="Spicy" />
                            </TableCell>
                        </TableRow>
                    </Table>
                    {alert && <Alert severity="error" aria-label='errorAlert'>{alert}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
                    <Button type="submit" variant="contained" color="success">Add</Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default AddItemPopUp;