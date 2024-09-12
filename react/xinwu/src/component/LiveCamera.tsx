import React, { useEffect, useState,useRef  } from 'react';
import {Player} from 'video-react';
import 'video-react/dist/video-react.css'; 
import { useGlobalContext } from '../global';
import Hls from 'hls.js';

const LiveCamera=()=>{

  useEffect(() => {
    const video = document.getElementById('video');


    if (video instanceof HTMLMediaElement) {
      const hls = new Hls();
      // 放在public/hls底下可用路徑
      hls.loadSource('/hls/playlist.m3u8');

      // hls.loadSource( "../../../../stream/hls/playlist.m3u8");
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, []);



  return (
    <div>
      <h2>LiveCamera</h2>
      {/* .mp4放在public/hls裡面用 /.mp4 */}
      {/* <video width="640" height="360" autoPlay>
        <source src="/hls/output.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}


    {/* 放在react/xinwu/public/hls底下確定OK可撥放 */}
    {/* <video id="video" controls width="640" height="360">
        Your browser does not support the video tag.
      </video> */}
      
    {/* 放在react/xinwu/public/hls底下確定OK可撥放 */}
      <video id="video" controls width="640" height="360">
        Your browser does not support the video tag.
      </video>
      
    </div>
  );
};


export default LiveCamera;
