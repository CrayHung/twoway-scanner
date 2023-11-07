import React, { createContext, useContext, ReactNode } from 'react';

export const UrlContext = createContext<any>(null);

export const GlobalUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
//local端測試用127.0.0.1:8080 , 部屬到195上的話用192.168.195.195
  const globalUrl = {
    //url: 'http://192.168.195.195:8080',     //195
    url: 'http://127.0.0.1:8080',             //loacl

    //wsurl: 'ws://192.168.195.195:8080/ws',  //195
    wsurl: 'ws://127.0.0.1:8080/ws',          //loacl
  };

  return (
    <UrlContext.Provider value={globalUrl}>
      {children}
    </UrlContext.Provider>
  );
};


export const useGlobalUrl = () => {

  const context = useContext(UrlContext);
  return context;
};
