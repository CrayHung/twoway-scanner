import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./Menu.css"
import { useIntl } from "react-intl";
import { useGlobalContext } from './global';

const Menu = () => {
  const { formatMessage } = useIntl();
  const { userRole, isLoggedIn, globalUrl } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();

  // const handleLinkClick = (path:any) => {
  //   if (location.pathname === path) {
  //      // 如果當前頁面與目標頁面相同，強制刷新頁面
  //      navigate(path);
  //      navigate(0);
  //     } else {
  //       // 如果是不同頁面，透過 React Router 正常導航
  //       window.location.href = path;
  //     }
  // };

  return (
    <div className="menu">

      {isLoggedIn ? (
        <>
          {(userRole === 'OPERATOR' || userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            // <Link to="/"  >{formatMessage({ id: 'Menu-All-WorkOrders' })}</Link>
            <Link to="/reload"  >{formatMessage({ id: 'Menu-All-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR') && (
            // <Link to="/allowlist" >{formatMessage({ id: 'Menu-Add-WorkOrders' })}</Link>
            <Link to="/allowlist/reload">{formatMessage({ id: 'Menu-Add-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR' || userRole === 'USER') && (
            // <Link to="/searchTable1" >{formatMessage({ id: 'Menu-Search-WorkOrders' })}</Link>
            <Link to="/searchTable1/reload">{formatMessage({ id: 'Menu-Search-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            // <Link to="/partTable" >{formatMessage({ id: 'part-table' })}</Link>
            <Link to="/partTable/reload" >{formatMessage({ id: 'part-table' })}</Link>
          )}

          {userRole === 'ADMIN' && (
            // <Link to="/accountPage" >{formatMessage({ id: 'account-page' })}</Link>
            <Link to="/accountPage/reload" >{formatMessage({ id: 'account-page' })}</Link>
          )}
        </>
      ) : (
        <></>
      )}




      {/* {isLoggedIn ? (
        <>
          {(userRole === 'OPERATOR' || userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            <Link to="/" onClick={() => handleLinkClick('/')} >{formatMessage({ id: 'Menu-All-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR') && (
            <Link to="/allowlist" onClick={() => handleLinkClick('/allowlist')}>{formatMessage({ id: 'Menu-Add-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR' || userRole === 'USER') && (
            <Link to="/searchTable1" onClick={() => handleLinkClick('/searchTable1')}>{formatMessage({ id: 'Menu-Search-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            <Link to="/partTable" onClick={() => handleLinkClick('/partTable')}>{formatMessage({ id: 'part-table' })}</Link>
          )}

          {userRole === 'ADMIN' && (
            <Link to="/accountPage" onClick={() => handleLinkClick('/accountPage')}>{formatMessage({ id: 'account-page' })}</Link>
          )}
        </>
      ) : (
        <></>
      )} */}

    </div>
  );
};

export default Menu;
