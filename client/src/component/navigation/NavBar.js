import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  styled,
} from '@mui/material';
import { SelfImprovement } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../authentication/AuthProvider';

const NavButton = styled(Button)({
  border: '1px solid #F9F7F7',
  color: 'inherit',
  '&.active': {
    backgroundColor: '#F9F7F7',
    color: '#112D4E',
  },
});

const NavBar = () => {
  const { handleLogout, isLogin } = useAuthContext();

  const loggedInNav = (
    <nav>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <NavButton color='inherit' component={NavLink} to='/home'>
              <SelfImprovement />
              Productivity
            </NavButton>
          </Typography>
          <Stack direction='row' spacing={1}>
            <NavButton color='inherit' component={NavLink} to='/goals'>
              GOALS
            </NavButton>
            <NavButton color='inherit' component={NavLink} to='/learningcards'>
              Learning Cards
            </NavButton>
            <NavButton color='inherit' component={NavLink} to='/dashboard'>
              DASHBOARD
            </NavButton>
            <NavButton color='inherit' onClick={handleLogout}>
              LOG OUT
            </NavButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </nav>
  );

  const loggedOutNav = (
    <nav>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <NavButton color='inherit' component={NavLink} to='/home'>
              <SelfImprovement />
              Productivity
            </NavButton>
          </Typography>
          <Stack direction='row' spacing={2}>
            <NavButton color='inherit' component={NavLink} to='/signup'>
              SIGN UP
            </NavButton>
            <NavButton color='inherit' component={NavLink} to='/login'>
              LOG IN
            </NavButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </nav>
  );

  return <>{isLogin ? loggedInNav : loggedOutNav}</>;
};

export default NavBar;
