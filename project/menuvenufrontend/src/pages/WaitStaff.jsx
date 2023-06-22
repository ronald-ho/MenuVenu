import React from "react";
// import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function WaitStaff () {
    // const navigate = useNavigate();

    // polling for order items ready and assistance required
    // monitor db for new fields in relevant tables etc.
    // https://mui.com/material-ui/react-table/
    return (
        <>
            <Table sx={{ margin: 'auto', maxWidth: 600 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ borderLeft: 1, borderRight: 1}}>ORDER ITEM READY</TableCell>
                        <TableCell sx={{ borderRight: 1}}>TABLE NO.</TableCell>
                    </TableRow>
                </TableHead> 
                <TableBody>
                    <TableRow>Insert row</TableRow>
                </TableBody>
            </Table>
            <b>ASSISTANCE REQUIRED</b>
        </>
    );
}

export default WaitStaff;