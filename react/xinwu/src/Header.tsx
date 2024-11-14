// Header.tsx

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from './global';
import "./Header.css"
import LanguageButton from "./language/LanguageButton";
import { useIntl } from "react-intl";

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header = () => {

  const { jwtToken,currentUser, userRole, isLoggedIn, setIsLoggedIn, setToken } = useGlobalContext();

  const { formatMessage } = useIntl();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null,null,null);
  };

  return (

    <div className="header">
      <Link to="/" style={{ float: 'left' }} >home img</Link>
      {/* {jwtToken ? ( */}
      {isLoggedIn ? (
        <>
          <Link to="/" style={{ float: 'right' }} onClick={handleLogout}>{formatMessage({ id: 'logout' })}</Link>

          {/* { userRole === 'ADMIN' ? (
            <Link to="/register" style={{ float: 'right' }} >{formatMessage({ id: 'register' })}</Link>
          ) : null} */}


          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 'auto' }}> */}
          <Box style={{ float: 'right' }}>
            <LanguageButton />
          </Box>

          {/* 顯示目前使用者名稱 */}
          {currentUser && (
            <span style={{
              width: '60px',
              backgroundColor: 'lightskyblue',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              marginRight: '10px',
              float: 'right'
            }}>
              {currentUser}
            </span>
          )}



        </>
      ) : (
        <>



          <Link to="/" style={{ float: 'right' }}>{formatMessage({ id: 'login' })}</Link>

          <Box style={{ float: 'right' }}>
            <LanguageButton />
          </Box>
        </>
      )}

    </div>
  );
};

export default Header;
