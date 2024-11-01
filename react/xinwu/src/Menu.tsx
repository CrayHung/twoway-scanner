import React from 'react';
import { Link } from 'react-router-dom';
import "./Menu.css"
import { useIntl } from "react-intl";
import { useGlobalContext } from './global';

const Menu = () => {
  const { formatMessage } = useIntl();
  const { userRole, isLoggedIn, globalUrl } = useGlobalContext();

  return (
    <div className="menu">

      {isLoggedIn ? (
        <>
          {(userRole === 'OPERATOR' || userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            <Link to="/">{formatMessage({ id: 'Menu-All-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR') && (
            <Link to="/allowlist">{formatMessage({ id: 'Menu-Add-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR' || userRole === 'OPERATOR' || userRole === 'USER') && (
            <Link to="/searchTable1">{formatMessage({ id: 'Menu-Search-WorkOrders' })}</Link>
          )}

          {(userRole === 'ADMIN' || userRole === 'SUPERVISOR') && (
            <Link to="/partTable">{formatMessage({ id: 'part-table' })}</Link>
          )}

          {userRole === 'ADMIN' && (
            <Link to="/accountPage">{formatMessage({ id: 'account-page' })}</Link>
          )}
        </>
      ) : (
        <></>
      )}

    </div>
  );
};

export default Menu;
