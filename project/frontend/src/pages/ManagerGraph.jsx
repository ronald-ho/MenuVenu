import React from "react";
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { useLoaderData } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import { Box, MenuItem, TextField, Toolbar, Typography, AppBar } from "@mui/material";

function ManagerGraph() {
    const categories = useLoaderData();

    const [type, setType] = React.useState("popularity");
    const [period, setPeriod] = React.useState("week");
    const [category, setCategory] = React.useState(["0,Entire Menu"]);

    const [statistics, setStatistics] = React.useState(null);
    const options = {
        responsive: true,
        cubicInterpolationMode: 'monotone',
    }

    const randomnum = () => Math.floor(Math.random() * 235);
    const randomrgb = () => `rgb(${randomnum()}, ${randomnum()}, ${randomnum()})`

    const fetchstats = async () => {
        if (category.length === 0){
            return;
        }
        const datasets = []
        let days = []
        for (let cat in category) {
            let splitted = category[cat].split(",")
            let result = await apiCall("manager/profit_tracker?time=" + period + "&filter=" + type + "&category_id=" + splitted[0], "GET", {});
            if (result.status != 200) {
                console.log("OH NOO");
                return;
            }
            datasets.push({
                label: splitted[1],
                data: result.values,
                borderColor: randomrgb()
            })
            if (result.days.length > days.length) {
                days = result.days
            }
        }
        const formatted = {
            labels: days,
            datasets
        }
        setStatistics(formatted);
    }

    React.useEffect(() => {
        fetchstats();
    }, [type, period, category])

    return (
        <Box sx={{textAlign: "center"}}>
            <Toolbar sx={{justifyContent: "space-between", paddingTop: "10px", paddingBottom: "10px"}}>
                <Typography variant="h6">View: </Typography>
                <TextField select label="Select statistic" value={type} onChange={(e) => {setType(e.target.value)}}>
                    <MenuItem value={"popularity"}>Popularity</MenuItem>
                    <MenuItem value={"gross"}>Gross Profit</MenuItem>
                    <MenuItem value={"net"}>Net Profit</MenuItem>
                </TextField>
                <Typography variant="h6">Over: </Typography>
                <TextField select label="Select period" value={period} onChange={(e) => {setPeriod(e.target.value)}}>
                    <MenuItem value={"week"}>Week</MenuItem>
                    <MenuItem value={"month"}>Month</MenuItem>
                    <MenuItem value={"year"}>Year</MenuItem>
                    <MenuItem value={"all"}>All</MenuItem>
                </TextField>
                <Typography variant="h6">For: </Typography>
                <TextField select label="Select filter" SelectProps={{
                    value: category,
                    onChange: (e) => {setCategory(e.target.value)},
                    multiple: true
                }}>
                    <MenuItem value={"0,Entire Menu"}>Entire Menu</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.category_id} value={`${category.category_id},${category.name}`}>{category.name}</MenuItem>
                    ))}
                </TextField>
            </Toolbar>
            {statistics && <Line options={options} data={statistics} style={{maxHeight: "80vh"}} />}
        </Box>
    )

}

export default ManagerGraph;
