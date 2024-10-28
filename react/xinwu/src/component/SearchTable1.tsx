/**
 * 
 * 首頁進入後進到此component , 完成搜尋表單填寫的話 , 將會找到幾筆指定的工單 , 點選某一筆工單即可跳轉到 SearchForm component
 * 
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
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


const SearchTable1 = () => {
    const { formatMessage } = useIntl();
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, workNo, setWorkNo, part, setPart, quant, setQuant } = useGlobalContext();

    const [open, setOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 查詢結果存放 , 用來渲染table的
    const [resultData, setResultData] = useState<any[]>([]);
    const navigate = useNavigate();

    //達運專用excel格式
    const [twowayExcelData, setTwowayExcelData] = useState([]);
    //客戶專用excel格式
    const [customerExcelData, setCustomerExcelData] = useState([]);

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)


    //為了要在下拉選單中可以渲染 , 一進頁面就先取得所有工單
    const [tmpData, setTmpData] = useState<any[]>(table1Data);

    //搜尋表單,這樣可以對欄位的多組搜尋(workOrderNumbers , SNs , QR_Trays)
    const [formData, setFormData] = useState({
        workOrderNumber: [''],
        productionDateStart: [''],
        productionDateEnd: [''],
        SN: [''],
        QR_RFTray: [''],
        QR_PS: [''],
        QR_HS: [''],
        snStart: [''],
        snEnd: ['']
    });

    const handleAddField = (field: keyof typeof formData) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] as string[]), '']
        }));
    };
    //range SN欄位
    const handleSnRangeChange = (field: 'snStart' | 'snEnd', index: number, value: string) => {
        const newRange = [...(formData[field] as string[])];
        newRange[index] = value;
        setFormData({ ...formData, [field]: newRange });
    };

    // SN切換模式
    const handleModeChange = (e: any) => {
        const selectedMode = e.target.value;
        setMode(selectedMode);

        // 如果切換到單一SN的搜尋模式，重置範圍的 snStart 和 snEnd
        if (selectedMode === 'single') {
            setFormData((prevData) => ({
                ...prevData,
                snStart: [''],
                snEnd: ['']
            }));
        }

        // 如果切換到範圍的SN搜尋模式，  重置 SN 列表
        if (selectedMode === 'range') {
            setFormData((prevData) => ({
                ...prevData,
                SN: ['']
            }));
        }
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
            workOrderNumber: [''],
            productionDateStart: [''],
            productionDateEnd: [''],
            SN: [''],
            QR_RFTray: [''],
            QR_PS: [''],
            QR_HS: [''],
            snStart: [''],
            snEnd: ['']
        });
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

            const data: any[] = await response.json();
            // console.log("所有工單 : " + JSON.stringify(data));
            setTmpData(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchAll();
    }, []);




    //根據選到的工單號碼(workNumber),fetch該工單號碼的table2資料 , 並將資料設定給tabel2Data
    const handleSearchTable2ByForm = async () => {
        handleClose();
        console.log('搜尋的Form資料為:', JSON.stringify(formData, null, 2));

        // try {
        //     const response = await fetch(`${globalUrl.url}/api/snfield-search-details `, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ formData }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to get ');
        //     }
        //     const data: any[] = await response.json();

        //     //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
        //     //並且重新排序順序
        //     const mappedData = data.map(item => ({
        //         id: item.id,
        //         workOrderNumber: item.parentWorkOrderNumber,
        //         detailId: item.detailId,
        //         SN: item.SN,
        //         QR_RFTray: item.QR_RFTray,
        //         QR_PS: item.QR_PS,
        //         QR_HS: item.QR_HS,
        //         QR_backup1: item.QR_backup1,
        //         QR_backup2: item.QR_backup2,
        //         QR_backup3: item.QR_backup3,
        //         QR_backup4: item.QR_backup4,
        //         note: item.note,
        //         create_date: item.create_date,
        //         create_user: item.create_user,
        //         edit_date: item.edit_date,
        //         edit_user: item.edit_user,
        //         ...item,

        //     }));

        //     //用來將table2的不要欄位過濾掉(quantity,company,partNumber)
        //     const filteredData = mappedData.map(({
        //         parentPartNumber,
        //         parentWorkOrderNumber,
        //         parentCompany,
        //         parentQuantity,
        //         ...rest
        //     }) => rest);

        //     setResultData(filteredData);
        //     console.log('搜尋的結果為:', JSON.stringify(filteredData, null, 2));

        // } catch (error) {
        //     console.error('Error fetching:', error);
        // }
    };



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

    //SN選一種模式   用來切換模式 1.single 2.range
    const [mode, setMode] = useState('single');

    return (
        <div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 工單號碼欄位 */}
                            <Grid item xs={12}>
                                {formData.workOrderNumber.map((workOrderNumber, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                select
                                                label={formatMessage({ id: 'workOrderNumber' })}
                                                value={workOrderNumber}
                                                onChange={(e) => handleFieldChange('workOrderNumber', index, e.target.value)}
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
                                            <IconButton onClick={() => handleAddField('workOrderNumber')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 序號欄位 */}
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Choose Mode</FormLabel>
                                <RadioGroup row value={mode} onChange={handleModeChange}>
                                    <FormControlLabel value="single" control={<Radio />} label="Single SN" />
                                    <FormControlLabel value="range" control={<Radio />} label="SN Range" />
                                </RadioGroup>
                            </FormControl>

                            {mode === 'single' ? (
                                <Grid item xs={12}>
                                    {formData.SN.map((SN, index) => (
                                        <Grid container spacing={1} key={index}>
                                            <Grid item xs={10}>
                                                <TextField
                                                    label="SN"
                                                    value={SN}
                                                    onChange={(e) => handleFieldChange('SN', index, e.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton onClick={() => handleAddField('SN')}>
                                                    +
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    {formData.snStart.map((start, index) => (
                                        <Grid container spacing={1} key={index}>
                                            <Grid item xs={5}>
                                                <TextField
                                                    label="SN Start"
                                                    value={start}
                                                    onChange={(e) => handleSnRangeChange('snStart', index, e.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    label="SN End"
                                                    value={formData.snEnd[index]}
                                                    onChange={(e) => handleSnRangeChange('snEnd', index, e.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* 序號QR_RFTray欄位 */}
                            <Grid item xs={12}>
                                {formData.QR_RFTray.map((QR_RFTray, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'QR_RFTray' })}
                                                value={QR_RFTray}
                                                onChange={(e) => handleFieldChange('QR_RFTray', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('QR_RFTray')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 其他欄位 */}
                            <Grid item xs={6}>
                                {formData.productionDateStart.map((productionDateStart, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'startdate' })}
                                                type="date"
                                                value={productionDateStart}
                                                onChange={(e) => handleFieldChange('productionDateStart', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                            </Grid>
                            <Grid item xs={6}>
                                {formData.productionDateEnd.map((productionDateEnd, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'enddate' })}
                                                type="date"
                                                value={productionDateEnd}
                                                onChange={(e) => handleFieldChange('productionDateEnd', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                            </Grid>

                            <Grid item xs={12}>
                                {formData.QR_PS.map((QR_PS, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'QR_PS' })}
                                                value={QR_PS}
                                                onChange={(e) => handleFieldChange('QR_PS', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('QR_PS')}>
                                                +
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* 按鈕區域 */}
                            <Grid item xs={4}>
                                <Button variant="contained" color="secondary" fullWidth onClick={handleEmpty}>
                                    {formatMessage({ id: 'clear' })}
                                </Button>
                            </Grid>

                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleSearchTable2ByForm}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {resultData.length &&
                <>
                    <div>
                        <button onClick={handleDownloadTwowayExcel}>{formatMessage({ id: 'twowayexcel' })}</button>
                    </div>
                    <div>
                        <button onClick={handleDownloadCustomerExcel}>{formatMessage({ id: 'customexcel' })}</button>
                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden', height: '90%' }}>
                        <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'detailId' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'SN' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup1' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup2' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup3' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup4' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'note' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_date' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_date' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_user' })}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultData.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex} >
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



