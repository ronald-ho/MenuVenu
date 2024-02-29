import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import AssistReqTableButton from '../components/AssistReqTableButton';
import ConfirmAssistPopUp from '../components/ConfirmAssistPopUp';
import WaitstaffOrderRow from '../components/WaitstaffOrderRow';
import { apiCall } from '../helpers/helpers';

function WaitStaff () {
  const [tablesToAssist, setTablesToAssist] = React.useState([]);
  const [orderItemsToServe, setOrderItemsToServe] = React.useState([]);
  const [showConfirmAssist, setShowConfirmAssist] = React.useState(false);
  const [confirmTableAssist, setConfirmTableAssist] = React.useState();
  const tables = useLoaderData();

  React.useEffect(() => {
    const getTablesNeedAssist = async () => {
      const data = await apiCall('/orders/get_assist', 'GET', {});
      console.log(data);
      if (data.assistance_list) {
        setTablesToAssist(data.assistance_list);
        console.log(data.assistance_list);
      } else {
        console.log('Failed to fetch tables req assistance');
      }
    };

    const interval1 = setInterval(getTablesNeedAssist, 5000);

    return () => clearInterval(interval1);
  }, [tablesToAssist]);

  React.useEffect(() => {
    const getOrdersToServe = async () => {
      const data = await apiCall('/orders/get_serve_list', 'GET', {});
      console.log(data);
      if (data.serve_list) {
        setOrderItemsToServe(data.serve_list);
        console.log(data.serve_list);
      } else {
        console.log('Failed to fetch orders');
      }
    };

    const interval2 = setInterval(getOrdersToServe, 5000);

    return () => clearInterval(interval2);
  }, [orderItemsToServe]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #caccce',
          borderRadius: '15px',
          height: '80vh',
          margin: '10px auto',
          padding: '10px',
          width: '70vw'
        }}
      >
        <TableContainer sx={{
          height: '81vh',
          overflow: 'auto'
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>ORDER ITEM READY</b></TableCell>
                <TableCell><b>TABLE #</b></TableCell>
                <TableCell><b>READY TO SERVE?</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItemsToServe.length === 0
                ? (
                  <TableRow>
                    <TableCell sx={{ border: 0 }}></TableCell>
                    <TableCell sx={{
                      border: 0,
                      textAlign: 'center'
                    }}>
                      <Typography sx={{ margin: '0 auto 35px auto' }}>
                        Waiting for orders to serve
                      </Typography>
                      <CircularProgress/>
                    </TableCell>
                    <TableCell sx={{ border: 0 }}></TableCell>
                  </TableRow>
                )
                : (
                  orderItemsToServe.map((orderItem) =>
                    <WaitstaffOrderRow key={orderItem.ordered_item_id} tables={tables}
                      orderItem={orderItem}
                      setOrderItemsToServe={setOrderItemsToServe}/>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #caccce',
          borderRadius: '15px 0 0 15px',
          borderRight: 0,
          fontSize: '15px',
          position: 'absolute',
          margin: '10px 0 0 0',
          textAlign: 'center',
          top: '81.6px',
          right: 0,
          width: '140px',
          height: '83vh'
        }}
      >
        <Typography sx={{
          fontWeight: 'bold',
          padding: '15px 10px'
        }}>
          ASSISTANCE REQUIRED AT
        </Typography>
        <Box sx={{ height: '74vh' }}>
          {tablesToAssist.length === 0
            ? (
              <Box>
                <Typography sx={{ margin: '0 0 35px 0' }}>Waiting for tables</Typography>
                <CircularProgress/>
              </Box>
            )
            : (
              tablesToAssist.map((table) => (
                <AssistReqTableButton
                  key={table}
                  handleClick={() => {
                    setShowConfirmAssist(true);
                    setConfirmTableAssist(table);
                  }}
                  tableNo={table}
                >
                </AssistReqTableButton>
              ))
            )}
        </Box>
      </Box>
      {showConfirmAssist &&
        <ConfirmAssistPopUp open={showConfirmAssist} setOpen={setShowConfirmAssist} tableNo={confirmTableAssist}
          setTablesToAssist={setTablesToAssist}/>}
    </>
  );
}

export default WaitStaff;
