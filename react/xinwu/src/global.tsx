import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

export const GlobalContext = createContext<any>(null);

export const GlobalUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [globalUrl, setGlobalUrl] = useState({
    //url: 'http://192.168.195.195:8080',     //195
    url: 'http://127.0.0.1:8080',          //loacl

    //wsurl: 'ws://192.168.195.195:8080/ws',  //195
    wsurl: 'ws://127.0.0.1:8080/ws',          //loacl
  });

  //從localStorage中取得token
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setJwtToken(token);
    }
  }, [jwtToken]);

  //將token存到localStorage中
  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
    setJwtToken(token);
  };

  const [cam1LatestData, setCam1LatestData] = useState(null);
  const [cam2LatestData, setCam2LatestData] = useState(null);


  const [workNo, setWorkNo] = useState('');         //工單號碼
  const [detailId,setDetailId]=useState(0);         //存放目前指向該筆工單的哪一筆資料
  const [quant, setQuant] = useState(0);               //工單數量
  const [part, setPart] = useState('');           //料號名稱
  const [model, setModel] = useState('');           //模式A~E

  const [currentUser, setCurrentUser] = useState('admin');  // 當前使用者

  const [table3Data, setTable3Data] = useState([{
    "id":1,
    "partNumber":"QQ",
    "inputModel":"A"
  },{
    "id":2,
    "partNumber":"AA",
    "inputModel":"D"
  }]);


  const [table1Data, setTable1Data] = useState([{
    "id":1,
    "workOrderNumber": "01",
    "quantity": 2,
    "partNumber": "QQ",
    "createUser": "admin",
    "createDate": "2024-09-16",
    "editUser": "admin",
    "editDate": "2024-09-16"
  }, {
    "id":2,
    "workOrderNumber": "02",
    "quantity": 1,
    "partNumber": "AA",
    "createUser": "admin",
    "createDate": "2024-09-16",
    "editUser": "admin",
    "editDate": "2024-09-16"
  }]);

  const [table2Data, setTable2Data] = useState([{
      "id":1,
      "workOrderNumber": "01",
      "detailId": 1,
      "SN": "QQ123",
      "QR_RFTray": "DDDD",
      "QR_PS": "QZ",
      "QR_HS": "QQ",
      "QR_backup1": "",
      "QR_backup2": "",
      "QR_backup3": "",
      "QR_backup4": "",
      "note": "",
      "create_date": "2024-09-16",
      "create_user": "admin",
      "edit_date": "2024-09-16",
      "edit_user": "admin"
    }, {
      "id":2,
      "workOrderNumber": "01",
      "detailId": 2,
      "SN": "",
      "QR_RFTray": "",
      "QR_PS": "",
      "QR_HS": "",
      "QR_backup1": "",
      "QR_backup2": "",
      "QR_backup3": "",
      "QR_backup4": "",
      "note": "",
      "create_date": "2024-09-16",
      "create_user": "admin",
      "edit_date": "2024-09-16",
      "edit_user": "admin"
    }
    
    , {
      "id":3,
      "workOrderNumber": "02",
      "detailId": 1,
      "SN": "",
      "QR_RFTray": "",
      "QR_PS": "",
      "QR_HS": "",
      "QR_backup1": "",
      "QR_backup2": "",
      "QR_backup3": "",
      "QR_backup4": "",
      "note": "",
      "create_date": "2024-09-16",
      "create_user": "admin",
      "edit_date": "2024-09-16",
      "edit_user": "admin"
    }
  
  ]);


  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    globalUrl,
    jwtToken,
    //setJwtToken,
    setJwtToken: setToken,
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
    setCurrentUser
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
