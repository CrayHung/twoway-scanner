/**
 * 
 * 此組件會根據單一筆的工單號碼(workOrderNumber) , 列出Table2內該筆工單的所有資訊 ,並可進行編輯 
 * 
 */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, SelectChangeEvent, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';
import { message } from 'antd';
import { useIntl } from "react-intl";
import './SearchForm.css';
import { truncate } from 'fs/promises';



const SearchForm = () => {
    const { formatMessage } = useIntl();
    const { company, setTable1Id, table1Id, userRole, currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data, setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, model, setModel } = useGlobalContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //fetch尚未完成,先用loading提示
    const [loading, setLoading] = useState(false);
    type InputMode = 'A' | 'B' | 'C' | 'D' | 'E';
    const [inputMode, setInputMode] = useState<InputMode>(model);

    const [isComplete, setIsComplete] = useState(false); // 用來標記是否已經完成掃描
    const [continueInput, setContinueInput] = useState(false); // 用來標記是否繼續輸入
    const [updateData, setUpdateData] = useState(false);    // 用來標記是否要修改工單

    // const [updateCell, setUpdateCell] = useState(false);    // 用來標記如果TableCell有更改過的話,要先將原本的button都隱藏,只顯示儲存

    // for 編輯表單
    const [rows, setRows] = useState(0);  // 工單數量資料筆數
    const [currentRow, setCurrentRow] = useState<number | null>(null);
    // id是第0列 , 工單號碼是第1列，detailid是第2列 , 從第3列SN(序號)開始輸入其他資料
    //但要渲染的資料將id給屏蔽掉了 , 所以從第2列SN開始...但因為不確定一開始在SN欄位還是QR_欄位,所以不給初始值
    const [currentColumn, setCurrentColumn] = useState<number | null>(null);


    //接收number
    const [editCell, setEditCell] = useState<{ rowIndex: number | null; colIndex: number | null }>({ rowIndex: null, colIndex: null });
    //接收字串
    // const [editCell, setEditCell] = useState<{ rowIndex: number | null; colKey: string | null }>({ rowIndex: null, colKey: null }); //編輯當前的行和列
    const [inputValue, setInputValue] = useState('');

    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const navigate = useNavigate();

    //如要修改 , 編輯table1資料用
    const [updateWorkNo, setUpdateWorkNo] = useState(workNo);
    const [updateWorkQuantity, setUpdateWorkQuantity] = useState(quant);
    const [updateWorkPart, setUpdateWorkPart] = useState(part);

    const [originalData, setOriginalData] = useState<any[]>([]);
    const [updatedRowData, setUpdatedRowData] = useState<any>([]);

    const [editingCell, setEditingCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
    /**************************************************************************************************************** */
    /**
     * 
     * 一進組件要做的
     * 將該筆workNo從table1 , 
     * 將該筆workNo從table2拉出來 , 並設定給originalData
     */

    useEffect(() => {
        console.log("選到的公單號碼:" + workNo);
        console.log("公單號碼的數量:" + quant);
        console.log("公單號碼的料號:" + part);
        console.log("公單號碼的料號對應模式:" + model);


    }, [workNo, quant, part, model])

    // 把originalData清空
    useEffect(() => {
        setOriginalData([]);
    }, [])

    // useEffect(() => {
    //     console.log("目前資料:",JSON.stringify(originalData, null, 2) );
    // }, [originalData])



    // useEffect(() => {
    //     //      console.log('目前所有table1的內容是:', JSON.stringify(table1Data, null, 2));
    //     //      console.log('目前所有table2的內容是:', JSON.stringify(table2Data, null, 2));
    //     // console.log('目前originalData的內容是:', JSON.stringify(originalData, null, 2));
    //     // console.log('資料共' + rows + '筆');
    //     //      console.log("目前的model是:" + model);
    // }, [originalData]);


    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    /**************************************************************************************************************** */
    /**
     * 
     * 更改 "編輯按鈕" 的input 用
     * 
     */
    //取消更改
    const handleCancel = () => {
        setUpdateData(false);
    }
    //編輯按鈕
    const handleUpdate = () => {
        setUpdateData(true);
    }
    //編輯按鈕裡面的"確認更改"按鈕
    //將有更改的內容PUT到 table1 ,table2做修改
    const handleConfirm = async () => {

        /******************************************* */
        // 更新 table1Data
        /******************************************* */
        // for table1 update
        const updatedTable1Data = {
            workOrderNumber: updateWorkNo !== workNo ? updateWorkNo : workNo,
            quantity: updateWorkQuantity !== quant ? updateWorkQuantity : quant,
            partNumber: updateWorkPart !== part ? updateWorkPart : part,
            editUser: currentUser,
            company: company,
        };
        //for table2 update
        const updatedRows = table2Data.filter((row: { workOrderNumber: any; }) => row.workOrderNumber === workNo).map((row: { workOrderNumber: any; }) => ({
            ...row,
            workOrderNumber: updateWorkNo || row.workOrderNumber
        }));
        const originalRowCount = updatedRows.length;

        // for table2 add
        const additionalRows: any = [];
        if (updateWorkQuantity > originalRowCount) {
            additionalRows.push(...Array.from({ length: updateWorkQuantity - originalRowCount }, (_, index) => ({
                workOrderNumber: updateWorkNo || workNo,
                // detailId: originalRowCount + index + 1,  //這個由後端自行累加
                SN: '',
                QR_RFTray: '',
                QR_PS: '',
                QR_HS: '',
                QR_backup1: '',
                QR_backup2: '',
                QR_backup3: '',
                QR_backup4: '',
                note: '',
                create_user: currentUser,
                edit_user: currentUser,
                // QR_RFTray_BEDID: '',
                // QR_PS_BEDID: '',
                // QR_HS_BEDID: '',
            })));
        }

        setLoading(true); // 開始Loading

        /**
                更新tbale2Data邏輯為
                步驟1.  將舊的table2資料更新....資料庫join的關係似乎連動改了?...所以這部份不用做
                步驟2.  新增資料   (有修改updateWorkQuantity的話)
         */


        // 第一次table2 的 API請求 - 更新資料 ( 有用join的關係  免做)
        // const fetchUpdateRows = async () => {
        //     console.log("table2的第一個更新請求 : ", JSON.stringify(updatedRows, null, 2));
        //     try {
        //         const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(updatedRows),
        //         });

        //         if (!response.ok) {
        //             throw new Error('Failed to 更新已存在資料');
        //         } else {
        //             console.log('完成更新現有資料');
        //         }
        //     } catch (error) {
        //         console.error('Error updating rows:', error);
        //     }
        // };


        // 第二次table2的 API 請求 - 新增資料
        const fetchAddRows = async () => {
            console.log("additionalRows", JSON.stringify(additionalRows, null, 2))

            try {
                const response = await fetch(`${globalUrl.url}/api/post-work-order-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(additionalRows),
                });

                if (!response.ok) {
                    throw new Error('Failed to 新增資料');
                } else {
                    console.log('完成新增資料');
                }
            } catch (error) {
                console.error('Error adding rows:', error);
            }
        };


        //更新table1資料
        const fetchUpdateTable1 = async () => {

            try {
                const response = await fetch(`${globalUrl.url}/api/update-work-orders/${table1Id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTable1Data),
                })

                if (!response.ok) {
                    throw new Error('Failed to 更新已存在資料');
                } else {
                    console.log('完成更新現有資料');
                    if (additionalRows.length > 0) {
                        //如果有增加行 , 則要新增行到table2
                        await fetchAddRows();
                    }
                    await fetchAll();
                }
            } catch (error) {
                console.error('Error updating rows:', error);
            }
        }

        fetchUpdateTable1();

        // fetch(`${globalUrl.url}/api/update-work-orders/${table1Id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(updatedData),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('更新成功:', data);
        //         await fetchAddRows();
        //     })
        //     .catch((error) => {
        //         console.error('更新失敗:', error);
        //     });


        /******************************************* */
        // 更新 table1Data
        /******************************************* */


        //將table1Data裡面多餘的workOrderDetails資訊刪掉
        const removeWorkOrderDetails = (data: any[]) => {
            return data.map(({ workOrderDetails, ...rest }) => rest);
        };


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


            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };



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
                    // QR_RFTray_BEDID: item.QR_RFTray_BEDID,
                    // QR_PS_BEDID: item.QR_PS_BEDID,
                    // QR_HS_BEDID: item.QR_HS_BEDID,
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

        const fetchAll = () => {
            fetchAllTable1();
            fetchAllTable2();
            fetchAllTable3();
            // setWorkNo('');
            // setQuant('');
            // setPart('');
            // setModel('');
            // setTable1Id('');
        }


        // setTable2Data((prevTable2Data: any) => {

        //     //將所有相同的workOderNumber抓出來
        //     const originalRows = prevTable2Data.filter((row: { workOrderNumber: any; }) => row.workOrderNumber === workNo);

        //     // 更新原有的workOrderNumber資料
        //     let updatedRows = originalRows.map((row: { workOrderNumber: any;}) => ({
        //         ...row,
        //         //逐條比對,如果有新值 , 則更新
        //         workOrderNumber: updateWorkNo && updateWorkNo !== workNo
        //             ? updateWorkNo
        //             : row.workOrderNumber,

        //     }));

        //     // 如果newQuantity大於現有資料數量，新增行
        //     // 如果小於則不做任何改動
        //     if (updateWorkQuantity && updateWorkQuantity > originalRows.length) {
        //         const rowsToAdd = updateWorkQuantity - originalRows.length;

        //         const additionalRows = Array.from({ length: rowsToAdd }, (_, index) => ({
        //             workOrderNumber: updateWorkNo || workNo, // 如果updateWork有值則使用 , 沒有則用舊的
        //             detailId: originalRows.length + index + 1,
        //             sn: '',
        //             qr_RFTray: '',
        //             qr_PS: '',
        //             qr_HS: '',
        //             qr_backup1: '',
        //             qr_backup2: '',
        //             qr_backup3: '',
        //             qr_backup4: '',
        //             note: '',
        //             create_date: today,
        //             create_user: currentUser,
        //             edit_date: today,
        //             edit_user: currentUser,
        //         }));

        //         updatedRows = [...updatedRows, ...additionalRows]; // 新增的行加到已更新的資料
        //     }

        //     // 更新整個 table2Data
        //     return updatedRows;
        // });

        // setOriginalData(table2Data);

        //在同時更新和新增的情況下，應該先更新需要的workOrderNumber欄位，然後檢查是否需要新增行，最後將所有更新後的資料一起傳送到後端。

        // 將table2Data資料UPDATE資料庫
        // const fetchUpdateTable2 = async () => {
        //     try {
        //         const response = await fetch(`${globalUrl.url}/api/`, {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(table2Data),
        //         });

        //         if (!response.ok) {
        //             throw new Error('Failed to 更新Table2');
        //         } else {
        //             console.log('完成更新table2');
        //         }

        //     } catch (error) {
        //         console.error('Error fetching token:', error);
        //     }
        // };

        // fetchUpdateTable2();




        //根據料號part , 找出table3該料號對應的model是哪個 , 更新setModel
        const selectedData = table3Data.find((data: any) => data.partNumber === updateWorkPart);
        if (selectedData) {
            setModel(selectedData.inputMode);
        }

        //將編輯按鈕顯現出來 ,關閉原本的3個input框
        setUpdateData(false);

        setLoading(false); // 完成後結束Loading

        navigate("/editWorker/reload");
    };

    /**************************************************************************************************************** */
    /**
     * 
     * table用
     * 編輯單元格
     * 處理Barcode input
     * 輸入完表單後要儲存
     */


    // 處理單元格點擊進入編輯模式(接收row和column的key)
    // const handleCellClick = (rowIndex: number, colKey: string) => {
    //     //不開放編輯的欄位
    //     if (colKey === 'id' || colKey === 'workOrderNumber' || colKey === 'detailId' || colKey === 'create_date' || colKey === 'create_user' || colKey === 'edit_date' || colKey === 'edit_user') {
    //         return;
    //     }
    //     setEditCell({ rowIndex, colKey });
    // };


    // 處理單元格點擊進入編輯模式(接收row和column index)
    const handleCellClick = (rowIndex: number, colIndex: number) => {

        // 根據 colIndex 來取得實際的欄位名稱
        const colKey = Object.keys(originalData[rowIndex])
            .filter((key) => key !== 'id')[colIndex];

        /****************************************************** */
        //因為alert會讓單元格無法點到, 所以用antd的message來處理
        const nonEditableKeys = [
            'id', 'workOrderNumber', 'detailId',
            'create_date', 'create_user', 'edit_date', 'edit_user',
            'QR_RFTray_BEDID', 'QR_PS_BEDID', 'QR_HS_BEDID'
        ];
        const alertKeys = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];

        if (nonEditableKeys.includes(colKey)) {
            return;
        }
        if (alertKeys.includes(colKey)) {
            message.warning(formatMessage({ id: 'text' }), 1);
        }
        setEditingCell({ rowIndex, colIndex });
        setEditCell({ rowIndex, colIndex });
        // setEditingCell(colIndex);
    };

    // 結束編輯模式(使用col index)
    const handleCellBlur = () => {
        setEditCell({ rowIndex: null, colIndex: null });
        setEditingCell(null);
    };
    /************************************************************************ */

    const [tempValue, setTempValue] = useState('');
    // const handleBlurOrEnter = (e: any, originalData: any, rowIndex: number, colIndex: number, colKey: string) => {
    //     alert("執行到這1");

    //     const newValue = tempValue.trim();

    //     console.log("這邊要進行判斷的值:" + newValue);

    //     //判斷該欄位是否要檢查重複或格式
    //     const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];
    //     let isDuplicateInDatabase = false;

    //     if (newValue=== "") {
    //         alert("執行到這2");
    //         isDuplicateInDatabase = false;

    //         //傳一個內容給cellChange,並進行判斷是否重複或合乎格式
    //         const fakeEvent = {
    //             target: { value: tempValue },
    //         } as React.ChangeEvent<HTMLInputElement>;
    //         handleCellChange(fakeEvent, rowIndex, colIndex, colKey);

    //     }
    //     else if (checkColumn.includes(colKey)) {



    //         const newID = extractID(tempValue);

    //         if (newID === null) {
    //             alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
    //             setTempValue('');
    //             setInputValue(''); // 清空輸入框
    //             return;
    //         }

    //         isDuplicateInDatabase = table2Data.some(
    //             (item: { [x: string]: string }, index: number) =>
    //             item[colKey] === newValue && index !== rowIndex);

    //             alert("執行到這3 :" + isDuplicateInDatabase);
    //     } else {
    //         alert("執行到這4");

    //         isDuplicateInDatabase = false;

    //         //傳一個內容給cellChange,並進行判斷是否重複或合乎格式
    //         const fakeEvent = {
    //             target: { value: tempValue },
    //         } as React.ChangeEvent<HTMLInputElement>;
    //         handleCellChange(fakeEvent, rowIndex, colIndex, colKey);

    //     }

    //     if (isDuplicateInDatabase) {
    //         alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
    //         setInputValue(''); // 清空輸入框
    //         return;
    //     }

    // }



    // const handleBlurOrEnter = (
    //     e: any,
    //     originalData: any,
    //     rowIndex: number,
    //     colIndex: number,
    //     colKey: string
    // ) => {
    //     alert("執行到這1");

    //     // 使用暫存值
    //     console.log("目前輸入的值:", tempValue);

    //     // 判斷該欄位是否要檢查重複或格式
    //     const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];
    //     let isDuplicateInDatabase = false;

    //     if (tempValue === "") {
    //         isDuplicateInDatabase = false;

    //         // 傳一個內容給 cellChange
    //         const fakeEvent = {
    //             target: { value: tempValue },
    //         } as React.ChangeEvent<HTMLInputElement>;
    //         handleCellChange(fakeEvent, rowIndex, colIndex, colKey);


    //     } else if (checkColumn.includes(colKey)) {
    //         // 檢查格式
    //         const newID = extractID(tempValue);
    //         if (newID === null) {
    //             alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
    //             setTempValue(''); // 清空輸入框
    //             return;
    //         }

    //         // 檢查重複性（排除當前行）
    //         isDuplicateInDatabase = table2Data.some(
    //             (item: { [x: string]: string }, index: number) =>
    //                 item[colKey] === tempValue && index !== rowIndex // 排除當前行
    //         );
    //         console.log("執行到這3, 是否重複:", isDuplicateInDatabase);
    //     }

    //     // 判斷是否重複
    //     if (isDuplicateInDatabase) {
    //         alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
    //         setTempValue(''); // 清空輸入框
    //         return;
    //     }

    //     // 傳一個內容給 cellChange
    //     const fakeEvent = {
    //         target: { value: tempValue },
    //     } as React.ChangeEvent<HTMLInputElement>;
    //     handleCellChange(fakeEvent, rowIndex, colIndex, colKey);
    //     // alert("執行到這4");
    // };


    // const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colIndex: number, colKey: string) => {

    //     // //取得欄位名 , 略調id欄位
    //     // const colKey = Object.keys(originalData[rowIndex])
    //     //     .filter((key) => key !== 'id')[colIndex];

    //     const newValue = e.target.value;

    //     console.log("handleCellChange中目前輸入的字串是:" + tempValue);

    //     /*新增防呆機制 */
    //     const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];
    //     // let isDuplicateInDatabase = false;

    //     // // 若是空字串，視為不重複
    //     // if (newValue.trim() === "") {
    //     //     isDuplicateInDatabase = false;
    //     //     //指定的比對欄位
    //     // } else if (checkColumn.includes(colKey)) {

    //     //     const newID = extractID(newValue);

    //     //     if (newID === null) {
    //     //         alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
    //     //         setInputValue(''); // 清空輸入框
    //     //         return;
    //     //     }
    //     //     isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => item[colKey] === newValue);
    //     // } else {
    //     //     isDuplicateInDatabase = false;
    //     // }
    //     // console.log("目前isDuplicateInDatabase是:" + isDuplicateInDatabase);

    //     // // if (newValue.trim() !== "" && isDuplicateInDatabase) {
    //     // if (isDuplicateInDatabase) {
    //     //     alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
    //     //     setInputValue(''); // 清空輸入框
    //     //     return;
    //     // }

    //     // const isDuplicateInDatabase = table2Data.some((item: any) => item[colKey] === newValue);
    //     // if (isDuplicateInDatabase) {
    //     //     alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
    //     //     setInputValue(''); // 清空輸入框
    //     //     return; // 阻止更新
    //     // }
    //     /*新增防呆機制 */


    //     /**新增PUT即時更新 */

    //     //檢查原欄位值和新輸入的質是否相同,如不同則PUT到API
    //     // const originalValue = table2Data.find((item: any) => item.id === originalData[rowIndex].id)?.[colKey];

    //     // console.log("這個欄位的值是 : " + tempValue)
    //     // if (originalValue !== newValue) {
    //     //     const fetchUpdateRows = async () => {
    //     //         try {

    //     //             //如果修改的欄位是QR_,則將PUT內容新增到table2的 _BEDID欄位
    //     //             const updateData = {
    //     //                 id: originalData[rowIndex].id,
    //     //                 [colKey]: newValue,
    //     //                 edit_user: currentUser
    //     //             };

    //     //             if (checkColumn.includes(colKey)) {
    //     //                 updateData[`${colKey}_BEDID`] = extractID(newValue);
    //     //             }

    //     //             console.log("要更新的資料是 : ", JSON.stringify(updateData, null, 2))

    //     //             const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
    //     //                 method: 'PUT',
    //     //                 headers: {
    //     //                     'Content-Type': 'application/json',
    //     //                 },
    //     //                 body: JSON.stringify([updateData]),
    //     //             });

    //     //             if (!response.ok) {
    //     //                 throw new Error('Failed to 更新');
    //     //             } else {
    //     //                 console.log('完成table2更新現有資料');
    //     //             }
    //     //         } catch (error) {
    //     //             console.error('Error updating rows:', error);
    //     //         }
    //     //     };
    //     //     fetchUpdateRows();
    //     // }
    //     /**新增PUT即時更新 */

    //     //複製原值並將該欄位值更新
    //     // const updatedData = originalData.map((row: any, idx: any) =>
    //     //     idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today, [`${colKey}_BEDID`]: extractID(newValue) } : row
    //     // );

    //     // console.log("updatedData", JSON.stringify(updatedData, null, 2));



    //     // setOriginalData(updatedData);
    //     // setUpdateCell(true);
    // };
    /************************************************************************** */
    const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colIndex: number) => {

        //取得欄位名 , 略調id欄位
        const colKey = Object.keys(originalData[rowIndex])
            .filter((key) => key !== 'id')[colIndex];

        /*新增防呆機制 */
        const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];

        //newValue 新輸入的值
        const newValue = e.target.value;
        // originalValue原始值的table值
        const originalValue = originalData[rowIndex][colKey];

        let isDuplicateInDatabase = false;

        // 若是空字串，視為不重複
        if (newValue.trim() === "") {
            isDuplicateInDatabase = false;
            //指定的比對欄位
        } else if (checkColumn.includes(colKey)) {


            if (colKey === 'SN') {
                isDuplicateInDatabase = table2Data.some(
                    (item: { [x: string]: string }) => item[colKey] === newValue
                );
            } else {
                //格式檢查
                const newID = extractID(newValue);
                if (newID === null) {
                    alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
                    setInputValue(''); // 清空輸入框
                    return;
                }

                //重複檢查
                isDuplicateInDatabase = table2Data.some(
                    (item: { [x: string]: string; }) => item[colKey] === newValue
                );
            }

        }

        // else {
        //     isDuplicateInDatabase = false;
        // }

        //如果和資料庫資料重複 , 則將渲染的table改回原值
        // if (newValue.trim() !== "" && isDuplicateInDatabase) {
        if (isDuplicateInDatabase) {
            alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);

            // 將table值還原為原始值
            const updatedData = originalData.map((row: any, idx: number) =>
                idx === rowIndex ? { ...row, [colKey]: originalValue } : row
            );

            setOriginalData(updatedData);

            setInputValue(''); // 清空輸入框
            return;
        }
        else {
            //如果沒有重複 , 將該欄位值更新


            console.log("這個欄位的值是 : " + newValue)
            // if (originalValue !== newValue) {
            const fetchUpdateRows = async () => {
                try {

                    //如果修改的欄位是QR_,則將PUT內容新增到table2的 _BEDID欄位
                    const updateData = {
                        id: originalData[rowIndex].id,
                        [colKey]: newValue,
                        edit_user: currentUser
                    };

                    if (checkColumn.includes(colKey)) {
                        updateData[`${colKey}_BEDID`] = extractID(newValue);
                    }

                    console.log("要更新的資料是 : ", JSON.stringify(updateData, null, 2))

                    const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify([updateData]),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to 更新');
                    } else {
                        console.log('完成table2更新現有資料');
                        await fetchAllTable2();
                        await handlefilterWorkOrder();

                    }
                } catch (error) {
                    console.error('Error updating rows:', error);
                }
            };
            fetchUpdateRows();

            const updatedData = originalData.map((row: any, idx: any) =>
                idx === rowIndex
                    ? {
                        ...row,
                        [colKey]: e.target.value,
                        edit_user: currentUser,
                        edit_date: today,
                        [`${colKey}_BEDID`]: extractID(newValue)
                    }
                    : row
            );

            setOriginalData(updatedData);


        }

        // const isDuplicateInDatabase = table2Data.some((item: any) => item[colKey] === newValue);
        // if (isDuplicateInDatabase) {
        //     alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
        //     setInputValue(''); // 清空輸入框
        //     return; // 阻止更新
        // }
        /*新增防呆機制 */


        /**新增PUT即時更新 */

        //檢查原欄位值和新輸入的質是否相同,如不同則PUT到API
        // const originalValue = table2Data.find((item: any) => item.id === originalData[rowIndex].id)?.[colKey];



        // }
        /**新增PUT即時更新 */



        // console.log("updatedData", JSON.stringify(updatedData, null, 2));




        // setUpdateCell(true);
    };







    // 處理Barcode input條碼輸入
    // const handleBarcodeInput = (event: any) => {

    //     if (event.key === 'Enter' && !isComplete) {
    //         event.preventDefault();
    //         const newValue = inputValue.trim();
    //         const rowIndex = currentRow !== null ? currentRow : 0;


    //         if (newValue && currentRow !== null && currentRow < rows) {//尚未達到工單數量
    //             const updatedData = [...originalData];
    //             let updatedRow = { ...updatedData[currentRow] };
    //             // 根據當前模式和欄位，填入不同的條碼數據

    //             if (table2Data.some((row: { SN: string; }) => row.SN === newValue) ||
    //                 updatedRowData.some((row: { SN: string; }) => row.SN === newValue)
    //             ) {
    //                 alert("SN 已存在，請輸入不同的 SN");
    //                 setInputValue(''); // 清空輸入框
    //                 return;
    //             }

    //             if (model === 'A') {
    //                 // A模式: 依次填入 sn 和 qr_HS
    //                 if (currentColumn === 2) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(5); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 5) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (model === 'B') {
    //                 // B模式: 依次填入 sn 和 qr_RFTray
    //                 if (currentColumn === 2) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(3); // 跳到QR_RFTray欄位
    //                 } else if (currentColumn === 3) { // 填入QR_RFTray欄位
    //                     updatedRow.QR_RFTray = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (model === 'C') {
    //                 // C模式: 依次填入 sn 和 qr_PS
    //                 if (currentColumn === 2) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(4); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (model === 'D') {
    //                 // D模式: 依次填入 sn, qr_PS, qr_HS
    //                 if (currentColumn === 2) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(4); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     setCurrentColumn(5); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 5) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             } else if (model === 'E') {
    //                 // E模式: 依次填入 sn, qr_RFTray, qr_PS, qr_HS
    //                 if (currentColumn === 2) { // 填入SN欄位
    //                     updatedRow.SN = newValue;
    //                     setCurrentColumn(3); // 跳到QR_RFTray欄位
    //                 } else if (currentColumn === 3) { // 填入QR_RFTray欄位
    //                     updatedRow.QR_RFTray = newValue;
    //                     setCurrentColumn(4); // 跳到QR_PS欄位
    //                 } else if (currentColumn === 4) { // 填入QR_PS欄位
    //                     updatedRow.QR_PS = newValue;
    //                     setCurrentColumn(5); // 跳到QR_HS欄位
    //                 } else if (currentColumn === 5) { // 填入QR_HS欄位
    //                     updatedRow.QR_HS = newValue;
    //                     moveToNextRowOrEnd(); // 完成該筆資料
    //                 }
    //             }

    //             // 更新當前行的資料
    //             updatedRow.edit_user = currentUser;
    //             updatedRow.edit_date = today;
    //             updatedData[currentRow] = updatedRow;
    //             setOriginalData(updatedData); // // 更新整體表格資料..編輯在還沒按"儲存"按鈕以前,先不把資料更新回table2
    //             setInputValue(''); // 清空輸入框
    //             // console.log('目前table2Data資料為:', JSON.stringify(table2Data, null, 2));

    //             // 新增到 updatedRowData
    //             setUpdatedRowData((prevUpdatedRow: any) => [...prevUpdatedRow, updatedRow]);
    //         }
    //     }
    // };
    // // 處理是否需要跳到下一行或標記掃描完成
    // const moveToNextRowOrEnd = () => {
    //     setCurrentColumn(2); // 重置到 sn 欄位
    //     if (currentRow !== null && currentRow + 1 >= rows) {
    //         setIsComplete(true); // 已經完成所有行的掃描
    //         setCurrentColumn(null);
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
    /************************************************************* */
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
                const updatedData = [...originalData];
                let updatedRow = { ...updatedData[currentRow] };

                // 確定當前欄位的名稱
                let fieldToCompare = "";
                if (currentColumn === 2) fieldToCompare = "SN";
                else if (currentColumn === 3) fieldToCompare = "QR_RFTray";
                else if (currentColumn === 4) fieldToCompare = "QR_PS";
                else if (currentColumn === 5) fieldToCompare = "QR_HS";

                // 比對資料庫 (table2Data) 和已輸入資料 (updatedData)
                let isDuplicateInDatabase = false;
                let isDuplicateInUpdatedData = false;

                if (fieldToCompare === "SN") {
                    // 若是空字串，視為不重複
                    if (newValue.trim() === "") {
                        isDuplicateInDatabase = false;
                        isDuplicateInUpdatedData = false;
                    } else {
                        isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => item[fieldToCompare] === newValue);
                        isDuplicateInUpdatedData = updatedRowData.some((item: { [x: string]: string; }, index: number) => index < currentRow && item[fieldToCompare] === newValue);
                    }

                    if (newValue.trim() !== "" && isDuplicateInDatabase || isDuplicateInUpdatedData) {
                        alert(`${fieldToCompare} 已存在，請輸入不同的 ${fieldToCompare}`);
                        setInputValue(''); // 清空輸入框
                        return;
                    }
                    // 更新當前欄位的數據
                    updatedRow[fieldToCompare] = newValue;
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setOriginalData(updatedData); // 更新整體表格資料
                    setUpdatedRowData(updatedData);
                    setInputValue(''); // 清空輸入框


                    /**新增PUT即時更新剛行的資料到table2 */
                    const fetchUpdateRows = async () => {
                        setLoading(true); // 開始Loading
                        try {
                            const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify([{
                                    id: originalData[rowIndex].id,
                                    [fieldToCompare]: newValue,
                                    edit_user: currentUser
                                }]),
                            });

                            if (!response.ok) {
                                throw new Error('Failed to 更新');
                            } else {
                                console.log('完成table2更新現有資料');
                            }
                        } catch (error) {
                            console.error('Error updating rows:', error);
                        } finally {
                            setLoading(false); // 完成後結束Loading
                        }
                    };
                    fetchUpdateRows();


                    // 移動到下一個欄位或下一行
                    moveToNextColumnOrRow();

                } else if (fieldToCompare === "QR_RFTray" || fieldToCompare === "QR_PS" || fieldToCompare === "QR_HS") {
                    const newID = extractID(newValue);

                    if (newID === null) {
                        alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
                        setInputValue(''); // 清空輸入框
                        return;
                    }

                    isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => extractID(item[fieldToCompare]) === extractID(newValue));
                    isDuplicateInUpdatedData = updatedData.some((item, index) => index < currentRow && extractID(item[fieldToCompare]) === extractID(newValue));

                    if (isDuplicateInDatabase || isDuplicateInUpdatedData) {
                        alert(`${fieldToCompare} 已存在，請輸入不同的 ${fieldToCompare}`);
                        setInputValue(''); // 清空輸入框
                        return;
                    }

                    updatedRow[fieldToCompare] = newValue;
                    updatedRow[`${fieldToCompare}_BEDID`] = extractID(newValue);
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setOriginalData(updatedData); // 更新整體表格資料
                    setUpdatedRowData(updatedData);
                    setInputValue(''); // 清空輸入框



                    /**新增PUT即時更新剛行的資料到table2 */
                    const fetchUpdateRows = async () => {
                        setLoading(true); // 開始Loading
                        try {
                            const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify([{
                                    id: originalData[rowIndex].id,
                                    [fieldToCompare]: newValue,
                                    [`${fieldToCompare}_BEDID`]: extractID(newValue),
                                    edit_user: currentUser
                                }]),
                            });

                            if (!response.ok) {
                                throw new Error('Failed to 更新');
                            } else {
                                console.log('完成table2更新現有資料');
                            }
                        } catch (error) {
                            console.error('Error updating rows:', error);
                        } finally {
                            setLoading(false); // 完成後結束Loading
                        }
                    };
                    fetchUpdateRows();



                    // 移動到下一個欄位或下一行
                    moveToNextColumnOrRow();
                } else {


                    updatedRow[fieldToCompare] = newValue;
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setOriginalData(updatedData); // 更新整體表格資料
                    setUpdatedRowData(updatedData);
                    setInputValue(''); // 清空輸入框



                    /**新增PUT即時更新剛行的資料到table2 */
                    const fetchUpdateRows = async () => {
                        setLoading(true); // 開始Loading
                        try {
                            const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify([{
                                    id: originalData[rowIndex].id,
                                    [fieldToCompare]: newValue,
                                    edit_user: currentUser
                                }]),
                            });

                            if (!response.ok) {
                                throw new Error('Failed to 更新');
                            } else {
                                console.log('完成table2更新現有資料');
                            }
                        } catch (error) {
                            console.error('Error updating rows:', error);
                        } finally {
                            setLoading(false); // 完成後結束Loading
                        }
                    };
                    fetchUpdateRows();



                    // 移動到下一個欄位或下一行
                    moveToNextColumnOrRow();
                }


            }
        }
    };

    // 移動到下一個欄位或下一行(這版本移動到下一行或列時,不管該欄位有沒有資料 , 都會停在那格)
    const moveToNextColumnOrRow = () => {
        const columnOrderPerMode: { [key in InputMode]: number[] } = {
            'A': [2, 5], // SN, QR_HS
            'B': [2, 3], // SN, QR_RFTray
            'C': [2, 4], // SN, QR_PS
            'D': [2, 4, 5], // SN, QR_PS, QR_HS
            'E': [2, 3, 4, 5], // SN, QR_RFTray, QR_PS, QR_HS
        };

        const columnOrder = columnOrderPerMode[inputMode]; // 取得當前模式的欄位順序
        const currentColumnIndex = columnOrder.indexOf(currentColumn ?? 1); // 找出目前欄位的索引

        if (currentColumnIndex === columnOrder.length - 1) {
            // 如果是最後一個欄位 , 檢查是否超出資料行數
            if (currentRow !== null && currentRow + 1 >= rows) {
                setIsComplete(true); // 完成輸入
                setCurrentColumn(null); // 重置欄位到 SN
                setCurrentRow(null); // 重置行數
            } else {
                setCurrentRow((prevRow) => (prevRow !== null ? prevRow + 1 : 0)); // 移動到下一行
                setCurrentColumn(columnOrder[0]); // 重設為第一個欄位 (SN)
            }
        } else {
            // 移動到下一個欄位
            setCurrentColumn(columnOrder[currentColumnIndex + 1]);
        }
    };


    /************************************************************** */
    //根據料號map所有originalData的資料,如果有尚未填寫的欄位,則從此行開始續繼編輯
    const handleContinueInput = () => {
        const { rowIndex, column } = findNextIncompleteRow(model, originalData);
        if (rowIndex === -1) {

            alert(formatMessage({ id: 'text1' }));

            setIsComplete(true);
            setContinueInput(false);
            setCurrentRow(null);
            setCurrentColumn(null);
        }
        //如果有尚未填寫的欄位 , 將目前的currentRow和currentColumn設定到尚未輸入的該單元格上
        else {
            alert('第' + rowIndex + '行   第' + column + '列尚未輸入 , 模式是' + model);
            setCurrentRow(rowIndex);
            setCurrentColumn(column);
            setIsComplete(false);
            setContinueInput(true);
        }
    };

    //根據model map所有originalData(tabel2)的資料 , 並回傳空白單元格的row和column
    const findNextIncompleteRow = (model: string, data: any[]) => {


        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            // A 模式需要檢查 sn 和 qr_HS 欄位
            if (model === 'A') {
                if (!row.SN) {
                    return { rowIndex, column: 2 }; // 找到SN尚未填寫 返回對應的行和列
                }
                if (!row.QR_HS) {
                    return { rowIndex, column: 5 }; // 找到QR_HS尚未填寫 返回對應的行和列
                }
            } else if (model === 'B') {
                // B 模式檢查 sn 和 qr_RFTray
                if (!row.SN) {
                    return { rowIndex, column: 2 };
                }
                if (!row.QR_RFTray) {
                    return { rowIndex, column: 3 };
                }
            } else if (model === 'C') {
                // C 模式檢查 sn 和 qr_PS
                if (!row.SN) {
                    return { rowIndex, column: 2 };
                }
                if (!row.QR_PS) {
                    return { rowIndex, column: 4 };
                }
            } else if (model === 'D') {
                // D 模式檢查 sn, qr_PS, qr_HS
                if (!row.SN) {
                    return { rowIndex, column: 2 };
                }
                if (!row.QR_PS) {
                    return { rowIndex, column: 4 };
                }
                if (!row.QR_HS) {
                    return { rowIndex, column: 5 };
                }
            } else if (model === 'E') {
                // E 模式檢查 sn, qr_RFTray, qr_PS, qr_HS
                if (!row.SN) {
                    return { rowIndex, column: 2 };
                }
                if (!row.QR_RFTray) {
                    return { rowIndex, column: 3 };
                }
                if (!row.QR_PS) {
                    return { rowIndex, column: 4 };
                }
                if (!row.QR_HS) {
                    return { rowIndex, column: 5 };
                }
            }
        }

        // 如果所有行都已填寫，返回 -1 表示已完成
        return { rowIndex: -1, column: -1 };
    };

    // "儲存"按鈕 , 將編輯過的資料originalData 新增或更新到table2Data裡面
    // const handleSaveData = () => {

    //     // 先將相同workOrderNumber的originalData合併到tabel2Data
    //     const updatedTable2Data = [...table2Data];

    //     //用來PUT更新的幾筆資料到資料庫的
    //     const updatedRows = [];

    //     //比對相同workOrderNumber
    //     originalData.forEach((originalRow) => {
    //         const matchingIndex = updatedTable2Data.findIndex(
    //             // (tableRow) => tableRow.workOrderNumber === originalRow.workOrderNumber && tableRow.id === originalRow.id
    //             (tableRow) => tableRow.workOrderNumber === originalRow.workOrderNumber
    //         );

    //         // 如果找到相同 workOrderNumber 的行，則合併原始資料和現有資料
    //         if (matchingIndex !== -1) {
    //             updatedTable2Data[matchingIndex] = {
    //                 ...updatedTable2Data[matchingIndex],
    //                 ...originalRow // 使用 originalRow 的數據覆蓋 table2Data 的相同欄位
    //             };
    //         }
    //         // 如果找不到相同 workOrderNumber，將 originalRow 新增到 updatedTable2Data
    //         else {
    //             updatedTable2Data.push(originalRow);
    //         }
    //     });

    //     //setOriginalData(updatedTable2Data);
    //     // 將合併後的數據設定回 table2Data
    //     setTable2Data(updatedTable2Data);

    //     // 這邊用API將table2Data資料更新到DB , PUT


    //     // 將相同 workOrderNumber 的行更新table1Data的 editUser 和 editDate
    //     setTable1Data((prevData: any) =>
    //         prevData.map((row: any) => {
    //             if (row.workOrderNumber === workNo) {
    //                 // 如果 workOrderNumber 匹配，更新 editUser 和 editDate
    //                 return {
    //                     ...row,
    //                     editUser: currentUser,
    //                     editDate: today,
    //                 };
    //             }
    //             return row; // 如果不匹配，保持原數據不變
    //         })
    //     );

    //     // 這邊用API將table1Data資料回存到DB

    //     //save資料後將所有欄位都清空
    //     // setOriginalData([]);
    //     setContinueInput(false);

    // };

    // const handleSaveData = async () => {

    //     setLoading(true); // 開始Loading

    //     try {



    //         // 將相同 workOrderNumber 的行更新table1Data的 editUser 和 editDate

    //         // const updatedTable1Data = table1Data.map((row: any) => {      
    //         const updatedTable1Data = originalData.map((row: any) => {
    //             if (row.workOrderNumber === workNo) {
    //                 // 如果 workOrderNumber 匹配，更新 editUser 和 editDate
    //                 return {
    //                     ...row,
    //                     editUser: currentUser,
    //                     editDate: today,
    //                 };
    //             }
    //             return row; // 如果不匹配，保持原數據不變
    //         });
    //         //測試用setTable1Data(updatedTable1Data);

    //         // console.log("table1要更新的資料:" + JSON.stringify(updatedTable1Data));

    //         // 這邊用API將table1Data資料回存到DB
    //         // 將所有的table1Data資料UPDATE資料庫
    //         const fetchUpdateTable1 = async (id: number, updatedData: any) => {
    //             try {
    //                 const response = await fetch(`${globalUrl.url}/api/update-work-orders/${id}`, {
    //                     method: 'PUT',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(updatedData),
    //                 });

    //                 if (!response.ok) {
    //                     throw new Error('Failed to update work order');
    //                 } else {
    //                     console.log(`完成更新table1資料`);
    //                 }
    //             } catch (error) {
    //                 console.error('Error updating work order:', error);
    //             }
    //         };

    //         // 只針對相同 workOrderNumber 的行發送 API 請求
    //         for (const row of updatedTable1Data) {
    //             // 只發送更新符合 workNo 的資料
    //             if (row.workOrderNumber === workNo) {
    //                 // 更新後端資料
    //                 await fetchUpdateTable1(row.id, {
    //                     workOrderNumber: row.workOrderNumber,
    //                     edit_user: currentUser,
    //                     // editUser: row.editUser,
    //                     // editDate: row.editDate,
    //                     quantity: row.quantity,
    //                     partNumber: row.partNumber,
    //                     company: company

    //                 });
    //             }
    //         }




    //         const updatedTable2Data = [...table2Data];
    //         const updatedRows: any[] = [];

    //         // 比對相同的 workOrderNumber 和 id，然後更新有修改的欄位
    //         originalData.forEach((originalRow) => {
    //             const matchingIndex = updatedTable2Data.findIndex(
    //                 (tableRow) => tableRow.id === originalRow.id
    //             );

    //             if (matchingIndex !== -1) {
    //                 const tableRow = updatedTable2Data[matchingIndex];
    //                 const updatedRow = { ...tableRow }; // 複製一份現有資料行
    //                 let hasChanges = false; // 檢查是否有修改

    //                 // 檢查原始資料和現有資料是否有差異
    //                 Object.keys(originalRow).forEach((key) => {
    //                     if (tableRow[key] !== originalRow[key]) {
    //                         updatedRow[key] = originalRow[key];
    //                         hasChanges = true; // 標記有變更
    //                     }
    //                 });

    //                 if (hasChanges) {
    //                     updatedTable2Data[matchingIndex] = updatedRow;
    //                     updatedRows.push({ ...tableRow, ...originalRow }); // 將原有資料和修改的資料行加入陣列
    //                 }
    //             } else {
    //                 // 如果找不到相同 id，將 originalRow 新增到 updatedTable2Data
    //                 updatedTable2Data.push(originalRow);
    //                 updatedRows.push(originalRow); // 新資料也加入到待發送的陣列
    //             }
    //         });

    //         // 更新 table2Data 狀態
    //         //setTable2Data(updatedTable2Data);

    //         console.log("table2要更新的資料:" + JSON.stringify(updatedRows));

    //         // 將table2有變更的資料"更新"
    //         if (updatedRows.length > 0) {
    //             const fetchUpdateRows = async () => {
    //                 try {
    //                     const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
    //                         method: 'PUT',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify(updatedRows),
    //                     });

    //                     if (!response.ok) {
    //                         throw new Error('Failed to 更新已存在資料');
    //                     } else {
    //                         console.log('完成table2更新現有資料');
    //                     }
    //                 } catch (error) {
    //                     console.error('Error updating rows:', error);
    //                 }
    //             };
    //             fetchUpdateRows();
    //         }



    //         //save資料後將所有欄位都清空
    //         // setOriginalData([]);
    //         setContinueInput(false);

    //         setUpdateCell(false);
    //     } catch (error) {
    //         console.error("Error saving data:", error);
    //     } finally {
    //         setLoading(false); // 完成後結束Loading
    //     }

    // };


    const handleDeleteClick = async (id: any, workOrder: any) => {

        console.log("handleDeleteClick接收到的資料:" + id + " , " + workOrder);
        console.log("table1 ID : "+table1Id);

        //const confirmMessage = {formatMessage({ id: 'text9' })};
        const isConfirmed = window.confirm(formatMessage({ id: 'text9' }));


        if (isConfirmed) {

            const newQuant = quant - 1;

            //for table2
            const fetchDeleteRows = async () => {
                setLoading(true); // 開始Loading
                try {
                    const response = await fetch(`${globalUrl.url}/api/delete-work-order-details/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to 刪除');
                    } else {
                        console.log('完成table2 刪除資料');
                    }
                } catch (error) {
                    console.error('Error updating rows:', error);
                }
            };

            await fetchDeleteRows();
            await fetchAllTable2();

        

            //更新table1內容(非刪除table2最後一筆)
            const fetchUpdateTable1 = async () => {

                const updatedTable1Data = {
                    workOrderNumber: workOrder,
                    quantity: newQuant,
                    partNumber: part,
                    editUser: currentUser,
                    company: company
                };

                // console.log("要更新的資料:", JSON.stringify(updatedTable1Data, null, 2))
                try {
                    const response = await fetch(`${globalUrl.url}/api/update-work-orders/${table1Id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedTable1Data),
                    })

                    // if (!response.ok) {
                    //     throw new Error('Failed to 更新已存在資料');
                    // } 

                } catch (error) {
                    console.error('Error updating rows:', error);
                }
            }


            //刪除table1(刪除table2最後一筆)
            const deleteTable1 = async (table1Id: any) => {
                try {
                    const response = await fetch(`${globalUrl.url}/api/delete-work-orders/${table1Id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                } catch (error) {
                    console.error('Error updating rows:', error);
                }
            }

            //刪掉其中一比,更新table1
            if (newQuant > 0) {
                await fetchUpdateTable1();
            }
            //已刪掉table2最後一筆.把整個table1刪掉
            else if(newQuant===0){

                await deleteTable1(table1Id);
            }


            await setQuant(newQuant);









            setLoading(false); // 完成後結束Loading

            // navigate('/editworker/reload');
        }
    }
    useEffect(() => {
        console.log("目前比數 : " + quant)
    }, [quant])


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
                // QR_RFTray_BEDID: item.QR_RFTray_BEDID,
                // QR_PS_BEDID: item.QR_PS_BEDID,
                // QR_HS_BEDID: item.QR_HS_BEDID,
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


            await setTable2Data(filteredData);
            handlefilterWorkOrder();

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };


    const handleExitButtonClick = () => {
        navigate('/reload');
    };

    // 將選擇的工單號碼從table2Data中拉出來
    const handlefilterWorkOrder = () => {
        // 根據選擇的 workOrderNumber 過濾出相應資料
        const filteredData = table2Data.filter((item: { workOrderNumber: any; }) => item.workOrderNumber === workNo);
        // 設定過濾後的資料為 originalData
        setOriginalData(filteredData);

        // console.log("      setOriginalData(filteredData);", JSON.stringify(originalData, null, 2));
        setRows(filteredData.length);
    };
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


        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    //一進組件就先把要渲染的Table資料從table2Data拉出來設定給(originalData)暫存
    useEffect(() => {
        handlefilterWorkOrder();
        fetchAllTable1();
    }, [])

    //資料有更新,就重新更新originalData
    useEffect(() => {
        handlefilterWorkOrder();
    }, [workNo, part, quant, table1Data, table2Data])


    return (
        // <div style={{ overflow: "hidden" }}>
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

            {/* <div>
                <label>使用者(測試用)：</label>
                <input
                    type="text"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(e.target.value)}
                    placeholder="輸入使用者名稱"
                />
            </div> */}
            {/* {userRole !== 'USER' || userRole !== 'OPERATOR' && (
                <>
                    {!updateData && !continueInput &&
                        <button onClick={handleUpdate}>{formatMessage({ id: 'edit' })}</button>
                    }
                </>
            )} */}
            {/* {!updateData && !continueInput && userRole !== 'USER' && userRole !== 'OPERATOR' && !updateCell && */}
            {!updateData && !continueInput && userRole !== 'USER' && userRole !== 'OPERATOR' &&
                <button onClick={handleUpdate}>{formatMessage({ id: 'edit-workOrderDetail' })}</button>
            }
            {/* 
            {
                updateCell &&
                <>
                    <button onClick={handleSaveData} disabled={loading}>{formatMessage({ id: 'save' })}</button>
                </>
            } */}
            {/* <>
                {!continueInput && 
                    <button onClick={handleContinueInput}>繼續輸入</button>
                }
            </> */}
            {
                !isComplete && continueInput && userRole !== 'USER' &&
                <>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleBarcodeInput}
                        placeholder={formatMessage({ id: 'text' })}
                        disabled={isComplete} // 當掃描完成後禁用輸入框
                        autoFocus />
                </>
            }

            {/* {userRole !== 'USER' && !updateData && !updateCell && ( */}
            {userRole !== 'USER' && !updateData && (
                <>
                    {/* {continueInput ? (
                        <button onClick={handleSaveData} disabled={loading}>{formatMessage({ id: 'save' })}</button>
                    ) : (
                        <button onClick={handleContinueInput}>{formatMessage({ id: 'continueinput' })}</button>
                    )} */}
                    {!continueInput && (
                        <button onClick={handleContinueInput}>{formatMessage({ id: 'continueinput' })}</button>
                    )}
                </>
            )}
            <>
                {updateData &&
                    <>
                        <div>
                            <>
                                <label>{formatMessage({ id: 'newworkordernumber' })}：</label>
                                <input
                                    type="text"
                                    value={updateWorkNo}
                                    onChange={(e) => setUpdateWorkNo(e.target.value)}
                                />
                            </>
                            <>
                                <label>{formatMessage({ id: 'part' })}：</label>
                                <select value={updateWorkPart} onChange={(e) => setUpdateWorkPart(e.target.value)}>
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
                                <input type="number" value={updateWorkQuantity} onChange={(e) => setUpdateWorkQuantity(parseInt(e.target.value))} />
                            </>
                            <button onClick={handleCancel}>{formatMessage({ id: 'cancel' })}</button>
                            <button onClick={handleConfirm}>{formatMessage({ id: 'save' })}</button>

                        </div>


                    </>
                }

            </>

            {/* for Loading*/}

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}


            {
                isComplete &&
                <>
                    <p>{formatMessage({ id: 'text1' })}</p>
                </>
            }
            {
                originalData.length != 0 ? (
                    <>
                        {/* for灰色背景 */}
                        {editingCell !== null && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景灰色
                                    zIndex: 1000,
                                }}
                            ></div>
                        )}

                        <Paper sx={{ width: '100%', height: '90%', overflow: 'hidden' }}>

                            <TableContainer component={Paper} style={{ height: 'calc(100vh - 110px)', overflow: 'auto' }}>
                                {/* <TableContainer component={Paper} style={{
                            maxHeight: '70vh', // 設置最大高度，避免超出視窗
                            overflowX: 'auto', // 確保左右滾動條出現
                            overflowY: 'auto', // 確保上下滾動條出現
                        }}
                        > */}
                                <Table stickyHeader aria-label="sticky table"
                                    style={{
                                        minWidth: '800px', // 最小寬度，確保資料過多時滾動
                                        tableLayout: 'auto',
                                    }}>
                                    <TableHead >
                                        <TableRow style={{ border: '1px solid #ccc' }}>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'delete' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'workOrderNumber' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'detailId' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'SN' })}</TableCell>
                                            <TableCell style={{ width: '500px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
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
                                            {/* <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray_BEDID' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS_BEDID' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS_BEDID' })}</TableCell> */}

                                        </TableRow>
                                    </TableHead>
                                    {/* 使用col index */}
                                    <TableBody>
                                        {originalData.map((row: any, rowIndex: number) => (
                                            <TableRow key={rowIndex}>

                                                {['ADMIN', 'SUPERVISOR', 'OPERATOR'].includes(userRole) &&
                                                    <TableCell>
                                                        <button onClick={(e) => {
                                                            handleDeleteClick(row.id, row.workOrderNumber)
                                                        }}>
                                                            {formatMessage({ id: 'delete' })}</button>
                                                    </TableCell>
                                                }

                                                {Object.keys(row)
                                                    .filter((colKey) => colKey !== 'id' && colKey !== 'QR_RFTray_BEDID' && colKey !== 'QR_HS_BEDID' && colKey !== 'QR_PS_BEDID')
                                                    .map((colKey, colIndex) => (
                                                        // <TableCell
                                                        //     key={colKey}
                                                        //     onClick={() => handleCellClick(rowIndex, colIndex)}  // 傳遞 rowIndex 和 colIndex
                                                        //     className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}
                                                        // >
                                                        <TableCell
                                                            key={colKey}
                                                            onClick={() => {
                                                                if (userRole === 'ADMIN' || userRole === 'SUPERVISOR') {
                                                                    // 依據 model 的條件 , 訂出不可編輯的欄位
                                                                    const restrictedFields: { [key in 'A' | 'B' | 'C' | 'D']: string[] } = {
                                                                        A: ['QR_PS', 'QR_RFTray'],
                                                                        B: ['QR_PS', 'QR_HS'],
                                                                        C: ['QR_RFTray', 'QR_HS'],
                                                                        D: ['QR_RFTray'],
                                                                    };
                                                                    // 檢查當前的欄位是否在 restrictedFields[model] 中
                                                                    if (!model || !restrictedFields[model as 'A' | 'B' | 'C' | 'D']?.includes(colKey)) {
                                                                        // 如果不在不可編輯的欄位中，才允許編輯
                                                                        handleCellClick(rowIndex, colIndex);
                                                                    }
                                                                }
                                                            }}
                                                            className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}




                                                        >


                                                            {editCell.rowIndex === rowIndex && editCell.colIndex === colIndex ? (
                                                                <>



                                                                    <TextField
                                                                        value={row[colKey]}
                                                                        // value={tempValue}
                                                                        onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                                                                        onBlur={handleCellBlur}
                                                                        // onBlur={(e) => handleCellChange(e, rowIndex, colIndex)}
                                                                        autoFocus
                                                                        fullWidth
                                                                        style={{
                                                                            backgroundColor: 'white',
                                                                            width: '1000px',
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            zIndex: 1002,
                                                                        }}


                                                                    // onChange={(e) => {
                                                                    //     setTempValue(e.target.value);

                                                                    //     const updatedValue = e.target.value;
                                                                    //     row[colKey] = updatedValue;
                                                                    // }}

                                                                    // onBlur={(e)=>{
                                                                    //     handleBlurOrEnter(tempValue , rowIndex , colIndex);
                                                                    // }}

                                                                    /*按下enter才做判斷*/
                                                                    // onKeyDown={(e) => {
                                                                    //     if (e.key === 'Enter') {
                                                                    //         e.preventDefault();
                                                                    //         handleBlurOrEnter(e, originalData, rowIndex, colIndex, colKey);
                                                                    //     }
                                                                    // }}




                                                                    // onBlur={(e) => {
                                                                    //     const target = e.target as HTMLInputElement;
                                                                    //     const fakeEvent = {
                                                                    //         target: {
                                                                    //             value: target.value,
                                                                    //         },
                                                                    //     } as React.ChangeEvent<HTMLInputElement>;

                                                                    //     handleCellChange(fakeEvent, rowIndex, colIndex); 
                                                                    // }}
                                                                    // onChange={(e) => {
                                                                    //     const updatedValue = e.target.value;

                                                                    //     row[colKey] = updatedValue;
                                                                    // }}

                                                                    // onKeyDown={(e) => {
                                                                    //     if (e.key === 'Enter') {
                                                                    //         e.preventDefault();
                                                                    //         const target = e.target as HTMLInputElement;
                                                                    //         const fakeEvent = {
                                                                    //             target: {
                                                                    //                 value: target.value,
                                                                    //             },
                                                                    //         } as React.ChangeEvent<HTMLInputElement>;

                                                                    //         handleCellChange(fakeEvent, rowIndex, colIndex);
                                                                    //     }
                                                                    // }}


                                                                    />
                                                                </>
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
                ) : (
                    <p>NO DATA</p>
                )}
        </div >
    );
};

export default SearchForm;
