import React from 'react';
import { Button, TableCell, TableRow } from '@mui/material';
import { Check } from '@mui/icons-material';
import ConfirmServePopUp from './ConfirmServePopUp';

function WaitstaffOrderRow ({ orderItem, setOrderItemsToServe }) {
    const [openConfirmServe, setOpenConfirmServe] = React.useState(false);

    return (
        <>
            <TableRow>
                <TableCell>{orderItem.item_name}</TableCell>
                <TableCell>{orderItem.table_number}</TableCell>
                <TableCell>
                    <Button variant='text' onClick={() => setOpenConfirmServe(true)}>SERVE ITEM<Check/></Button>
                </TableCell>
            </TableRow>
            {openConfirmServe && <ConfirmServePopUp open={openConfirmServe} setOpen={setOpenConfirmServe} orderItem={orderItem} setOrderItemsToServe={setOrderItemsToServe} />}
        </>
    );
}

export default WaitstaffOrderRow;