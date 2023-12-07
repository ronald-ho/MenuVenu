import React from 'react';
import { useLoaderData } from 'react-router-dom';
import TableButton from '../components/TableButton';

function SelectTable ({ setmode }) {
  const tables = useLoaderData();
  console.log(tables);

  React.useEffect(() => {
    setmode(localStorage.getItem('mvuser') ? 'customer' : '');
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {tables.map((table) => <TableButton table={table} key={table.id}></TableButton>)}
    </div>
  )
}

export default SelectTable;
