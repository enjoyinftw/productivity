import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import DragAndDrop from '../component/DragAndDrop/DragAndDrop';
import { static_items } from '../component/DragAndDrop/data';

const Home = () => {
  const demoData = {};
  demoData['content'] = static_items;

  const [userBoard, setUserBoard] = useState(demoData);

  return (
    <div>
      <Typography
        textAlign='center'
        color='info'
        variant='h5'
        component='h1'
        sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
        DragAndDrop Demo. Add, edit, save and delete function in the future.
      </Typography>
      <Typography
        textAlign='center'
        color='info'
        variant='h5'
        component='h1'
        sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
        Sign Up, Login and Logout functional, but dont provide additional
        features.
      </Typography>

      <DragAndDrop userBoard={userBoard} />
    </div>
  );
};

export default Home;
