import React from 'react';
import { Box, Button, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { EditNote, Insights, ReceiptLong, Settings, TrendingUp } from '@mui/icons-material';
import styled from '@emotion/styled';
import LogOutButton from './LogOutButton';
import ProfilePopup from './ProfilePopup';
import ManagerPopup from './ManagerPopup';
import { NavLink, useLocation } from 'react-router-dom';
import ChatbotPopup from './ChatbotPopup';

const StyledHeader = styled.header({
  backgroundColor: '#7a49a5',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

function MMHeader ({ mode, setmode }) {
  const [profile, setProfile] = React.useState(false);
  const [manager, setManager] = React.useState(false);
  const [chatbot, setChatbot] = React.useState(false);

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <StyledHeader>
      <Typography sx={{ 
        color: 'white', 
        fontFamily: "'Libre Franklin', sans-serif", fontSize: '40px', 
        fontWeight: '1000', padding: '10px 20px' }}>
        MOGGER MEALS
      </Typography>
      <div>
        {mode === 'customer' && <>
          <LogOutButton setmode={setmode}/>
          <Button variant='contained' onClick={() => {setProfile(true)}}>Profile</Button>
          {profile && <ProfilePopup open={profile} setOpen={setProfile}/>}
          <Button variant='contained' onClick={() => {setChatbot(true)}}>Chatbot</Button>
          <ChatbotPopup open={chatbot} setOpen={setChatbot}/>
        </>}
        {mode === 'manager' && 
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Performance Graph">
            <NavLink to={'/managergraph'} >
              <IconButton aria-label="Performance Graph">
                <Insights fontSize="large" sx={{ color: isActive('/managergraph') ? '#F5EBFF' : '' }} />
              </IconButton>
            </NavLink>
          </Tooltip>
          <Tooltip title="Order Log">
            <NavLink to={'/orderlog'}>
              <IconButton aria-label="Order Log">
                <ReceiptLong fontSize="large" sx={{ color: isActive('/orderlog') ? '#F5EBFF' : '' }} />
              </IconButton>
            </NavLink>
          </Tooltip>
          <Tooltip title="Item Popularity">
            <NavLink to={'/popularitems'}>
              <IconButton aria-label="Item Popularity">
                  <TrendingUp fontSize="large" sx={{ color: isActive('/popularitems') ? '#F5EBFF' : '' }} />
              </IconButton>
            </NavLink>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Edit Menu">
            <NavLink to={'/managereditmenu'} >
              <IconButton aria-label="Edit Menu">
                <EditNote fontSize="large" sx={{ color: isActive('/managereditmenu') ? '#F5EBFF' : '' }} />
              </IconButton>
            </NavLink>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton aria-label="Settings" onClick={() => {setManager(true)}} >
              <Settings fontSize="large" />
            </IconButton>
          </Tooltip>
          {manager && <ManagerPopup open={manager} setOpen={setManager}/>}
        </Box>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;