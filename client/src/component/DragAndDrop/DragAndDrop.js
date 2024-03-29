import { useEffect, useState } from 'react';
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

const DragAndDrop = ({ userBoard, setUserBoard }) => {
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
        minWidth: '80%',
        overflowX: 'hidden',
        padding: '10px 50px',
      },
      column: {
        minWidth: '250px',
        width: '250px',
      },
      columnHead: {},
      rowItem: {},
    },
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === 'droppableColumn') {
      const newItems = reorder(userBoard.content, sourceIndex, destIndex);
      setUserBoard({ ...userBoard, content: newItems });
    } else if (result.type === 'droppableSubColumn') {
      const colItemMap = userBoard.content.reduce((acc, item) => {
        acc[item._id] = item.columnitems;
        return acc;
      }, {});

      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;

      const sourceColItems = colItemMap[sourceParentId];
      const destColItems = colItemMap[destParentId];
      let newColItems = [...userBoard.content];

      if (sourceParentId === destParentId) {
        const reorderedColItems = reorder(
          sourceColItems,
          sourceIndex,
          destIndex
        );

        newColItems = newColItems.map((item) => {
          if (item._id === sourceParentId) {
            item.columnitems = reorderedColItems;
          }
          return item;
        });

        const newUserBoard = { ...userBoard };
        newUserBoard.content = newColItems;

        setUserBoard({ ...userBoard, newUserBoard });
      } else {
        let newSourceSubItems = [...sourceColItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destColItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newColItems.map((item) => {
          if (item._id === sourceParentId) {
            item.columnitems = newSourceSubItems;
          } else if (item._id === destParentId) {
            item.columnitems = newDestSubItems;
          }
          return item;
        });
        const newUserBoard = { userBoard };
        newUserBoard.content = newColItems;
        setUserBoard(newUserBoard);
      }
    }
  };

  const handleClick = (event) => {
    console.log(event.currentTarget);
    console.log(event.currentTarget.id);
    console.log(event.currentTarget.index);
  };

  const displayDragAndDrop = (content) => {
    if (content) {
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
                    {content.map((column, colIndex) => (
                      <Draggable
                        key={column._id}
                        draggableId={column._id}
                        index={colIndex}>
                        {(provided, snapshot) => (
                          <Grid
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            key={column._id}
                            id={column._id}
                            index={colIndex}
                            sx={{
                              ...style.DragAndDrop.column,
                            }}
                            item>
                            <Card
                              {...provided.dragHandleProps}
                              variant='outlined'
                              sx={{
                                border: snapshot.isDragging
                                  ? '3px solid '
                                  : '1px solid',
                                borderColor: snapshot.isDragging
                                  ? 'secondary.main'
                                  : 'primary.main',
                                ...style.DragAndDrop.columnHead,
                              }}>
                              <CardContent
                                sx={{
                                  position: 'relative',

                                  zIndex: 'auto',
                                  padding: '10px 0 0 0',
                                  '&:last-child': {
                                    paddingBottom: '10px',
                                  },
                                }}>
                                <Typography
                                  color='primary'
                                  id={column._id}
                                  sx={{ textAlign: 'center', width: '100%' }}
                                  variant='h5'
                                  component='h2'>
                                  {column.columnname}
                                </Typography>
                              </CardContent>
                              <CardActions
                                sx={{ paddingTop: 0 }}
                                disableSpacing>
                                <Stack
                                  width={'100%'}
                                  direction='row'
                                  justifyContent='center'
                                  alignItems='center'>
                                  <IconButton
                                    id='colHeaderButton'
                                    index='2323'
                                    onClick={handleClick}
                                    color='secondary'
                                    size='small'
                                    aria-label='add column'>
                                    <AddCircleIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={handleClick}
                                    color='secondary'
                                    size='small'
                                    aria-label='edit column name'>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={handleClick}
                                    color='secondary'
                                    size='small'
                                    aria-label='delete column'>
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                              </CardActions>
                            </Card>
                            <Droppable
                              droppableId={column._id}
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
                                  {column.columnitems.map(
                                    (rowItem, rowIndex) => (
                                      <Draggable
                                        key={rowItem._id}
                                        draggableId={rowItem._id}
                                        index={rowIndex}>
                                        {(provided, snapshot) => (
                                          <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                              ...style.DragAndDrop.rowItem,
                                              border: snapshot.isDragging
                                                ? '3px solid '
                                                : '1px solid',
                                              borderColor: snapshot.isDragging
                                                ? 'secondary.main'
                                                : 'primary.main',

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
                                                  {rowItem.rowname}
                                                </Typography>
                                                <Typography
                                                  variant='body2'
                                                  color='primary'
                                                  component='p'>
                                                  {rowItem.rowdescription}
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
                                                  onClick={handleClick}
                                                  color='secondary'
                                                  size='small'
                                                  aria-label='add row'>
                                                  <AddCircleIcon />
                                                </IconButton>
                                                <IconButton
                                                  onClick={handleClick}
                                                  color='secondary'
                                                  size='small'
                                                  aria-label='edit row'>
                                                  <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                  onClick={handleClick}
                                                  color='secondary'
                                                  size='small'
                                                  aria-label='delete row'>
                                                  <DeleteIcon />
                                                </IconButton>
                                              </Stack>
                                            </CardActions>
                                            {provided.placeholder}
                                          </Card>
                                        )}
                                      </Draggable>
                                    )
                                  )}
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
    } else {
      return (
        <Typography
          textAlign='center'
          color='info'
          variant='h6'
          component='h3'
          sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
          Waiting for data
        </Typography>
      );
    }
  };

  return <>{displayDragAndDrop(userBoard.content)} </>;
};

export default DragAndDrop;
