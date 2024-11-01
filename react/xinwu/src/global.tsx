import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

export const GlobalContext = createContext<any>(null);

export const GlobalUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [globalUrl, setGlobalUrl] = useState({
    //url: 'http://192.168.195.195:8080',     //195
    url: 'http://127.0.0.1:8080',          //loacl
    // url: 'http://192.168.29.91:8080',       //twoway sacnner

    //wsurl: 'ws://192.168.195.195:8080/ws',  //195
    // wsurl: 'ws://127.0.0.1:8080/ws',          //loacl
    wsurl: 'ws://192.168.29.91:8080/ws',       //twoway sacnner

  });

  //取得目前的使用者身分
  const [userRole ,setUserRole]=useState('');

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


  const [table1Id ,setTable1Id] = useState('');     //存放當點到某一筆工單時的第一層table的ID
  const [workNo, setWorkNo] = useState('');         //工單號碼
  const [detailId,setDetailId]=useState(0);         //存放目前指向該筆工單的哪一筆資料
  const [quant, setQuant] = useState(0);            //工單數量
  const [part, setPart] = useState('');             //料號名稱
  const [model, setModel] = useState('');           //模式A~E

  const [company,setCompany] = useState('');        //公司單位 (Twoway或ACI)

  const [currentUser, setCurrentUser] = useState('admin');  // 當前使用者

  const [table3Data, setTable3Data] = useState([{
    "id":1,
    "partNumber":"QQ",
    "inputMode":"A",
    "number_per_pallet":10,
    "summary":"",
    "note":"",
    "create_user":"",
    "create_date":"",
    "edit_user":"",
    "edit_date":""
  },{
    "id":2,
    "partNumber":"AA",
    "inputMode":"D",
    "number_per_pallet":20,
    "summary":"",
    "note":"",
    "create_user":"",
    "create_date":"",
    "edit_user":"",
    "edit_date":""
  }]);


  const [table1Data, setTable1Data] = useState([{
    "id":1,
    "workOrderNumber": "01",
    "quantity": 2,
    "partNumber": "QQ",
    "company": "",
    "createUser": "admin",
    "createDate": "2024-09-16",
    "editUser": "admin",
    "editDate": "2024-09-16"
  }, {
    "id":2,
    "workOrderNumber": "02",
    "quantity": 1,
    "partNumber": "AA",
    "company": "",
    "createUser": "admin",
    "createDate": "2024-09-16",
    "editUser": "admin",
    "editDate": "2024-09-16"
  }]);

  const [table2Data, setTable2Data] = useState([{
      "id":1,
      "workOrderNumber": "01",
      "detailId": 1,
      "sn": "QQ123",
      "qr_RFTray": "DDDD",
      "qr_PS": "QZ",
      "qr_HS": "QQ",
      "qr_backup1": "",
      "qr_backup2": "",
      "qr_backup3": "",
      "qr_backup4": "",
      "note": "",
      "create_date": "2024-09-16",
      "create_user": "admin",
      "edit_date": "2024-09-16",
      "edit_user": "admin"
    }, {
      "id":2,
      "workOrderNumber": "01",
      "detailId": 2,
      "sn": "",
      "qr_RFTray": "",
      "qr_PS": "",
      "qr_HS": "",
      "qr_backup1": "",
      "qr_backup2": "",
      "qr_backup3": "",
      "qr_backup4": "",
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
      "sn": "",
      "qr_RFTray": "",
      "qr_PS": "",
      "qr_HS": "",
      "qr_backup1": "",
      "qr_backup2": "",
      "qr_backup3": "",
      "qr_backup4": "",
      "note": "",
      "create_date": "2024-09-16",
      "create_user": "admin",
      "edit_date": "2024-09-16",
      "edit_user": "admin"
    }
  
  ]);


  const contextValue = {
    company,
    setCompany,
    userRole,
    setUserRole,
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
