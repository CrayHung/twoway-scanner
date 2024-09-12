import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useGlobalContext } from '../global';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



const DownloadRecordXlsx = () => {
    const { jwtToken, setJwtToken, isLoggedIn, setIsLoggedIn, globalUrl, cam1LatestData, setCam1LatestData, cam2LatestData, setCam2LatestData } = useGlobalContext();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());


    const handleStartDateChange = (date:any) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date:any) => {
        setEndDate(date);
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/lpr/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                  }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            // Convert the response to a Blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.xlsx');
            document.body.appendChild(link);
            link.click();


            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            } catch (error) {
            console.error('Error downloading Excel file:', error);
            }
    };

    return (
        <>
        <div>
            <div>
                <label>Start Date:</label>
                <DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)} />
            </div>
            <div>
                <label>End Date:</label>
                <DatePicker selected={endDate} onChange={(date:any) => setEndDate(date)} />
            </div>
            <button onClick={handleSearch}>下載</button>
        </div>
        </>
    );
};

export default DownloadRecordXlsx;
