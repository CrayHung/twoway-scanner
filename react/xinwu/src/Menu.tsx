import React from 'react';
import { Link } from 'react-router-dom';
import "./Menu.css"

const Menu = () => {
  return (
    <div className="menu">
      {/* <Link to="/realtime">即時畫面</Link> */}
      <Link to="/history">進出紀錄</Link>
      <Link to="/allowlist">黑白名單</Link>
      <Link to="/upload&download">紀錄下載</Link>
    </div>
  );
};

export default Menu;
