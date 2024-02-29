import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function LogRegGuest ({ setmode }) {
  React.useEffect(() => {
    setmode('');
  }, []);

  return (
    <>
      <div style={{
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <Box sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '30px'
        }}>
          <Button component={Link} to='/tableselect' variant='contained' size='large' sx={{ width: '300px' }}>
            <AccountCircleIcon sx={{
              mr: 1,
              fontSize: 30
            }}/>
            <Typography>Continue as guest</Typography>
          </Button>
          <Button component={Link} to='/register' variant='contained' size='large' sx={{ width: '300px' }}>
            <HowToRegIcon sx={{
              mr: 1,
              fontSize: 30
            }}/>
            <Typography>Register new MenuVenu account</Typography>
          </Button>
          <Button component={Link} to='/login' variant='contained' size='large' sx={{ width: '300px' }}>
            <LoginIcon sx={{
              mr: 1,
              fontSize: 30
            }}/>
            <Typography>Login as MenuVenu member</Typography>
          </Button>
        </Box>
      </div>
    </>
  )
}

export default LogRegGuest;
