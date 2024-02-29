import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import { apiCall } from '../helpers/helpers';
import { getCategories } from '../helpers/loaderfunctions';

function UpdateCategoryPopUp ({
  open,
  setOpen,
  category,
  setCategories
}) {
  const [newName, setNewName] = React.useState(category.name);
  const [alert, setAlert] = React.useState('');

  async function handleUpdate () {
    if (newName === '') {
      setAlert('Please enter a category name');
      return;
    }

    const data = await apiCall('menu/category', 'PUT', {
      category_id: category.category_id,
      name: newName
    });
    if (data.status === 200) {
      // make feedback alert like assistance?
      const categories = await getCategories();
      setCategories(categories);
      handleClose();
      console.log('Category successfully updated');
    } else {
      setAlert(data.message);
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
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <TextField
            label='Update category name'
            variant='outlined'
            margin='normal'
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained' color='success'>Update</Button>
        </DialogActions>
        {alert && <Alert severity='error' aria-label='errorAlert'>{alert}</Alert>}
      </Dialog>
    </>
  )
}

export default UpdateCategoryPopUp;
