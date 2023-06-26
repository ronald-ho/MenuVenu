import React from "react";
import { useLoaderData } from "react-router-dom";
import TableButton from "../components/TableButton";

function SelectTable () {
    const tables = useLoaderData();
    console.log(tables);
    return (
        <div style={{textAlign: 'center', display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            {tables.map((table) => <TableButton table={table} key={table.id}></TableButton>)}
        </div>
    )
}

export default SelectTable;