/**
 * 
 * 此組件會根據單一筆的工單號碼(workOrderNumber) , 列出Table2內該筆工單的所有資訊 ,並可進行編輯 
 * 
 */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, SelectChangeEvent, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";



const SearchForm = () => {
    const { formatMessage } = useIntl();
    const {setTable1Id,table1Id, userRole, currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data, setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, model, setModel } = useGlobalContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isComplete, setIsComplete] = useState(false); // 用來標記是否已經完成掃描
    const [continueInput, setContinueInput] = useState(false); // 用來標記是否繼續輸入
    const [updateData, setUpdateData] = useState(false);    // 用來標記是否要修改工單

    // for 編輯表單
    const [rows, setRows] = useState(0);  // 工單數量資料筆數
    const [currentRow, setCurrentRow] = useState<number | null>(null);
    // id是第0列 , 工單號碼是第1列，detailid是第2列 , 從第3列SN(序號)開始輸入其他資料
    //但要渲染的資料將id給屏蔽掉了 , 所以從第2列SN開始
    const [currentColumn, setCurrentColumn] = useState<number | null>(2);


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

    // 將選擇的工單號碼從table2Data中拉出來
    const handlefilterWorkOrder = () => {
        // 根據選擇的 workOrderNumber 過濾出相應資料
        const filteredData = table2Data.filter((item: { workOrderNumber: any; }) => item.workOrderNumber === workNo);
        // 設定過濾後的資料為 originalData
        setOriginalData(filteredData);
        setRows(filteredData.length);
    };

    //一進組件就先把要渲染的Table資料從table2Data拉出來設定給(originalData)暫存
    useEffect(() => {
        handlefilterWorkOrder();
    }, [])

    //資料有更新,就重新更新originalData
    useEffect(() => {
        handlefilterWorkOrder();
    }, [workNo, part, quant, table1Data, table2Data])

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
        // for table1
        const updatedTable1Data = {
            workOrderNumber: updateWorkNo !== workNo ? updateWorkNo : workNo,
            quantity: updateWorkQuantity !== quant ? updateWorkQuantity : quant,
            partNumber: updateWorkPart !== part ? updateWorkPart : part,
            editUser: currentUser,
        };
        //for table2
        const updatedRows = table2Data.filter((row: { workOrderNumber: any; }) => row.workOrderNumber === workNo).map((row: { workOrderNumber: any; }) => ({
            ...row,
            workOrderNumber: updateWorkNo || row.workOrderNumber
        }));
        const originalRowCount = updatedRows.length;
        // 分開新增的行
        const additionalRows: any = [];
        if (updateWorkQuantity > originalRowCount) {
            additionalRows.push(...Array.from({ length: updateWorkQuantity - originalRowCount }, (_, index) => ({
                workOrderNumber: updateWorkNo || workNo,
                // detailId: originalRowCount + index + 1,
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
            })));
        }


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


        //更新tbale2Data邏輯為
        // 步驟1.  將舊的table2資料更新....資料庫join的關係似乎連動改了?...所以這部份不用做
        // 步驟2.  新增資料   (有修改updateWorkQuantity的話)

        // const originalRows = table2Data.filter((row: { workOrderNumber: any; }) => row.workOrderNumber === workNo);
        // 第一次API請求 - 更新資料 ( 有用join的關係  免做)
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

        // 第二次 API 請求 - 新增資料
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
        const removeWorkOrderDetails = (data: any[]) => {
            return data.map(({ workOrderDetails, ...rest }) => rest);
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
    
        const fetchAll =()=>{
            fetchAllTable1();
            fetchAllTable2();
            fetchAllTable3();
            setWorkNo();
            setQuant();
            setPart();
            setModel();
            setTable1Id();
        }


        //更新 table2Data (1.工單號碼更新 2.要增加幾行)
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

        navigate("/");
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

        /*這邊要取消註解一下*/
        // 只允許編輯QR_RFTray,QR_PS,QR_HS,QR_backup1,QR_backup2,QR_backup3,QR_backup4,note的欄位
        if (
            colKey === 'id' || colKey === 'workOrderNumber' || colKey === 'detailId' || colKey === 'SN' ||
            colKey === 'create_date' || colKey === 'create_user' || colKey === 'edit_date' || colKey === 'edit_user'
        ) {
            return;
        }
        setEditCell({ rowIndex, colIndex });
    };


    // 處理編輯完成後，更新edit_user和edit_date(使用colKey)
    // const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colKey: string) => {
    //     const updatedData = originalData.map((row: any, idx: any) =>
    //         idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today } : row
    //     );
    //     setOriginalData(updatedData); // 更新整體表格資料..編輯在還沒按"儲存"按鈕以前,先不把資料更新回table2
    // };

    // 處理編輯完成後，更新edit_user和edit_date
    const handleCellChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number, colIndex: number) => {
        const colKey = Object.keys(originalData[rowIndex])
            .filter((key) => key !== 'id')[colIndex];

        const updatedData = originalData.map((row: any, idx: any) =>
            idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today } : row
        );

        // console.log("編輯後的資料", JSON.stringify(updatedData, null, 2))
        setOriginalData(updatedData);
    };

    // 結束編輯模式(使用colKey)
    // const handleCellBlur = () => {
    //     setEditCell({ rowIndex: null, colKey: null });
    // };

    // 結束編輯模式(使用col index)
    const handleCellBlur = () => {
        setEditCell({ rowIndex: null, colIndex: null });
    };



    // 處理Barcode input條碼輸入
    const handleBarcodeInput = (event: any) => {

        if (event.key === 'Enter' && !isComplete) {
            event.preventDefault();
            const newValue = inputValue.trim();
            const rowIndex = currentRow !== null ? currentRow : 0;
            if (newValue && currentRow !== null && currentRow < rows) {//尚未達到工單數量
                const updatedData = [...originalData];
                let updatedRow = { ...updatedData[currentRow] };
                // 根據當前模式和欄位，填入不同的條碼數據

                if (model === 'A') {
                    // A模式: 依次填入 sn 和 qr_HS
                    if (currentColumn === 2) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(5); // 跳到QR_HS欄位
                    } else if (currentColumn === 5) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (model === 'B') {
                    // B模式: 依次填入 sn 和 qr_RFTray
                    if (currentColumn === 2) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(3); // 跳到QR_RFTray欄位
                    } else if (currentColumn === 3) { // 填入QR_RFTray欄位
                        updatedRow.QR_RFTray = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (model === 'C') {
                    // C模式: 依次填入 sn 和 qr_PS
                    if (currentColumn === 2) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(4); // 跳到QR_PS欄位
                    } else if (currentColumn === 4) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (model === 'D') {
                    // D模式: 依次填入 sn, qr_PS, qr_HS
                    if (currentColumn === 2) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(4); // 跳到QR_PS欄位
                    } else if (currentColumn === 4) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        setCurrentColumn(5); // 跳到QR_HS欄位
                    } else if (currentColumn === 5) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (model === 'E') {
                    // E模式: 依次填入 sn, qr_RFTray, qr_PS, qr_HS
                    if (currentColumn === 2) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(3); // 跳到QR_RFTray欄位
                    } else if (currentColumn === 3) { // 填入QR_RFTray欄位
                        updatedRow.QR_RFTray = newValue;
                        setCurrentColumn(4); // 跳到QR_PS欄位
                    } else if (currentColumn === 4) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        setCurrentColumn(5); // 跳到QR_HS欄位
                    } else if (currentColumn === 5) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                }

                // 更新當前行的資料
                updatedRow.edit_user = currentUser;
                updatedRow.edit_date = today;
                updatedData[currentRow] = updatedRow;
                setOriginalData(updatedData); // // 更新整體表格資料..編輯在還沒按"儲存"按鈕以前,先不把資料更新回table2
                setInputValue(''); // 清空輸入框
                // console.log('目前table2Data資料為:', JSON.stringify(table2Data, null, 2));
            }
        }
    };
    // 處理是否需要跳到下一行或標記掃描完成
    const moveToNextRowOrEnd = () => {
        setCurrentColumn(2); // 重置到 sn 欄位
        if (currentRow !== null && currentRow + 1 >= rows) {
            setIsComplete(true); // 已經完成所有行的掃描
            setCurrentColumn(null);
            setCurrentRow(null);
        } else {
            setCurrentRow((prevRow) => {
                if (prevRow !== null && prevRow + 1 < rows) {
                    return prevRow + 1;
                }
                return prevRow;
            });
        }
    };


    //根據料號map所有originalData的資料,如果有尚未填寫的欄位,則從此行開始續繼編輯
    const handleContinueInput = () => {
        const { rowIndex, column } = findNextIncompleteRow(model, originalData);
        if (rowIndex === -1) {
            alert('所有資料已填寫完成');
            setIsComplete(true);
            setContinueInput(false);
            setCurrentRow(null);
            setCurrentColumn(2);
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
                    return { rowIndex, column: 2 }; // 找到SN尚未填寫，返回對應的行和列
                }
                if (!row.QR_HS) {
                    return { rowIndex, column: 5 }; // 找到QR_HS尚未填寫，返回對應的行和列
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

    const handleSaveData = async () => {


        // 將相同 workOrderNumber 的行更新table1Data的 editUser 和 editDate

        const updatedTable1Data = table1Data.map((row: any) => {
            if (row.workOrderNumber === workNo) {
                // 如果 workOrderNumber 匹配，更新 editUser 和 editDate
                return {
                    ...row,
                    editUser: currentUser,
                    editDate: today,
                };
            }
            return row; // 如果不匹配，保持原數據不變
        });
        //測試用setTable1Data(updatedTable1Data);

        // console.log("table1要更新的資料:" + JSON.stringify(updatedTable1Data));

        // 這邊用API將table1Data資料回存到DB
        // 將所有的table1Data資料UPDATE資料庫
        const fetchUpdateTable1 = async (id: number, updatedData: any) => {
            try {
                const response = await fetch(`${globalUrl.url}/api/update-work-orders/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (!response.ok) {
                    throw new Error('Failed to update work order');
                } else {
                    console.log(`完成更新table1資料`);
                }
            } catch (error) {
                console.error('Error updating work order:', error);
            }
        };

        // 只針對相同 workOrderNumber 的行發送 API 請求
        for (const row of updatedTable1Data) {
            // 只發送更新符合 workNo 的資料
            if (row.workOrderNumber === workNo) {
                // 更新後端資料
                await fetchUpdateTable1(row.id, {
                    workOrderNumber: row.workOrderNumber,
                    editUser: row.editUser,
                    editDate: row.editDate,
                    quantity: row.quantity,
                    partNumber: row.partNumber

                });
            }
        }




        const updatedTable2Data = [...table2Data];
        const updatedRows: any[] = [];

        // 比對相同的 workOrderNumber 和 id，然後更新有修改的欄位
        originalData.forEach((originalRow) => {
            const matchingIndex = updatedTable2Data.findIndex(
                (tableRow) => tableRow.id === originalRow.id
            );

            if (matchingIndex !== -1) {
                const tableRow = updatedTable2Data[matchingIndex];
                const updatedRow = { ...tableRow }; // 複製一份現有資料行
                let hasChanges = false; // 檢查是否有修改

                // 檢查原始資料和現有資料是否有差異
                Object.keys(originalRow).forEach((key) => {
                    if (tableRow[key] !== originalRow[key]) {
                        updatedRow[key] = originalRow[key];
                        hasChanges = true; // 標記有變更
                    }
                });

                if (hasChanges) {
                    updatedTable2Data[matchingIndex] = updatedRow;
                    updatedRows.push({ ...tableRow, ...originalRow }); // 將原有資料和修改的資料行加入陣列
                }
            } else {
                // 如果找不到相同 id，將 originalRow 新增到 updatedTable2Data
                updatedTable2Data.push(originalRow);
                updatedRows.push(originalRow); // 新資料也加入到待發送的陣列
            }
        });

        // 更新 table2Data 狀態
        //setTable2Data(updatedTable2Data);

        console.log("table2要更新的資料:" + JSON.stringify(updatedRows));

        // 將table2有變更的資料更新
        if (updatedRows.length > 0) {
            const fetchUpdateRows = async () => {
                try {
                    const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedRows),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to 更新已存在資料');
                    } else {
                        console.log('完成table2更新現有資料');
                    }
                } catch (error) {
                    console.error('Error updating rows:', error);
                }
            };
            fetchUpdateRows();
        }



        //save資料後將所有欄位都清空
        // setOriginalData([]);
        setContinueInput(false);



    };








    return (
        <div style={{ width: '100vw', position: 'relative', left: 0 }}>
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

            {!updateData && !continueInput && userRole !== 'USER' && userRole !== 'OPERATOR' &&
                <button onClick={handleUpdate}>{formatMessage({ id: 'edit' })}</button>
            }



            {/* <>
                {!continueInput && 
                    <button onClick={handleContinueInput}>繼續輸入</button>
                }
            </> */}
            {userRole !== 'USER' && !updateData && (
                <>
                    {continueInput ? (
                        <button onClick={handleSaveData}>{formatMessage({ id: 'save' })}</button>
                    ) : (
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
                            <button onClick={handleConfirm}>{formatMessage({ id: 'submit' })}</button>

                        </div>


                    </>
                }

            </>


            {
                !isComplete && continueInput &&
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

            {
                isComplete &&
                <>
                    <p>{formatMessage({ id: 'text1' })}</p>
                </>
            }
            {
                originalData.length > 0 &&
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden', height: '90%' }}>
                        <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow style={{ border: '1px solid #ccc' }}>
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
                                {/* 使用colKey */}
                                {/* <TableBody>
                                    {originalData.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex}>
                                            {Object.keys(row)
                                                .filter((colKey) => colKey !== 'id')
                                                .map((colKey) => (
                                                    <TableCell key={colKey} onClick={() => handleCellClick(rowIndex, colKey)}>
                                                        {editCell.rowIndex === rowIndex && editCell.colKey === colKey ? (
                                                            <TextField
                                                                value={row[colKey] || ''}
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
                                    {originalData.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex}>
                                            {Object.keys(row)
                                                .filter((colKey) => colKey !== 'id')
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
                                                                handleCellClick(rowIndex, colIndex);
                                                            }
                                                        }}
                                                        className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}
                                                    >


                                                        {editCell.rowIndex === rowIndex && editCell.colIndex === colIndex ? (
                                                            <TextField
                                                                value={row[colKey]}
                                                                onChange={(e) => handleCellChange(e, rowIndex, colIndex)}  // 傳遞 rowIndex 和 colIndex
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={originalData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            }
        </div >
    );
};

export default SearchForm;
