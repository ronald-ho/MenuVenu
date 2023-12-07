import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import React from 'react';

const StyledFooter = styled.footer({
  textAlign: 'center',
  position: 'absolute',
  bottom: '0',
  width: '100%'
})

function MVFooter () {
  return (
    <StyledFooter>
      <Typography>Powered by MenuVenu</Typography>
    </StyledFooter>
  )
}

export default MVFooter;
