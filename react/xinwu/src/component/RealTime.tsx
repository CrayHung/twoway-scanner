/**
 *  https://rtsp.stream/
 * 
 *  rtsp://rtspstream:146af43a1f7bd1df7d4c59d19b734adb@zephyr.rtsp.stream/movie
 *  rtsp://rtspstream:c142140c5d39d01d01a3c8b398c4799b@zephyr.rtsp.stream/pattern
 * 
 * 
 * 
 */


import React, { useState } from 'react';
import styled from 'styled-components';
import WebSocket from './WebSocketComponent';
import { useGlobalContext } from '../global';

import CarListWithFetch from './CarList';
import LiveCamera from './LiveCamera';


const RealTimeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 90vw;
  height: 90vh;
  overflow: hidden;
`;

const Quadrant = styled.div`
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SubQuadrant80 = styled.div`
flex: 8;
`;

const SubQuadrant20 = styled.div`
`;


const RealTime = () => {
  const { jwtToken,setJwtToken,isLoggedIn, setIsLoggedIn,globalUrl , cam1LatestData ,setCam1LatestData, cam2LatestData, setCam2LatestData } = useGlobalContext();

  


  return (
    <>
 {/* <RealTimeContainer>

      <Quadrant>
      <p>cam1</p>
        <SubQuadrant80> <img src={cam1LatestData?.imagePath} alt="Camera 1 Image" /> </SubQuadrant80>
        <SubQuadrant20> {cam1LatestData?.plateNumber} </SubQuadrant20>
      </Quadrant>

      <Quadrant>
      <p>cam2</p>
        <SubQuadrant80> <img src={cam2LatestData?.imagePath} alt="Camera 2 Image" />   </SubQuadrant80>
        <SubQuadrant20> {cam2LatestData?.plateNumber} </SubQuadrant20>
      </Quadrant>

      <Quadrant>
        <SubQuadrant80><CarListWithFetch></CarListWithFetch> </SubQuadrant80>
        <SubQuadrant20> </SubQuadrant20>
      </Quadrant>

      <Quadrant>
        <SubQuadrant80> <LiveCamera></LiveCamera> </SubQuadrant80>
        <SubQuadrant20>  </SubQuadrant20>
      </Quadrant>
      
    </RealTimeContainer>

    <WebSocket></WebSocket> */}
    <LiveCamera></LiveCamera>

  </>
  );
};

export default RealTime;
