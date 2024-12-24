import React, { useEffect, useState } from 'react';
import { Button, Grid, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, TextField, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";



import './hightlight.css';
import './SearchForm.css';


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


    const [productionDateStart, setProductionDateStart] = useState<Date | null>(null);
    const [productionDateEnd, setProductionDateEnd] = useState<Date | null>(null);



    const { formatMessage } = useIntl();
    const { company, setTable1Id, userRole, globalUrl, table1Data, setTable1Data, setTable2Data, table3Data,
        setTable3Data, setWorkNo, setPart, setQuant, setModel } = useGlobalContext();

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [open, setOpen] = useState(true);
    const [searchWorkNumber, setSearchWorkNumber] = useState('');
    // const [productionDateStart, setProductionDateStart] = useState('');
    // const [productionDateEnd, setProductionDateEnd] = useState('');

    const [showTableData, setShowTableData] = useState([{}]);

    //fetch尚未完成,先用loading提示
    const [loading, setLoading] = useState(false);


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

            const updatedData: any[] = await response.json();


            // const updatedData = removeWorkOrderDetails(data);
            setTable1Data(updatedData);
            // setShowTableData(updatedData);

            // console.log("setShowTableData:"+ JSON.stringify(updatedData))


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
                workOrderNumber: item.workOrderNumber,
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
                QR_RFTray_BEDID: item.QR_RFTray_BEDID,
                QR_HS_BEDID: item.QR_HS_BEDID,
                QR_PS_BEDID: item.QR_PS_BEDID,
                ...item,

            }));

            //用來將table2的不要欄位過濾掉(quantity,company,partNumber)
            const filteredData = mappedData.map(({
                partNumber,
                // workOrderNumber,
                company,
                quantity,
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
        setWorkNo('');
        setQuant('');
        setPart('');
        setModel('');
        setTable1Id('');

        setShowTableData([]);
    }, [])

    // useEffect(() => {
    //     handleFetchTable1Data();
    // }, [searchWorkNumber,productionDateStart,productionDateEnd])



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
        navigate('/reload');
    };



    // 將date格式化為"YYYY-MM-DD"
    const formatDate = (date: Date | null): string | null => {
        return date ? date.toISOString().split("T")[0] : null;
    };



    const handleFetchTable1Data = async () => {

        const requestBody = {
            workOrderNumber: searchWorkNumber ? [searchWorkNumber] : [],
            createDateStart: productionDateStart ? [formatDate(productionDateStart)].filter(Boolean) as string[] : [],
            createDateEnd: productionDateEnd ? [formatDate(productionDateEnd)].filter(Boolean) as string[] : [],
        };

        // console.log("requestBody : " + JSON.stringify(requestBody, null, 2));


        // 判斷是否所有欄位都是空陣列
        const isRequestBodyEmpty = Object.values(requestBody).every(
            (value) => Array.isArray(value) && value.length === 0
        );



        const callFuzzy = async (requestBody: { workOrderNumber: string[]; createDateStart: string[]; createDateEnd: string[]; }) => {
            setLoading(true); // 開始Loading

            try {
                const response = await fetch(`${globalUrl.url}/api/fuzzy-search-work-orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                if (!response.ok) {
                    throw new Error('Failed to get 所有對應表');
                }

                const data = await response.json();
                //過濾掉workOrderDetails的資料
                // const updatedData = removeWorkOrderDetails(data);

                // console.log("過濾掉workOrderDetails的資料 : "+JSON.stringify(updatedData, null, 2));
                setShowTableData(data);



            } catch (error) {
                console.error('Error fetching token:', error);
            } finally {
                setLoading(false); // 完成後結束Loading

            }
        }

        // 如果都是空陣列,則取得所有table1Data
        if (isRequestBodyEmpty) {
            // 呼叫 Get all
            fetchAllTable1();
            setShowTableData(table1Data);
        } else {
            // 如果任一欄不是空陣列,則用模糊搜尋
            callFuzzy(requestBody);
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
        navigate('/searchForm/reload');

    }


    return (

        <div style={{ width: '100%', position: 'relative', left: 0, overflow: 'auto' }}>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" gutterBottom>
                    {formatMessage({ id: 'Menu-edit-WorkOrders' })}
                </Typography>
                <Button variant="contained" sx={{ marginRight: 1 }} onClick={handleExitButtonClick}>
                    {formatMessage({ id: 'exit' })}
                </Button>
            </Box>

            {/* for Loading*/}

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}



            <label>{formatMessage({ id: 'workOrderNumber' })}：</label>
            <input
                type="text"
                value={searchWorkNumber}
                onChange={(e) => setSearchWorkNumber(e.target.value)}
            />


            <label>{formatMessage({ id: 'startdate' })}：</label>
            <DatePicker
                selectsStart
                selected={productionDateStart}
                onChange={(date) => setProductionDateStart(date)}
                startDate={productionDateStart}
                portalId="root"
            />
            <label>{formatMessage({ id: 'enddate' })}：</label>
            <DatePicker
                selectsEnd
                selected={productionDateEnd}
                onChange={(date) => setProductionDateEnd(date)}
                endDate={productionDateEnd}
                startDate={productionDateStart}
                minDate={productionDateStart}
                portalId="root"

            />

            <button onClick={handleFetchTable1Data}>{formatMessage({ id: 'submit-search' })}</button>


            {showTableData.length > 0 &&
                <>
                    <Paper style={{ flex: 1, overflowX: "auto" }}>
                        <TableContainer
                            component="div"
                            style={{
                                height: "100%",
                                overflowY: "hidden",
                                overflowX: "auto",
                            }}
                            onWheel={(e) => {
                                const container = e.currentTarget;
                                container.scrollTop += e.deltaY;
                            }}
                        >


                            <Table
                                stickyHeader
                                aria-label="sticky table"
                                style={{
                                    minWidth: '800px',
                                    tableLayout: 'auto',
                                }}>
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'quantity' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'part' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'company' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'produce_date' })}</TableCell>
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
