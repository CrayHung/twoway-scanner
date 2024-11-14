import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

export const GlobalContext = createContext<any>(null);

export const GlobalUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  //從localStorage中取得token
  const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  //取得目前的使用者身分
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!jwtToken);

  //公司單位 (Twoway或ACI)
  // const [company,setCompany] = useState('');  
  const [company, setCompany] = useState<string | null>(localStorage.getItem('company')); 
// 當前使用者
  const [currentUser, setCurrentUser] = useState('');    
  
  
  const ip = window.location.host.split(":")[0];
  const serverUrl = `http://${ip}:8080`;
  // const serverUrl = window.location.origin;

  const [globalUrl, setGlobalUrl] = useState({
    //url: 'http://192.168.195.195:8080',     //195
    url: serverUrl,
    // url: 'http://192.168.29.91:8080',       //twoway sacnner NUC
    // url: 'http://59.120.199.69:8080',       //twoway sacnner WINDOWS

    //wsurl: 'ws://192.168.195.195:8080/ws',  //195
    // wsurl: 'ws://127.0.0.1:8080/ws',          //loacl
    // wsurl: 'ws://192.168.29.91:8080/ws',       //twoway sacnner
    wsurl: 'ws://59.120.199.69:8080/ws',       //twoway sacnner WINDOWS

  });

/******************************************************* */
  // 更新 Token 和 Role 並存入 localStorage
  const setToken = (token: string | null, role: string | null , company: string | null ) => {
    if (token && role && company) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('company', company);


      setJwtToken(token);
      setUserRole(role);
      setCompany(company);

      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('company');

      setJwtToken(null);
      setUserRole(null);
      setCompany(null);

      setIsLoggedIn(false);
    }
  };

  // 登出函數
  const logout = () => {
    setToken(null, null,null);
  };

  // 應用程式載入時檢查 localStorage 中的 token
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    const company = localStorage.getItem('company');

    if (token && role ) {
      setJwtToken(token);
      setUserRole(role);
      setCompany(company);

      setIsLoggedIn(true);
    }
  }, []);

/***************************************************** */
  // useEffect(() => {
  //   const token = localStorage.getItem('jwtToken');
  //   const role = localStorage.getItem('userRole');
  //   if (token ) {
  //     setJwtToken(token);
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  // 將token存到localStorage中
  // const setToken = (token: string | null) => {
  //   if (token) {
  //     localStorage.setItem('jwtToken', token);
  //     setIsLoggedIn(true);
  //   } else {
  //     localStorage.removeItem('jwtToken');
  //     setIsLoggedIn(false);
  //   }
  //   setJwtToken(token);
  // };

 


  const [cam1LatestData, setCam1LatestData] = useState(null);
  const [cam2LatestData, setCam2LatestData] = useState(null);


  const [table1Id ,setTable1Id] = useState('');     //存放當點到某一筆工單時的第一層table的ID
  const [workNo, setWorkNo] = useState('');         //工單號碼
  const [detailId,setDetailId]=useState(0);         //存放目前指向該筆工單的哪一筆資料
  const [quant, setQuant] = useState(0);            //工單數量
  const [part, setPart] = useState('');             //料號名稱
  const [model, setModel] = useState('');           //模式A~E

 
  const [table3Data, setTable3Data] = useState([]);

  const [table1Data, setTable1Data] = useState([]);

  const [table2Data, setTable2Data] = useState([]);


  const contextValue = {
    company,
    setCompany,
    userRole,
    setUserRole,
    isLoggedIn,
    setIsLoggedIn,
    globalUrl,
    jwtToken,
    setJwtToken,
    // setJwtToken: setToken,

    setToken,
    logout,

    cam1LatestData,
    setCam1LatestData,
    cam2LatestData,
    setCam2LatestData,
    table2Data,
    setTable2Data,
    table3Data, 
    setTable3Data,
    workNo,
    setWorkNo,
    table1Data,
    setTable1Data,
    part,
    setPart,

    quant,
    setQuant,
    model, 
    setModel,
    detailId,
    setDetailId,
    currentUser,
    setCurrentUser,

    table1Id ,
    setTable1Id
  };


  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};


export const useGlobalContext = () => {

  const context = useContext(GlobalContext);
  return context;
};
