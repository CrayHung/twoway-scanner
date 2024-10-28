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

  const { userRole, isLoggedIn, setIsLoggedIn } = useGlobalContext();

  const { formatMessage } = useIntl();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (

    <div className="header">
      <Link to="/main" style={{ float: 'left' }} >home img</Link>

      {isLoggedIn ? (
        <>
          <Link to="/" style={{ float: 'right' }} onClick={handleLogout}>{formatMessage({ id: 'logout' })}</Link>

          { userRole === 'ADMIN' ? (
            <Link to="/register" style={{ float: 'right' }} >{formatMessage({ id: 'register' })}</Link>
          ) : null}
        </>
      ) : (
        <>

          <Link to="/" style={{ float: 'right' }}>{formatMessage({ id: 'login' })}</Link>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 'auto' }}>
        <LanguageButton />
      </Box>
    </div>
  );
};

export default Header;
