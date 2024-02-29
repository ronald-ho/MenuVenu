import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import { apiCall } from '../helpers/helpers';

function ManagerPopup ({
  open,
  setOpen
}) {
  const [restname, setRestname] = React.useState(null);
  const [restphone, setRestphone] = React.useState(null)
  const [staffpass, setStaffpass] = React.useState(null);
  const [managerpass, setManagerpass] = React.useState(null);
  const [numtables, setNumtables] = React.useState(null);
  const [mess, setMess] = React.useState('');

  function handleClose () {
    setOpen(false);
  }

  const getTables = async () => {
    const data = await apiCall('orders/get_tables', 'GET', {});
    setNumtables(data.table_list.length);
  }

  React.useEffect(() => {
    fetchRestaurantData();
    getTables();
  }, []);

  async function sendChanges () {
    if (restname === '') {
      setMess('Please enter a valid restaurant name.');
      return;
    }

    if (restphone === '') {
      setMess('Please enter a valid phone number.');
      return;
    }

    if (numtables === '' || parseInt(numtables) <= 0) {
      setMess('Please enter a valid number of dining tables.');
      return;
    }

    const payload = {
      restaurant_id: 1,
      new_name: restname,
      new_phone: restphone,
      new_staff_password: staffpass,
      new_manager_password: managerpass,
      num_tables: numtables
    }
    const data = await apiCall('manager/update', 'PUT', payload);
    if (data.status === 200) {
      console.log('ey');
      if (data.undeletedtables !== 0) {
        const messageEnd = data.undeletedtables > 1 ? ' tables occupied' : ' table occupied';
        setMess(data.undeletedtables + messageEnd);
      } else {
        setMess('Successful update');
      }
    } else {
      setMess(data.message);
    }
  }

  async function fetchRestaurantData () {
    try {
      const response = await apiCall('/manager/restaurant', 'GET');
      if (response.status === 200 && response.restaurant) {
        const {
          name,
          phone
        } = response.restaurant;
        setRestname(name);
        setRestphone(phone);
      } else {
        console.error('Failed to fetch restaurant data');
      }
    } catch (error) {
      console.error('Error while fetching restaurant data:', error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        textAlign: 'center',
        margin: 'auto',
      }}
    >
      <DialogTitle>Manager Settings</DialogTitle>
      <DialogContent sx={{ width: '300px' }}>
        <Box>
          <Typography>Restaurant name</Typography>
          <TextField
            variant='outlined'
            margin='normal'
            value={restname}
            size='small'
            onChange={(e) => {
              setMess('');
              setRestname(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography>Restaurant phone number</Typography>
          <TextField
            variant='outlined'
            margin='normal'
            value={restphone}
            size='small'
            onChange={(e) => {
              setMess('');
              setRestphone(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography>Number of dining tables</Typography>
          <TextField
            variant='outlined'
            margin='normal'
            type='number'
            value={numtables}
            size='small'
            onChange={(e) => {
              setNumtables(e.target.value)
            }}
          />
        </Box>
        <Box>
          <Typography>Staff password</Typography>
          <TextField
            variant='outlined'
            margin='normal'
            value={staffpass}
            size='small'
            onChange={(e) => {
              setMess('');
              setStaffpass(e.target.value);
            }}
            type='password'
            helperText='Leave empty for no change'/>
        </Box>
        <Box>
          <Typography>Manager password</Typography>
          <TextField
            variant='outlined'
            margin='normal'
            value={managerpass}
            size='small'
            onChange={(e) => {
              setMess('');
              setManagerpass(e.target.value);
            }}
            type='password'
            helperText='Leave empty for no change'
          />
        </Box>
        {mess && <Alert sx={{
          margin: 'auto',
          textAlign: 'left',
          width: 3 / 4
        }}
        severity={mess === 'Successful update' ? 'success' : 'error'}>{mess}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
        <Button variant='contained' onClick={sendChanges}>Save changes</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ManagerPopup;
