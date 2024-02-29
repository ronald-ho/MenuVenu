import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';

function KitchenOrders () {
  const [orders, setOrders] = React.useState([]);
  const [currDatetime, setCurrDatetime] = React.useState(null);
  const tables = useLoaderData();

  const getOrders = async () => {
    const data = await apiCall('orders/get_order_list', 'GET', {});
    console.log(data.order_list);
    setOrders(data.order_list);
  }

  const calculateTimeSinceOrdered = (orderTime) => {
    const orderedDate = new Date(orderTime);
    const diffInMS = Math.abs(currDatetime.getTime() - orderedDate.getTime());
    const hours = Math.floor(diffInMS / (1000 * 60 * 60));
    const mins = Math.floor((diffInMS % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffInMS % (1000 * 60)) / 1000);
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMins = mins.toString().padStart(2, '0');
    const paddedSecs = secs.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMins}:${paddedSecs}`;
  }

  const updateCurrTime = () => {
    setCurrDatetime(new Date());
  }

  React.useEffect(() => {
    const interval1 = setInterval(getOrders, 5000);
    const interval2 = setInterval(updateCurrTime, 1000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    }
  }, []);

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      border: '1px solid #caccce',
      borderRadius: '15px',
      margin: '10px',
      padding: '10px',
      height: '80vh'
    }}>
      <Box sx={{
        overflow: 'auto',
        maxHeight: '85vh'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order item request</TableCell>
              <TableCell>Table #</TableCell>
              <TableCell>Time since order (HH:MM:SS)</TableCell>
              <TableCell>Ready?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0
              ? (
                <TableRow>
                  <TableCell sx={{ border: 0 }}></TableCell>
                  <TableCell sx={{
                    border: 0,
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ margin: '0 auto 35px auto' }}>
                      Waiting for orders to prepare
                    </Typography>
                    <CircularProgress/>
                  </TableCell>
                  <TableCell sx={{ border: 0 }}></TableCell>
                </TableRow>
              )
              : (
                orders.map((orderedItem, index) => {
                  const timeSinceOrdered = calculateTimeSinceOrdered(orderedItem.order_time);
                  return (
                    <TableRow key={index}>
                      <TableCell>{orderedItem.item_name}</TableCell>
                      <TableCell>{tables.find(obj => {
                        return obj.table_id === orderedItem.table_number
                      }).table_number}</TableCell>
                      <TableCell>{timeSinceOrdered}</TableCell>
                      <TableCell>
                        <Button variant='text' onClick={async () => {
                          const body = {
                            ordered_item_id: orderedItem.ordered_item_id
                          }
                          const data = await apiCall('orders/kitchen/prepared', 'POST', body);
                          if (data.status !== 200) {
                            console.log('OH NO');
                          }
                          await getOrders();
                        }}>YES</Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export default KitchenOrders;
