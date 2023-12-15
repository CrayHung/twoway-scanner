import React, { useEffect, useState, createContext , useContext } from 'react';
import WebSocketComponent from './component/websocket';
import { useGlobalContext } from './global';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './component/Home';
import ResetPassword from './component/ResetPassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/reset-password/:token" Component={ResetPassword} />
      </Routes>
    </Router>
  );
}

export default App;
