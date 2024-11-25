import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
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


const SearchTable1 = () => {
    const { formatMessage } = useIntl();
    const { table3Data, setTable3Data, currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, workNo, setWorkNo, part, setPart, quant, setQuant } = useGlobalContext();

    const [open, setOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 查詢結果存放 , 用來渲染table的
    const [resultData, setResultData] = useState<any[]>([]);
    const navigate = useNavigate();

    //整體要下載的原始檔案
    const [dataForDownload, setDataForDownload] = useState<any>([]);
    //達運專用excel格式
    const [twowayExcelData, setTwowayExcelData] = useState([]);
    //客戶專用excel格式
    const [customerExcelData, setCustomerExcelData] = useState([]);

    //SN選一種模式   用來切換模式 1.single 2.range
    const [mode, setMode] = useState('single');

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)

    //fetch尚未完成,先用loading提示
    const [loading, setLoading] = useState(false);

    //為了要在下拉選單中可以渲染 , 一進頁面就先取得所有工單
    const [tmpData, setTmpData] = useState<any[]>(table1Data);

    //搜尋表單,這樣可以對欄位的多組搜尋(workOrderNumbers , SNs , QR_Trays)
    // const [formData, setFormData] = useState({
    //     workOrderNumber: [''],
    //     productionDateStart: [''],
    //     productionDateEnd: [''],
    //     SN: [''],
    //     QR_RFTray: [''],
    //     QR_PS: [''],
    //     QR_HS: [''],
    //     snStart: [''],
    //     snEnd: ['']
    // });

    interface FormData {
        workOrderNumber: string[] | null;
        productionDateStart: string[] | null;
        productionDateEnd: string[] | null;
        QR_RFTray: string[] | null;
        QR_PS: string[] | null;
        QR_HS: string[] | null;
        QR_backup1: string[] | null;
        QR_backup2: string[] | null;
        QR_backup3: string[] | null;
        QR_backup4: string[] | null;
        note: string[] | null;
        edit_user: string[] | null;
        create_user: string[] | null;
        partNumber: string[] | null;
        company: string[] | null;


        SN?: string[] | null;
        snStart?: string[] | null;
        snEnd?: string[] | null;
    }
    const initializeFormData = (): FormData => {
        return {
            workOrderNumber: [''],
            productionDateStart: [''],
            productionDateEnd: [''],
            QR_RFTray: [''],
            QR_PS: [''],
            QR_HS: [''],
            QR_backup1: [''],
            QR_backup2: [''],
            QR_backup3: [''],
            QR_backup4: [''],
            note: [''],
            edit_user: [''],
            create_user: [''],
            partNumber: [''],
            company: [''],

            // 可選欄位預設為 null
            SN: [''],
            snStart: null,
            snEnd: null,
        };
    };


    const [formData, setFormData] = useState<FormData>(initializeFormData());


    // const [formData, setFormData] = useState<FormData>({
    //     workOrderNumber: [''],
    //     productionDateStart: [''],
    //     productionDateEnd: [''],
    //     QR_RFTray: [''],
    //     QR_PS: [''],
    //     QR_HS: [''],
    //     QR_backup1: [''],
    //     QR_backup2: [''],
    //     QR_backup3: [''],
    //     QR_backup4: [''],
    //     note: [''],
    //     create_date: [''],
    //     create_user: [''],
    //     partNumber: [''],
    //     company: [''],


    // });


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
        setFormData((prevData) => {
            const updatedData = { ...prevData };

            if (selectedMode === 'single') {
                delete updatedData.snStart;
                delete updatedData.snEnd;
                updatedData.SN = updatedData.SN || ['']; // 確保 SN 欄位存在
            }

            if (selectedMode === 'range') {
                delete updatedData.SN;
                updatedData.snStart = updatedData.snStart || ['']; // 確保 snStart 和 snEnd 欄位存在
                updatedData.snEnd = updatedData.snEnd || [''];
            }

            return updatedData;
        });
    };


    const handleFieldChange = (field: keyof typeof formData, index: number, newValue: string) => {
        setFormData((prevData) => {
            const updatedField = [...(formData[field] as string[])];
            updatedField[index] = newValue;
            return {
                ...prevData,
                [field]: updatedField.every((item) => item === '') ? [''] : updatedField,
            };
        });
    };


    // const handleFieldChange = (field: keyof typeof formData, index: number, value: string) => {
    //     const updatedFields = [...(formData[field] as string[])];
    //     updatedFields[index] = value;
    //     setFormData({ ...formData, [field]: updatedFields });
    // };



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
            snEnd: [''],


            QR_backup1: [''],
            QR_backup2: [''],
            QR_backup3: [''],
            QR_backup4: [''],
            note: [''],
            edit_user: [''],
            create_user: [''],
            partNumber: [''],
            company: ['']
        });
    };




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




    //根據搜尋表單得到的內容 , 並將資料設定給resultData用以渲染table用
    const handleSearchTable2ByForm = async () => {

        // 檢查所有欄位，將值為 [''] 的欄位設為 null
        const sanitizedFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                value && value.length === 1 && value[0] === '' ? null : value,
            ])
        );


        handleClose();
        console.log('搜尋的Form資料為:', JSON.stringify(sanitizedFormData, null, 2));

        setLoading(true); // 開始Loading

        //單一SN[]搜尋
        if (mode === 'single') {
            console.log("使用api/snfuzzy-search-details這個API")
            try {
                const response = await fetch(`${globalUrl.url}/api/snfuzzy-search-details `, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sanitizedFormData),
                });

                if (!response.ok) {
                    throw new Error('Failed to get ');
                }
                const data: any[] = await response.json();
                console.log('搜尋的結果為:', JSON.stringify(data, null, 2));
                setDataForDownload(data);

                //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
                //並且重新排序順序
                const mappedData = data.map(item => ({
                    id: item.id,
                    workOrderNumber: item.workOrderNumber,
                    detailId: item.detailId,
                    SN: item.SN,
                    QR_RFTray: item.QR_RFTray,
                    QR_RFTray_BEDID:item.QR_RFTray_BEDID,
                    QR_PS: item.QR_PS,
                    QR_PS_BEDID:item.QR_PS_BEDID,
                    QR_HS: item.QR_HS,
                    QR_HS_BEDID:item. QR_HS_BEDID,

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

                //用來將不要欄位過濾掉
                const filteredData = mappedData.map(({
                    partNumber,
                    // workOrderNumber,
                    company,
                    quantity,
                    ...rest
                }) => rest);

                setResultData(filteredData);
                // console.log('搜尋的結果為:', JSON.stringify(filteredData, null, 2));

            } catch (error) {
                console.error('Error fetching:', error);
            }
        }
        //範圍snStart: [''],snEnd: ['']搜尋
        else if (mode === 'range') {
            console.log("使用api/snfield-search-details這個API")
            try {
                const response = await fetch(`${globalUrl.url}/api/snfield-search-details `, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sanitizedFormData),
                });

                if (!response.ok) {
                    throw new Error('Failed to get ');
                }
                const data: any[] = await response.json();
                // console.log('搜尋的結果為:', JSON.stringify(data, null, 2));
                setDataForDownload(data);

                //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
                //並且重新排序順序
                const mappedData = data.map(item => ({
                    id: item.id,
                    workOrderNumber: item.workOrderNumber,
                    detailId: item.detailId,
                    SN: item.SN,

                    QR_RFTray: item.QR_RFTray,
                    QR_RFTray_BEDID:item.QR_RFTray_BEDID,
                    QR_PS: item.QR_PS,
                    QR_PS_BEDID:item.QR_PS_BEDID,
                    QR_HS: item.QR_HS,
                    QR_HS_BEDID:item. QR_HS_BEDID,

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

                //用來將不要欄位過濾掉
                const filteredData = mappedData.map(({
                    partNumber,
                    // workOrderNumber,
                    company,
                    quantity,
                    ...rest
                }) => rest);

                setResultData(filteredData);
                console.log('搜尋的結果為:', JSON.stringify(filteredData, null, 2));

            } catch (error) {
                console.error('Error fetching:', error);
            }
        } else {
            console.log("搜尋的資料是 : " , JSON.stringify(sanitizedFormData, null, 2))
            try {
                const response = await fetch(`${globalUrl.url}/api/snfield-search-details `, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sanitizedFormData),
                });

                if (!response.ok) {
                    throw new Error('Failed to get ');
                }
                const data: any[] = await response.json();
                // console.log('搜尋的結果為:', JSON.stringify(data, null, 2));
                setDataForDownload(data);

                //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
                //並且重新排序順序
                const mappedData = data.map(item => ({
                    id: item.id,
                    workOrderNumber: item.workOrderNumber,
                    detailId: item.detailId,
                    SN: item.SN,
                    QR_RFTray: item.QR_RFTray,
                    QR_RFTray_BEDID:item.QR_RFTray_BEDID,
                    QR_PS: item.QR_PS,
                    QR_PS_BEDID:item.QR_PS_BEDID,
                    QR_HS: item.QR_HS,
                    QR_HS_BEDID:item. QR_HS_BEDID,

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

                // 用來將不要欄位過濾掉
                const filteredData = mappedData.map(({
                    partNumber,
                    // workOrderNumber,
                    company,
                    quantity,
                    ...rest
                }) => rest);

                setResultData(filteredData);
                // console.log('搜尋的結果為:', JSON.stringify(filteredData, null, 2));



            } catch (error) {
                console.error('Error fetching:', error);
            } finally {
                setLoading(false); // 完成後結束Loading
            }
        }
        setLoading(false); // 開始Loading
    };




    /******************************************************** */
    //達運專用下載excel (xlsx中包含標題 項次,SN)
    /********************************************************* */
    // const handleDownloadTwowayExcel = () => {

    //     //根據原始資料(dataForDownload)的partNumber做資料分組
    //     const groupedData = dataForDownload.reduce((acc: any, item: any) => {
    //         const { parentPartNumber } = item;
    //         if (parentPartNumber) {  // 確保資料中有 parentPartNumber
    //             if (!acc[parentPartNumber]) {
    //                 acc[parentPartNumber] = [];
    //             }
    //             acc[parentPartNumber].push(item);
    //         }
    //         return acc;
    //     }, {});
    //     // console.log("groupedData:", JSON.stringify(groupedData, null, 2));

    //     // Step 2: 根據每個parentPartNumber對應的numberPerPallet去產生資料
    //     Object.keys(groupedData).forEach(parentPartNumber => {
    //         const numberPerPallet = table3Data.find((entry: any) => entry.partNumber === parentPartNumber)?.numberPerPallet;
    //         const worksheetData = groupedData[parentPartNumber].map((item: any, index: any) => ({
    //             項次: index + 1,
    //             SN: item.SN
    //         }));

    //         console.log("worksheetData:", JSON.stringify(worksheetData, null, 2));
    //         console.log("此料號的棧板數量:" + numberPerPallet);

    //         const workbook = XLSX.utils.book_new();

    //         for (let i = 0; i < worksheetData.length; i += numberPerPallet) {
    //             let sheetData = worksheetData.slice(i, i + numberPerPallet);
    //             console.log("sheetData:" + sheetData);
    //             console.log(`Sheet Data for ${parentPartNumber} (Sheet ${Math.floor(i / numberPerPallet) + 1}):`, sheetData);

    //             let formattedSheetData: any[] = [];
    //             let currentColumn = 0;


    //             formattedSheetData[0] = {}; 
    //             for (let j = 0; j < sheetData.length; j += 25) {
    //                 const colItemHeader = String.fromCharCode(65 + currentColumn);
    //                 const colSNHeader = String.fromCharCode(66 + currentColumn); 
    //                 formattedSheetData[0][colItemHeader] = "項次";
    //                 formattedSheetData[0][colSNHeader] = "SN";
    //                 currentColumn += 2; // Move to the next set of columns for every 25 items
    //             }
    //             sheetData.forEach((data: any, index: any) => {
    //                 const rowIndex = (index % 25) + 1; // Row index within each group
    //                 const colIndex = Math.floor(index / 25) * 2; // Column index for groups of 25 (0, 2, 4, ...)
    //                 const colItem = String.fromCharCode(65 + colIndex); // Column for 項次
    //                 const colSN = String.fromCharCode(66 + colIndex);   // Column for SN

    //                 if (!formattedSheetData[rowIndex]) formattedSheetData[rowIndex] = {}; // Ensure row exists
    //                 formattedSheetData[rowIndex][colItem] = data.項次;
    //                 formattedSheetData[rowIndex][colSN] = data.SN;
    //             });


    //             // 每25筆資料將資料從AB欄位換到CD欄位
    //             sheetData.forEach((data: any, index: any) => {
    //                 const rowIndex = (index % 25) + 1;
    //                 const colIndex = Math.floor(index / 25) * 2; // Column index for groups of 25 (0, 2, 4, ...)
    //                 const colItem = String.fromCharCode(65 + colIndex); // Column for 項次
    //                 const colSN = String.fromCharCode(66 + colIndex);   // Column for SN

    //                 if (!formattedSheetData[rowIndex]) formattedSheetData[rowIndex] = {}; // Ensure row exists
    //                 formattedSheetData[rowIndex][colItem] = data.項次;
    //                 formattedSheetData[rowIndex][colSN] = data.SN;
    //             });

    //             console.log(`Formatted Sheet Data for ${parentPartNumber} (Sheet ${Math.floor(i / numberPerPallet) + 1}):`, formattedSheetData);

    //             if (formattedSheetData.length > 0) {
    //                 const worksheet = XLSX.utils.json_to_sheet(formattedSheetData, { skipHeader: true });
    //                 XLSX.utils.book_append_sheet(workbook, worksheet, `${parentPartNumber}_Sheet${Math.floor(i / numberPerPallet) + 1}`);
    //             } else {
    //                 console.log(`Sheet Data is empty for ${parentPartNumber} (Sheet ${Math.floor(i / numberPerPallet) + 1})`);
    //             }
    //         }

    //         XLSX.writeFile(workbook, `${parentPartNumber}.xlsx`);
    //     });
    // }
    /********************************************************* */

    /******************************************************** */
    //達運專用下載excel (xlsx中不包含標題 項次,SN)
    /********************************************************* */
    const handleDownloadTwowayExcel = () => {

        //根據原始資料(dataForDownload)的partNumber做資料分組
        const groupedData = dataForDownload.reduce((acc: any, item: any) => {
            const { partNumber } = item;
            if (partNumber) {  // 確保資料中有 partNumber
                if (!acc[partNumber]) {
                    acc[partNumber] = [];
                }
                acc[partNumber].push(item);
            }
            return acc;
        }, {});
        // console.log("groupedData:", JSON.stringify(groupedData, null, 2));

        // Step 2: 根據每個PartNumber對應的number_per_pallet去產生資料
        Object.keys(groupedData).forEach(partNumber => {
            const numberPerPallet = table3Data.find((entry: any) => entry.partNumber === partNumber)?.numberPerPallet;
            const worksheetData = groupedData[partNumber].map((item: any, index: any) => ({
                項次: index + 1,
                SN: item.SN
            }));

            // console.log(`Worksheet Data for ${partNumber}:`, worksheetData);

            const workbook = XLSX.utils.book_new();

            for (let i = 0; i < worksheetData.length; i += numberPerPallet) {
                let sheetData = worksheetData.slice(i, i + numberPerPallet);

                let formattedSheetData: any[] = [];
                let currentColumn = 0;

                // 每25筆資料將資料從AB欄位換到CD欄位
                sheetData.forEach((data: any, index: any) => {
                    const rowIndex = index % 25;
                    const colIndex = Math.floor(index / 25) * 2; // Column index for groups of 25 (0, 2, 4, ...)
                    const colItem = String.fromCharCode(65 + colIndex); // Column for 項次
                    const colSN = String.fromCharCode(66 + colIndex);   // Column for SN

                    if (!formattedSheetData[rowIndex]) formattedSheetData[rowIndex] = {}; // Ensure row exists
                    formattedSheetData[rowIndex][colItem] = data.項次;
                    formattedSheetData[rowIndex][colSN] = data.SN;
                });


                if (formattedSheetData.length > 0) {
                    const worksheet = XLSX.utils.json_to_sheet(formattedSheetData, { skipHeader: true });
                    XLSX.utils.book_append_sheet(workbook, worksheet, `${partNumber}_Sheet${Math.floor(i / numberPerPallet) + 1}`);
                } else {
                    console.log("sheet Data為空");
                }
            }

            XLSX.writeFile(workbook, `${partNumber}.xlsx`);
        });
    }
    /********************************************************* */

    //客戶專用下載excel
    const handleDownloadCustomerExcel = () => {

        const customerExcelData = dataForDownload.map((row: { QR_HS: any; QR_PS: any; QR_RFTray: any; create_date: any; }) => ({
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "客戶專用下載excel");
        XLSX.writeFile(workbook, "customerData.xlsx");
    };

    /********************************************************* */
    //下載所有欄位
    const handleDownloadAllExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(resultData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "所有欄位下載excel");
        XLSX.writeFile(workbook, "AllData.xlsx");

    }


    // useEffect(() => {
    //     console.log(customerExcelData);
    // }, [customerExcelData]);

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

    useEffect(() => {
        fetchAllTable3();
    }, [])


    const location = useLocation();
    useEffect(() => {
        setOpen(true); // 當 URL 改變時，重新打開 Modal
    }, [location.search]); // location.search 變化時重新執行 useEffect


    const handleExitButtonClick = () => {
        navigate('/reload');
    };

    return (
        <div style={{ width: '100%', position: 'relative', left: 0, overflow: 'auto' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" gutterBottom>
                    {formatMessage({ id: 'Menu-Search-WorkOrders' })}
                </Typography>

                <Button variant="contained" sx={{ marginRight: 1 }} onClick={handleExitButtonClick}>
                    {formatMessage({ id: 'exit' })}
                </Button>
            </Box>
            {/* <div className="content" style={{ flex: 1 }}> */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 工單號碼欄位-select版本 */}
                            {/* <Grid item xs={12}>
                                {formData.workOrderNumber?.map((workOrderNumber, index) => (
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
                            </Grid> */}

                            {/* 工單號碼欄位-key in版本 */}
                            <Grid item xs={12}>
                                {formData.workOrderNumber?.map((workOrderNumber, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
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

                                <RadioGroup row value={mode} onChange={handleModeChange}>
                                    <FormControlLabel value="single" control={<Radio />} label="Single SN" />
                                    <FormControlLabel value="range" control={<Radio />} label="SN Range" />
                                </RadioGroup>
                            </FormControl>

                            {/* 看SN是single還是range mode , 會影響到要send的FormData */}
                            {mode === 'single' && formData?.SN ? (
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
                            ) : mode === 'range' && formData?.snStart && formData?.snEnd ? (
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
                                                    value={formData.snEnd?.[index] || ''}
                                                    onChange={(e) => handleSnRangeChange('snEnd', index, e.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : null}






                            {/* 其他欄位 */}
                            <Grid item xs={6}>
                                {formData.productionDateStart?.map((productionDateStart, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            {formatMessage({ id: 'startdate' })}
                                            <TextField

                                                type="date"
                                                value={productionDateStart}
                                                onChange={(e) => handleFieldChange('productionDateStart', index, e.target.value)}
                                                fullWidth
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                            </Grid>
                            <Grid item xs={6}>
                                {formData.productionDateEnd?.map((productionDateEnd, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            {formatMessage({ id: 'enddate' })}
                                            <TextField

                                                type="date"
                                                value={productionDateEnd}
                                                onChange={(e) => handleFieldChange('productionDateEnd', index, e.target.value)}
                                                fullWidth
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                            </Grid>
                            {/* 序號QR_RFTray欄位 */}
                            <Grid item xs={12}>
                                {formData.QR_RFTray?.map((QR_RFTray, index) => (
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
                            <Grid item xs={12}>
                                {formData.QR_PS?.map((QR_PS, index) => (
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

                            <Grid item xs={12}>
                                {formData.QR_HS?.map((QR_HS, index) => (
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={10}>
                                            <TextField
                                                label={formatMessage({ id: 'QR_HS' })}
                                                value={QR_HS}
                                                onChange={(e) => handleFieldChange('QR_HS', index, e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleAddField('QR_HS')}>
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
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}
            {resultData.length != 0 ? (
                <>

                    <div>
                        <button onClick={handleDownloadTwowayExcel}>{formatMessage({ id: 'twowayexcel' })}</button>
                    </div>
                    <div>
                        <button onClick={handleDownloadCustomerExcel}>{formatMessage({ id: 'customexcel' })}</button>
                    </div>
                    <div>
                        <button onClick={handleDownloadAllExcel}>{formatMessage({ id: 'Allexcel' })}</button>
                    </div>
                    <Paper sx={{ width: '100%', height: '90%', overflow: 'hidden' }}>
                        <TableContainer component={Paper} style={{
                            maxHeight: '70vh', // 設置最大高度，避免超出視窗
                            overflowX: 'auto', // 確保左右滾動條出現
                            overflowY: 'auto', // 確保上下滾動條出現
                        }}
                        >
                            <Table stickyHeader aria-label="sticky table"
                                style={{
                                    minWidth: '800px', // 最小寬度，確保資料過多時滾動
                                    tableLayout: 'auto',
                                }}>
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>

                                        {/* <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'detailId' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'SN' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup1' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup2' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup3' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_backup4' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'note' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'create_date' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_date' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_user' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray_BEDID' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS_BEDID' })}</TableCell>
                                        <TableCell style={{ border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS_BEDID' })}</TableCell> */}



                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'detailId' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'SN' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray_BEDID' })}</TableCell>

                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS_BEDID' })}</TableCell>

                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS_BEDID' })}</TableCell>

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
            ) : (
                <p>NO DATA</p>
            )}
        </div >

    );
}

export default SearchTable1;



