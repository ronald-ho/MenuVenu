import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, Table, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";

function AddItemPopUp ({ open, setOpen }) {
    const [itemName, setItemName] = React.useState('');
    const [alert, setAlert] = React.useState('');

    async function handleAdd() {
        if (itemName === "") {
            setAlert("Please enter an item name");
            return;
        }

        const data = await apiCall("menu/items", "POST", { 'name': itemName });
        if (data.category) {
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
                <DialogContent>
                <Table>
                    <TableRow>
                        <TableCell sx={labelCellStyle}><Typography>Name*</Typography></TableCell>
                        <TableCell sx={inputCellStyle}>
                            <TextField required size="small" sx={{ width: '254px'}} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={labelCellStyle}><Typography>Cost*</Typography></TableCell>
                        <TableCell sx={inputCellStyle}>
                            <TextField 
                                required
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
                            <input type="file" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={labelCellStyle}><Typography>Description</Typography></TableCell>
                        <TableCell sx={inputCellStyle}>
                            <TextField multiline size="small" rows={4} sx={{ width: '254px'}} />
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

export default AddItemPopUp;