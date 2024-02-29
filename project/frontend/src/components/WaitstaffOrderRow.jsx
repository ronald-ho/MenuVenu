import { Check } from '@mui/icons-material';
import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import ConfirmServePopUp from './ConfirmServePopUp';

function WaitstaffOrderRow ({
  orderItem,
  setOrderItemsToServe,
  tables
}) {
  const [openConfirmServe, setOpenConfirmServe] = React.useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{orderItem.item_name}</TableCell>
        <TableCell>{tables.find(obj => {
          return obj.table_id === orderItem.table_number
        }).table_number}</TableCell>
        <TableCell>
          <Button variant='text' onClick={() => setOpenConfirmServe(true)}>SERVE ITEM<Check/></Button>
        </TableCell>
      </TableRow>
      {openConfirmServe &&
        <ConfirmServePopUp open={openConfirmServe} setOpen={setOpenConfirmServe} orderItem={orderItem}
          setOrderItemsToServe={setOrderItemsToServe}/>}
    </>
  );
}

export default WaitstaffOrderRow;
