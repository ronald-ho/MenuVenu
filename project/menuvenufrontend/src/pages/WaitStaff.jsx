import React from "react";
// import { useNavigate } from "react-router-dom";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssistReqTableButton from "../components/AssistReqTableButton";

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
                        <TableCell sx={{ borderLeft: 1, borderRight: 1}}><b>ORDER ITEM READY</b></TableCell>
                        <TableCell sx={{ borderRight: 1}}><b>TABLE NO.</b></TableCell>
                    </TableRow>
                </TableHead> 
                <TableBody>
                    <TableRow>Insert row</TableRow>
                </TableBody>
            </Table>

            <Box
                sx={{
                    border: 1,
                    borderTop: 0,
                    fontSize: '15px',
                    position: 'absolute',
                    textAlign: 'center',
                    top: '81.6px',
                    right: 0,
                    width: '130px',
                    height: 'calc(100vh - 81.6px)',
                }}
            >
                <Typography sx={{
                    fontWeight: 'bold',
                    padding: '15px 10px',
                }}>ASSISTANCE REQUIRED</Typography>
                <Table sx={{ overflow: 'auto' }}> 
                    <TableBody>
                        <TableRow><AssistReqTableButton table={1}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={2}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={1}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={2}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={1}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={2}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={1}></AssistReqTableButton></TableRow>
                        <TableRow><AssistReqTableButton table={2}></AssistReqTableButton></TableRow>
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}

export default WaitStaff;