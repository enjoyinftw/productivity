import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import KanbanBoard from '../component/KanbanBoard/KanbanBoard';
import axios from 'axios';

const Goals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userBoard, setUserBoard] = useState([]);
  const [boardData, setBoardData] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/kanban/findall`, {
          withCredentials: true,
          credentials: 'include',
        });
        setBoardData(data);
        setUserBoard(data.boardData[0]);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div>
      <KanbanBoard />
    </div>
  );
};

export default Goals;

/*{isLoading ? (
        <Typography
          textAlign='center'
          color='info'
          variant='h6'
          component='h3'
          sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
          loading
        </Typography>
      ) : (
        <DragAndDrop userBoard={userBoard} setUserBoard={setUserBoard} />
      )} */
