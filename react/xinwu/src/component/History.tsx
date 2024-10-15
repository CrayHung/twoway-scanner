import React, { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import {
    Table, TableCell, TableHead, TableRow, TableContainer, TableBody,
    TablePagination
} from "@mui/material";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalContext } from '../global';

interface TableRow {
    id: string | number;
    sn: string | number;
    QR1: string | number;
    QR2: string | number;
    QR3: string | number;
    QR4: string | number;
    note: string | number;
    date: string;
    user: string;
}



const History = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { jwtToken, setJwtToken, isLoggedIn, setIsLoggedIn, globalUrl,testData, setTestData  } = useGlobalContext();

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setPage(0);
    }, [testData]);

    //取得所有工單
    // const fetchHistoryData = async () => {
    //     try {
    //         const response = await fetch(`${globalUrl.url}/lpr/all`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to get record');
    //         }

    //         const data: TableRow[] = await response.json();
    //         console.log("所有工單 : " + JSON.stringify(data));
    //         setTestData(data);

    //     } catch (error) {
    //         console.error('Error fetching token:', error);
    //     }
    // };

    // //一開始取得所有工單
    // useEffect(() => {
    //     fetchHistoryData();
    // }, [])


    //搜尋特定工單
    const handleSearch = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/lpr/all/searchDateBetween`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: TableRow[] = await response.json();
            setTestData(data);

        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };


    const handleDownload = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/lpr/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)} />
        </div>
        <div>
            <label>End Date:</label>
            <DatePicker selected={endDate} onChange={(date: any) => setEndDate(date)} />
        </div>
        <button onClick={handleSearch}>search</button>
        <button onClick={handleDownload}>下載</button>
    </div>
        <div style={{ width: "100vw", paddingLeft: "4px", paddingRight: "4px", paddingTop: "4px" }}>



            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 128px)', width: '100%' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">plateNumber</TableCell>
                                <TableCell align="center">recognitionTimeStr</TableCell>
                                <TableCell align="center">carType</TableCell>
                                <TableCell align="center">imagePath</TableCell>
                                <TableCell align="center">cameraId</TableCell>
                                <TableCell align="center">進出</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row: any, index: any) => (
                                <TableRow key={index} hover>
                                    <TableCell align="center">{row.plateNumber}</TableCell>
                                    <TableCell align="center">{row.recognitionTimeStr}</TableCell>
                                    <TableCell align="center">{row.carType}</TableCell>
                                    <TableCell align="center">{row.imagePath}</TableCell>
                                    <TableCell align="center">{row.cameraId}</TableCell>
                                    <TableCell align="center">{row.plateIn ? '出' : '進'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={testData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
        </>
    );
};
export default History;