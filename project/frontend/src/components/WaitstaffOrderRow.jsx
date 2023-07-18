import React from 'react';
import { apiCall } from '../helpers/helpers';
import { Button, TableCell, TableRow } from '@mui/material';
import { Check } from '@mui/icons-material';

function WaitstaffOrderRow ( {orderItem} ) {
    function handleConfirmServe () {
        // apicall
    }

    return (
        <TableRow>
            <TableCell>{orderItem.item_name}</TableCell>
            <TableCell>{orderItem.table_number}</TableCell>
            <TableCell>
                <Button variant='text' onClick={handleConfirmServe}>YES<Check/></Button>
            </TableCell>
        </TableRow>
    );
}

export default WaitstaffOrderRow;