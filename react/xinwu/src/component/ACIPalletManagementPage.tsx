import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Backdrop } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
import ACIPicking from './ACIPicking';

const ACIPalletManagementPage = () => {
    const { formatMessage } = useIntl();

    /*
    1.取得所有stock表中的pallet
    2.根據palletName去取得該pallet表 , 並拼接成渲染的表格 (可以用兩個表格,一個顯示stock內容, 一個顯示pallet內容)
    3.pallet表格的最後有個"編輯"按鈕 , 點擊該按鈕即連結到新頁面 , 並透過該palletName去取得cartonDetails表+渲染cartonDetails表格
    4.
    */

    const { globalUrl, palletName, setPalletName } = useGlobalContext();

    //一開始渲染Table的資料
    const [allStockData, setAllStockData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any[]>([]);


    //for 編輯時控制BackDrop
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocation, setEditedLocation] = useState(""); // 編輯的 location
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null); // 保存當前編輯的行索引


    const navigate = useNavigate();

    useEffect(() => {
        fetchStock();
    }, []);

    useEffect(() => {
        if (allStockData.length > 0) {
            fetchPallet();
        }
    }, [allStockData]);


    const fetchStock = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-stock`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                //把palletName為null的資料篩掉
                const filterData = data.filter((item: any) => item.palletName !== null);
                setAllStockData(filterData);
                console.log("返回的stock filterData : ", JSON.stringify(filterData, null, 2))

            } else {
                console.error('無法取得 stock 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };


    const fetchPallet = async () => {
        try {
            const palletNames = allStockData.map(stock => stock.palletName);
            const uniquePalletNames = Array.from(new Set(palletNames)); // 避免重複請求

            // console.log("palletNames : "+palletNames);
            console.log("uniquePalletNames : ", JSON.stringify(uniquePalletNames, null, 2));


            //取得所有的pallet資料
            const response = await fetch(`${globalUrl.url}/api/get-multiple-pallets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uniquePalletNames),
            });

            if (!response.ok) {
                console.error("Failed to fetch pallets:", response.status, response.statusText);
                return;
            }

            const pallets = await response.json();
            setPalletData(pallets);
            console.log("取得的pallets :", JSON.stringify(pallets, null, 2));
        } catch (error) {
            console.error('Error fetching pallet details:', error);
        }
    };


    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedLocation(e.target.value);
    };

    const handleSave = () => {
        if (selectedRowIndex !== null) {
            if (!palletData) {
                console.error("palletData is null or undefined");
                return;
            }
            // 更新前端資料 (這邊跟Stock的單一物件不同 , 藥用陣列的方式去更新)
            const updatedPalletData = palletData.map((pallet, index) => 
            index === selectedRowIndex 
                ? { ...pallet, location: editedLocation } // 更新該行資料
                : pallet // 其他不變
        );

            setPalletData(updatedPalletData);
            setIsEditing(false);


            // 更新後端資料
            const updatedLocation = editedLocation;
            // const palletId = palletData.id;
            const palletId = palletData[selectedRowIndex].id;

            fetch(`${globalUrl.url}/api/update-pallet-location/${palletId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: updatedLocation })
            })
                .then(response => response.json())
                .then(updatedPallet => {
                    console.log('Updated pallet:', updatedPallet);
                    setIsEditing(false); // 隱藏編輯框
                })
                .catch(error => {
                    console.error('Error updating pallet:', error);
                    setIsEditing(false); // 隱藏編輯框
                });
        }
    };

    const handleLocationClick = (location: string, rowIndex: number) => {
        setEditedLocation(location); // 設定為當前行的 location
        setSelectedRowIndex(rowIndex); // 記錄當前行的索引
        setIsEditing(true); // 顯示 Backdrop 和輸入框
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {

        if (event.key === "Enter") {
            handleSave(); // 儲存變更
            setIsEditing(false); // 隱藏輸入框
        }
    }

      // 隱藏 Backdrop 和輸入框
      const handleBackgroundClick = () => {
        setIsEditing(false);
        setEditedLocation("");
    };

    return (
        <div style={{ display: "flex", gap: "16px" }}>
            <Backdrop
                open={isEditing}
                onClick={handleBackgroundClick}
                style={{ zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            />
            {/* 渲染stock表 :  pallet_name  stock_time      */}
            <Paper style={{ flex: 1, overflowX: "auto", minWidth: "400px" }}>
                <h1>stock</h1>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>{formatMessage({ id: 'id' })}</strong></TableCell>
                                <TableCell align="center"><strong>{formatMessage({ id: 'PalletName' })}</strong></TableCell>
                                <TableCell align="center"><strong>{formatMessage({ id: 'stockTime' })}</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allStockData.length > 0 ? (
                                allStockData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.palletName}</TableCell>
                                        <TableCell align="center">{row.stockTime}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align="center" colSpan={3}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* 渲染pallet表 :  pallet_name  max_quantity  quantity  location 編輯按鈕     */}

            <Paper style={{ flex: 2, overflowX: "auto" }}>
                <h1>pallet</h1>
                <TableContainer component={Paper}>
                    <Table aria-label="sticky table">
                        <TableHead>
                            <TableRow style={{ border: '1px solid #ccc' }}>
                                <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'MaxQuantity' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'Quantity' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'Location' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'operate' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {palletData.map((row: any, rowIndex: number) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.palletName}</TableCell>
                                    <TableCell>{row.maxQuantity}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleLocationClick(row.location, rowIndex)} // 傳遞該行的 location 和索引
                                        >
                                            {isEditing && selectedRowIndex === rowIndex ? (
                                                <input
                                                    type="text"
                                                    value={editedLocation}
                                                    onChange={handleLocationChange}
                                                    onKeyDown={(event) => handleKeyDown(event, rowIndex)}
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
                                                    onBlur={handleSave}
                                                />
                                            ) : (
                                                row.location // 直接使用當前行的 location 值
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => navigate('/ACI/picking', { state: { palletName: row.palletName } })}
                                        >
                                            {formatMessage({ id: 'edit' })}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

        </div>
    );
}

export default ACIPalletManagementPage;
