import React, { useEffect, useState, createContext , useContext } from 'react';
import WebSocketComponent from './component/websocket';
import { useGlobalUrl } from './globalUrl';


function App() {

  const {url}=useGlobalUrl();

  const [lprData,setLprData] = useState<any[]>([]);

  useEffect(() => {

      fetch("http://127.0.0.1:8080/lpr/all")
      //fetch(url+"/lpr/all")
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
