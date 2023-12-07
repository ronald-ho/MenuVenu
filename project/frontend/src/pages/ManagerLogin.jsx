import { Alert, Button, TextField, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../helpers/helpers';

function ManagerLogin () {
  const navigate = useNavigate();

  // Get manager password from database
  const [password, setPassword] = React.useState('');
  const [showAlert, setShowAlert] = React.useState('');

  async function handleSubmit (event) {
    event.preventDefault();

    const body = {
      password
    };

    const data = await apiCall('auth/login/manager', 'POST', body);

    if (data.message === 'Manager login successful') {
      navigate('/managereditmenu');
    } else {
      setShowAlert(data.message);
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} style={{ textAlign: 'center' }}>
        <Typography>Manager Login</Typography>
        <TextField sx={{ margin: '10px' }} id='login-password' value={password} type='password' label='Password'
          placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <Button variant='contained' type='submit'>Submit</Button>
      </form>
      {showAlert && <Alert severity='error' aria-label='errorAlert'
        sx={{
          margin: 'auto',
          width: '300px'
        }}>{showAlert}</Alert>}
    </>
  );
}

export default ManagerLogin;
