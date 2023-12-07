import { Box, Card, Chip, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function ItemPreview ({ item }) {
  return (
    <Card
      component={Link} to={'../order/' + item.id}
      sx={{
        border: '1px solid #caccce',
        display: 'flex',
        flexDirection: 'column',
        height: '270px',
        margin: '5px',
        padding: '5px',
        textDecoration: 'none',
        width: '270px'
      }}
    >
      <Typography>{item.name}</Typography>
      <Box sx={{
        border: '1px solid #caccce',
        display: 'flex',
        height: '150px',
        margin: 'auto',
        width: '150px'
      }}>
        {item.image
          ? (
            <img src={item.image} alt={item.name} style={{
              maxWidth: '150px',
              maxHeight: '150px'
            }}/>
          )
          : (
            <Typography
              sx={{
                fontSize: '100px',
                fontWeight: 700,
                opacity: '0.1'
              }}
            >
              MV
            </Typography>
          )
        }
      </Box>
      <Typography>
        ${item.price.toFixed(2)}
        {item.points_to_redeem && <> | - {item.points_to_redeem} MVP</>}
        {item.points_to_redeem && item.points_earned && <> | </>}
        {item.points_earned && <> + {item.points_earned} MVP</>}
      </Typography>
      <Box>
        {item.calories && <Typography>{item.calories} Cal</Typography>}
        {item.ingredients.map((i) => (
          <Chip key={i.id} label={i}/>
        ))}

      </Box>

    </Card>
  )
}

export default ItemPreview;
