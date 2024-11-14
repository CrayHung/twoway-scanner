import React, { useEffect, useState, createContext, useContext } from 'react';

import { useGlobalContext } from './global';
import { BrowserRouter as Router, Route, Routes,Navigate  } from 'react-router-dom';

import Header from './Header';
import Menu from './Menu';

import "./App.css";
import LogInPage from './LogInPage';
import Register from './Register';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

import AddNewWorker from './component/AddNewWorker';
import SearchForm from './component/SearchForm';
import SearchTable1 from './component/SearchTable1';

import EditWork from './component/EditWork';
import PartTable from './component/partTable';
import AccountPage from './component/AccountPage';


import { IntlProvider } from "react-intl";
import useNavigatorLanguage, { LocaleContext } from "./language/useNavigatorLanguage";
import useGetMessage from "./language/useGetMessage";


import TwowayScannerImportOracleXlsx from './component/twowayScannerImportOracleXlsx';
import HomePage from './HomePage';

function App() {
  const [locale, setLocale] = useNavigatorLanguage();
  const messages = useGetMessage();

  const {    jwtToken, userRole,isLoggedIn, setIsLoggedIn } = useGlobalContext();
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
          {/* {jwtToken ? ( */}
          {isLoggedIn ? (


            <>


            <Route path="/" Component={HomePage} /> 
            <Route path="/reload" element={<Navigate to="/" />} />

            <Route path="/addnewworker" Component={AddNewWorker} /> 
            <Route path="/addnewworker/reload" element={<Navigate to="/addnewworker" />} />

            <Route path="/editWorker" Component={EditWork} /> 
            <Route path="/editWorker/reload" element={<Navigate to="/editWorker" />} />

            <Route path="/searchForm" Component={SearchForm} /> 
            <Route path="/searchForm/reload" element={<Navigate to="/searchForm" />} />

            <Route path="/searchTable1" Component={SearchTable1} /> 
            <Route path="/searchTable1/reload" element={<Navigate to="/searchTable1" />} />

            <Route path="/partTable" Component={PartTable} /> 
            <Route path="/partTable/reload" element={<Navigate to="/partTable" />} />

            <Route path="/register" Component={Register} /> 
            <Route path="/register/reload" element={<Navigate to="/register" />} />



            <Route path="/accountPage" Component={AccountPage} /> 
            <Route path="/accountPage/reload" element={<Navigate to="/accountPage" />} />

            <Route path="/importOracle" Component={TwowayScannerImportOracleXlsx} /> 
            <Route path="/importOracle/reload" element={<Navigate to="/importOracle" />} />

            

            </>
             ) : (
              <>
              <Route path="/" element={<LogInPage />} />
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
