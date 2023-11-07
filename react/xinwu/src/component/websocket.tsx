// WebSocketComponent.tsx
import React, { useEffect, useState } from "react";
import Stomp from "stompjs";
import SockJS from 'sockjs-client';
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { ReadyState } from "react-use-websocket";
import {useGlobalUrl} from "../globalUrl";

/*********************************************************** */
interface CamData {
  cameraId:string;
  id: number;
  imagePath:string;
  plateIn:string;
  plateNumber: string;
  recognitionTime:string;
  recognitionTimestr:string;
}

/*********************************************************** */
const WebSocketComponent = () => {

  const {url,wsurl}=useGlobalUrl();


  //const [socketUrl] = useState('ws://127.0.0.1:8080/ws'); 
  const [socketUrl] = useState(wsurl); 
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);



  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      // sendMessage('Hello, server!');
      console.log("ReadyState"+ReadyState)
    }
  }, [readyState]);


  /*******如果接收的是JSON, 處理反序列化 , 如果是接收單一字串   以下可免********/
  const [listData, setListData] = useState<string[]>([]);
  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const jsonData = JSON.parse(lastMessage.data);

        if (Array.isArray(jsonData)) {
          setListData(jsonData);
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, [lastMessage]);


  /****************************根據不同攝影機 , 取得不同資訊並渲染 */
  const [cam1LatestData,setCam1LatestData]= useState<CamData | null>(null);
  const [cam2LatestData,setCam2LatestData]= useState<CamData | null>(null);

  /* 最新資料載入 */
  useEffect(() => {
    // [DEMO]
    (async () => {
      try {
        //const res = await fetch("http://192.168.195.195:8080/lpr/cams/latest");
        //const res = await fetch("http://127.0.0.1:8080/lpr/cams/latest");
        const res = await fetch(url+"/lpr/cams/latest");
        if (res.ok) {
          const data = await res.json();
          console.log(data);


          setCam1LatestData(data.cam1);
          setCam2LatestData(data.cam2);
        }
      } catch (err) {
        console.error(err);
      }
    })();

  }, [cam1LatestData,cam2LatestData]);


  
  return (
    <div>

      <div>
          <h1>CAM1 latest</h1>
          <p>{cam1LatestData?.plateNumber}</p>
      </div>

      <div>
          <h1>CAM2 latest</h1>
          <p>{cam2LatestData?.plateNumber}</p>

      </div>
      <div>
        
      {/* 如果接收的是單一字串, 用此區塊 */}
      {/* {lastMessage && (
        <div>
          <p>Last Message from Server: {lastMessage.data}</p>
        </div>
      )} */}


      {/* 如果接收的是JSON, 用此區塊 */}
      {listData.length > 0 && (
        <div>
          <h1>Received List:</h1>
          <ul>
            {listData.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {/* 如果接收的是JSON, 用此區塊 */}


    </div>


       
      {/* <h1>Received Plate Number: {data}</h1> */}
    </div>
  );
};

export default WebSocketComponent;
