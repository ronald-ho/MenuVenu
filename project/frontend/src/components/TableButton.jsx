import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function TableButton ({ table }) {
    const greenboxcss = { display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px', height: '50px', verticalAlign: 'top', backgroundColor: "green" };
    
    const redboxcss = { display: 'inline-block', width: '20%', padding: '10px', border: '1px black solid', margin: '10px', height: '50px', verticalAlign: 'top', backgroundColor: "red" };
    const is_occupied = table.occupied;
    const nav = useNavigate();

    async function handleClick() {
        localStorage.setItem("mvtable", table.table_number);
        await apiCall("orders/select_table", "POST", { 'table_number' : table.table_number });
        nav('/menu/1');
    }

    return (
        <>
        {is_occupied ? <Box component={Button} disabled sx={redboxcss}>Table {table.table_number}</Box> : <Box component={Button} onClick={handleClick} sx={greenboxcss}>Table {table.table_number}</Box>}
        </>
    )
}

export default TableButton;