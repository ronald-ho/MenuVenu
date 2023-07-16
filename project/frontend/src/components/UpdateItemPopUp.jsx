import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, Table, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";
import { useNavigate } from "react-router-dom";

function UpdateItemPopUp ({ open, setOpen, categoryId, item }) {
    const  navigate = useNavigate();

    const [name, setName] = React.useState(item.name);
    const [price, setPrice] = React.useState(item.price);
    const [imageData, setImageData] = React.useState(null);
    const [imageFilename, setImageFilename] = React.useState([]);
    const [description, setDescription] = React.useState(item.description);
    const [calories, setCalories] = React.useState(item.calories);
    const [pointsToRedeem, setPointsToRedeem] = React.useState(item.points_to_redeem);
    const [pointsEarned, setPointsEarned] = React.useState(item.points_earned);
    let itemIngredients = item.ingredients;
    const [alert, setAlert] = React.useState('');
    const [allIngredients, setAllIngredients] = React.useState([]);

    React.useEffect(() => {
        const getAllIngredients = async () => {
            const data = await apiCall("menu/ingredients", "GET", {});
            if (data.message === 200) {
                setAllIngredients(data.ingredients);
            }
        }
        
        getAllIngredients();
    }, []);
    
    async function handleSubmit(e) {
        e.preventDefault();

        if (parseInt(price) === 0) {
            setAlert("Please enter a valid price");
            return;
        }

        const updatedItem = {
            'category_id': categoryId,
            'name': name,
            'price': price,
            'image': imageData,
            // 'filename' : imageFilename,
            'description': description,
            'calories': calories,
            'points_to_redeem': pointsToRedeem,
            'points_earned': pointsEarned,
            'ingredients': itemIngredients
        };

        console.log(updatedItem);

        const data = await apiCall("menu/item", "PUT", updatedItem);
        if (data.item) {
            navigate(`/managereditmenu/${categoryId}`);
            handleClose();
            // make feedback alert like assistance?
            console.log("item successfully updated");
        } 
        else {
            setAlert(data.message);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    function handleImageInput (e) {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                console.log(imageData);
                setImageData(imageData);
                // setImageFilename(file.name);
            }
            reader.readAsDataURL(file);
        } 
    }

    function handleCheckIngredient (ingredientState, ingredientName) {
        if (ingredientState) {
            itemIngredients.push(ingredientName);
        }
        else {
            itemIngredients = itemIngredients.filter(i => i !== ingredientName);
        } 
    }

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
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Update Item</DialogTitle>
                <form onSubmit={(e) => handleSubmit(e)}>
                <DialogContent>
                    <Table>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Name</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    size="small" 
                                    sx={{ width: '254px'}} 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Price</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    value={price}
                                    type="number"
                                    inputProps={{
                                        step: 0.01
                                    }}
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
                                    // fix this
                                    value={image} 
                                    onChange={(e) => handleImageInput(e)}
                                    type="file" 
                                    accept="image/jpeg, image/png, image/jpg"
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
                                    type="number"
                                    onChange={(e) => setCalories(e.target.value)}
                                    size="small" 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">calories</InputAdornment>,
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={labelCellStyle}><Typography>Redeem using</Typography></TableCell>
                            <TableCell sx={inputCellStyle}>
                                <TextField 
                                    type="number"
                                    onChange={(e) => setPointsToRedeem(e.target.value)}
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
                                    type="number"
                                    onChange={(e) => setPointsEarned(e.target.value)}
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
                                {allIngredients.map((ingredient, index) => {
                                    itemIngredients.includes(ingredient) ? (
                                        <FormControlLabel 
                                            key={index}
                                            onChange={(e) => handleCheckIngredient(e.target.checked, ingredient)}
                                            control={<Checkbox defaultChecked />} 
                                            label={ingredient} 
                                        />
                                    ) : (
                                        <FormControlLabel 
                                            key={index}
                                            onChange={(e) => handleCheckIngredient(e.target.checked, ingredient)}
                                            control={<Checkbox />} 
                                            label={ingredient} 
                                        />
                                    )
                                })}
                            </TableCell>
                        </TableRow>
                    </Table>
                    {alert && <Alert severity="error" aria-label='errorAlert'>{alert}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                    <Button type="submit" variant="contained" color="success">Add</Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default UpdateItemPopUp;