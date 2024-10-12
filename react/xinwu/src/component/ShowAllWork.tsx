import React, { useEffect, useState } from 'react';
import { SelectChangeEvent, TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, formControlLabelClasses, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';

const ShowAllWork = () => {
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data,
        setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, model, setModel } = useGlobalContext();

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const navigate = useNavigate();


    //點擊任一行工單資料, 記錄當下是按了哪一筆工單號碼,工單數量,料號 
    // 跳轉頁面顯示該筆工單的詳細內容(QR_PS,QR_HS...)
    const handleRowClick = (workOrder: any, quantity: any, partnumber: any) => {

        setWorkNo(workOrder);
        setQuant(quantity);
        setPart(partnumber);

        //紀錄該筆工單是哪種model
        const selectedData = table3Data.find((data: any) => data.partNumber === partnumber);
        if (selectedData) {
            setModel(selectedData.inputModel);
        }

        navigate('/searchForm');
    };

    //一進組件就先把要渲染的資料從table3Data拉出來
    useEffect(() => {
        fetchAllTable1();
        fetchAllTable2();
    }, [])

    //當table1Data資料有更新,就重新更新要渲染的資料
    useEffect(() => {
        fetchAllTable1();
        fetchAllTable2();
    }, [table1Data,table2Data])

    //一進組件就先把要渲染的資料從table1Data拉出來
    const fetchAllTable1 = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-work-orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 所有工單');
            }

            const data: any[] = await response.json();
            console.log("table1所有工單 : " + JSON.stringify(data));
            setTable1Data(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    //一進組件就先把table2Data拉出來
    const fetchAllTable2 = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-work-order-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 所有工單');
            }

            const data: any[] = await response.json();
            console.log("table2所有工單 : " + JSON.stringify(data));
            setTable2Data(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };


    return (
        <div>
            {table1Data.length &&
                <>

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

                        <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                            <Table >
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>工單號碼</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>工單數量</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>料號</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>創建使用者</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>創建日期</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>編輯使用者</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>編輯日期</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table1Data.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex} onClick={() => handleRowClick(row.workOrderNumber, row.quantity, row.partNumber)}>
                                            {Object.keys(row)
                                                .filter((colKey) => colKey !== 'id')
                                                .map((colKey) => (
                                                    <TableCell key={colKey}>
                                                        {row[colKey]}
                                                    </TableCell>
                                                ))}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            }
        </div>
    );
}

export default ShowAllWork;
