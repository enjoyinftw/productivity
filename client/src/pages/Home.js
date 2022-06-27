import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import DragAndDropV2 from '../component/DragAndDrop/DragAndDropv2';
import { static_items } from '../component/DragAndDrop/data';

const Home = () => {
  const demoData = static_items;

  const [userBoard, setUserBoard] = useState(demoData);

  return (
    <div style={{ marginTop: '70px' }}>
      <Typography
        textAlign='center'
        variant='h5'
        component='h1'
        color='primary'>
        Demo
      </Typography>
      <DragAndDropV2 userBoard={userBoard} handleBoardUpdate={setUserBoard} />
    </div>
  );
};

export default Home;
