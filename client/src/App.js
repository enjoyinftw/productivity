import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import FlashCards from './pages/FlashCards';
import Layout from './component/Layout';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AuthProvider from './component/authentication/AuthProvider';
import ProtectedRoute from './component/authentication/ProtectedRoute';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#112D4E',
    },
    secondary: {
      //main: '#3F72AF',
      main: '#646FD4',
    },
    background: {
      default: '#3F72AF',
      paper: '#DBE2EF',
    },
    error: {
      main: '#ff2442',
    },
    warning: {
      main: '#ffb830',
    },
    info: {
      main: '#646fd4',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route
              path='goals'
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path='dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='learningcards'
              element={
                <ProtectedRoute>
                  <FlashCards />
                </ProtectedRoute>
              }
            />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
