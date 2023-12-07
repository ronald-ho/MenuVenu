import styled from '@emotion/styled';
import { AccountCircle, EditNote, Insights, ReceiptLong, Settings, SmartToy, TrendingUp } from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';
import ChatbotPopup from './ChatbotPopup';
import LogOutButton from './LogOutButton';
import ManagerPopup from './ManagerPopup';
import ProfilePopup from './ProfilePopup';

const StyledHeader = styled.header({
  backgroundColor: '#7a49a5',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

function MMHeader ({
  mode,
  setmode
}) {
  const [profile, setProfile] = React.useState(false);
  const [manager, setManager] = React.useState(false);
  const [chatbot, setChatbot] = React.useState(false);
  const [restname, setRestname] = React.useState(null);

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  async function fetchRestaurantData () {
    try {
      const response = await apiCall('/manager/restaurant', 'GET');
      if (response.status === 200 && response.restaurant) {
        const { name } = response.restaurant;
        setRestname(name);
      } else {
        console.error('Failed to fetch restaurant data');
      }
    } catch (error) {
      console.error('Error while fetching restaurant data:', error);
    }
  }

  React.useEffect(() => {
    fetchRestaurantData();
  }, []);

  return (
    <StyledHeader>
      <Typography
        sx={{
          color: 'white',
          fontFamily: '\'Libre Franklin\', sans-serif',
          fontSize: '40px',
          fontWeight: '1000',
          padding: '10px 20px'
        }}
      >
        {restname}
      </Typography>
      <div>
        {mode === 'customer' && <>
          <Tooltip title='Chatbot'>
            <IconButton aria-label='Chatbot' onClick={() => {
              setChatbot(true)
            }}>
              <SmartToy fontSize='large'/>
            </IconButton>
          </Tooltip>
          <ChatbotPopup open={chatbot} setOpen={setChatbot}/>
          <LogOutButton setmode={setmode}/>
        </>}
        {mode === 'dining' && <>
          <Tooltip title='Chatbot'>
            <IconButton aria-label='Chatbot' onClick={() => {
              setChatbot(true)
            }}>
              <SmartToy fontSize='large'/>
            </IconButton>
          </Tooltip>
          <ChatbotPopup open={chatbot} setOpen={setChatbot}/>
          <Tooltip title='My Account'>
            <IconButton aria-label='My Account' onClick={() => {
              setProfile(true)
            }}>
              <AccountCircle fontSize='large'/>
            </IconButton>
          </Tooltip>
          <ProfilePopup open={profile} setOpen={setProfile}/>
        </>}
        {mode === 'manager' &&
          <Box sx={{ display: 'flex' }}>
            <Tooltip title='Performance Graph'>
              <NavLink to={'/managergraph'}>
                <IconButton aria-label='Performance Graph'>
                  <Insights fontSize='large'
                    sx={{ color: isActive('/managergraph') ? '#F5EBFF' : '' }}/>
                </IconButton>
              </NavLink>
            </Tooltip>
            <Tooltip title='Order Log'>
              <NavLink to={'/orderlog'}>
                <IconButton aria-label='Order Log'>
                  <ReceiptLong fontSize='large' sx={{ color: isActive('/orderlog') ? '#F5EBFF' : '' }}/>
                </IconButton>
              </NavLink>
            </Tooltip>
            <Tooltip title='Item Popularity'>
              <NavLink to={'/popularitems'}>
                <IconButton aria-label='Item Popularity'>
                  <TrendingUp fontSize='large'
                    sx={{ color: isActive('/popularitems') ? '#F5EBFF' : '' }}/>
                </IconButton>
              </NavLink>
            </Tooltip>
            <Divider orientation='vertical' flexItem/>
            <Tooltip title='Edit Menu'>
              <NavLink to={'/managereditmenu'}>
                <IconButton aria-label='Edit Menu'>
                  <EditNote fontSize='large'
                    sx={{ color: isActive('/managereditmenu') ? '#F5EBFF' : '' }}/>
                </IconButton>
              </NavLink>
            </Tooltip>
            <Tooltip title='Settings'>
              <IconButton aria-label='Settings' onClick={() => {
                setManager(true)
              }}>
                <Settings fontSize='large'/>
              </IconButton>
            </Tooltip>
            {manager && <ManagerPopup open={manager} setOpen={setManager}/>}
          </Box>}
      </div>
    </StyledHeader>
  )
}

export default MMHeader;
