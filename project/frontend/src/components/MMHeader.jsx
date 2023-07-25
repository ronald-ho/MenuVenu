import React from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';
import ProfilePopup from './ProfilePopup';

const StyledHeader = styled.header({
  backgroundColor: '#7a49a5',
  display: 'flex',
  justifyContent: 'space-between',
});

function MMHeader ({ mode, setmode }) {
  const [profile, setProfile] = React.useState(false);

  return (
    <StyledHeader>
      <Typography sx={{ color: 'white', fontFamily: "'Libre Franklin', sans-serif", fontSize: '40px', fontWeight: '1000', padding: '10px 20px' }}>MOGGER MEALS</Typography>
      <div>
        {mode === 'customer' && <>
          <LogOutButton setmode={setmode}/>
          <Button variant='contained' onClick={() => {setProfile(true)}}>Profile</Button>
          {profile && <ProfilePopup open={profile} setOpen={setProfile}/>}
        </>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;