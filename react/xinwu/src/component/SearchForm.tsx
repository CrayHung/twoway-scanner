/**
 * 
 * 此組件會根據單一筆的工單號碼(workOrderNumber) , 列出Table2內該筆工單的所有資訊 ,並可進行編輯 
 * 
 */
import React, { useEffect, useState } from 'react';
import { Backdrop, TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, SelectChangeEvent, Select, Typography } from '@mui/material';
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

    //for 編輯時的放大輸入框
    const [isEditing, setIsEditing] = useState(false);
    //for 點擊單元格染色框用
    const [clickedCell, setClickedCell] = useState<{ rowIndex: number; colIndex: number | null } | null>(null);

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
    // useEffect(() => {
    //     setOriginalData([]);
    // }, [])

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

    // const fetchAllTable1 = async () => {

    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/get-work-orders`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to get 所有工單');
    //         }

    //         const updatedData: any[] = await response.json();


    //         // const updatedData = removeWorkOrderDetails(data);
    //         setTable1Data(updatedData);


    //     } catch (error) {
    //         console.error('Error fetching token:', error);
    //     }
    // };
    // const fetchAllTable2 = async () => {
    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/get-work-order-details`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to get 所有工單');
    //         }

    //         const data: any[] = await response.json();


    //         //資料映射 將不一致的欄位名稱轉換為需要的欄位名稱
    //         //並且重新排序順序
    //         const mappedData = data.map(item => ({
    //             id: item.id,
    //             workOrderNumber: item.workOrderNumber,
    //             detailId: item.detailId,
    //             SN: item.SN,
    //             QR_RFTray: item.QR_RFTray,
    //             QR_PS: item.QR_PS,
    //             QR_HS: item.QR_HS,
    //             QR_backup1: item.QR_backup1,
    //             QR_backup2: item.QR_backup2,
    //             QR_backup3: item.QR_backup3,
    //             QR_backup4: item.QR_backup4,
    //             note: item.note,
    //             create_date: item.create_date,
    //             create_user: item.create_user,
    //             edit_date: item.edit_date,
    //             edit_user: item.edit_user,
    //             // QR_RFTray_BEDID: item.QR_RFTray_BEDID,
    //             // QR_PS_BEDID: item.QR_PS_BEDID,
    //             // QR_HS_BEDID: item.QR_HS_BEDID,
    //             ...item,

    //         }));

    //         //用來將table2的不要欄位過濾掉(quantity,company,partNumber)
    //         const filteredData = mappedData.map(({
    //             partNumber,
    //             // workOrderNumber,
    //             company,
    //             quantity,
    //             ...rest
    //         }) => rest);


    //         setTable2Data(filteredData);

    //     } catch (error) {
    //         console.error('Error fetching token:', error);
    //     }
    // };
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


        setLoading(true); // 開始Loading
        console.log("originalData : ", JSON.stringify(originalData, null, 2));


          // 第二次table2的 API 請求 - 新增資料
          const fetchAddRows = async () => {
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
                QR_RFTray_BEDID: '',
                QR_PS_BEDID: '',
                QR_HS_BEDID: '',
            })));

            await fetchUpdateTable1();

            setUpdateData(false);

            setLoading(false); // 完成後結束Loading
            navigate("/editWorker/reload");
        }

      

        //for table2 delete
        //如果要更新的筆數 小於 目前的資料數
        //1.判斷originalData中是否有所有欄位都是空的row
        //2.如有,則刪除這些行
        //3.如沒有足夠的空白行 , 則跳出警告
        if (updateWorkQuantity < quant) {
            // 需要刪除的行數
            const rowsToDelete = quant - updateWorkQuantity;
            console.log("rowsToDelete : "+rowsToDelete);
            // 找出所有欄位都是空字串的行
            const excludedKeys = ["id", "workOrderNumber", "detailId", "create_date", "create_user", "edit_date", "edit_user"];
            const emptyRows = originalData.filter(row =>
                Object.keys(row).every(key =>
                    excludedKeys.includes(key) || row[key] === ''|| row[key] === null || row[key] === undefined
                )
            ).reverse(); // 倒序排列，從最後一筆開始刪除
            
            console.log("emptyRows : ", JSON.stringify(emptyRows, null, 2));

            // 如果有足夠的空白行可以刪除
            if (emptyRows.length >= rowsToDelete) {
                // 收集要刪除的行的id
                const rowsToDeleteIds = emptyRows.slice(0, rowsToDelete).map(row => row.id);
                console.log("rowsToDeleteIds : "+rowsToDeleteIds);


                try {


                    for (const id of rowsToDeleteIds) {
                        await fetch(`${globalUrl.url}/api/delete-work-order-details/${id}`, {
                          method: 'DELETE',
                        });
                      }

                    // 更新
                    const updatedData = originalData.filter(row => !rowsToDeleteIds.includes(row.id));


                    alert(`成功刪除 ${rowsToDeleteIds.length} 筆資料`);
                    await fetchUpdateTable1();
                    await fetchAll();

                    setOriginalData(updatedData);
                    setRows(updateWorkQuantity);
                    // setQuant(updateWorkQuantity);

                    
                    //將編輯按鈕顯現出來 ,關閉原本的3個input框
                    setUpdateData(false);

                    navigate("/editWorker/reload");
                    setLoading(false); // 完成後結束Loading



                } catch (error) {
                    console.error('刪除失敗:', error);
                    alert('刪除失敗，請稍後再試');
                    setUpdateData(false);
                    setLoading(false); // 完成後結束Loading
                }

            } else {
                // 跳出警告，無法刪除足夠的空白行
                alert("沒有足夠的空白行可以刪除！請檢查資料。");
                //將編輯按鈕顯現出來 ,關閉原本的3個input框
                setUpdateData(false);

                setLoading(false); // 完成後結束Loading


            }


        }

        /******************************************* */
        // 更新 table1Data
        /******************************************* */


        //將table1Data裡面多餘的workOrderDetails資訊刪掉
        const removeWorkOrderDetails = (data: any[]) => {
            return data.map(({ workOrderDetails, ...rest }) => rest);
        };

        //根據料號part , 找出table3該料號對應的model是哪個 , 更新setModel
        const selectedData = table3Data.find((data: any) => data.partNumber === updateWorkPart);
        if (selectedData) {
            setModel(selectedData.inputMode);
        }


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


    const handleBackgroundClick = () => {
        setIsEditing(false); // 點擊背景結束編輯
        setEditCell({ rowIndex: null, colIndex: null });
        setEditingCell(null);
        setTempValue(""); // 清空輸入框值
    };

    // 處理單元格點擊進入編輯模式(接收row和column index)
    const handleCellClick = (rowIndex: number, colIndex: number) => {

        setIsEditing(true);


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
    const extractID = (value: string) => {
        const match = value.match(/\.\$ID:(.*?)\.\$/);
        return match ? match[1] : null;
    };
    const [tempValue, setTempValue] = useState('');

    ///////////////////////////////////////////////////////////////////////////
    // change時將變更的值設定給tempValue , 
    // keyDown時 執行判斷
    //     - 符合規格的話 , 將tempValue的值給PUT更新
    //     - 不符合規格的話 , 將tempValue的值反空 , 跳出alert , 結束keyDown
    // 更新完畢後, 將更新的值設定給originalData 並將 tempValue值反空

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colKey: string) => {

        if (event.key === "Enter") {
            // alert("原本的值:" + originalData[rowIndex][colKey])

            const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];
            let isDuplicateInDatabase = false;

            const newValue = tempValue;
            // alert("輸入的值:" + newValue)



            // 若是空字串，視為不重複
            if (newValue === "") {
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
                        setTempValue('');
                        setInputValue(''); // 清空輸入框
                        return;
                    }

                    //重複檢查
                    isDuplicateInDatabase = table2Data.some(
                        (item: { [x: string]: string; }) => item[colKey] === newValue
                    );
                }

            }

            const originalValue = table2Data.find((item: any) => item.id === originalData[rowIndex].id)?.[colKey];
            //如果和資料庫資料重複 , 則將渲染的table改回原值
            // if (newValue.trim() !== "" && isDuplicateInDatabase) {
            if (isDuplicateInDatabase) {
                alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
                setTempValue('');

                // 將table值還原為原始值
                // const updatedData = originalData.map((row: any, idx: number) =>
                //     idx === rowIndex ? { ...row, [colKey]: originalValue } : row
                // );

                // setOriginalData(updatedData);

                setInputValue(''); // 清空輸入框
                return;
            }
            else {
                //如果沒有重複 , 將該欄位值更新


                // console.log("這個欄位的值是 : " + newValue)
                // if (originalValue !== newValue) {
                const fetchUpdateRows = async () => {

                    try {
                        // 發送 PUT 請求進行資料更新
                        const updateData: any = {
                            id: originalData[rowIndex].id,
                            [colKey]: newValue,
                            edit_user: currentUser,
                        };

                        if (checkColumn.includes(colKey) && colKey !== 'SN') {
                            updateData[`${colKey}_BEDID`] = extractID(newValue);
                        }

                        const response = await fetch(`${globalUrl.url}/api/update-work-order-details`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify([updateData]),
                        });

                        if (!response.ok) {
                            throw new Error('Failed to 更新');
                        }

                        // 更新 originalData 並清空 tempValue
                        const updatedData = [...originalData];
                        updatedData[rowIndex][colKey] = newValue;
                        setOriginalData(updatedData);
                        setTempValue(""); // 清空 tempValue
                        console.log('完成資料更新');
                    } catch (error) {
                        console.error('Error updating rows:', error);
                    }
                };
                await fetchUpdateRows();


            }
            setIsEditing(false);
        };
    }

    ///////////////////////////////////////////////////////////////////////////

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

                    // console.log("要更新的資料是 : ", JSON.stringify(updateData, null, 2))

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
    };

    /************************************************************* */


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

   


    const handleDeleteClick = async (id: any, workOrder: any) => {

        // console.log("handleDeleteClick接收到的資料:" + id + " , " + workOrder);
        // console.log("table1 ID : " + table1Id);

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
                setQuant(newQuant);
            }
            //已刪掉table2最後一筆.把整個table1刪掉
            else if (newQuant === 0) {

                await deleteTable1(table1Id);
                setQuant(0);
                setWorkNo('');
                setTable1Id('');
                setPart('');
                setModel('');

            }


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

    //for 點擊單元格變紅框用
    useEffect(() => {
        if (!isEditing) {
            setClickedCell(null);
        }
    }, [isEditing]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "auto",
            }}>
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


            {/* {userRole !== 'USER' || userRole !== 'OPERATOR' && (
                <>
                    {!updateData && !continueInput &&
                        <button onClick={handleUpdate}>{formatMessage({ id: 'edit' })}</button>
                    }
                </>
            )} */}
            {/* {!updateData && !continueInput && userRole !== 'USER' && userRole !== 'OPERATOR' && !updateCell && */}
            {!updateData && !continueInput && userRole !== 'USER' && userRole !== 'OPERATOR' &&
                <div>
                    <button onClick={handleUpdate}>{formatMessage({ id: 'edit-workOrderDetail' })}</button>
                </div>
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
                    <div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleBarcodeInput}
                            placeholder={formatMessage({ id: 'text' })}
                            disabled={isComplete} // 當掃描完成後禁用輸入框
                            autoFocus />
                    </div>
                </>
            }

            {/* {userRole !== 'USER' && !updateData && !updateCell && ( */}
            {userRole !== 'USER' && !updateData && (
                <>
                    <div>
                        {/* {continueInput ? (
                        <button onClick={handleSaveData} disabled={loading}>{formatMessage({ id: 'save' })}</button>
                    ) : (
                        <button onClick={handleContinueInput}>{formatMessage({ id: 'continueinput' })}</button>
                    )} */}
                        {!continueInput && (
                            <button onClick={handleContinueInput}>{formatMessage({ id: 'continueinput' })}</button>
                        )}
                    </div>
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
            <Backdrop
                open={isEditing}
                onClick={handleBackgroundClick}
                style={{ zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            />
            {
                originalData.length != 0 ? (
                    <>
                        {/* <Paper sx={{ width: '90%', height: '90%' }}> */}
                        {/* <TableContainer
                                component={Paper}
                                style={{ height: 'calc(100vh - 110px)', overflowY: 'auto', overflowX: 'auto' }}
                            > */}
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
                                            {['ADMIN', 'SUPERVISOR'].includes(userRole) &&
                                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'delete' })}</TableCell>
                                            }
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
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'produce_date' })}</TableCell>
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

                                                {['ADMIN', 'SUPERVISOR'].includes(userRole) &&
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

                                                                        // e.stopPropagation(); // 防止點擊事件冒泡到 Backdrop
                                                                        setClickedCell({ rowIndex, colIndex });

                                                                    }
                                                                }
                                                            }}
                                                            // className={currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''}
                                                            // className={`${
                                                            //     currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : ''
                                                            // } ${clickedCells.has(`${rowIndex}-${colIndex}`) ? 'clicked-cell' : ''}`}
                                                            className={[
                                                                currentRow === rowIndex && currentColumn === colIndex ? 'highlight-cell' : '',
                                                                clickedCell?.rowIndex === rowIndex && clickedCell?.colIndex === colIndex ? 'highlight-cell' : '',
                                                            ]
                                                                .filter(Boolean)
                                                                .join(' ')} // 合併 className 並過濾空值

                                                        >

                                                            {isEditing &&
                                                                editCell.rowIndex === rowIndex &&
                                                                editCell.colIndex === colIndex ? (


                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={tempValue}
                                                                        onChange={(e) => setTempValue(e.target.value)}
                                                                        onKeyDown={(event) => handleKeyDown(event, rowIndex, colKey)}
                                                                        style={{
                                                                            backgroundColor: 'white',
                                                                            width: '1000px',
                                                                            height: '50px',
                                                                            fontSize: '18px',
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            zIndex: 1002,
                                                                        }}
                                                                        onBlur={() => setIsEditing(false)}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <span
                                                                    onClick={() => {
                                                                        setEditCell({ rowIndex, colIndex });
                                                                        setTempValue(row[colKey] || "");
                                                                        setIsEditing(true);
                                                                    }}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    {row[colKey]}
                                                                </span>
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
