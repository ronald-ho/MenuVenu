import React from 'react';
import { apiCall } from '../helpers/helpers';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function WaitstaffOrderRow ( {orderItem} ) {
    function handleConfirmServe () {
        // apicall
    }

    return (
        <>
            <TableCell>{orderItem.item_name}</TableCell>
            <TableCell>{orderItem.table_number}</TableCell>
            <TableCell>
                <Button variant='text' onClick={handleConfirmServe}>YES</Button>
            </TableCell>
        </>
    );
}

export default WaitstaffOrderRow;