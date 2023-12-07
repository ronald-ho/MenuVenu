import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';

function ItemInfoPopUp ({
  open,
  setOpen,
  item
}) {
  const ingredients = item.ingredients;
  console.log(ingredients);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{item.name}</DialogTitle>
        <DialogContent
          sx={{
            columnGap: '20px',
            display: 'flex'
          }}
        >
          <Box sx={{
            textAlign: 'center',
            width: 3 / 8
          }}>
            <Box sx={{
              alignItems: 'center',
              border: '1px solid #caccce',
              display: 'flex',
              height: '150px',
              width: '150px'
            }}>
              {item.image
                ? (
                  <img src={item.image} alt={item.name}
                    style={{
                      margin: 'auto',
                      maxWidth: '150px',
                      maxHeight: '150px'
                    }}/>
                )
                : (
                  <Typography>No image uploaded</Typography>
                )}
            </Box>
            {item.calories && <Typography>{item.calories} Cal</Typography>}
            {ingredients.map((i, index) => (
              <Chip key={index} label={i}/>
            ))}

          </Box>
          <Box sx={{ width: 5 / 8 }}>
            <Box sx={{
              height: '150px',
              textAlign: 'right'
            }}>
              <Typography>Price: ${item.price.toFixed(2)}</Typography>
              <Typography>Production cost: ${item.production.toFixed(2)}</Typography>
              {item.points_to_redeem &&
                <Typography>Redeem with {item.points_to_redeem} MV Points</Typography>}
              {item.points_earned && <Typography>Buy to earn {item.points_earned} MV Points</Typography>}
            </Box>
            {item.description && <Typography>{item.description}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color='error'>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ItemInfoPopUp;
