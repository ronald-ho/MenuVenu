import {Button, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";
import {apiCall} from "../helpers/helpers";
import RestaurantIcon from '@mui/icons-material/Restaurant';

function TableButton ({ table }) {
    const is_occupied = table.is_occupied;
    const nav = useNavigate();

    async function handleClick() {
        localStorage.setItem("mvtable", table.table_number);
        await apiCall("orders/select_table", "POST", { 'table_number' : table.table_number });
        nav('/menu/1');
    }

    return (
        <Button variant="contained" size="large"
            onClick={handleClick}
            disabled={is_occupied}
            sx={{
                width: '300px',
                backgroundColor: is_occupied ? 'red' : 'green',
                '&.Mui-disabled': {
                    backgroundColor: is_occupied ? 'red' : 'green',
                },
                margin: '10px'
            }}
        >
            <RestaurantIcon sx={{mr: 1, fontSize: 30}} />
            <Typography>Table {table.table_number}</Typography>
        </Button>
    )
}

export default TableButton;