import { Alert, Box } from '@mui/material';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers/helpers';
import { getItems } from '../helpers/loaderfunctions';
import BouncingArrow from './BouncingArrow';
import ItemListItem from './ItemListItem';

function ItemList () {
  const params = useParams();

  const [allIngredients, setAllIngredients] = React.useState([]);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const getAllIngredients = async () => {
      const data = await apiCall('menu/ingredients', 'GET', {});
      if (data.ingredients) {
        console.log(data.ingredients);
        setAllIngredients(data.ingredients);
      }
    }

    getAllIngredients();
  }, []);

  React.useEffect(() => {
    const getItems = async () => {
      const activeCategoryItems = await getItems(params);
      setItems(activeCategoryItems);
    }
    getItems();
  }, [params]);

  async function newposition (result) {
    if (!result.destination) {
      return;
    }
    const newitems = Array.from(items);
    const [draggeditem] = newitems.splice(result.source.index, 1);
    const body = {
      item_id: draggeditem.id,
      new_position: result.destination.index + 1
    }
    const result1 = await apiCall('menu/item/position', 'PUT', body);
    if (result1.status !== 200) {
      console.log('bruh');
    }
    const result2 = await getItems(params);
    setItems(result2);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '65vh',
        flexDirection: 'column',
        justifyContent: items.length === 0 ? 'flex-end' : 'flex-start'
      }}
    >
      {items.length === 0
        ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 2 / 3
          }}>
            <Box sx={{
              display: 'flex',
              flex: 1
            }}>
              <Alert severity='info' aria-label='infoAlert'
                sx={{
                  margin: 'auto',
                  textAlign: 'left',
                  width: 3 / 4
                }}>
                Click the button below to add your first menu item in this category. Once you have added
                a menu item, you can view and update item info, or delete the item from the category.
              </Alert>
            </Box>
            <BouncingArrow/>
          </Box>
        )
        : (
          <DragDropContext onDragEnd={newposition}>
            <Droppable droppableId='items'>
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}
                  sx={{
                    flex: 1,
                    overflow: 'auto'
                  }}>
                  {items.map((item, index) =>
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => <div
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ItemListItem categoryId={params.categoryid} item={item}
                          allIngredients={allIngredients}/>
                      </div>}
                    </Draggable>)}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
    </Box>
  )
}

export default ItemList;
