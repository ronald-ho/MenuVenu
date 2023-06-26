import { Box, Button } from "@mui/material";
import React from "react";

function TableButton ({ table }) {
    const greenboxcss = { display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px', height: '50px', verticalAlign: 'top', backgroundColor: "green" };

    return (
        <Box component={Button} sx={greenboxcss}>Table {table.table_id}</Box>
    )
}

export default TableButton;