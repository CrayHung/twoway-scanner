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

  /**fetch token at begining */
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'admin',
            password: '1234',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }

        const data = await response.json();
        const token = data.token; // Replace 'token' with the actual key in your API response

        setToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);





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
