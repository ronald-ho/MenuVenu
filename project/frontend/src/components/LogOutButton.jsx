import { Logout } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogOutButton ({ setmode }) {
  const nav = useNavigate();

  function logout () {
    localStorage.removeItem('mvuser');
    // setmode('');
    nav('/login');
  }

  return (
    <Tooltip title='Logout'>
      <IconButton aria-label='Logout' onClick={logout}>
        <Logout fontSize='large'/>
      </IconButton>
    </Tooltip>
  )
}

export default LogOutButton;
