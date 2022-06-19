import { useState } from 'react';
import { Typography } from '@mui/material';
import DragAndDrop from '../component/DragAndDrop/DragAndDrop';
import { static_items } from '../component/DragAndDrop/data';

const Home = () => {
  const [userBoard, setUserBoard] = useState(static_items);

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
      <DragAndDrop content={userBoard} />
    </div>
  );
};

export default Home;
