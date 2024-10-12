/**
 * 
 * 此組件為新增工單組件 , 
 * 
 */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../global';
import './hightlight.css';


function AllowList() {

    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, table3Data, setTable3Data, workNo, setWorkNo, part, setPart, quant, setQuant, setModel } = useGlobalContext();

    const [workNumber, setWorkNumber] = useState('');    //工單號碼
    const [rows, setRows] = useState(0);  // 工單數量資料筆數
    const [selectedPartNumber, setSelectedPartNumber] = useState('');    //下拉料號
    const [inputModel, setInputModel] = useState("");    //料號對應的模式

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



    /**************************************************************************************************************** */
    /**
     * 
     *  "生成表格" 按鈕 邏輯
     * 
     */

    /**
     * 
     "id" ,"workOrderNumber", "detailId", "SN", "QR_RFTray", "QR_PS", "QR_HS", 
     "QR_backup1", "QR_backup2", "QR_backup3", "QR_backup4", 
     "note", "create_date", "create_user", "edit_date", "edit_user"
    
     */



    //使用按鈕增新表格
    const handleGenerateTable = () => {
        // 檢查工單號碼、工單數量、料號是否有效
        if (!workNumber) {
            alert('請輸入工單號碼');
            return;
        }

        if (rows <= 0) {
            alert('請輸入有效的工單數量');
            return;
        }

        if (!selectedPartNumber) {
            alert('請選擇有效的料號');
            return;
        }

        //如果已存在相同工單號碼,將input框反白
        const sameWorkNumber = table1Data.some((row: any) => row.workOrderNumber === workNumber);
        if (sameWorkNumber) {
            alert('該工單號碼已存在，請輸入不同的工單號碼');
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
            edit_user: ''
        })));

        setCurrentRow(0); // 重置行指針
        setCurrentColumn(1); // 重置列指針
        setIsComplete(false); // 重置完成狀態

    };


    // 處理工單數量輸入
    const handleRowChange = (e: any) => {
        const numRows = parseInt(e.target.value);
        if (numRows < 0) {
            alert("不符合的 工單數量");
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
    //     "id" , "workOrderNumber", "detailId", "SN", "QR_RFTray", "QR_PS", "QR_HS", "QR_backup1", "QR_backup2", "QR_backup3", "QR_backup4", "note", "create_date", "create_user", "edit_date", "edit_user"
    // ];
    // 處理條碼輸入
    const handleBarcodeInput = (event: any) => {
        if (event.key === 'Enter' && !isComplete) {
            event.preventDefault();
            const newValue = inputValue.trim();

            const rowIndex = currentRow !== null ? currentRow : 0;
            if (newValue && currentRow !== null && currentRow < rows) {//尚未達到工單數量

                const updatedData = [...data];

                let updatedRow = { ...updatedData[currentRow] };

                // 根據當前模式和欄位，填入不同的條碼數據
                if (inputModel === 'A') {
                    // A模式: 依次填入 SN 和 QR_HS
                    if (currentColumn === 1) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(4); // 跳到QR_HS欄位
                    } else if (currentColumn === 4) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (inputModel === 'B') {
                    // B模式: 依次填入 SN 和 QR_RFTray
                    if (currentColumn === 1) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(2); // 跳到QR_RFTray欄位
                    } else if (currentColumn === 2) { // 填入QR_RFTray欄位
                        updatedRow.QR_RFTray = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (inputModel === 'C') {
                    // C模式: 依次填入 SN 和 QR_PS
                    if (currentColumn === 1) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(3); // 跳到QR_PS欄位
                    } else if (currentColumn === 3) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (inputModel === 'D') {
                    // D模式: 依次填入 SN, QR_PS, QR_HS
                    if (currentColumn === 1) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(3); // 跳到QR_PS欄位
                    } else if (currentColumn === 3) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        setCurrentColumn(4); // 跳到QR_HS欄位
                    } else if (currentColumn === 4) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                } else if (inputModel === 'E') {
                    // E模式: 依次填入 SN, QR_RFTray, QR_PS, QR_HS
                    if (currentColumn === 1) { // 填入SN欄位
                        updatedRow.SN = newValue;
                        setCurrentColumn(2); // 跳到QR_RFTray欄位
                    } else if (currentColumn === 2) { // 填入QR_RFTray欄位
                        updatedRow.QR_RFTray = newValue;
                        setCurrentColumn(3); // 跳到QR_PS欄位
                    } else if (currentColumn === 3) { // 填入QR_PS欄位
                        updatedRow.QR_PS = newValue;
                        setCurrentColumn(4); // 跳到QR_HS欄位
                    } else if (currentColumn === 4) { // 填入QR_HS欄位
                        updatedRow.QR_HS = newValue;
                        moveToNextRowOrEnd(); // 完成該筆資料
                    }
                }

                // 更新當前行的資料
                updatedRow.edit_user = currentUser;
                updatedRow.edit_date = today;
                updatedData[currentRow] = updatedRow;
                setData(updatedData); // 更新整體表格資料
                setInputValue(''); // 清空輸入框
            }
        }
    };
    // 處理是否需要跳到下一行或標記掃描完成
    const moveToNextRowOrEnd = () => {
        setCurrentColumn(1); // 重置到 SN 欄位

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

    // 處理單元格點擊進入編輯模式(接收row和column的key)
    // const handleCellClick = (rowIndex: number, colKey: string) => {
    //     //只開放note欄位可手動新增
    //     if (
    //         colKey === 'workOrderNumber' || colKey === 'id' || colKey === 'SN' || colKey === 'QR_RFTray' ||
    //         colKey === 'QR_PS' || colKey === 'QR_HS' || colKey === 'QR_backup1' || colKey === 'QR_backup2' ||
    //         colKey === 'QR_backup3' || colKey === 'QR_backup4' ||
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

        // 只允許編輯note的欄位
        if (
            colKey === 'id' || colKey === 'workOrderNumber' || colKey === 'detailId' || colKey === 'SN' || colKey === 'QR_RFTray' ||
            colKey === 'QR_PS' || colKey === 'QR_HS' || colKey === 'QR_backup1' || colKey === 'QR_backup2' ||
            colKey === 'QR_backup3' || colKey === 'QR_backup4' ||
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

        const newFormattedData = data.map((row: any, index: any) => {

            // 如果原始資料不存在，設定為空物件，避免 undefined 錯誤
            const originalRow = originalData[index] || {};

            // 如果之前有儲存的資料，使用已儲存的資料，否則使用當前 row 資料
            const savedRow = savedData[index] || {
                workOrderNumber: row.workOrderNumber,
                detailId: row.detailId,
                SN: row.SN,
                QR_RFTray: row.QR_RFTray,
                QR_PS: row.QR_PS,
                QR_HS: row.QR_HS,
                QR_backup1: row.QR_backup1,
                QR_backup2: row.QR_backup2,
                QR_backup3: row.QR_backup3,
                QR_backup4: row.QR_backup4,
                note: row.note,
                create_date: row.create_date,
                create_user: row.create_user,
                edit_date: row.edit_date,
                edit_user: row.edit_user,
            };

            // 判斷該行是否有資料變動
            const hasChanged =
                originalRow.workOrderNumber !== savedRow.workOrderNumber ||
                originalRow.detailId !== savedRow.detailId ||
                originalRow.SN !== savedRow.SN ||
                originalRow.QR_RFTray !== savedRow.QR_RFTray ||
                originalRow.QR_PS !== savedRow.QR_PS ||
                originalRow.QR_HS !== savedRow.QR_HS ||
                originalRow.QR_backup1 !== savedRow.QR_backup1 ||
                originalRow.QR_backup2 !== savedRow.QR_backup2 ||
                originalRow.QR_backup3 !== savedRow.QR_backup3 ||
                originalRow.QR_backup4 !== savedRow.QR_backup4 ||
                originalRow.note !== savedRow.note;
            // 如果資料有變動，更新資料，並更新日期和使用者
            if (hasChanged) {
                return {
                    ...row,          // 保留其餘欄位的值
                    edit_date: today,
                    edit_user: currentUser,
                };
            } else {
                // 如果沒有變動，返回原始資料，保持 date 和 user 不變
                return savedRow;
            }
        });

        //測試用 ,先將資料加入到table2Data後面...但沒有加id欄位...所以測試編輯會錯
        const updatedTestData = [...table2Data, ...newFormattedData];
        setTable2Data(updatedTestData);

        //測試用 ,將資料加到table2Dat1
        const newTestData1 = {
            workOrderNumber: workNumber,
            quantity: rows,
            partNumber: selectedPartNumber,
            createUser: currentUser,
            createDate: today,
            editUser: currentUser,
            editDate: today
        };
        setTable1Data((prevData: any) => [...prevData, newTestData1]);



        // 這邊用API將新增的資料存到DB中的 table1 table2
        //將新增的表格加入到table2資料庫
        // const fetchData2 = async () => {
        //     try {
        //         const response = await fetch(`${globalUrl.url}/api/add-news`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(data),
        //         });
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! Status: ${response.status}`);
        //         }
        //         const res = await response.json();
        //         console.log("新增成功"+ res);
        //     } catch (error: any) {
        //         console.error('Error :', error);

        //     }
        // };
        // fetchData2();

        //將新增的表格加入到table1資料庫
        // const fetchData1 = async () => {
        //     try {
        //         const response = await fetch(`${globalUrl.url}/api/add-news`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(newTestData1),
        //         });
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! Status: ${response.status}`);
        //         }
        //         const res = await response.json();
        //         console.log("新增成功"+ res);
        //     } catch (error: any) {
        //         console.error('Error :', error);

        //     }
        // };
        // fetchDat1();


        navigate('/');

    };


    /**
     * 
     * 一進組件要做的
     * 資料初始化
     * 換頁
     * 將table3的料號對應model儲存起來
     */

    useEffect(() => {
        // 從 table3Data 提取 inputModel
        const model = table3Data.map((item: { inputModel: any; }) => item.inputModel);
        setInputModel(model);
    }, []);

    //一進頁面先將資料初始化
    useEffect(() => {
        setWorkNo('');
        setQuant(0);
        setPart('');
    }, [])

    // 根據 selectedPartNumber 找到對應的 inputModel
    useEffect(() => {
        const foundItem = table3Data.find((item: { partNumber: string; }) => item.partNumber === selectedPartNumber);
        if (foundItem) {
            setInputModel(foundItem.inputModel);
        }
    }, [selectedPartNumber, table3Data]);

    // useEffect(() => {
    //     console.log('目前所有table1的內容是:', JSON.stringify(table1Data, null, 2));
    //     console.log('目前所有table2的內容是:', JSON.stringify(table2Data, null, 2));
    // }, [table1Data]);

    // useEffect(() => {
    //     console.log('新增的表單:', JSON.stringify(data, null, 2));
    // }, [data])

    // useEffect(() => {
    //     alert("工單號碼"+workNumber+"數量"+rows+"料號"+selectedPartNumber+"模式"+inputModel);
    // }, [workNumber,rows,selectedPartNumber,inputModel]);



    return (
        <>
            <div className="content" style={{ flex: 1 }}>
                <h1>條碼掃描系統</h1>
                <div>
                    <label>使用者(測試用)：</label>
                    <input
                        type="text"
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        placeholder="輸入使用者名稱"
                    />
                </div>
                <div>
                    <>
                        <label>工單號碼：</label>
                        <input
                            type="text"
                            value={workNumber}
                            onChange={(e) => setWorkNumber(e.target.value)}
                        />
                    </>
                    <>
                        <label>料號：</label>
                        <select value={selectedPartNumber} onChange={(e) => setSelectedPartNumber(e.target.value)}>
                            <option value="">料號</option>
                            {table3Data.map((item: any) => (
                                <option key={item.id} value={item.partNumber}>
                                    {item.partNumber}
                                </option>
                            ))}
                        </select>
                    </>
                    <>
                        <label>工單數量：</label>
                        <input type="number" value={rows} onChange={handleRowChange} />
                    </>
                    <button onClick={handleGenerateTable}>生成表格</button>
                </div>



                {data.length > 0 &&
                    <>
                        <button onClick={handleSaveData}>儲存</button>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleBarcodeInput}
                            placeholder="請掃描條碼"
                            disabled={isComplete} // 當掃描完成後禁用輸入框
                        />
                        {isComplete && <p>所有條碼已完成掃描。</p>}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                                <Table >
                                    <TableHead >
                                        <TableRow style={{ border: '1px solid #ccc' }}>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>細項</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>序號SN</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_RFTray</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_PS</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_HS</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_backup1</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_backup2</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_backup3</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>QR_backup4</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>備註</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>創建日期</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>創建使用者</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>編輯日期</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>編輯使用者</TableCell>
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

export default AllowList;