import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

export const GlobalContext = createContext<any>(null);

export const GlobalUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
  const [globalUrl, setGlobalUrl] = useState({
    //url: 'http://192.168.195.195:8080',     //195
    url: 'http://127.0.0.1:8080',              //loacl

    //wsurl: 'ws://192.168.195.195:8080/ws',  //195
    wsurl: 'ws://127.0.0.1:8080/ws',          //loacl
  });



  //從localStorage中取得token
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const token = localStorage.getItem('jwtToken');
  //   if (token) {
  //     setJwtToken(token);
  //   }
  // }, []);

  //將token存到localStorage中
  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
    setJwtToken(token);
  };



  const contextValue = {
    globalUrl,
    jwtToken,
    setToken
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
