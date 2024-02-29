import FaceIcon from '@mui/icons-material/Face';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Restaurant () {
  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2
    }}>
      <Typography>I am a...</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        mt: 3
      }}>
        <Button component={Link} to='/customerselect' variant='contained' size='large' sx={{ width: '300px' }}>
          <FaceIcon sx={{
            mr: 1,
            fontSize: 30
          }}/>
          <Typography>Customer</Typography>
        </Button>
        <Button component={Link} to='/staffselect' variant='contained' size='large' sx={{ width: '300px' }}>
          <SoupKitchenIcon sx={{
            mr: 1,
            fontSize: 30
          }}/>
          <Typography>Staff Member</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default Restaurant;
