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

function AddItemPopUp ({ open, setOpen, categoryId }) {
    const  navigate = useNavigate();

    const [name, setName] = React.useState(null);
    const [price, setPrice] = React.useState(null);
    const [imageData, setImageData] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [calories, setCalories] = React.useState(null);
    const [pointsToRedeem, setPointsToRedeem] = React.useState(null);
    const [pointsEarned, setPointsEarned] = React.useState(null);
    const [alert, setAlert] = React.useState('');
    const [allIngredients, setAllIngredients] = React.useState([]);
    let itemIngredients = [];

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
        
        if (name === "") {
            setAlert("Please enter an item name");
            return;
        }

        if (!price || parseInt(price) === 0) {
            setAlert("Please enter a valid price");
            return;
        }

        const newItem = {
            'category_id': categoryId,
            'name': name,
            'price': price,
            'image': imageData,
            'description': description,
            'calories': calories,
            'points_to_redeem': pointsToRedeem,
            'points_earned': pointsEarned,
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
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Add New Item</DialogTitle>
                <form onSubmit={(e) => handleSubmit(e)}>
                <DialogContent>
                    <Table>
                        <TableBody>
                        </TableBody>
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
                                {allIngredients.map((ingredient, index) => (
                                    <FormControlLabel 
                                        key={index}
                                        onChange={(e) => handleCheckIngredient(e.target.checked, ingredient)}
                                        control={<Checkbox />} 
                                        label={ingredient} 
                                    />
                                ))}
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

export default AddItemPopUp;