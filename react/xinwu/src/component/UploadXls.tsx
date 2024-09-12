import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useGlobalContext } from '../global';
import { useDropzone } from 'react-dropzone'


const UploadXls = () => {
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const { jwtToken, setJwtToken, isLoggedIn, setIsLoggedIn, globalUrl, cam1LatestData, setCam1LatestData, cam2LatestData, setCam2LatestData } = useGlobalContext();
    const {getRootProps, getInputProps } = useDropzone({ multiple: true , onDrop: (files) => setAcceptedFiles(files), });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {

        if (fileInputRef.current) {
            fileInputRef.current.click();
            setAcceptedFiles([]);
        }
    };

    const files = acceptedFiles.map((file: any) => (
        <li key={file.path || file.name}>
            {file.path || file.name} - {file.size} bytes
        </li>
    ));


    //上傳檔案到後端
    const handleFileUpload = async () => {
        const formData = new FormData();
        
        acceptedFiles.forEach(file => {
          formData.append('files', file);
        });
    
        try {
          const response = await fetch(`${globalUrl.url}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
              },
            body: formData,
          });
    
          if (response.ok) {
            console.log('Files uploaded successfully');
            alert('upload ok')
            const data = await response.json();
            console.log("上傳檔案 後端回傳的字串"+data);
          } else {
            console.error('Failed to upload files');
            alert('upload fail')
          }
        } catch (error) {
          console.error('Error uploading files:', error);

        }
        setAcceptedFiles([]);
      };

    return (
        <>
            <section >
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} ref={fileInputRef} />
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
                <Button onClick={handleButtonClick}>匯入</Button>
                <Button onClick={handleFileUpload}>上傳</Button>
            </section>
        </>
    );
};

export default UploadXls;
