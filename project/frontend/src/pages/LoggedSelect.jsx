import DiningIcon from '@mui/icons-material/Dining';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function LoggedSelect ({ setmode }) {
  React.useEffect(() => {
    setmode(localStorage.getItem('mvuser') ? 'customer' : '');
  }, []);

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2
    }}>
      <Typography>I want to...</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        mt: 3
      }}>
        <Button component={Link} to='/tableselect' variant='contained' size='large' sx={{ width: '300px' }}>
          <DiningIcon sx={{
            mr: 1,
            fontSize: 30
          }}/>
          <Typography>Start dining</Typography>
        </Button>
        <Button component={Link} to='/updateaccount' variant='contained' size='large' sx={{ width: '300px' }}>
          <PersonAddIcon sx={{
            mr: 1,
            fontSize: 30
          }}/>
          <Typography>Update my profile</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default LoggedSelect;
