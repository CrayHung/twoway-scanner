/**
 * 
 * 此組件為新增工單組件 , 
 * 
 */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Typography } from '@mui/material';
// import '../App.css';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
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

    // id是第0列 , 工單號碼是第1列，detailid是第2列 , 第3列是SN(序號)
    // 因為要渲染的Table資料直接屏蔽掉id和 workOrderNumber欄位,所以初始從1開始
    const [currentColumn, setCurrentColumn] = useState<number | null>(1);
    const [inputValue, setInputValue] = useState('');
    const [isComplete, setIsComplete] = useState(false); // 用來標記是否已經完成掃描
    const [hiddenInput, setHiddenInput] = useState(false); //當按下"生成表格"的按鈕後 , 將輸入框以及按鈕都隱藏起來

    //for 編輯
    //接收number
    const [editCell, setEditCell] = useState<{ rowIndex: number | null; colIndex: number | null }>({ rowIndex: null, colIndex: null });
    //接收字串
    // const [editCell, setEditCell] = useState<{ rowIndex: number | null; colKey: string | null }>({ rowIndex: null, colKey: null }); //編輯當前的行和列
    const [savedData, setSavedData] = useState<any[]>([]); // 用來追蹤每行已儲存的資料


    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)




    useEffect(() => {
        // console.log('目前所有table1的內容是:', JSON.stringify(table1Data, null, 2));
        // console.log('目前所有table2的內容是:', JSON.stringify(table2Data, null, 2));
        // console.log('目前所有table3的內容是:', JSON.stringify(table3Data, null, 2));
        alert("QR CODE模式為 : .$DT+3碼.$DM:3碼NAN或12碼.$VN:3碼ACI.$SN:8~12碼.$MN:不超過25碼ACI的part Number.$HW:4碼.$ID:固定15碼.$")
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

    useEffect(() => {
        const fetchAllTable1Data = async () => {
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
                setTable1Data(data);

            } catch (error) {
                console.error('Error fetching token:', error);
                return [];
            }
        }
        fetchAllTable1Data();

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
        }; fetchAllTable3();

    }, [])

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

        setHiddenInput(true);

        setLoading(true);

        // 根據工單數量和模式生成表格 (單機測試要另外增加id欄位...)
        const newData = Array.from({ length: rows }, (v, i) => ({
            workOrderNumber: workNumber,
            // detailId: i + 1,
            SN: '',
            QR_RFTray: '',
            QR_PS: '',
            QR_HS: '',
            QR_backup1: '',
            QR_backup2: '',
            QR_backup3: '',
            QR_backup4: '',
            note: '',
            // create_date: today,
            create_user: currentUser,
            // edit_date: '',
            edit_user: currentUser,
            QR_RFTray_BEDID: '',
            QR_HS_BEDID: '',
            QR_PS_BEDID: ''
        }));

        // setData(newData);



        /**新增PUT即時更新 */

        //取得所有的table2資料,再來比對workNumber,
        //將所有table2Data中workOrderNumber欄位和workNumber相同的組成新的陣列顯示出來用來渲染table(setData)
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

                // console.log("table2Data : ", JSON.stringify(data, null, 2) )
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
                    QR_PS_BEDID: item.QR_PS_BEDID,
                    QR_HS_BEDID: item.QR_HS_BEDID,
                    ...item

                }));

                // //用來將table2的不要欄位過濾掉(quantity,company,partNumber)
                const filteredData = mappedData.map(({
                    partNumber,
                    // workOrderNumber,
                    company,
                    quantity,
                    ...rest
                }) => rest);


                setTable2Data(filteredData);
                return filteredData;

            } catch (error) {
                console.error('Error fetching token:', error);
                return [];
            }
        };


        //比對table2Data
        const matchData2 = async () => {
            const table2Data = await fetchAllTable2(); // 直接獲取最新資料
            //比對
            const matchData = table2Data.filter((item: { workOrderNumber: string; }) => item.workOrderNumber === workNumber);
            //    console.log("比對後 相同的資料 :",JSON.stringify(matchData, null, 2) ) 
            setData(matchData);
        };


        //新增table2
        const fetchData2 = async () => {
            try {
                const response = await fetch(`${globalUrl.url}/api/post-work-order-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // const res = await response.json();
                // console.log("新增table2成功");

            } catch (error: any) {
                console.error('Error :', error);
            }
        };


        //新增table1
        const fetchData1 = async () => {
            try {
                const response = await fetch(`${globalUrl.url}/api/post-work-orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        workOrderNumber: workNumber,
                        quantity: rows,
                        partNumber: selectedPartNumber,
                        company: company,
                        createUser: currentUser,
                        editUser: currentUser

                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // const res = await response.json();

                await fetchData2();
                // console.log("新增table1成功");

                //重新fetch table2Data並且比對workNumber找出目前要新增的陣列內容
                matchData2();

                // console.log('完成新增table1  table2', JSON.stringify(data, null, 2));
                // console.log('table1 ', JSON.stringify(table1Data, null, 2));
                // console.log('table2', JSON.stringify(table2Data, null, 2));

            } catch (error: any) {
                console.error('Error :', error);
            }
        };

        fetchData1();
        /**新增PUT即時更新 */


        setCurrentRow(0); // 重置行指針
        setCurrentColumn(1); // 重置列指針
        setIsComplete(false); // 重置完成狀態
        setLoading(false);

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


    /***************************************************************** */
    const [updatedRowData, setUpdatedRowData] = useState<any>([]);

    //QR_後面的.$ID~.$的字串取出
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
                    setData(updatedData); // 更新整體表格資料
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
                                    id: data[rowIndex].id,
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

                    updatedRow[`${fieldToCompare}`] = newValue;
                    updatedRow[`${fieldToCompare}_BEDID`] = extractID(newValue);
                    updatedRow.edit_user = currentUser;
                    updatedRow.edit_date = today;
                    updatedData[currentRow] = updatedRow;
                    setData(updatedData); // 更新整體表格資料
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
                                    id: data[rowIndex].id,
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
                    setData(updatedData); // 更新整體表格資料
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
                                    id: data[rowIndex].id,
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
            'A': [1, 4], // SN, QR_HS
            'B': [1, 2], // SN, QR_RFTray
            'C': [1, 3], // SN, QR_PS
            'D': [1, 3, 4], // SN, QR_PS, QR_HS
            'E': [1, 2, 3, 4], // SN, QR_RFTray, QR_PS, QR_HS
        };

        const columnOrder = columnOrderPerMode[inputMode]; // 取得當前模式的欄位順序
        const currentColumnIndex = columnOrder.indexOf(currentColumn ?? 1); // 找出目前欄位的索引

        if (currentColumnIndex === columnOrder.length - 1) {
            // 如果是最後一個欄位 , 檢查是否超出資料行數 , 如果沒超過則移動到下一行
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

        /****************************************************** */
        //因為alert會讓單元格無法點到, 所以用antd的message來處理
        const nonEditableKeys = [
            'id', 'workOrderNumber', 'detailId',
            'create_date', 'create_user', 'edit_date', 'edit_user',
            'QR_RFTray_BEDID', 'QR_PS_BEDID', 'QR_HS_BEDID'
        ];
        const alertKeys = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];

        if (nonEditableKeys.includes(colKey)) {
            return; // 禁止操作
        }
        if (alertKeys.includes(colKey)) {
            message.warning(formatMessage({ id: 'text' }), 1);
        }

        /****************************************************** */
        /****************************************************** */
        // 只允許編輯QR_RFTray ,QR_PS,QR_HS ,QR_backup1,QR_backup2,QR_backup3,QR_backup4note的欄位
        // if (
        //     colKey === 'id' || colKey === 'workOrderNumber' || colKey === 'detailId' ||
        //     colKey === 'create_date' || colKey === 'create_user' || colKey === 'edit_date' || colKey === 'edit_user'
        // ) {
        //     return;
        // }
        /****************************************************** */

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

        const newValue = e.target.value;



        /*新增防呆機制 */
        const checkColumn = ['SN', 'QR_RFTray', 'QR_PS', 'QR_HS'];
        let isDuplicateInDatabase = false;

        // 若是空字串，視為不重複
        if (newValue.trim() === "") {
            isDuplicateInDatabase = false;
            //指定的比對欄位
        } else if (checkColumn.includes(colKey)) {

            const newID = extractID(newValue);

            if (newID === null) {
                alert("字串格式不正確！請確保字串符合規定格式：.$ID:<內容>.$");
                setInputValue(''); // 清空輸入框
                return;
            }

            isDuplicateInDatabase = table2Data.some((item: { [x: string]: string; }) => item[colKey] === newValue);
        } else {
            isDuplicateInDatabase = false;
        }

        if (newValue.trim() !== "" && isDuplicateInDatabase) {
            alert(`${colKey} 已存在，請輸入不同的 ${colKey}`);
            setInputValue(''); // 清空輸入框
            return;
        }
        /*新增防呆機制 */


        /**新增PUT即時更新 */

        //檢查原欄位值和新輸入的質是否相同,如不同則PUT到API
        const originalValue = table2Data.find((item: any) => item.id === data[rowIndex].id)?.[colKey];
        if (originalValue !== newValue) {
            const fetchUpdateRows = async () => {
                try {
                    setLoading(true);
                    //如果修改的欄位是QR_,則將PUT內容新增_BEDID欄位
                    const updateData = {
                        id: data[rowIndex].id,
                        [colKey]: newValue,
                        edit_user: currentUser
                    };

                    if (checkColumn.includes(colKey)) {
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
        }
        /**新增PUT即時更新 */

        const updatedData = data.map((row: any, idx: any) =>
            //如果當前行和目標行相同,則將該欄位的值更新,其他行則維持原本的值
            idx === rowIndex ? { ...row, [colKey]: e.target.value, edit_user: currentUser, edit_date: today, [`${colKey}_BEDID`]: extractID(newValue) } : row
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

    // const handleSaveData = () => {

    //     setLoading(true); // 開始Loading

    //     try {


    //         const newFormattedData = data.map((row: any, index: any) => {

    //             // 如果原始資料不存在，設定為空物件，避免 undefined 錯誤
    //             const originalRow = data[index] || {};

    //             // 如果之前有儲存的資料，使用已儲存的資料，否則使用當前 row 資料
    //             const savedRow = savedData[index] || {
    //                 workOrderNumber: row.workOrderNumber,
    //                 // detailId: row.detailId,
    //                 SN: row.SN,
    //                 QR_RFTray: row.QR_RFTray,
    //                 QR_PS: row.QR_PS,
    //                 QR_HS: row.QR_HS,
    //                 QR_backup1: row.QR_backup1,
    //                 QR_backup2: row.QR_backup2,
    //                 QR_backup3: row.QR_backup3,
    //                 QR_backup4: row.QR_backup4,
    //                 note: row.note,
    //                 company: row.company,
    //                 // create_date: row.create_date,
    //                 create_user: row.create_user,
    //                 // edit_date: row.edit_date,
    //                 edit_user: row.edit_user,
    //                 QR_RFTray_BEDID: row.QR_RFTray_BEDID,
    //                 QR_PS_BEDID: row.QR_PS_BEDID,
    //                 QR_HS_BEDID: row.QR_HS_BEDID,
    //             };

    //             // 判斷該行是否有資料變動
    //             const hasChanged =
    //                 originalRow.workOrderNumber !== savedRow.workOrderNumber ||
    //                 // originalRow.detailId !== savedRow.detailId ||
    //                 originalRow.SN !== savedRow.SN ||
    //                 originalRow.QR_RFTray !== savedRow.QR_RFTray ||
    //                 originalRow.QR_PS !== savedRow.QR_PS ||
    //                 originalRow.QR_HS !== savedRow.QR_HS ||
    //                 originalRow.QR_backup1 !== savedRow.QR_backup1 ||
    //                 originalRow.QR_backup2 !== savedRow.QR_backup2 ||
    //                 originalRow.QR_backup3 !== savedRow.QR_backup3 ||
    //                 originalRow.QR_backup4 !== savedRow.QR_backup4 ||
    //                 originalRow.note !== savedRow.note ||
    //                 originalRow.company !== savedRow.company ||
    //                 originalRow.QR_RFTray_BEDID !== savedRow.QR_RFTray_BEDID ||
    //                 originalRow.QR_PS_BEDID !== savedRow.QR_PS_BEDID ||
    //                 originalRow.QR_HS_BEDID !== savedRow.QR_HS_BEDID;

    //             // 如果資料有變動，更新資料，並更新日期和使用者
    //             if (hasChanged) {
    //                 const updatedRow = {
    //                     ...savedRow,          // 保留其餘欄位的值
    //                     edit_user: currentUser,  // 更新使用者
    //                 };

    //                 // 移除不需要的欄位 (detailId, create_date, edit_date)
    //                 const { detailId, create_date, edit_date, ...filteredRow } = updatedRow;
    //                 return filteredRow;
    //             } else {
    //                 // 如果沒有變動，返回原始資料，保持 date 和 user 不變
    //                 return savedRow;
    //             }


    //         });

    //         // 這邊用API將新增的資料存到DB中的 table1 table2
    //         console.log("要新增table2的資料:" + JSON.stringify(newFormattedData));
    //         //將新增的表格加入到table2資料庫
    //         const fetchData2 = async () => {
    //             try {
    //                 const response = await fetch(`${globalUrl.url}/api/post-work-order-details`, {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(newFormattedData),
    //                 });
    //                 if (!response.ok) {
    //                     throw new Error(`HTTP error! Status: ${response.status}`);
    //                 }
    //                 const res = await response.json();
    //                 console.log("新增table2成功" + res);
    //             } catch (error: any) {
    //                 console.error('Error :', error);
    //             }
    //         };

    //         //將資料加到table1Data
    //         const newTestData1 = {
    //             workOrderNumber: workNumber,
    //             quantity: rows,
    //             partNumber: selectedPartNumber,
    //             company: company,
    //             createUser: currentUser,
    //             createDate: today,
    //             editUser: currentUser,
    //             editDate: today
    //         };
    //         // console.log("要新增table1的資料:" + JSON.stringify(newTestData1));
    //         // 這邊用API將新增的資料存到DB中的 table1 table2
    //         //將新增的表格加入到table1資料庫
    //         const fetchData1 = async () => {
    //             try {
    //                 const response = await fetch(`${globalUrl.url}/api/post-work-orders`, {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(newTestData1),
    //                 });
    //                 if (!response.ok) {
    //                     throw new Error(`HTTP error! Status: ${response.status}`);
    //                 }
    //                 // const res = await response.json();

    //                 await fetchData2();

    //             } catch (error: any) {
    //                 console.error('Error :', error);
    //             }
    //         };

    //         fetchData1();
    //     } catch (error) {
    //         console.error("Error saving data:", error);
    //     } finally {
    //         setLoading(false); // 完成後結束Loading
    //         alert(`${formatMessage({ id: 'updated' })}`)
    //     }
    // };





    // useEffect(() => {
    //     console.log('新增的表單:', JSON.stringify(data, null, 2));
    // }, [data])

    // useEffect(() => {
    //     alert("工單號碼"+workNumber+"數量"+rows+"料號"+selectedPartNumber+"模式"+inputMode);
    // }, [workNumber,rows,selectedPartNumber,inputMode]);


    const handleExitButtonClick = () => {
        navigate('/reload');
    };


    return (

        <div style={{ width: '100%', position: 'relative', left: 0, overflow: 'auto' }}>


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

            {!hiddenInput &&
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
            }


            {data.length > 0 &&
                <>
                    {!isComplete &&
                        <>
                            {/* <button onClick={handleSaveData}>{formatMessage({ id: 'save' })}</button> */}

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

                    {/* {isComplete &&
                            <>
                                <p>{formatMessage({ id: 'text1' })}</p>
                                <button onClick={handleSaveData}>{formatMessage({ id: 'save' })}</button>
                            </>
                        } */}
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
                                                .filter((colKey) => colKey !== 'id' && colKey !== 'workOrderNumber' && colKey !== 'QR_RFTray_BEDID' && colKey !== 'QR_PS_BEDID' && colKey !== 'QR_HS_BEDID')
                                                .map((colKey, colIndex) => (
                                                    <TableCell
                                                        key={colKey}
                                                        // onClick={() => 
                                                        //     handleCellClick(rowIndex, colIndex)
                                                        // }

                                                        onClick={() => {
                                                            // 依據 inputMode 的條件 , 訂出不可編輯的欄位
                                                            const restrictedFields: { [key in 'A' | 'B' | 'C' | 'D']: string[] } = {
                                                                A: ['QR_PS', 'QR_RFTray'],
                                                                B: ['QR_PS', 'QR_HS'],
                                                                C: ['QR_RFTray', 'QR_HS'],
                                                                D: ['QR_RFTray'],
                                                            };
                                                            // 檢查當前的欄位是否在 restrictedFields[inputMode] 中
                                                            if (!inputMode || !restrictedFields[inputMode as 'A' | 'B' | 'C' | 'D']?.includes(colKey)) {
                                                                // 如果不在不可編輯的欄位中，才允許編輯
                                                                handleCellClick(rowIndex, colIndex);
                                                            }
                                                        }}
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

    );
}

export default AddNewWorker;