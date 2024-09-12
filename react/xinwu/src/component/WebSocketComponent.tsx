// WebSocket.tsx
import React, { useEffect, useState,createContext } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { ReadyState } from "react-use-websocket";
import { useGlobalContext } from '../global';
import RealTime from "./RealTime";



/*********************************************************** */
interface CamData {
  cameraId:string;
  carType:string;
  id: number;
  imagePath:string;
  plateIn:string;
  plateNumber: string;
  recognitionTime:string;
  recognitionTimestr:string;
}

/*********************************************************** */
const WebSocket = () => {

  const { jwtToken,setJwtToken,isLoggedIn, setIsLoggedIn,globalUrl , cam1LatestData ,setCam1LatestData, cam2LatestData, setCam2LatestData } = useGlobalContext();

  const [socketUrl] = useState(globalUrl.wsurl); 

  console.log(jwtToken);
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  // const [listData, setListData] = useState<string[]>([]);
  // const [cam1LatestData,setCam1LatestData]= useState<CamData | null>(null);
  // const [cam2LatestData,setCam2LatestData]= useState<CamData | null>(null);


  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      // sendMessage('Hello, server!');
    }
    else if (readyState === ReadyState.CLOSED) {
      console.log("WebSocket connection is closed!");
    }
  }, [readyState]);

    /* 一進網頁就先fetch最新資料載入 */
    useEffect(() => {
      fetchData();
    }, []);

    /** */
    useEffect(() => {
      // [DEMO]
      if (readyState === ReadyState.OPEN) {
        const fetchData = async () => {
        try {
          const res = await fetch(globalUrl.url+"/lpr/cams/latest");
          if (res.ok) {
            const data = await res.json();
            console.log(data);
  
  
            setCam1LatestData(data.cam1);
            setCam2LatestData(data.cam2);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
    }, [lastMessage,readyState]);



  const fetchData = async () => {
    try {
      const res = await fetch(globalUrl.url + "/lpr/cams/latest");
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setCam1LatestData(data.cam1);
        setCam2LatestData(data.cam2);
      }
    } catch (err) {
      console.error(err);
    }
  };


    /*******如果接收的是單一字串********/
    useEffect(() => {
      if (lastMessage && lastMessage.data) {
        console.log("前端接收到的ws資訊為:"+lastMessage.data)
        if (lastMessage && lastMessage.data === "update") {
          fetchData();
        }
      }
    }, [lastMessage,readyState]);

  
  return (
    <></>
  );
};

export default WebSocket;
