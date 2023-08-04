import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { apiCall } from "../helpers/helpers";
import { MenuItem, TextField, Typography, Box } from "@mui/material";
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

function ItemStatistics() {
    const item_id = useParams().itemid;
    const item_info = useLoaderData();
    const [time, setTime] = React.useState("week");
    const [stats, setStats] = React.useState(null);
    const [graphstat, setGraphstat] = React.useState(null);

    const getStats = async () => {
        const result = await apiCall("manager/items/statistics?id=" + item_id + "&time=" + time, "GET", {});
        if (result.status === 200) {
            setStats(result);
            const formatted = {
                labels: result.days,
                datasets: [
                    {
                        label: "Popularity",
                        data: result.popularitybyday
                    }
                ]
            }
            setGraphstat(formatted);
        }
    }

    const options = {
        responsive: true,
        cubicInterpolationMode: 'monotone',
    }

    React.useEffect(() => {
        getStats();
    }, [time])

    return (
        <Box sx={{border: "1px solid black", borderRadius: "15px", margin: "10px", padding: "10px", textAlign: "center"}}>
            <Typography variant="h5">{item_info.name}</Typography>
            <Typography variant="h6">${item_info.price}</Typography>
            {stats && <div style={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", margin: "15px"}}>
                <Typography>Total popularity over timeframe: {stats.popularity}</Typography>
                <Typography>Number of unique orders: {stats.unique_pop}</Typography>
                <Typography>Net profit: ${stats.net.toFixed(2)}</Typography>
                <Typography>Gross profit: ${stats.gross.toFixed(2)}</Typography>
                <Typography>Total cost of production: ${stats.production.toFixed(2)}</Typography>
                <Typography>Average number in an order: {stats.per_order.toFixed(2)}</Typography>
                <Typography>Popularity Rank: {stats.ranking}</Typography>
                <Typography>Average time ordered: {stats.avgtime}</Typography>
            </div>}
            <TextField select sx={{margin: "10px"}} label="Pick Timeframe" value={time} onChange={(e) => setTime(e.target.value)}>
                <MenuItem value={"week"}>Week</MenuItem>
                <MenuItem value={"month"}>Month</MenuItem>
                <MenuItem value={"year"}>Year</MenuItem>
                <MenuItem value={"all"}>All Time</MenuItem>
            </TextField>
            {graphstat && <Line options={options} data={graphstat} style={{maxHeight: "65vh"}} />}
        </Box>
    )
}

export default ItemStatistics;