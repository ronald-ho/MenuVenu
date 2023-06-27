import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';

const StyledHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  border: '1px black solid'
});

function MMHeader () {
  return (
    <StyledHeader>
      <Typography sx={{ fontSize: '40px', padding: '10px 20px' }}>MOGGER MEALS</Typography>
      <div>
        {localStorage.getItem("mvuser") && <LogOutButton />}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;