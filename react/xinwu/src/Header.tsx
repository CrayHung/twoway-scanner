// Header.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from './global';
import "./Header.css"


interface HeaderProps {
    isLoggedIn: boolean;
  }

const Header =()=>{

    const { isLoggedIn, setIsLoggedIn } = useGlobalContext();

    const handleLogin = () => {
        setIsLoggedIn(true);
      };

    const handleLogout = () => {
        setIsLoggedIn(false);
      };

  return (

    <div className="header">
      <Link to="/main" style={{float:'left' }} >home img</Link>

      {isLoggedIn ? (
        <Link to="/"  style={{float:'right' }} onClick={handleLogout}>Logout</Link>
        
      ) : (
        <>
          <Link to="/register" style={{float:'right' }}>Register</Link>
          <Link to="/" style={{float:'right' }}>Login</Link>
        </>
      )}
    </div>
  );
};

export default Header;
