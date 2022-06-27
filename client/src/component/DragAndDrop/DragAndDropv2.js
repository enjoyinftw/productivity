import React from 'react';
import { Box } from '@mui/material';
import ColumnHead from './ColumnHead';
import ColumnItem from './ColumnItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DragAndDropV2 = ({ userBoard, handleBoardUpdate }) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === 'droppableColumn') {
      const newItems = reorder(userBoard.content, sourceIndex, destIndex);
      handleBoardUpdate({ ...userBoard, content: newItems });
    } else if (result.type === 'droppableSubColumn') {
      const itemSubItemMap = userBoard.content.reduce((acc, item) => {
        acc[item._id] = item.columnitems;
        return acc;
      }, {});

      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];
      let newItems = [...userBoard.content];

      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );

        newItems = newItems.map((item) => {
          if (item._id === sourceParentId) {
            item.columnitems = reorderedSubItems;
          }
          return item;
        });

        handleBoardUpdate({ ...userBoard, content: newItems });
      } else {
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems.map((item) => {
          if (item._id === sourceParentId) {
            item.columnitems = newSourceSubItems;
          } else if (item._id === destParentId) {
            item.columnitems = newDestSubItems;
          }
          return item;
        });
        handleBoardUpdate({ ...userBoard, content: newItems });
      }
    }
  };

  const handleBoardChange = ({
    type = null,
    value = null,
    colIndex = null,
    rowIndex = null,
  } = {}) => {
    if (type === 'newColumnHead') {
      const newBoard = [...userBoard.content];
      const newColumn = {
        columnname: 'New Column',
        columnitems: [
          {
            itemname: 'New Item',
            itemdescription: 'New Description',
          },
        ],
      };
      newBoard.push(newColumn);
      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
    if (type === 'deleteColumnHead') {
      const newBoard = [...userBoard.content];
      newBoard.splice(colIndex, 1);
      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
    if (type === 'saveColumnHead') {
      const newBoard = [...userBoard.content];
      newBoard[colIndex].columnname = value;

      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
    if (type === 'newColumnItem') {
      const newBoard = [...userBoard.content];
      const newColumn = newBoard[colIndex];
      newColumn.columnitems.push({
        itemname: 'new item',
        itemdescription: '',
      });

      newBoard[colIndex] = newColumn;
      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
    if (type === 'deleteColumnItem') {
      const newBoard = [...userBoard.content];
      const newColumn = newBoard[colIndex];
      newColumn.columnitems.splice(rowIndex, 1);
      newBoard[colIndex] = newColumn;
      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
    if (type === 'saveColumnItem') {
      const newBoard = [...userBoard.content];
      const newColumn = newBoard[colIndex];
      let newColumnItem = newColumn.columnitems[rowIndex];
      newColumnItem = {
        ...newColumnItem,
        itemname: value.title,
        itemdescription: value.description,
      };
      newBoard[colIndex].columnitems.splice(rowIndex, 1, newColumnItem);
      handleBoardUpdate({ ...userBoard, content: newBoard });
    }
  };
  return (
    <Box sx={{ padding: '0 1%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box>
          <Droppable
            droppableId='all-droppables'
            direction='horizontal'
            type='droppableColumn'>
            {(provided, snapshot) => (
              <Box
                sx={{ display: 'flex' }}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {userBoard.content.map((column, colIndex) => (
                  <Draggable
                    key={column._id}
                    draggableId={column._id}
                    index={colIndex}>
                    {(provided, snapshot) => (
                      <Box ref={provided.innerRef} {...provided.draggableProps}>
                        <ColumnHead
                          {...provided.dragHandleProps}
                          snapshot={snapshot}
                          column={column}
                          colIndex={colIndex}
                          handleBoardChange={handleBoardChange}
                        />
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
                              {column.columnitems.map((colItem, rowIndex) => (
                                <Draggable
                                  key={colItem._id}
                                  draggableId={colItem._id}
                                  index={rowIndex}>
                                  {(provided, snapshot) => (
                                    <Box ref={provided.innerRef}>
                                      <ColumnItem
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        snapshot={snapshot}
                                        colItem={colItem}
                                        colIndex={colIndex}
                                        rowIndex={rowIndex}
                                        handleBoardChange={handleBoardChange}>
                                        {provided.placeholder}
                                      </ColumnItem>
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                        {provided.placeholder}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default DragAndDropV2;
