import { ArrowDownward } from '@mui/icons-material';
import React from 'react';

function BouncingArrow () {
  return (
    <ArrowDownward
      sx={{
        margin: '0 auto',
        flex: 1,
        fontSize: 48, // Adjust as needed
        animation: 'bounce 2s infinite',
        '@keyframes bounce': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-20px)',
          },
          '60%': {
            transform: 'translateY(-10px)',
          },
        }
      }}
    />
  );
}

export default BouncingArrow;
