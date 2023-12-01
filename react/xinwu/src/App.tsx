import React, { useEffect, useState, createContext , useContext } from 'react';
import WebSocketComponent from './component/websocket';
import { useGlobalContext } from './global';


function App() {

  const {globalUrl,jwtToken,setToken}=useGlobalContext();

  const { url, wsurl } = globalUrl;
  const [lprData,setLprData] = useState<any[]>([]);
  const jwtToken1 = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJPUCIsImlhdCI6MTcwMTE2NTU4OCwiZXhwIjoxNzAxMTY5MTg4fQ.wd0nGFE4INNVkImyToAqQEmXxvV6gO3a0kL3ZyGq-_I"
  
  useEffect(() => {
    console.log(jwtToken1);
      const headers = {'Authorization':`Bearer ${jwtToken1}`,
                      "Content-Type": "application/json"};
    
      console.log(headers);
      console.log(url);
      fetch(url+"/lpr/all", {headers})
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setLprData(data);
      });
  }, []);


  

  return (
    <>
      <div><p>react OK</p></div>
      {/* <div>
      <WebSocketComponent></WebSocketComponent>
      </div> */}

        <ul>
            {lprData.map((jsonObject) => (
              <li key={jsonObject.id}>
                <p>plateNumber: {jsonObject.plateNumber}</p>
                <p>vehicleType: {jsonObject.vehicleType}</p>
              </li>
            ))}
          </ul>

    </>
  );
}

export default App;
