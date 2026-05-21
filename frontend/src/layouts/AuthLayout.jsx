import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Outlet hona bahut zaroori hai, tabhi Login page dikhega */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;