import React, { useEffect, useState } from 'react';
import { SelectChangeEvent, TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, formControlLabelClasses, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";

const ShowAllWork = () => {
    const { formatMessage } = useIntl();
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data,
        setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, model, setModel } = useGlobalContext();

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        console.log('目前所有table3的內容是:', JSON.stringify(table3Data, null, 2));

    }, []);

    useEffect(() => {
        console.log('篩選後的table2的內容是:', JSON.stringify(table2Data, null, 2));
    }, [table2Data]);


    //點擊任一行工單資料, 記錄當下是按了哪一筆工單號碼,工單數量,料號 
    // 跳轉頁面顯示該筆工單的詳細內容(qr_PS,qr_HS...)
    const handleRowClick = (workOrder: any, quantity: any, partnumber: any) => {
        setWorkNo(workOrder);
        setQuant(quantity);
        setPart(partnumber);

        //紀錄該筆工單是哪種model
        const selectedData = table3Data.find((data: any) => data.partNumber === partnumber);
        if (selectedData) {
            setModel(selectedData.inputMode);
        }


        navigate('/searchForm');
    };






    //用來將table1的workOrderDetails過濾掉
    const removeWorkOrderDetails = (data: any[]) => {
        return data.map(({ workOrderDetails, ...rest }) => rest);
    };

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
 

            const updatedData = removeWorkOrderDetails(data);
            setTable1Data(updatedData);


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


            //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
            //並且重新排序順序
            const mappedData = data.map(item => ({
                id: item.id,
                workOrderNumber: item.parentWorkOrderNumber,
                detailId: item.detailId,
                SN: item.SN,
                QR_RFTray: item.QR_RFTray,
                QR_PS: item.QR_PS,
                QR_HS: item.QR_HS,
                QR_backup1: item.QR_backup1,
                QR_backup2: item.QR_backup2,
                QR_backup3: item.QR_backup3,
                QR_backup4: item.QR_backup4,
                note: item.note,
                create_date: item.create_date,
                create_user: item.create_user,
                edit_date: item.edit_date,
                edit_user: item.edit_user,
                ...item,

            }));

            //用來將table2的不要欄位過濾掉(quantity,company,partNumber)
            const filteredData = mappedData.map(({ 
                parentPartNumber, 
                parentWorkOrderNumber,
                parentCompany, 
                parentQuantity, 
                ...rest 
            }) => rest);


            setTable2Data(filteredData);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    //一進組件就先把table3Data拉出來
    const fetchAllTable3 = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-input-modes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 所有對應表');
            }

            const data = await response.json();
            console.log("table3所有對應 : " + JSON.stringify(data));
            setTable3Data(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    //一進組件就先把要渲染的資料拉出來
    useEffect(() => {
        fetchAllTable1();
        fetchAllTable2();
        fetchAllTable3();
        setWorkNo();
        setQuant();
        setPart();
        setModel();
    }, [])

    return (
        <div>
            {table1Data.length &&
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden',height: '90%' }}>
                        <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>

                        <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'quantity' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'part' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'company' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_date' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_date' })}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table1Data.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex} onClick={() => handleRowClick(row.workOrderNumber, row.quantity, row.partNumber)}>
                                            {Object.keys(row)
                                                // .filter((colKey) => colKey !== 'id')
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
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={table1Data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </>
            }
        </div>
    );
}

export default ShowAllWork;
