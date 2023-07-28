import React from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';
import ProfilePopup from './ProfilePopup';
import { Link, NavLink } from 'react-router-dom';

const StyledHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  border: '1px black solid',
  alignItems: 'center'
});

function MMHeader ({ mode, setmode }) {
  const [profile, setProfile] = React.useState(false);

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
          <NavLink to={'/managergraph'} style={({ isActive }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              textDecoration: "none",
              color: "inherit",
              marginRight: "10px"
            }
          }}>
            Performance Graph
          </NavLink>
        </>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;