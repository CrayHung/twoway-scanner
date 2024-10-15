/**
 * 
 * 首頁進入後進到此component , 完成搜尋表單填寫的話 , 將會找到幾筆指定的工單 , 點選某一筆工單即可跳轉到 SearchForm component
 * 
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, IconButton } from '@mui/material';
import * as XLSX from 'xlsx';
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
interface Table1Row {
    workOrderNumber: string | number;
    quantity: string | number;
    partNumber: string | number;
    createUser: string | number;
    createDate: string | number;
    editUser: string | number;
    editDate: string | number;
}

interface Table2Row {
    workOrderNumber: string | number;
    id: string | number;
    SN: string | number;
    QR_RFTray: string | number;
    QR_PS: string | number;
    QR_HS: string | number;
    QR_backup1: string | number;
    QR_backup2: string | number;
    QR_backup3: string | number;
    QR_backup4: string | number;
    note: string | number;
    create_date: string;
    create_user: string;
    edit_date: string;
    edit_user: string;
}

interface SNData {
    id: number;
    SN: string;
}

interface ExcelRow {
    ASN_Number: string;
    manufacture_batch_number_or_identifier: string;
    manufacture_country: string;
    purchase_order_received_date: string;
    shipping_date: string;
    shipping_company_contractor: string;
    tracking_number: string;
    qr_HS?: string;
    qr_PS?: string;
    qr_RFTray?: string;
}


const SearchTable1 = () => {
    const { formatMessage } = useIntl();
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, workNo, setWorkNo, part, setPart, quant, setQuant } = useGlobalContext();

    const [open, setOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    //達運專用excel格式
    const [twowayExcelData, setTwowayExcelData] = useState([]);
    //客戶專用excel格式
    const [customerExcelData, setCustomerExcelData] = useState([]);

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)


    //為了要在下拉選單中可以渲染 , 一進頁面就先取得所有工單
    const [tmpData, setTmpData] = useState<Table1Row[]>(table1Data);

    //搜尋表單
    // const [formData, setFormData] = useState({
    //     workOrderNumber: '',
    //     productionDateStart: '',
    //     productionDateEnd: '',
    //     sn: '',
    //     qr_RFTray: '',
    //     qr_PS: '',
    //     qr_HS: '',
    //     qr_backup1: '',
    //     qr_backup2: '',
    //     qr_backup3: '',
    //     qr_backup4: '',
    // });



    //搜尋表單,這樣可以對欄位的多組搜尋(workOrderNumbers , SNs , QR_Trays)
    const [formData, setFormData] = useState({
        workOrderNumbers: [''],
        productionDateStart: '',
        productionDateEnd: '',
        SNs: [''],
        QR_RFTrays: [''],
        qr_PS: '',
        qr_HS: ''
    });
    const handleAddField = (field: keyof typeof formData) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] as string[]), '']
        }));
    };
    const handleFieldChange = (field: keyof typeof formData, index: number, value: string) => {
        const updatedFields = [...(formData[field] as string[])];
        updatedFields[index] = value;
        setFormData({ ...formData, [field]: updatedFields });
    };



    const handleClose = () => setOpen(false);
    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    //清除表單內容
    const handleEmpty = () => {
        setFormData({
            workOrderNumbers: [''],
            productionDateStart: '',
            productionDateEnd: '',
            SNs: [''],
            QR_RFTrays: [''],
            qr_PS: '',
            qr_HS: ''
        });
    };


    //點擊任一行工單資料, 記錄當下是按了哪一筆工單號碼,工單數量,料號 
    // 跳轉頁面顯示該筆工單的詳細內容(qr_PS,qr_HS...)
    const handleRowClick = (workOrder: any, quantity: any, partnumber: any) => {
        setWorkNo(workOrder);
        setQuant(quantity);
        setPart(partnumber)

        // 將相同 workOrderNumber 的行更新 editUser 和 editDate
        setTable1Data((prevData: any) =>
            prevData.map((row: any) => {
                if (row.workOrderNumber === workOrder) {
                    // 如果 workOrderNumber 匹配，更新 editUser 和 editDate
                    return {
                        ...row,
                        editUser: currentUser,
                        editDate: today,
                    };
                }
                return row; // 如果不匹配，保持原數據不變
            })
        );


        navigate('/changeWorkContent');
        // navigate('/searchForm');
    };

    useEffect(() => {
        console.log("選到的工號是:" + workNo);
        console.log("選到的工號數量是:" + quant);
        console.log("選到的料號是:" + part);
    }, [workNo, quant, part]);

    useEffect(() => {
        console.log('目前所有table1的內容是:', JSON.stringify(table1Data, null, 2));
        console.log('目前所有table2的內容是:', JSON.stringify(table2Data, null, 2));
    }, [table1Data, table2Data]);


    //為了要在下拉選單中可以渲染出已儲存的所有工單 , 一進頁面就先取得table1的所有工單 , 設定給tmpData
    const fetchAll = async () => {
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

            const data: Table1Row[] = await response.json();
            console.log("所有工單 : " + JSON.stringify(data));
            setTmpData(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchAll();
    }, []);


    //根據form內容搜尋table1資料庫 , 並將搜尋出來的幾筆table1資料設給table1Data
    // const handleSearchTable1ByForm = async () => {
    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: formData,
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to get record');
    //         }
    //         const data: Table1Row[] = await response.json();
    //         setTable1Data(data);
    //     } catch (error) {
    //         console.error('Error fetching :', error);
    //     }
    // };


    //根據選到的工單號碼(workNumber),fetch該工單號碼的table2資料 , 並將資料設定給tabel2Data
    // 增加邏輯,將所有資料的SN按照順序輸出成excel
    // const handleSearchTable2ByWorkNumber = async () => {
    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 workOrderNumber: workNo,
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to get record');
    //         }
    //         const data: Table2Row[] = await response.json();
    //         setTable2Data(data);


    //     } catch (error) {
    //         console.error('Error fetching:', error);
    //     }
    // };



    //達運專用下載excel , 將tabel2Data內的SN都提取出來並從1開始編號
    const handleDownloadTwowayExcel = () => {
        const extractedData = table2Data.map((row: any, index: any) => ({
            id: index + 1,
            SN: row.SN
        }));
        setTwowayExcelData(extractedData);

        const rowsPerPage = 1000;
        const rowsPerColumn = 35;

        // 動態創建表頭根據資料數量
        const createHeaders = (numColumns: number) => {
            const headers = [];
            for (let i = 1; i <= numColumns; i++) {
                headers.push(`id`, `SN`);
            }
            return headers;
        };

        // 動態創建每頁的資料
        const createPageData = (pageData: any) => {
            const numColumns = Math.ceil(pageData.length / rowsPerColumn); // 確定需要的列數
            const formattedData: any[] = [];

            // 初始化每一行的資料
            for (let i = 0; i < rowsPerColumn; i++) {
                const rowData: any = {};
                for (let j = 0; j < numColumns; j++) {
                    rowData[`id`] = pageData[i + j * rowsPerColumn]?.id || "";
                    rowData[`SN`] = pageData[i + j * rowsPerColumn]?.SN || "";
                }
                formattedData.push(rowData);
            }
            return formattedData;
        };

        const workbook = XLSX.utils.book_new();

        // 分頁
        for (let i = 0; i < extractedData.length; i += rowsPerPage) {
            const pageData = extractedData.slice(i, i + rowsPerPage);
            const formattedData = createPageData(pageData);

            // 動態生成 header
            const numColumns = Math.ceil(pageData.length / rowsPerColumn);
            const headers = createHeaders(numColumns);

            const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });

            // 設定列印設置
            worksheet['!pageSetup'] = {
                orientation: "portrait",
                fitToWidth: 1,
                fitToHeight: 1,
                paperSize: 9
            };

            XLSX.utils.book_append_sheet(workbook, worksheet, `達運專用 ${i / rowsPerPage + 1}`);
        }

        XLSX.writeFile(workbook, 'twowayExcelData.xlsx');
    };


    //客戶專用下載eexcel
    const handleDownloadCustomerExcel = () => {

        const customerExcelData = table2Data.map((row: { QR_HS: any; QR_PS: any; QR_RFTray: any; create_date: any; }) => ({
            ASN_Number: "",
            component_QR_code_syntax: row.QR_RFTray,
            cable_operator_known_material_ID: "",
            housing_QR_code_syntax: row.QR_HS,
            QR_RFTray: row.QR_RFTray,
            manufacture_batch_number_or_identifier: "",
            manufacture_country: "Taiwan",
            manufacture_date: row.create_date,
            purchase_order_received_date: "",
            purchase_order_number: "",
            shipping_date: "",
            shipping_company_contractor: "",
            tracking_number: ""
        }));


        const worksheet = XLSX.utils.json_to_sheet(customerExcelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "客戶專用");
        XLSX.writeFile(workbook, "customerData.xlsx");
    };

    useEffect(() => {
        console.log(customerExcelData);
    }, [customerExcelData]);



    //測試用
    const handleSearchTable1ByForm = () => {
        // 關閉 Modal
        handleClose();
        console.log('Form資料為:', JSON.stringify(formData, null, 2));

    };

    return (
        <div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 工單號碼欄位 */}
                            <Grid item xs={12}>
                                {formData.workOrderNumbers.map((workOrderNumber, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                select
                                                label={formatMessage({ id: 'workOrderNumber' })}
                                                value={workOrderNumber}
                                                onChange={(e) => handleFieldChange('workOrderNumbers', index, e.target.value)}
                                                fullWidth
                                            >
                                                {tmpData.map((row: any, index: number) => (
                                                    <MenuItem key={index} value={row.workOrderNumber}>
                                                        {row.workOrderNumber}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('workOrderNumbers')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 序號欄位 */}
                            <Grid item xs={12}>
                                {formData.SNs.map((sn, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'SN' })}
                                                value={sn}
                                                onChange={(e) => handleFieldChange('SNs', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('SNs')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 序號QR_RFTray欄位 */}
                            <Grid item xs={12}>
                                {formData.QR_RFTrays.map((qr_RFTray, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'QR_RFTray' })}
                                                value={qr_RFTray}
                                                onChange={(e) => handleFieldChange('QR_RFTrays', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('QR_RFTrays')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 其他欄位 */}
                            <Grid item xs={6}>
                                <TextField
                                    label={formatMessage({ id: 'startdate' })}
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.productionDateStart}
                                    onChange={(e) => setFormData({ ...formData, productionDateStart: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={formatMessage({ id: 'enddate' })}
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.productionDateEnd}
                                    onChange={(e) => setFormData({ ...formData, productionDateEnd: e.target.value })}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label={formatMessage({ id: 'QR_PS' })}
                                    value={formData.qr_PS}
                                    onChange={(e) => setFormData({ ...formData, qr_PS: e.target.value })}
                                    fullWidth
                                />
                            </Grid>

                            {/* 按鈕區域 */}
                            <Grid item xs={4}>
                                <Button variant="contained" color="secondary" fullWidth onClick={handleEmpty}>
                                    {formatMessage({ id: 'clear' })}
                                </Button>
                            </Grid>

                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleSearchTable1ByForm}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {table1Data.length &&
                <>
                    <div>
                        <button onClick={handleDownloadTwowayExcel}>{formatMessage({ id:'twowayexcel'})}</button>
                    </div>
                    <div>
                        <button onClick={handleDownloadCustomerExcel}>{formatMessage({ id: 'customexcel' })}</button>
                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

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
                                            {Object.keys(row).map((colKey) => (
                                                <TableCell >
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

export default SearchTable1;



