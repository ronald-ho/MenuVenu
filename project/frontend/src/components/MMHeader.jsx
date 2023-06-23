import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const StyledHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  border: '1px black solid'
});

function MMHeader ({ mode }) {
  return (
    <StyledHeader>
      <Typography sx={{ fontSize: '40px', padding: '10px 20px' }}>MOGGER MEALS</Typography>
      <div>
        { mode === 'guest' && 
          <>
          </>
        }
        { mode === 'customer' &&
          <>
          </>
        }
        { mode === 'admin' && 
          <>
          </>
        }
      </div>
    </StyledHeader>
  )
}

export default MMHeader;