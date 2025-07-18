import React, { useEffect, useState, createContext, useContext } from 'react';

import { useGlobalContext } from './global';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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
import ACIPicking from './component/ACIPicking';
import ACIStock from './component/ACIStock';
import ACIShippedPage from './component/ACIShippedPage';
import ACIPalletManagementPage from './component/ACIPalletManagementPage';
import ACIRepackPage from './component/ACIRepackPage';
import ACICustomerPage from './component/ACICustomerPage';
import ACIShippingCart from './component/ACIShippingCart';
import ACItest from './component/ACItest';
import ACICreatePallet from './component/ACICreatePallet';
import ACIAddCarton from './component/ACIAddCarton';
import ACIShipHistoryPage from './component/ACIShipHistoryPage';
import PalletAndShipPage from './component/PalletAndShipPage';

function App() {
  const [locale, setLocale] = useNavigatorLanguage();
  const messages = useGetMessage();

  const { jwtToken, userRole, isLoggedIn, setIsLoggedIn } = useGlobalContext();
  return (
    <LocaleContext.Provider value={[locale, setLocale]}>
      <IntlProvider locale={locale} messages={messages && messages[locale]}>


        <Router>
          <div className="app">

            <Header />

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

                    <Route path="/palletAndShipPage" Component={PalletAndShipPage} />
                    <Route path="/palletAndShipPage/reload" element={<Navigate to="/palletAndShipPage" />} />



                    {/* ACI */}
                    <Route path="/importOracle" Component={TwowayScannerImportOracleXlsx} />
                    <Route path="/importOracle/reload" element={<Navigate to="/importOracle" />} />


                    <Route path="/ACI/stock" Component={ACIStock} />
                    <Route path="/ACI/stock/reload" element={<Navigate to="/ACI/stock" />} />

                    <Route path="/ACI/picking" Component={ACIPicking} />
                    <Route path="/ACI/picking/reload" element={<Navigate to="/ACI/picking" />} />


                    <Route path="/ACI/shippingCart" Component={ACIShippingCart} />
                    <Route path="/ACI/shippingCart/reload" element={<Navigate to="/ACI/shippingCart" />} />

                    {/* 入庫檢視 */}
                    <Route path="/ACI/shipHistoryPage" Component={ACIShipHistoryPage} />
                    <Route path="/ACI/shipHistoryPage/reload" element={<Navigate to="/ACI/shipHistoryPage" />} />

                    {/* 出貨檢視 */}
                    <Route path="/ACI/shipped" Component={ACIShippedPage} />
                    <Route path="/ACI/shipped/reload" element={<Navigate to="/ACI/shipped" />} />

                    <Route path="/ACI/palletManagement" Component={ACIPalletManagementPage} />
                    <Route path="/ACI/palletManagement/reload" element={<Navigate to="/ACI/palletManagement" />} />

                    <Route path="/ACI/repack" Component={ACIRepackPage} />
                    <Route path="/ACI/repack/reload" element={<Navigate to="/ACI/repack" />} />

                    <Route path="/ACI/customer" Component={ACICustomerPage} />
                    <Route path="/ACI/customer/reload" element={<Navigate to="/ACI/customer" />} />

                    <Route path="/ACI/test" Component={ACItest} />
                    <Route path="/ACI/test/reload" element={<Navigate to="/ACI/test" />} />


                    <Route path="/ACI/createPallet" Component={ACICreatePallet} />
                    <Route path="/ACI/createPallet/reload" element={<Navigate to="/ACI/createPallet" />} />

                    {/* 帶入palletName的參數 */}
                    <Route path="/ACI/ACIAddCarton" Component={ACIAddCarton} />
                    <Route
                      path="/ACI/ACIAddCarton/reload"
                      element={<Navigate to={`/ACI/ACIAddCarton${window.location.search}`} replace />}
                    />
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
