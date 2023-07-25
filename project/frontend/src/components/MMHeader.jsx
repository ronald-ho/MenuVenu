import React from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';
import ProfilePopup from './ProfilePopup';
import ManagerPopup from './ManagerPopup';

const StyledHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  border: '1px black solid'
});

function MMHeader ({ mode, setmode }) {
  const [profile, setProfile] = React.useState(false);
  const [manager, setManager] = React.useState(false);

  return (
    <StyledHeader>
      <Typography sx={{ fontSize: '40px', padding: '10px 20px' }}>MOGGER MEALS</Typography>
      <div>
        {mode === 'customer' && <>
          <LogOutButton setmode={setmode}/>
          <Button variant='contained' onClick={() => {setProfile(true)}}>Profile</Button>
          {profile && <ProfilePopup open={profile} setOpen={setProfile}/>}
        </>}
        {mode === 'manager' && <>
          <Button variant='contained' onClick={() => {setManager(true)}}>Manager</Button>
          {manager && <ManagerPopup open={manager} setOpen={setManager}/>}
        </>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;