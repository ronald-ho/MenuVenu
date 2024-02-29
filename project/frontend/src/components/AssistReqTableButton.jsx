import { Button } from '@mui/material';
import React from 'react';

function AssistReqTableButton ({
  handleClick,
  tableNo
}) {
  const buttonCss = {
    border: 1,
    borderRadius: '50%',
    color: '#7a49a5',
    fontSize: '18px',
    height: '85px',
    lineHeight: '25px',
    marginBottom: '20px',
    width: '85px'
  };

  return (
    <Button onClick={handleClick} sx={buttonCss}>Table<br/>{tableNo}</Button>
  )
}

export default AssistReqTableButton;
