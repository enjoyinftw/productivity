import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './navigation/NavBar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main style={{ marginTop: 64 }}>
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
