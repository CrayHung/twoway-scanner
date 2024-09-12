import React, { useEffect, useState,useRef  } from 'react';
import {Player} from 'video-react';
import 'video-react/dist/video-react.css'; 
import { useGlobalContext } from '../global';
import Hls from 'hls.js';
import DownloadRecordXlsx from './DownloadRecordXlsx';

const UploadDownload=()=>{

  
  return (
    <div>

      <DownloadRecordXlsx></DownloadRecordXlsx>

    </div>
  );
};

export default UploadDownload;
;
