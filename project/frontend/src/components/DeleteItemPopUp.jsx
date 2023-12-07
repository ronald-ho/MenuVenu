import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';

function DeleteItemPopUp ({
  open,
  setOpen,
  categoryId,
  item
}) {
  const navigate = useNavigate();

  async function handleDelete () {
    const data = await apiCall('menu/item', 'DELETE', { item_id: item.id });
    if (data.status === 200) {
      // make feedback alert like assistance?
      navigate(`/managereditmenu/${categoryId}`);
      handleClose();
      console.log('item deleted');
    } else {
      console.log('Failed to delete item');
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
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>Are you sure you want to delete the {item.name} item?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
          <Button onClick={handleDelete} variant='contained' color='success'>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteItemPopUp;
