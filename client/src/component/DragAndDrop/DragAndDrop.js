import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Card,
  Grid,
  Typography,
  Stack,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuListPop from '../userinterface/MenuListPop';

const DragAndDrop = ({ content }) => {
  const [itemList, setitemList] = useState(content);

  const handleButtonClick = (event) => {
    console.log('nice click!');
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const style = {
    DragAndDrop: {
      body: {
        backgroundColor: '#F9F7F7',
        width: 'max-content',
        minWidth: '100%',
        overflowX: 'hidden',
        padding: '10px 50px',
      },
      column: {
        minWidth: '250px',
        width: '250px',
      },
      columnHead: {
        border: '1px solid',
        borderColor: 'primary.main',
      },
    },
    menuListItem: [
      {
        id: 'add',
        color: 'secondary',
        onClick: handleButtonClick,
        icon: <AddCircleIcon />,
        ariaLabel: 'add button',
      },
      {
        id: 'edit',
        color: 'secondary',
        onClick: handleButtonClick,
        icon: <EditIcon />,
        ariaLabel: 'edit button',
      },
      {
        id: 'delete',
        color: 'secondary',
        onClick: handleButtonClick,
        icon: <DeleteIcon />,
        ariaLabel: 'delete button',
      },
    ],
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === 'droppableColumn') {
      const newItems = reorder(itemList, sourceIndex, destIndex);
      setitemList(newItems);
    } else if (result.type === 'droppableSubColumn') {
      const itemSubItemMap = itemList.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});

      const sourceParentId = parseInt(result.source.droppableId);
      const destParentId = parseInt(result.destination.droppableId);

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...itemList];

      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );

        newItems = newItems.map((item) => {
          if (+item.id === +sourceParentId) {
            item.subItems = reorderedSubItems;
          }
          return item;
        });

        setitemList(newItems);
      } else {
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems.map((item) => {
          if (+item.id === sourceParentId) {
            item.subItems = newSourceSubItems;
          } else if (+item.id === destParentId) {
            item.subItems = newDestSubItems;
          }
          return item;
        });
        setitemList(newItems);
      }
    }
  };

  return (
    <Box sx={{ ...style.DragAndDrop.body }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
          <Droppable
            droppableId='all-droppables'
            direction='horizontal'
            type='droppableColumn'>
            {(provided, snapshot) => (
              <Box
                sx={{ display: 'flex' }}
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {itemList.map((column, colIndex) => (
                  <Draggable
                    key={column.id}
                    draggableId={column.id}
                    index={colIndex}>
                    {(provided, snapshot) => (
                      <Grid
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        key={column.id}
                        id={column.id}
                        index={colIndex}
                        sx={{
                          ...style.DragAndDrop.column,
                        }}
                        item>
                        <Card
                          {...provided.dragHandleProps}
                          variant='outlined'
                          sx={{ ...style.DragAndDrop.columnHead }}>
                          <CardContent
                            sx={{
                              padding: '10px 0 10px 0',
                              '&:last-child': {
                                paddingBottom: '10px',
                              },
                            }}>
                            <Stack
                              direction='row'
                              justifyContent='space-between'
                              alignItems='center'>
                              <Typography
                                color='primary'
                                id={column.id}
                                sx={{ flex: 1, textAlign: 'center' }}
                                variant='h5'
                                component='h2'>
                                {column.content}
                              </Typography>
                              <MenuListPop menuItems={style.menuListItem} />
                            </Stack>
                          </CardContent>
                        </Card>
                        <Droppable
                          droppableId={column.id}
                          type='droppableSubColumn'>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              sx={{
                                minHeight: '25px',
                                backgroundColor: snapshot.isDraggingOver
                                  ? 'primary.main'
                                  : '',
                              }}>
                              {column.subItems.map((rowItem, rowIndex) => (
                                <Draggable
                                  key={rowItem.id}
                                  draggableId={rowItem.id}
                                  index={rowIndex}>
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{
                                        border: '1px solid',
                                        borderColor: 'primary.main',

                                        ...provided.draggableProps.style,
                                      }}>
                                      <CardContent
                                        sx={{
                                          paddingBottom: '0',
                                          '&:last-child': {
                                            paddingBottom: '0',
                                          },
                                        }}>
                                        <Stack
                                          textAlign='center'
                                          justifyContent='center'
                                          direction='column'>
                                          <Typography
                                            variant='body1'
                                            color='primary'
                                            component='p'>
                                            {rowItem.content}
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='primary'
                                            component='p'>
                                            {rowItem.description}
                                          </Typography>
                                        </Stack>
                                      </CardContent>

                                      <CardActions disableSpacing>
                                        <Stack
                                          width={'100%'}
                                          direction='row'
                                          justifyContent='center'
                                          alignItems='center'>
                                          <IconButton
                                            color='secondary'
                                            size='small'
                                            aria-label='add'>
                                            <AddCircleIcon />
                                          </IconButton>
                                          <IconButton
                                            color='secondary'
                                            size='small'
                                            aria-label='edit'>
                                            <EditIcon />
                                          </IconButton>
                                          <IconButton
                                            color='secondary'
                                            size='small'
                                            aria-label='delete'>
                                            <DeleteIcon />
                                          </IconButton>
                                        </Stack>
                                      </CardActions>
                                      {provided.placeholder}
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                        {provided.placeholder}
                      </Grid>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default DragAndDrop;
