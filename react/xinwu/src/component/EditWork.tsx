import React, { useEffect, useState } from 'react';
import { Button, Grid, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const EditWork = () => {
    const { formatMessage } = useIntl();
    const { company, setTable1Id, userRole, globalUrl, table1Data, setTable1Data, setTable2Data, table3Data,
        setTable3Data, setWorkNo, setPart, setQuant, setModel } = useGlobalContext();

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [open, setOpen] = useState(true);
    const [searchWorkNumber, setSearchWorkNumber] = useState('');
    const [productionDateStart, setProductionDateStart] = useState('');
    const [productionDateEnd, setProductionDateEnd] = useState('');


    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // useEffect(() => {
    //     console.log('目前所有table3的內容是:', JSON.stringify(table3Data, null, 2));

    // }, []);

    // useEffect(() => {
    //     console.log('篩選後的table2的內容是:', JSON.stringify(table2Data, null, 2));
    // }, [table2Data]);


    //點擊任一行工單資料, 記錄當下是按了哪一筆工單號碼,工單數量,料號 
    // 跳轉頁面顯示該筆工單的詳細內容(qr_PS,qr_HS...)
    const handleRowClick = (id: any, workOrder: any, quantity: any, partnumber: any, companyUnit: any) => {

        if (companyUnit !== company) {

        } else {
            setTable1Id(id);
            setWorkNo(workOrder);
            setQuant(quantity);
            setPart(partnumber);

            //紀錄該筆工單是哪種model
            const selectedData = table3Data.find((data: any) => data.partNumber === partnumber);
            if (selectedData) {
                setModel(selectedData.inputMode);
            }
            navigate('/searchForm');
        }
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

            // console.log("所有table1資料:"+ JSON.stringify(updatedData))


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
            // console.log("table3所有對應 : " + JSON.stringify(data));
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
        setTable1Id();

        // setShowTableData([]);
    }, [])

    // useEffect(() => {
    //     handleFetchTable1Data();
    // }, [searchWorkNumber,productionDateStart,productionDateEnd])

    //fetch All
    const fetchAll = async () => {
        fetchAllTable1();
        fetchAllTable2();
        fetchAllTable3();
        setWorkNo();
        setQuant();
        setPart();
        setModel();
        setTable1Id();
    };


    //刪除工單
    // const [openDeleteForm, setOpenDeleteForm] = useState(false);
    // const [deleteWorkOrderNumber, setDeleteWorkOrderNumber] = useState({
    //     id: "",
    //     workOrderNumber: "",
    // });
    // const handleDeleteClose = () => setOpenDeleteForm(false);
    // const handleDeleteClick = (row: any) => {
    //     setDeleteWorkOrderNumber(row);
    //     setOpenDeleteForm(true);
    // };
    // const handleDeleteConfirm = async () => {

    //     const deleteId = deleteWorkOrderNumber.id;
    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/delete-work-orders/${deleteId}`, {
    //             method: 'DELETE',
    //         })
    //         if (response.ok) {
    //             console.log('刪除成功:');
    //             setOpenDeleteForm(false);
    //             fetchAll();

    //         } else {
    //             console.error('更新失敗:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching:', error);
    //     }
    // };




    const handleExitButtonClick = () => {
        navigate('/');
    };

    //避免start日期大於end
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStartDate = e.target.value;

        if (productionDateEnd && selectedStartDate > productionDateEnd) {
            alert(formatMessage({ id: 'text6' }));
        } else {
            setProductionDateStart(selectedStartDate);
        }
    };

    //避免end日期小於start
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedEndDate = e.target.value;

        if (productionDateStart && selectedEndDate < productionDateStart) {
            alert(formatMessage({ id: 'text7' }));
        } else {
            setProductionDateEnd(selectedEndDate);
        }
    };

    //
    const [showTableData, setShowTableData] = useState(table1Data)
    //篩選資料,由得到所有資料再篩選(但只能做正確的資料查詢 , 下面用table1的API模糊查詢取代)
    // const handleFetchTable1Data = () => {

    //     const filteredData = table1Data.filter((item: { workOrderNumber: string; createDate: string | number | Date; }) => {
    //         const isWorkOrderMatch = item.workOrderNumber === searchWorkNumber;
    //         const isDateInRange = new Date(item.createDate) >= new Date(productionDateStart) &&
    //             new Date(item.createDate) <= new Date(productionDateEnd);

    //         return isWorkOrderMatch || isDateInRange;
    //     });

    //     setShowTableData(filteredData);
    // }


    const handleFetchTable1Data = async () => {

        const requestBody = {
            workOrderNumber: searchWorkNumber ? [searchWorkNumber] : [],
            createDateStart: productionDateStart ? [productionDateStart] : [],
            createDateEnd: productionDateEnd ? [productionDateEnd] : [],
          };
        
        // console.log("requestBody : "+JSON.stringify(requestBody, null, 2));


        try {
            const response = await fetch(`${globalUrl.url}/api/fuzzy-search-work-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workOrderNumber: searchWorkNumber ? [searchWorkNumber] : [],
                    createDateStart: productionDateStart ? [productionDateStart] : [],
                    createDateEnd: productionDateEnd ? [productionDateEnd] : [],
                }),

              });


            if (!response.ok) {
                throw new Error('Failed to get 所有對應表');
            }

            const data = await response.json();
            //過濾掉workOrderDetails的資料
            const updatedData = removeWorkOrderDetails(data);

            // console.log("updatedData : "+JSON.stringify(updatedData, null, 2));
            setShowTableData(updatedData);

        } catch (error) {
            console.error('Error fetching token:', error);
        }

    }

    const handleEditClick = (id: any, workOrder: any, quantity: any, partnumber: any) => {


        setTable1Id(id);
        setWorkNo(workOrder);
        setQuant(quantity);
        setPart(partnumber);

        //紀錄該筆工單是哪種model
        const selectedData = table3Data.find((data: any) => data.partNumber === partnumber);
        if (selectedData) {
            setModel(selectedData.inputMode);
        }
        navigate('/searchForm');

    }


    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" gutterBottom>
                    {formatMessage({ id: 'Menu-edit-WorkOrders' })}
                </Typography>
                <Button variant="contained" sx={{ marginRight: 1 }} onClick={handleExitButtonClick}>
                    {formatMessage({ id: 'exit' })}
                </Button>
            </Box>


            <div>
                <>
                    <label>{formatMessage({ id: 'workOrderNumber' })}：</label>
                    <input
                        type="text"
                        value={searchWorkNumber}
                        onChange={(e) => setSearchWorkNumber(e.target.value)}
                    />
                </>
                <>
                    <label>{formatMessage({ id: 'startdate' })}：</label>
                    <input
                        type="date"
                        value={productionDateStart}
                        onChange={handleStartDateChange}
                    />
                </>                    <>
                    <label>{formatMessage({ id: 'enddate' })}：</label>
                    <input
                        type="date"
                        value={productionDateEnd}
                        onChange={handleEndDateChange}
                    />
                </>
                <button onClick={handleFetchTable1Data}>{formatMessage({ id: 'submit-search' })}</button>
            </div>
            {/* {table1Data && */}
            {showTableData &&
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
                        <TableContainer component={Paper} style={{ maxHeight: '700px', overflowY: 'scroll' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'quantity' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'part' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'company' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_date' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_date' })}</TableCell>

                                        {/* {['ADMIN', 'SUPERVISOR'].includes(userRole) && (
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>
                                                {formatMessage({ id: 'delete-orkOrder' })}
                                            </TableCell>
                                        )} */}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {showTableData
                                        .filter((row: any) => row.company === company)  // 過濾出 company 相同的資料
                                        .map((row: any, rowIndex: number) => (
                                            <TableRow key={rowIndex}>
                                                {/* <TableRow key={rowIndex} onClick={() => handleRowClick(row.id, row.workOrderNumber, row.quantity, row.partNumber, row.company)}> */}
                                                {['ADMIN', 'SUPERVISOR', 'OPERATOR'].includes(userRole) &&
                                                    <TableCell>
                                                        <button onClick={(e) => {
                                                            handleEditClick(row.id, row.workOrderNumber, row.quantity, row.partNumber)
                                                        }}>
                                                            {formatMessage({ id: 'edit' })}</button>
                                                    </TableCell>
                                                }

                                                {Object.keys(row)
                                                    // .filter((colKey) => colKey !== 'id')
                                                    .map((colKey) => (
                                                        <TableCell key={colKey}>
                                                            {row[colKey]}
                                                        </TableCell>
                                                    ))}

                                                {/* {['ADMIN', 'SUPERVISOR'].includes(userRole) &&
                                                <TableCell>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();    //避免handleRowClick和handleDeleteClick衝突
                                                        handleDeleteClick(row)
                                                    }}>
                                                        {formatMessage({ id: 'delete-orkOrder' })}</button>
                                                </TableCell>
                                            } */}
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
        </div >
    );
}

export default EditWork;