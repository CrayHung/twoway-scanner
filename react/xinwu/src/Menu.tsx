import React from 'react';
import { Link } from 'react-router-dom';
import "./Menu.css"
import { useIntl } from "react-intl";

const Menu = () => {
  const { formatMessage } = useIntl();
  return (
    <div className="menu">
      
      <Link to="/">  {formatMessage({ id: 'Menu-All-WorkOrders' })}</Link>
      <Link to="/allowlist"> {formatMessage({ id: 'Menu-Add-WorkOrders' })}</Link>
      <Link to="/searchTable1">{formatMessage({ id: 'Menu-Search-WorkOrders' })}</Link>
    </div>
  );
};

export default Menu;
