import React from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';
import ProfilePopup from './ProfilePopup';
import ManagerPopup from './ManagerPopup';
import { Link, NavLink } from 'react-router-dom';

const StyledHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  border: '1px black solid',
  alignItems: 'center'
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
          <Button variant='contained' onClick={() => {setManager(true)}} sx={{marginRight: "10px"}}>Manager</Button>
          {manager && <ManagerPopup open={manager} setOpen={setManager}/>}
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
          <NavLink to={'/orderlog'} style={({ isActive }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              textDecoration: "none",
              color: "inherit",
              marginRight: "10px"
            }
          }}>
            Order Log
          </NavLink>
          <NavLink to={'/popularitems'} style={({ isActive }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              textDecoration: "none",
              color: "inherit",
              marginRight: "10px"
            }
          }}>
            Popular Items
          </NavLink>
        </>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;