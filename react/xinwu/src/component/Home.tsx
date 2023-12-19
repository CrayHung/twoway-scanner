import React, { useEffect, useState, createContext , useContext } from 'react';
import WebSocketComponent from "./websocket";
import { useGlobalContext } from '../global';

import { BrowserRouter as Router, Route } from 'react-router-dom';


function Home() {

  const {globalUrl,jwtToken,setToken}=useGlobalContext();

  const { url, wsurl } = globalUrl;
  const [lprData,setLprData] = useState<any[]>([]);
  //const jwtToken1 = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMjYzMTg5OSwiZXhwIjoxNzAyNjM1NDk5fQ.LpXDmqSXcOgW4t9xHDguicPZ7BEETw9_nP1cLJVQnaM"
  
  useEffect(() => {
    console.log(jwtToken);
      const headers = {'Authorization':`Bearer ${jwtToken}`,
                      "Content-Type": "application/json"};
    
      //console.log(headers);
      //console.log(url);
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
      <div>
      <WebSocketComponent></WebSocketComponent>
      </div>

        {/* <ul>
            {lprData.map((jsonObject) => (
              <li key={jsonObject.id}>
                <p>plateNumber: {jsonObject.plateNumber}</p>
                <p>vehicleType: {jsonObject.vehicleType}</p>
              </li>
            ))}
          </ul> */}

    </>
  );
}

export default Home;
