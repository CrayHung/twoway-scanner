/**
 * 
 * 此組件為新增工單組件 , 
 * 
 */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Typography } from '@mui/material';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../global';
import './hightlight.css';
import { useIntl } from "react-intl";
import './SearchForm.css';


function AddNewWorker() {
    const { formatMessage } = useIntl();
    const { company, userRole, currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data, setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, model, setModel } = useGlobalContext();

    //fetch尚未完成,先用loading提示
    const [loading, setLoading] = useState(false);

    const [workNumber, setWorkNumber] = useState('');    //工單號碼
    const [rows, setRows] = useState(0);  // 工單數量資料筆數
    const [selectedPartNumber, setSelectedPartNumber] = useState('');    //下拉料號
    // const [inputMode, setInputMode] = useState("");    //料號對應的模式

    type InputMode = 'A' | 'B' | 'C' | 'D' | 'E';
    const [inputMode, setInputMode] = useState<InputMode>('A');


    const [data, setData] = useState<any[]>([]);

    const [currentRow, setCurrentRow] = useState<number | null>(null);

    // id是第0列 , 工單號碼是第1列，detailid是第2列 , 從第3列SN(序號)開始輸入其他資料
    // 因為要渲染的Table資料直接屏蔽掉id和 workOrderNumber欄位,所以初始從1開始
    const [currentColumn, setCurrentColumn] = useState<number | null>(1);
    const [inputValue, setInputValue] = useState('');
    const [isComplete, setIsComplete] = useState(false); // 用來標記是否已經完成掃描

    //for 編輯
    //接收number
    const [editCell, setEditCell] = useState<{ rowIndex: number | null; colIndex: number | null }>({ rowIndex: null, colIndex: null });
    //接收字串
    // const [editCell, setEditCell] = useState<{ rowIndex: number | null; colKey: string | null }>({ rowIndex: null, colKey: null }); //編輯當前的行和列
    const [savedData, setSavedData] = useState<any[]>([]); // 用來追蹤每行已儲存的資料
    const [originalData, setOriginalData] = useState<any[]>([]); // 保留原始的data

    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)


    useEffect(() => {
        console.log('目前所有table1的內容是:', JSON.stringify(table1Data, null, 2));
        console.log('目前所有table2的內容是:', JSON.stringify(table2Data, null, 2));
        console.log('目前所有table3的內容是:', JSON.stringify(table3Data, null, 2));

    }, []);

    /**************************************************************************************************************** */
    /**
     * 
     *  "生成表格" 按鈕 邏輯
     * 
     */

    /**
     * 
     "id" ,"workOrderNumber", "detailId", "sn", "qr_RFTray", "qr_PS", "qr_HS", 
     "qr_backup1", "qr_backup2", "qr_backup3", "qr_backup4", 
     "note", "create_date", "create_user", "edit_date", "edit_user"
    
     */



    //使用按鈕增新表格
    const handleGenerateTable = () => {
        // 檢查工單號碼、工單數量、料號是否有效
        if (!workNumber) {
            alert(formatMessage({ id: 'text2' }));
            return;
        }

        if (rows <= 0) {
            alert(formatMessage({ id: 'text3' }));
            return;
        }

        if (!selectedPartNumber) {
            alert(formatMessage({ id: 'text4' }));
            return;
        }

        //如果已存在相同工單號碼,將input框反白
        const sameWorkNumber = table1Data.some((row: any) => row.workOrderNumber === workNumber);
        if (sameWorkNumber) {
            alert(formatMessage({ id: 'text5' }));
            setWorkNumber(''); // 清空輸入框
            return;
        }

        // 根據工單數量和模式生成表格 (單機測試要另外增加id欄位...)
        setData(Array.from({ length: rows }, (v, i) => ({

            workOrderNumber: workNumber,
            detailId: i + 1,
            SN: '',
            QR_RFTray: '',
            QR_PS: '',
            QR_HS: '',
            QR_backup1: '',
            QR_backup2: '',
            QR_backup3: '',
            QR_backup4: '',
            note: '',
            create_date: today,
            create_user: currentUser,
            edit_date: '',
            edit_user: '',
            QR_RFTray_BEDID: '',
            QR_HS_BEDID: '',
            QR_PS_BEDID: ''

        })));

        setCurrentRow(0); // 重置行指針
        setCurrentColumn(1); // 重置列指針
        setIsComplete(false); // 重置完成狀態

    };


    // 處理工單數量輸入
    const handleRowChange = (e: any) => {
        const numRows = parseInt(e.target.value);
        if (numRows < 0) {
            alert(formatMessage({ id: 'text3' }));
        } else {
            setRows(numRows);
        }
    };


    /**************************************************************************************************************** */
    /**
     * 
     *  處理輸入 , 編輯
     * 
     */
    // const keyMap = [
    //     "id" , "workOrderNumber", "detailId", "sn", "qr_RFTray", "qr_PS", "qr_HS", "qr_backup1", "qr_backup2", "qr_backup3", "qr_backup4", "note", "create_date", "create_user", "edit_date", "edit_user"
    // ];

    /* */

    // const [updatedRowData, setUpdatedRowData] = useState<any>([]);
    // 處理條碼輸入
    // const handleBarcodeInput = (event: any) => {
    //     if (event.key === 'Enter' && !isComplete) {
    //         event.preventDefault();
    //         const newValue = inputValue.trim();

    //         const rowIndex = currentRow !== null ? currentRow : 0;
    //         if (newValue && currentRow !== null && currentRow < rows) {//尚未達到工單數量

    //             const updatedData = [...data];
    //             let updatedRow = { ...updatedData[currentRow] };

    //             /* 檢查新輸入的SN是否已存在資料庫或即將要新增的updatedRow中*/
    //             // if (table2Data.some((row: { SN: string; }) => row.SN === newValue) ||
    //             //     updatedRowData.some((row: { SN: string; }) => row.SN === newValue)
    //             // ) {
    //             //     alert("SN 已存在，請輸入不同的 SN");
    //             //     setInputValue(''); // 清空輸入框
    //             //     return;
    //             // }





    //             // 根據當前模式和欄位，填入不同的條碼數據
    //             if (inputMode === 'A') {
    //                 // A模式: 依次填入 sn 和 qr_HS
    //                 if (currentColumn === 1) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(4); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (inputMode === 'B') {
    //                 // B模式: 依次填入 sn 和 qr_RFTray
    //                 if (currentColumn === 1) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(2); // 跳到QR_RFTray欄位
    //                 } else if (currentColumn === 2) { // 填入QR_RFTray欄位
    //                     updatedRow.QR_RFTray = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (inputMode === 'C') {
    //                 // C模式: 依次填入 sn 和 qr_PS
    //                 if (currentColumn === 1) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(3); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 3) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (inputMode === 'D') {
    //                 // D模式: 依次填入 sn, qr_PS, qr_HS
    //                 if (currentColumn === 1) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(3); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 3) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     setCurrentColumn(4); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (inputMode === 'E') {
    //                 // E模式: 依次填入 sn, qr_RFTray, qr_PS, qr_HS
    //                 if (currentColumn === 1) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(2); // 跳到QR_RFTray欄位
    //                 } else if (currentColumn === 2) { // 填入QR_RFTray欄位
    //                     updatedRow.QR_RFTray = newValue;
    //                     setCurrentColumn(3); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 3) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     setCurrentColumn(4); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             }

    //             // 更新當前行的資料
    //             updatedRow.edit_user = currentUser;
    //             updatedRow.edit_date = today;
    //             updatedData[currentRow] = updatedRow;
    //             setData(updatedData); // 更新整體表格資料
    //             setInputValue(''); // 清空輸入框

    //             // 新增到 updatedRowData
    //             setUpdatedRowData((prevUpdatedRow: any) => [...prevUpdatedRow, updatedRow]);
    //         }
    //     }
    // };
    // 處理是否需要跳到下一行或標記掃描完成
    // const moveToNextRowOrEnd = () => {
    //     setCurrentColumn(1); // 重置到 sn 欄位

    //     if (currentRow !== null && currentRow + 1 >= rows) {
    //         setIsComplete(true); // 已經完成所有行的掃描
    //         setCurrentColumn(1);
    //         setCurrentRow(null);
    //     } else {
    //         setCurrentRow((prevRow) => {
    //             if (prevRow !== null && prevRow + 1 < rows) {
    //                 return prevRow + 1;
    //             }
    //             return prevRow;
    //         });
    //     }

    // };

    /* */


    /***************************************************************** */
    // const [updatedRowData, setUpdatedRowData] = useState<any>([]);
    // const handleBarcodeInput = (event:any) => {
    //     if (event.key === 'Enter' && !isComplete) {
    //         event.preventDefault();
    //         const newValue = inputValue.trim();

    //         const rowIndex = currentRow !== null ? currentRow : 0;
    //         if (newValue && currentRow !== null && currentRow < rows) {
    //             const updatedData = [...data];
    //             let updatedRow = { ...updatedData[currentRow] };

    //             // 僅在輸入 SN 欄位時進行重複檢查
    //             if (currentColumn === 1) {
    //                 const isSNDuplicate = 
    //                     table2Data.some((row: { SN: string; }) => row.SN === newValue) || 
    //                     updatedRowData.some((row: { SN: string; }) => row.SN === newValue);

    //                 if (isSNDuplicate) {
    //                     alert("SN 已存在，請輸入不同的 SN");
    //                     setInputValue(''); // 清空輸入框
    //                     return; // 如果重複，終止輸入
    //                 }

    //                 // 將輸入的 SN 值儲存到當前行的 `SN` 欄位
    //                 updatedRow.SN = newValue;
    //             } else {
    //                 // 當前是非 SN 欄位，直接根據模式將值儲存到對應的欄位
    //                 if (inputMode === 'A' && currentColumn === 4) {
    //                     updatedRow.QR_HS = newValue;
    //                 } else if (inputMode === 'B' && currentColumn === 2) {
    //                     updatedRow.QR_RFTray = newValue;
    //                 } else if (inputMode === 'C' && currentColumn === 3) {
    //                     updatedRow.QR_PS = newValue;
    //                 } else if (inputMode === 'D') {
    //                     if (currentColumn === 3) {
    //                         updatedRow.QR_PS = newValue;
    //                     } else if (currentColumn === 4) {
    //                         updatedRow.QR_HS = newValue;
    //                     }
    //                 } else if (inputMode === 'E') {
    //                     if (currentColumn === 2) {
    //                         updatedRow.QR_RFTray = newValue;
    //                     } else if (currentColumn === 3) {
    //                         updatedRow.QR_PS = newValue;
    //                     } else if (currentColumn === 4) {
    //                         updatedRow.QR_HS = newValue;
    //                     }
    //                 }
    //             }

    //             // 更新當前行的資料
    //             updatedRow.edit_user = currentUser;
    //             updatedRow.edit_date = today;
    //             updatedData[currentRow] = updatedRow;
    //             setData(updatedData); // 更新整體表格資料
    //             setInputValue(''); // 清空輸入框
    //             setUpdatedRowData(updatedData);

    //             // 移動到下一個欄位或行
    //             moveToNextColumnOrRow();
    //         }
    //     }
    // };

    // // 移動到下一個欄位或下一行的輔助函數
    // const moveToNextColumnOrRow = () => {

    //     const columnsPerMode: { [key in InputMode]: number } = {
    //         'A': 4,
    //         'B': 2,
    //         'C': 3,
    //         'D': 4,
    //         'E': 4,
    //     };

    //     const maxColumn = columnsPerMode[inputMode];

    //     // 如果當前欄位是最後一個欄位，移動到下一行的 SN 欄位
    //     if (currentColumn === maxColumn) {
    //         setCurrentRow((prevRow) => {
    //             // 如果 prevRow 為 null，則設置為 0
    //             return prevRow !== null ? prevRow + 1 : 0;
    //         });
    //         setCurrentColumn(1); // 重設為 SN 欄位
    //     } else {
    //         // 否則移動到下一個欄位
    //         setCurrentColumn((prevColumn) => {
    //             // 如果 prevRow 為 null，則設置為 0）
    //             return prevColumn !== null ? prevColumn + 1 : 0;
    //         });
    //     }
    // };

    /***************************************************************** */
    // const handleBarcodeInput = (event: any) => {
    //     if (event.key === 'Enter' && !isComplete) {
    //         event.preventDefault();
    //         const newValue = inputValue.trim();

    //         const rowIndex = currentRow !== null ? currentRow : 0;
    //         if (newValue && currentRow !== null && currentRow < rows) {
    //             const updatedData = [...data];
    //             let updatedRow = { ...updatedData[currentRow] };

    //             // 確定當前欄位的名稱
    //             let fieldToCompare = "";
    //             if (currentColumn === 1) fieldToCompare = "SN";
    //             else if (currentColumn === 2) fieldToCompare = "QR_RFTray";
    //             else if (currentColumn === 3) fieldToCompare = "QR_PS";
    //             else if (currentColumn === 4) fieldToCompare = "QR_HS";

    //             // 比對資料庫 (table2Data) 和已輸入資料 (updatedData)
    //             const isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => item[fieldToCompare] === newValue);
    //             const isDuplicateInUpdatedData = updatedData.some((item, index) => index < currentRow && item[fieldToCompare] === newValue);

    //             if (isDuplicateInDatabase || isDuplicateInUpdatedData) {
    //                 alert(`${fieldToCompare} 已存在，請輸入不同的 ${fieldToCompare}`);
    //                 setInputValue(''); // 清空輸入框
    //                 return;
    //             }

    //             // 更新當前欄位的數據
    //             updatedRow[fieldToCompare] = newValue;
    //             updatedRow.edit_user = currentUser;
    //             updatedRow.edit_date = today;

    //             updatedData[currentRow] = updatedRow;
    //             setData(updatedData); // 更新整體表格資料
    //             setInputValue(''); // 清空輸入框

    //             // 移動到下一個欄位或下一行
    //             moveToNextColumnOrRow();
    //         }
    //     }
    // };

    // // 移動到下一個欄位或下一行
    // const moveToNextColumnOrRow = () => {

    //     const columnsPerMode: { [key in InputMode]: number } = {
    //         'A': 4,
    //         'B': 2,
    //         'C': 3,
    //         'D': 4,
    //         'E': 4,
    //     };

    //     const maxColumn = columnsPerMode[inputMode];

    //     if (currentColumn === maxColumn) {
    //         setCurrentRow((prevRow) => (prevRow !== null ? prevRow + 1 : 0));
    //         setCurrentColumn(1); // 重設為 SN 欄位

    //     } else {
    //         // 移動到下一欄位
    //         setCurrentColumn((prevColumn) => {
    //             // 如果 prevRow 為 null，則設置為 0）
    //             return prevColumn !== null ? prevColumn + 1 : 0;
    //         });
    //     }
    // };


    /***************************************************************** */
    const [updatedRowData, setUpdatedRowData] = useState<any>([]);
    const extractID = (value: string) => {
        const match = value.match(/\.\$ID:(.*?)\.\$/);
        return match ? match[1] : null;
    };

    const handleBarcodeInput = (event: any) => {
        if (event.key === 'Enter' && !isComplete) {
            event.preventDefault();
            const newValue = inputValue.trim();

            const rowIndex = currentRow !== null ? currentRow : 0;
            if (newValue && currentRow !== null && currentRow < rows) {
                const updatedData = [...data];
                let updatedRow = { ...updatedData[currentRow] };

                // 確定當前欄位的名稱
                let fieldToCompare = "";
                if (currentColumn === 1) fieldToCompare = "SN";
                else if (currentColumn === 2) fieldToCompare = "QR_RFTray";
                else if (currentColumn === 3) fieldToCompare = "QR_PS";
                else if (currentColumn === 4) fieldToCompare = "QR_HS";
                // 比對資料庫 (table2Data) 和已輸入資料 (updatedData)
                let isDuplicateInDatabase = false;
                let isDuplicateInUpdatedData = false;

                if (fieldToCompare === "SN") {
                    isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => item[fieldToCompare] === newValue);
                    isDuplicateInUpdatedData = updatedRowData.some((item: { [x: string]: string; }, index: number) => index < currentRow && item[fieldToCompare] === newValue);

                    if (isDuplicateInDatabase || isDuplicateInUpdatedData) {
                        alert(`${fieldToCompare} 已存在，請輸入不同的 ${fieldToCompare}`);
                        setInputValue(''); // 清空輸入框
                        return;
                    }
                    // 更新當前欄位的數據
                    updatedRow[fieldToCompare] = newValue;
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setData(updatedData); // 更新整體表格資料
                    setUpdatedRowData(updatedData);
                    setInputValue(''); // 清空輸入框

                    // 移動到下一個欄位或下一行
                    moveToNextColumnOrRow();

                } else {
                    isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => extractID(item[fieldToCompare]) === extractID(newValue));
                    isDuplicateInUpdatedData = updatedData.some((item, index) => index < currentRow && extractID(item[fieldToCompare]) === extractID(newValue));

                    if (isDuplicateInDatabase || isDuplicateInUpdatedData) {
                        alert(`${fieldToCompare} 已存在，請輸入不同的 ${fieldToCompare}`);
                        setInputValue(''); // 清空輸入框
                        return;
                    }
                    updatedRow[`${fieldToCompare}`] = newValue;
                    updatedRow[`${fieldToCompare}_BEDID`] = extractID(newValue);
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setData(updatedData); // 更新整體表格資料
                    setUpdatedRowData(updatedData);
                    setInputValue(''); // 清空輸入框

                    // 移動到下一個欄位或下一行
                    moveToNextColumnOrRow();
                }








            }
        }
    };

    // 移動到下一個欄位或下一行
    const moveToNextColumnOrRow = () => {
        const columnsPerMode: { [key in InputMode]: number } = {
            'A': 4,
            'B': 2,
            'C': 3,
            'D': 4,
            'E': 4,
        };

        const maxColumn = columnsPerMode[inputMode];

        // if (currentColumn === maxColumn) {
        //     setCurrentRow((prevRow) => (prevRow !== null ? prevRow + 1 : 0));
        //     setCurrentColumn(1); // 重設為 SN 欄位
        // } else {
        //     // 移動到下一欄位
        //     setCurrentColumn((prevColumn) => {
        //         return prevColumn !== null ? prevColumn + 1 : 0;
        //     });
        // }

        //該筆資料的欄位已輸入完畢
        if (currentColumn === maxColumn) {
            //下一行的資料大於總資料行數,則不繼續新增
            if (currentRow !== null && currentRow + 1 >= rows) {
                setIsComplete(true); // 完成輸入
                setCurrentColumn(1); // 重置欄位到 SN
                setCurrentRow(null); // 重置行數
            } else {
                setCurrentRow((prevRow) => (prevRow !== null ? prevRow + 1 : 0));
                setCurrentColumn(1); // 重設為 SN 欄位
            }
        }
        // 移動到下一欄位
        else {
            setCurrentColumn((prevColumn) => {
                return prevColumn !== null ? prevColumn + 1 : 0;
            });
        }



    };




    /***************************************************************** */

    // 處理單元格點擊進入編輯模式(接收row和column的key)
    // const handleCellClick = (rowIndex: number, colKey: string) => {
    //     //只開放note欄位可手動新增
    //     if (
    //         colKey === 'workOrderNumber' || colKey === 'id' || colKey === 'sn' || colKey === 'qr_RFTray' ||
    //         colKey === 'qr_PS' || colKey === 'qr_HS' || colKey === 'qr_backup1' || colKey === 'qr_backup2' ||
    //         colKey === 'qr_backup3' || colKey === 'qr_backup4' ||
    //         colKey === 'create_date' || colKey === 'create_user' || colKey === 'edit_date' || colKey === 'edit_user') {
    //         return;
    //     }
    //     setEditCell({ rowIndex, colKey });
    // };

    // 處理單元格點擊進入編輯模式(接收row和column index)
    const handleCellClick = (rowIndex: number, colIndex: number) => {
        // 根據 colIndex 來取得實際的欄位名稱
        const colKey = Object.keys(data[rowIndex])
            .filter((key) => key !== 'id' && key !== 'workOrderNumber')[colIndex];

        // 只允許編輯QR_RFTray ,QR_PS,QR_HS ,QR_backup1,QR_backup2,QR_backup3,QR_backup4note的欄位
        if (
            colKey === 'id' || colKey === 'workOrderNumber' || colKey === 'detailId' || colKey === 'SN' ||
            colKey === 'create_date' || colKey === 'create_user' || colKey === 'edit_date' || colKey === 'edit_user'
        ) {
            return;
        }
        setEditCell({ rowIndex, colIndex });
    };


    // 處理編輯完成後，更新data (使用colKey)
    // const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colKey: string) => {
    //     const updatedData = data.map((row: any, idx: any) =>
    //         idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today } : row
    //     );
    //     setData(updatedData);
    // };

    // 處理編輯完成後，更新data (使用col index)
    const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colIndex: number) => {
        //取得所有欄位名
        const colKey = Object.keys(data[rowIndex])
            //略掉id worrOrderNumber兩欄位
            .filter((key) => key !== 'id' && key !== 'workOrderNumber')[colIndex];

        const updatedData = data.map((row: any, idx: any) =>
            //如果當前行和目標行相同,則將該欄位的值更新,其他行則維持原本的值
            idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today } : row
        );

        setData(updatedData);
    };


    // 結束編輯模式(使用colKey)
    // const handleCellBlur = () => {
    //     setEditCell({ rowIndex: null, colKey: null });
    // };
    // 結束編輯模式(使用col index)
    const handleCellBlur = () => {
        setEditCell({ rowIndex: null, colIndex: null });
    };



    // 儲存表格資料
   
    const handleSaveData = () => {

        setLoading(true); // 開始Loading

        try {


            const newFormattedData = data.map((row: any, index: any) => {

                // 如果原始資料不存在，設定為空物件，避免 undefined 錯誤
                const originalRow = originalData[index] || {};

                // 如果之前有儲存的資料，使用已儲存的資料，否則使用當前 row 資料
                const savedRow = savedData[index] || {
                    workOrderNumber: row.workOrderNumber,
                    // detailId: row.detailId,
                    SN: row.SN,
                    QR_RFTray: row.QR_RFTray,
                    QR_PS: row.QR_PS,
                    QR_HS: row.QR_HS,
                    QR_backup1: row.QR_backup1,
                    QR_backup2: row.QR_backup2,
                    QR_backup3: row.QR_backup3,
                    QR_backup4: row.QR_backup4,
                    note: row.note,
                    // create_date: row.create_date,
                    create_user: row.create_user,
                    // edit_date: row.edit_date,
                    edit_user: row.edit_user,
                    QR_RFTray_BEDID: row.QR_RFTray_BEDID,
                    QR_PS_BEDID: row.QR_PS_BEDID,
                    QR_HS_BEDID: row.QR_HS_BEDID,
                };

                // 判斷該行是否有資料變動
                const hasChanged =
                    originalRow.workOrderNumber !== savedRow.workOrderNumber ||
                    // originalRow.detailId !== savedRow.detailId ||
                    originalRow.SN !== savedRow.SN ||
                    originalRow.QR_RFTray !== savedRow.QR_RFTray ||
                    originalRow.QR_PS !== savedRow.QR_PS ||
                    originalRow.QR_HS !== savedRow.QR_HS ||
                    originalRow.QR_backup1 !== savedRow.QR_backup1 ||
                    originalRow.QR_backup2 !== savedRow.QR_backup2 ||
                    originalRow.QR_backup3 !== savedRow.QR_backup3 ||
                    originalRow.QR_backup4 !== savedRow.QR_backup4 ||
                    originalRow.note !== savedRow.note ||
                    originalRow.QR_RFTray_BEDID !== savedRow.QR_RFTray_BEDID ||
                    originalRow.QR_PS_BEDID !== savedRow.QR_PS_BEDID ||
                    originalRow.QR_HS_BEDID !== savedRow.QR_HS_BEDID;

                // 如果資料有變動，更新資料，並更新日期和使用者
                if (hasChanged) {
                    const updatedRow = {
                        ...savedRow,          // 保留其餘欄位的值
                        edit_user: currentUser,  // 更新使用者
                    };

                    // 移除不需要的欄位 (detailId, create_date, edit_date)
                    const { detailId, create_date, edit_date, ...filteredRow } = updatedRow;
                    return filteredRow;
                } else {
                    // 如果沒有變動，返回原始資料，保持 date 和 user 不變
                    return savedRow;
                }


            });

            // 這邊用API將新增的資料存到DB中的 table1 table2
            console.log("要新增table2的資料:" + JSON.stringify(newFormattedData));
            //將新增的表格加入到table2資料庫
            // const fetchData2 = async () => {
            //     try {
            //         const response = await fetch(`${globalUrl.url}/api/post-work-order-details`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify(newFormattedData),
            //         });
            //         if (!response.ok) {
            //             throw new Error(`HTTP error! Status: ${response.status}`);
            //         }
            //         const res = await response.json();
            //         console.log("新增table2成功" + res);
            //     } catch (error: any) {
            //         console.error('Error :', error);

            //     }
            // };

            //將資料加到table1Data
            const newTestData1 = {
                workOrderNumber: workNumber,
                quantity: rows,
                partNumber: selectedPartNumber,
                company: company,
                createUser: currentUser,
                createDate: today,
                editUser: currentUser,
                editDate: today
            };
            // console.log("要新增table1的資料:" + JSON.stringify(newTestData1));
            // 這邊用API將新增的資料存到DB中的 table1 table2
            //將新增的表格加入到table1資料庫
            // const fetchData1 = async () => {
            //     try {
            //         const response = await fetch(`${globalUrl.url}/api/post-work-orders`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify(newTestData1),
            //         });
            //         if (!response.ok) {
            //             throw new Error(`HTTP error! Status: ${response.status}`);
            //         }
            //         // const res = await response.json();
            //         console.log("新增table1成功" + response);

            //         await fetchData2();

            //     } catch (error: any) {
            //         console.error('Error :', error);

            //     }
            // };







            // fetchData1();
        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            setLoading(false); // 完成後結束Loading
        }


    };


    /**
     * 
     * 一進組件要做的
     * 資料初始化
     * 換頁
     * 將table3的料號對應model儲存起來
     */

    //一進頁面先將資料初始化
    useEffect(() => {
        setWorkNo('');
        setQuant(0);
        setPart('');
        setModel('');
    }, [])

    // 根據 selectedPartNumber 找到對應的 inputMode
    useEffect(() => {
        const foundItem = table3Data.find((item: { partNumber: string; }) => item.partNumber === selectedPartNumber);
        if (foundItem) {
            setInputMode(foundItem.inputMode);
        }
    }, [selectedPartNumber, table3Data]);



    // useEffect(() => {
    //     console.log('新增的表單:', JSON.stringify(data, null, 2));
    // }, [data])

    // useEffect(() => {
    //     alert("工單號碼"+workNumber+"數量"+rows+"料號"+selectedPartNumber+"模式"+inputMode);
    // }, [workNumber,rows,selectedPartNumber,inputMode]);


    const handleExitButtonClick = () => {
        navigate('/');
    };


    return (
        <>
            <div className="content" style={{ flex: 1 }}>


                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h4" gutterBottom>
                        {formatMessage({ id: 'newwork' })}
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

                <div>
                    <>
                        <label>{formatMessage({ id: 'workOrderNumber' })}：</label>
                        <input
                            type="text"
                            value={workNumber}
                            onChange={(e) => setWorkNumber(e.target.value)}
                        />
                    </>
                    <>
                        <label>{formatMessage({ id: 'part' })}：</label>
                        <select value={selectedPartNumber} onChange={(e) => setSelectedPartNumber(e.target.value)}>
                            <option value="">{formatMessage({ id: 'part' })}</option>
                            {table3Data.map((item: any) => (
                                <option key={item.id} value={item.partNumber}>
                                    {item.partNumber}
                                </option>
                            ))}
                        </select>
                    </>
                    <>
                        <label>{formatMessage({ id: 'quantity' })}：</label>
                        <input type="number" value={rows} onChange={handleRowChange} />
                    </>
                    <button onClick={handleGenerateTable}>{formatMessage({ id: 'generate' })}</button>
                </div>



                {data.length > 0 &&
                    <>
                        {!isComplete &&
                            <>
                                <button onClick={handleSaveData}>{formatMessage({ id: 'save' })}</button>

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleBarcodeInput}
                                    placeholder={formatMessage({ id: 'text' })}
                                    disabled={isComplete} // 當掃描完成後禁用輸入框
                                />
                            </>
                        }
                        {isComplete && <p>{formatMessage({ id: 'text1' })}</p>}
                        <Paper sx={{ width: '100%', overflow: 'hidden', height: '90%' }}>
                            <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>

                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow style={{ border: '1px solid #ccc' }}>
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
                                    {/* 使用colKey */}
                                    {/* <TableBody>
                                        {data.map((row: any, rowIndex: number) => (
                                            <TableRow key={rowIndex} >
                                                {Object.keys(row)
                                                    .filter((colKey) => colKey !== 'id' && colKey !== 'workOrderNumber')
                                                    .map((colKey, colIndex) => (
                                                        <TableCell
                                                            key={colKey}
                                                            onClick={() => handleCellClick(rowIndex, colKey)}
                                                            className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}
                                                        >
                                                            {editCell.rowIndex === rowIndex && editCell.colKey === colKey ? (
                                                                <TextField
                                                                    value={row[colKey]}
                                                                    onChange={(e) => handleCellChange(e, rowIndex, colKey)}
                                                                    onBlur={handleCellBlur}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                row[colKey]
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))}
                                    </TableBody> */}

                                    {/* 使用col index */}
                                    <TableBody>
                                        {data.map((row: any, rowIndex: number) => (
                                            <TableRow key={rowIndex}>
                                                {Object.keys(row)
                                                    .filter((colKey) => colKey !== 'id' && colKey !== 'workOrderNumber')
                                                    .map((colKey, colIndex) => (
                                                        <TableCell
                                                            key={colKey}
                                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                                            className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}
                                                        >
                                                            {editCell.rowIndex === rowIndex && editCell.colIndex === colIndex ? (
                                                                <TextField
                                                                    value={row[colKey]}
                                                                    onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                                                                    onBlur={handleCellBlur}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                row[colKey]
                                                            )}
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
        </>
    );
}

export default AddNewWorker;