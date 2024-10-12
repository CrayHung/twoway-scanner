import React from 'react';
import { Link } from 'react-router-dom';
import "./Menu.css"

const Menu = () => {
  return (
    <div className="menu">
      
      <Link to="/"> - 所有工單 (編輯)</Link>
      <Link to="/allowlist"> - 新增工單</Link>
      <Link to="/searchTable1">- 查詢+下載</Link>
    </div>
  );
};

export default Menu;
