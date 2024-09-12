import React, { useEffect, useState, createContext, useContext } from 'react';

import { useGlobalContext } from './global';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Menu from './Menu';

import "./App.css";
import RealTime from './component/RealTime';
import History from './component/History';
import LogInPage from './LogInPage';
import AllowList from './component/AllowList';
import Register from './Register';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';
import UploadDownload from './component/UploadDownload';





function App() {


  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();



  return (
    <Router>
      <div className="app">

        <Header/>

        <div className="container" >

          <Menu />

          <Routes>
          {isLoggedIn ? (
            <>
            <Route path="/" element={<Navigate to="/main" />} />
            <Route path="/main" Component={Main} />
            <Route path="/realtime" Component={RealTime} />
            <Route path="/history" Component={History} />
            <Route path="/allowlist" Component={AllowList} /> 
            <Route path="/upload&download" Component={UploadDownload} /> 
            </>
             ) : (
              <>
              <Route path="/" element={<LogInPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              </>
            )}
          </Routes>



        </div>
      </div>
    </Router>

  );
}

export default App;
