import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

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