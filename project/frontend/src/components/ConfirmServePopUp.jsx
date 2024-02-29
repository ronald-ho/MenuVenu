import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import { apiCall } from '../helpers/helpers';

function ConfirmServePopUp ({
  open,
  setOpen,
  orderItem,
  setOrderItemsToServe
}) {
  async function handleConfirm () {
    const data = await apiCall('/orders/waitstaff/served', 'POST', { ordered_item_id: orderItem.ordered_item_id });
    console.log(data);
    if (data.status === 200) {
      const response = await apiCall('/orders/get_serve_list', 'GET', {});
      console.log(data);
      if (response.serve_list) {
        setOrderItemsToServe(response.serve_list);
        console.log(response.serve_list);
        handleClose();
      }
    } else {
      console.log('Failed to serve');
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
        <DialogTitle>{'Confirm Order Item Served'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Have you served item {orderItem.item_name} to
            Table {orderItem.table_number}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleConfirm} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmServePopUp;
