import { TextField, Box, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import { Link } from "react-router-dom";

function PopularItems() {
    const categories = useLoaderData();
    const [items, setItems] = React.useState(null);
    const [search, setSearch] = React.useState("");
    const [category, setCategory] = React.useState(0);
    const [filter, setFilter] = React.useState("popularity");

    const getItems = async () => {
        const data = await apiCall("manager/items/popularity?filter=" + filter + "&category_id=" + category, "GET", {});
        if (data.status === 200) {
            setItems(data.list);
        }
    }

    React.useEffect(() => {
        setItems(null);
        getItems();
    }, [category, filter]);

    return (
        <Box sx={{border: "1px solid black", borderRadius: "15px", margin: "10px", padding: "10px", textAlign: "center"}}>
            <TextField sx={{margin: "10px"}} label="Search items" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <TextField sx={{margin: "10px"}} select label="Pick a category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value={0}>All Items</MenuItem>
                {categories.map((category) => <MenuItem key={category.category_id} value={category.category_id}>{category.name}</MenuItem>)}
            </TextField>
            <TextField sx={{margin: "10px"}} select label="Pick a filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <MenuItem value={"popularity"}>Popularity</MenuItem>
                <MenuItem value={"gross"}>Gross Profit</MenuItem>
                <MenuItem value={"net"}>Net Profit</MenuItem>
            </TextField>
            <div style={{overflow: "auto", maxHeight: "70vh"}}>
                {items && <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item Name</TableCell>
                            {filter === "gross" && <TableCell>Gross Profit</TableCell>}
                            {filter === "net" && <TableCell>Net Profit</TableCell>}
                            <TableCell>Popularity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => item.name.toLowerCase().includes(search.toLowerCase()) && <TableRow>
                            <TableCell component={Link} to={"/itemstatistics/" + item.item_id}>{item.name}</TableCell>
                            {filter === "gross" && <TableCell>${item.gross_income ? item.gross_income.toFixed(2) : ""}</TableCell>}
                            {filter === "net" && <TableCell>${item.net_income ? item.net_income.toFixed(2) : ""}</TableCell>}
                            <TableCell>{item.popularity}</TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>}
            </div>
        </Box>
    )
}

export default PopularItems;