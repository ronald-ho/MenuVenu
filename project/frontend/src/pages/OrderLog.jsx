import { Check } from '@mui/icons-material';
import { Box, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';

function OrderLog () {
  const [timespan, setTimespan] = React.useState('day');
  const [orders, setOrders] = React.useState(null);
  const [total, setTotal] = React.useState(0);

  const updateorders = async () => {
    const data = await apiCall('manager/orderlog?time=' + timespan, 'GET', {});
    if (data.status === 200) {
      setOrders(data.orderlog);
      setTotal(data.gross_income);
    }
  }

  React.useEffect(() => {
    updateorders();
  }, [timespan]);

  return (
    <Box sx={{
      border: '1px solid black',
      borderRadius: '15px',
      margin: '10px',
      padding: '10px',
      textAlign: 'center'
    }}>
      <TextField select label='Select timeframe' value={timespan} onChange={(e) => {
        setTimespan(e.target.value)
      }}>
        <MenuItem value={'day'}>Day</MenuItem>
        <MenuItem value={'week'}>Week</MenuItem>
        <MenuItem value={'month'}>Month</MenuItem>
        <MenuItem value={'year'}>Year</MenuItem>
        <MenuItem value={'all'}>All Time</MenuItem>
      </TextField>
      <Typography sx={{ margin: '20px' }} variant='h6'>Total: ${total.toFixed(2)}</Typography>
      <div style={{
        overflow: 'auto',
        maxHeight: '70vh'
      }}>
        {orders && <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Item Price</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Redeemed with points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell component={Link} to={'/itemstatistics/' + order.item_id}>
                  {order.item_name}
                </TableCell>
                <TableCell>${order.item_price}</TableCell>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>
                  {order.item_redeemed && <Check/>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>}
      </div>
    </Box>
  )
}

export default OrderLog;
