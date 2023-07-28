import React from "react";
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { useLoaderData } from "react-router-dom";
import { Box, MenuItem, TextField, Toolbar, Typography, AppBar } from "@mui/material";

function ManagerGraph() {
    const categories = useLoaderData();

    const [type, setType] = React.useState(0);
    const [period, setPeriod] = React.useState(0);
    const [category, setCategory] = React.useState(0);

    const [statistics, setStatistics] = React.useState(null);
    const options = {
        responsive: true
    }

    const fetchstats = async () => {
        //apiCall
    }

    React.useEffect(() => {
        fetchstats();
    }, [type, period, category])

    return (
        <Box sx={{textAlign: "center"}}>
            <Toolbar sx={{justifyContent: "space-between", paddingTop: "10px", paddingBottom: "10px"}}>
                <Typography variant="h6">View: </Typography>
                <TextField select label="Select statistic" value={type} onChange={(e) => {setType(e.target.value)}}>
                    <MenuItem value={0}>Popularity</MenuItem>
                    <MenuItem value={1}>Gross Profit</MenuItem>
                    <MenuItem value={2}>Net Profit</MenuItem>
                </TextField>
                <Typography variant="h6">Over: </Typography>
                <TextField select label="Select period" value={period} onChange={(e) => {setPeriod(e.target.value)}}>
                    <MenuItem value={0}>Week</MenuItem>
                    <MenuItem value={1}>Month</MenuItem>
                </TextField>
                <Typography variant="h6">For: </Typography>
                <TextField select label="Select filter" value={category} onChange={(e) => {setCategory(e.target.value)}}>
                    <MenuItem value={0}>Entire Menu</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.category_id} value={category.category_id}>{category.name}</MenuItem>
                    ))}
                </TextField>
            </Toolbar>
            {statistics && <Line options={options} data={statistics} />}
        </Box>
    )

}

export default ManagerGraph;
