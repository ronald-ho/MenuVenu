import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {apiCall} from "../helpers/helpers";
import React from "react";
import {useNavigate} from "react-router-dom";

function AddItemPopUp ({ open, setOpen, categoryId, allIngredients }) {
    const  navigate = useNavigate();

    const [name, setName] = React.useState(null);
    const [price, setPrice] = React.useState(null);
    const [production, setProduction] = React.useState(null);
    const [imageData, setImageData] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [calories, setCalories] = React.useState(null);
    const [pointsToRedeem, setPointsToRedeem] = React.useState(null);
    const [pointsEarned, setPointsEarned] = React.useState(null);
    const [alert, setAlert] = React.useState('');
    let itemIngredients = [];
    
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

        const newItem = {
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

        console.log(newItem);

        const data = await apiCall("menu/item", "POST", newItem);
        if (data.item) {
            navigate(`/managereditmenu/${categoryId}`);
            handleClose();
            // make feedback alert like assistance?
            console.log("item successfully added");
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
                sx={{ margin: "auto", width: "600px" }}
            >
                <DialogTitle>Add New Item</DialogTitle>
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
                                        size="small" 
                                        sx={{ width: '250px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Price*</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
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
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setAlert(''); 
                                        }}
                                        multiline 
                                        size="small" 
                                        rows={4} 
                                        sx={{ width: '250px'}} 
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Energy</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        type="number"
                                        size="small" 
                                        onChange={(e) => {
                                            setCalories(e.target.value);
                                            setAlert(''); 
                                        }}
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
                                        type="number"
                                        size="small" 
                                        onChange={(e) => {
                                            setPointsToRedeem(e.target.value);
                                            setAlert(''); 
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                        }}
                                        sx={{ width: '160px'}}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={labelCellStyle}><Typography>Buy to earn</Typography></TableCell>
                                <TableCell sx={inputCellStyle}>
                                    <TextField 
                                        type="number"
                                        size="small" 
                                        onChange={(e) => {
                                            setPointsEarned(e.target.value);
                                            setAlert(''); 
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">MV points</InputAdornment>,
                                        }}
                                        sx={{ width: '160px'}}
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
                                            control={<Checkbox />} 
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
                    <Button type="submit" variant="contained" color="success">Add</Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default AddItemPopUp;