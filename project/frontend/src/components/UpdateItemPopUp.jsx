import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { apiCall } from "../helpers/helpers";
import React from "react";
import { useNavigate } from "react-router-dom";

function UpdateItemPopUp ({ open, setOpen, categoryId, item, allIngredients }) {
    const  navigate = useNavigate();

    const [name, setName] = React.useState(item.name);
    const [price, setPrice] = React.useState(item.price);
    const [production, setProduction] = React.useState(item.production);
    const [imageData, setImageData] = React.useState(item.image);
    const [description, setDescription] = React.useState(item.description);
    const [calories, setCalories] = React.useState(item.calories);
    const [pointsToRedeem, setPointsToRedeem] = React.useState(item.points_to_redeem);
    const [pointsEarned, setPointsEarned] = React.useState(item.points_earned);
    const [itemIngredients, setItemIngredients] = React.useState(item.ingredients);

    const [alert, setAlert] = React.useState('');
    
    async function handleSubmit(e) {
        e.preventDefault();

        if (!name) {
            setAlert("Please enter an item name");
            return;
        }

        if (!price || parseFloat(price) <= 0 ) {
            setAlert("Please enter a price greater than 0");
            return;
        }

        if (!production || parseFloat(production) <= 0) {
            setAlert("Please enter a production cost greater than 0");
            return;
        }

        if (calories && parseFloat(calories) <= 0 ) {
            setAlert("Calories must be greater than 0");
            return;
        }

        if (pointsToRedeem && parseFloat(pointsToRedeem) <= 0) {
            setAlert("Points to redeem must be greater than 0");
            return;
        }

        if (pointsEarned && parseFloat(pointsEarned) <= 0) {
            setAlert("Points earned must be greater than 0");
            return;
        }

        console.log(itemIngredients);
        const updatedItem = {
            'id': item.id,
            'category_id': categoryId,
            'name': name,
            'price': price,
            'production': production,
            'image': imageData === '' ? null : imageData,
            'description': description === '' ? null : description,
            'calories': calories === '' ? null : calories,
            'points_to_redeem': pointsToRedeem === '' ? null : pointsToRedeem,
            'points_earned': pointsEarned === '' ? null : pointsEarned,
            'ingredients': itemIngredients
        };

        console.log(updatedItem);

        const data = await apiCall("menu/item", "PUT", updatedItem);
        if (data.status === 200) {
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
            }
            reader.readAsDataURL(file);
        } 
    }

    function handleCheckIngredient (ingredientState, ingredientName) {
        if (ingredientState) {
            const newIngredients = [...itemIngredients];
            newIngredients.push(ingredientName);
            setItemIngredients(newIngredients);
        }
        else {
            const newIngredients = itemIngredients.filter(i => i !== ingredientName);
            setItemIngredients(newIngredients);
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
                sx={{ margin: "auto", width: "560px" }}
            >
                <DialogTitle>Update Item</DialogTitle>
                <form onSubmit={(e) => handleSubmit(e)}>
                <DialogContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Name*</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setAlert(''); 
                                        }}
                                        value={name}
                                        size="small" 
                                        sx={{ width: '270px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Price*</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={price}
                                        type="number"
                                        inputProps={{
                                            step: 0.01
                                        }}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            setAlert(''); 
                                        }}
                                        size="small" 
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        sx={{ width: '120px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Production cost*</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={production}
                                        type="number"
                                        inputProps={{
                                            step: 0.01
                                        }}
                                        onChange={(e) => {
                                            setProduction(e.target.value);
                                            setAlert(''); 
                                        }}
                                        size="small" 
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        sx={{ width: '120px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Image</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    {item.image && 
                                    <>
                                        <Typography>Current uploaded image</Typography>
                                        <img src={item.image} alt={item.name} style={{ margin: "auto", maxWidth: "100px", maxHeight: "100px" }} />
                                    </>
                                    }
                                    <input 
                                        onChange={(e) => {
                                            handleImageInput(e);
                                            setAlert(''); 
                                        }}
                                        type="file" 
                                        accept="image/jpeg, image/png, image/jpg"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Description</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setAlert(''); 
                                        }}
                                        multiline 
                                        size="small" 
                                        rows={4} 
                                        sx={{ width: '270px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Energy</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={calories}
                                        type="number"
                                        onChange={(e) => {
                                            setCalories(e.target.value);
                                            setAlert(''); 
                                        }}
                                        size="small" 
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">calories</InputAdornment>,
                                        }}
                                        sx={{ width: '160px'}}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Redeem using</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={pointsToRedeem}
                                        type="number"
                                        onChange={(e) => {
                                            setPointsToRedeem(e.target.value);
                                            setAlert(''); 
                                        }}
                                        size="small" 
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                        }}
                                        sx={{ width: '175px'}}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Buy to earn</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        value={pointsEarned}
                                        type="number"
                                        onChange={(e) => {
                                            setPointsEarned(e.target.value);
                                            setAlert(''); 
                                        }}
                                        size="small" 
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                        }}
                                        sx={{ width: '175px'}}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Dietary tags</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    {allIngredients.map((ingredient, index) => (
                                        <FormControlLabel 
                                            key={index}
                                            onChange={(e) => {
                                                handleCheckIngredient(e.target.checked, ingredient);
                                                setAlert(''); 
                                            }}
                                            control={<Checkbox checked={itemIngredients.includes(ingredient)}/>} 
                                            label={ingredient} 
                                        />                         
                                    ))}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {alert && <Alert severity="error" aria-label='errorAlert'>{alert}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
                    <Button type="submit" variant="contained" color="success">Update</Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default UpdateItemPopUp;