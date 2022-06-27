import { useState, useEffect, useRef } from 'react';
import {
  ClickAwayListener,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import DownloadingIcon from '@mui/icons-material/Downloading';
import DragAndDropV2 from '../DragAndDrop/DragAndDropv2';
import MenuListPop from '../userinterface/MenuListPop';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';

const KanbanBoard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userBoard, setUserBoard] = useState({});
  const [boardData, setBoardData] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const boardTitleRef = useRef();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/kanban/findall`, {
          withCredentials: true,
          credentials: 'include',
        });
        setBoardData(data.boardData);
        setUserBoard(data.boardData[0]);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  const handleNewBoard = async (e) => {
    const newBoard = {
      name: 'My Board1',
      content: [
        {
          columnname: 'New Column',
          columnitems: [
            {
              itemname: 'New Item',
              itemdescription: '',
            },
          ],
        },
      ],
    };
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/kanban/create`,
        newBoard,
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      const newBoardData = [...boardData];
      newBoardData.push(data.boardData);

      setBoardData(newBoardData);
      setUserBoard(data.boardData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBoardUpdate = async (newState) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/kanban/updateone`,
        newState,
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      const updatedBoard = await axios.get(`${API_URL}/api/v1/kanban/findall`, {
        withCredentials: true,
        credentials: 'include',
      });
      setBoardData(updatedBoard.data.boardData);

      setUserBoard(data.boardData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditBoardname = (e) => {
    setIsEditingName(true);
  };
  const handleDeleteBoard = async (e) => {
    const _id = e.currentTarget.getAttribute('name');

    const deleteReq = { _id: _id };
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/kanban/delete`,

        { data: deleteReq, withCredentials: true, credentials: 'include' }
      );
      const updatedBoard = await axios.get(`${API_URL}/api/v1/kanban/findall`, {
        withCredentials: true,
        credentials: 'include',
      });
      setBoardData(updatedBoard.data.boardData);
      setUserBoard(boardData[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const menuItems = [
    {
      id: 'add',
      color: 'primary',
      // eslint-disable-next-line no-undef
      onClick: handleNewBoard,
      // eslint-disable-next-line react/jsx-no-undef
      icon: <AddCircleIcon />,
      ariaLabel: 'add button',
    },
    {
      id: 'edit',
      color: 'primary',
      // eslint-disable-next-line no-undef
      onClick: handleEditBoardname,
      // eslint-disable-next-line react/jsx-no-undef
      icon: <EditIcon />,
      ariaLabel: 'edit button',
    },
    {
      id: 'delete',
      color: 'primary',
      // eslint-disable-next-line no-undef
      onClick: handleDeleteBoard,
      // eslint-disable-next-line react/jsx-no-undef
      icon: <DeleteIcon />,
      ariaLabel: 'delete button',
    },
  ];

  const handleClickSelect = (event) => {
    setUserBoard(boardData[event.target.id]);
  };

  const handleBoardTitleChange = async () => {
    const newBoard = { ...userBoard };
    newBoard.name = boardTitleRef.current.value;
    await handleBoardUpdate(newBoard);
    setIsEditingName(false);
  };

  return (
    <Box>
      {isLoading && (
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Typography
            variant='h6'
            component='h3'
            color='primary'
            sx={{
              alignItems: 'center',
              marginTop: '20px',
              border: '1px solid',
              borderColor: 'primary',
              borderRadius: '4px',
              backgroundColor: 'background.paper',
            }}>
            <DownloadingIcon /> Getting the data.
          </Typography>
        </Stack>
      )}

      {boardData.length === 0 ? (
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Typography
            variant='h6'
            component='h4'
            color='primary'
            sx={{
              marginTop: '20px',
              border: '1px solid',
              borderColor: 'primary',
              borderRadius: '4px',
              backgroundColor: 'background.paper',
            }}>
            <IconButton
              variant='outlined'
              sx={{
                borderColor: 'primary.main',
                backgroundColor: 'background.paper',
              }}
              onClick={(e) => handleNewBoard(e)}>
              <AddCircleIcon size='small' />
            </IconButton>
            Create a board to get started.
          </Typography>
        </Stack>
      ) : (
        <>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='center'
            sx={{ padding: '3% 0' }}>
            <Box>
              <FormControl>
                <InputLabel id='select-board-label'>Board</InputLabel>
                <Select
                  labelId='select-board-label'
                  id='select-board'
                  value={userBoard.name}
                  label='Name'>
                  {boardData.map((board, index) => (
                    <MenuItem
                      onClick={(e) => handleClickSelect(e)}
                      id={index}
                      key={board._id}
                      value={board.name}
                      name={board.name}>
                      {board.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {!isEditingName ? (
              <Typography
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: '4px',
                  padding: '8px 0px 8px 16px',
                  backgroundColor: 'background.paper',
                }}
                variant='h5'
                component='h2'
                color='primary'>
                {userBoard.name}
                <MenuListPop menuItems={menuItems} id={userBoard._id} />
              </Typography>
            ) : (
              <>
                <ClickAwayListener onClickAway={() => setIsEditingName(false)}>
                  <Stack direction='row'>
                    <TextField
                      autoFocus
                      sx={{
                        borderColor: 'primary.main',
                      }}
                      variant='outlined'
                      inputRef={boardTitleRef}
                    />
                    <IconButton
                      color='primary'
                      onClick={() => handleBoardTitleChange()}>
                      <SaveIcon />
                    </IconButton>
                  </Stack>
                </ClickAwayListener>
              </>
            )}
          </Stack>

          <DragAndDropV2
            userBoard={userBoard}
            handleBoardUpdate={handleBoardUpdate}
          />
        </>
      )}
    </Box>
  );
};

export default KanbanBoard;
