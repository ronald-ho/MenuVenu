import React from 'react';
import { apiCall } from '../helpers/helpers';
import { Button, TableCell, TableRow } from '@mui/material';
import { Check } from '@mui/icons-material';
import ConfirmServePopUp from './ConfirmServePopUp';

function WaitstaffOrderRow ({ orderItem }) {
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
            {openConfirmServe && <ConfirmServePopUp open={openConfirmServe} setOpen={setOpenConfirmServe} orderItem={orderItem} />}
        </>
    );
}

export default WaitstaffOrderRow;