import React, { useEffect, useState, createContext, useContext } from 'react';

import { useGlobalContext } from './global';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';

import Header from './Header';
import Menu from './Menu';

import "./App.css";
import LogInPage from './LogInPage';
import Register from './Register';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

import AllowList from './component/AllowList';
import SearchForm from './component/SearchForm';
import SearchTable1 from './component/SearchTable1';

import ShowAllWork from './component/ShowAllWork';

import { IntlProvider } from "react-intl";
import useNavigatorLanguage, { LocaleContext } from "./language/useNavigatorLanguage";
import useGetMessage from "./language/useGetMessage";


function App() {
  const [locale, setLocale] = useNavigatorLanguage();
  const messages = useGetMessage();

  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
  return (
    <LocaleContext.Provider value={[locale, setLocale]}>
    <IntlProvider locale={locale} messages={messages && messages[locale]}>


    <Router>
      <div className="app">

        <Header/>

        <div className="container" >
        <div className="menu"> {/* 固定的左側 Menu */}
        <Menu />
        </div>


          <Routes>
          {isLoggedIn ? (
            <>
            {/* <Route path="/" element={<Navigate to="/searchTable1" />} /> */}
            <Route path="/allowlist" Component={AllowList} /> 
            <Route path="/searchForm" Component={SearchForm} /> 
            <Route path="/searchTable1" Component={SearchTable1} /> 



            <Route path="/" Component={ShowAllWork} /> 

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
    </IntlProvider>
    </LocaleContext.Provider>
  );
}

export default App;
