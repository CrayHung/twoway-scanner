import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Backdrop, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { useGlobalContext } from '../global';


const ACIStock = () => {
    const { formatMessage } = useIntl();
    const { globalUrl, } = useGlobalContext();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間

    //掃描棧板上的條碼
    const [palletname, setPalletname] = useState('');
    //掃描棧板上的條碼 , 取得該棧板的資訊
    // const [palletData, setPalletData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any | null>(null);

    //該棧板上的carton資訊
    const [cartonDetailData, setCartonDetailData] = useState<any>([]);



    //for 編輯時控制BackDrop
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocation, setEditedLocation] = useState("INSP"); // 編輯的 location
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null); // 保存當前編輯的行索引




    const handleLocationClick = (location: string, rowIndex: number) => {
        setEditedLocation(location); // 設定為當前行的 location
        setSelectedRowIndex(rowIndex); // 記錄當前行的索引
        setIsEditing(true); // 顯示 Backdrop 和輸入框
    };

    // 隱藏 Backdrop 和輸入框
    const handleBackgroundClick = () => {
        setIsEditing(false);
        setEditedLocation("");
    };

    // 更新輸入框的內容
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedLocation(e.target.value);
    };

    const handleSave = () => {
        if (selectedRowIndex !== null) {
            if (!palletData) {
                console.error("palletData is null or undefined");
                return;
            }
            // 更新前端資料
            const newPalletData = { ...palletData, location: editedLocation };
            setPalletData(newPalletData);
            setIsEditing(false);


            // 更新後端資料
            const updatedLocation = editedLocation;
            const palletId = palletData.id;

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


    const handleStockInput = async (e: any) => {
        if (e.key === 'Enter') {


            //入庫後 , 取得該palletName的所有carton Detail資訊
            const getCartonDetailData = async () => {
                try {
                    const response = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ pallet_name: palletname }),
                    });

                    if (!response.ok) {
                        alert("無法取得carton Detail資訊");
                        throw new Error('Failed to get carton');
                    }
                    else {
                        const data: any[] = await response.json();
                        console.log("即將進庫的資料是 : ", JSON.stringify(data, null, 2))
                        setCartonDetailData(data);
                    }



                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            }
            //將pallet加入stcok裡面完成入庫作業
            const stockIn = async () => {
                try {
                    const response = await fetch(`${globalUrl.url}/api/post-stock`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pallet_name: palletname,
                            stock_time: dateTime
                        }),
                    });
                    if (!response.ok) {
                        alert("無法入庫");
                        throw new Error('Failed to stock in');
                    }
                    else {
                        const data: any[] = await response.json();
                        console.log("stock data : ", JSON.stringify(data, null, 2));
                        await getCartonDetailData();
                    }
                } catch (error) {
                    console.error('Error fetching:', error);
                }
            }
            //先透過palletname字串 取得該棧板的所有資訊
            const getPalletData = async () => {
                try {
                    const response = await fetch(`${globalUrl.url}/api/get-pallet`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ pallet_name: palletname }),
                    });

                    if (!response.ok) {
                        alert("無法取得pallet Name資訊");
                        throw new Error('Failed to get pallet');
                    }
                    else {
                        const data: any[] = await response.json();
                        console.log("返回的pallet data : ", JSON.stringify(data, null, 2));

                        // setPalletData(data);
                        if (data && typeof data === "object") {
                            setPalletData(data);
                        } else {
                            console.error("API 返回的 palletData 不是物件:", data);
                            setPalletData(null);
                        }

                        await stockIn();

                    }



                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            }
            getPalletData();
            await alert("入庫成功")
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {

        if (event.key === "Enter") {
            handleSave(); // 儲存變更
            setIsEditing(false); // 隱藏輸入框
        }
    }

    //入庫成功後馬上跳出.可以修改location的Modal
    useEffect(() => {
        if (palletData) {
            setIsEditing(true);
            setSelectedRowIndex(0);
        }
    }, [palletData]);






    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "auto",
            }}>
            <div>
                <label>{formatMessage({ id: 'stock' })}：</label>
                <input
                    type="text"
                    value={palletname}
                    placeholder="輸入 Pallet Name"
                    onChange={(e) => setPalletname(e.target.value)}
                    onKeyDown={handleStockInput}
                />
            </div>
            <Backdrop
                open={isEditing}
                onClick={handleBackgroundClick}
                style={{ zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            />

            {!palletData ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>no data</p>
            ) : (
                <>
          
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                                    }}
                                >
                                    <TableHead>
                                        <TableRow style={{ border: '1px solid #ccc' }}>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'PalletName' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'MaxQuantity' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'Quantity' })}</TableCell>
                                            <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'Location' })}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={palletData?.id}>
                                            <TableCell>{palletData?.id}</TableCell>
                                            <TableCell>{palletData.palletName}</TableCell>
                                            <TableCell>{palletData.maxQuantity}</TableCell>
                                            <TableCell>{palletData.quantity}</TableCell>
                                            <TableCell onClick={() => handleLocationClick(palletData.location, 0)} style={{ cursor: 'pointer' }}>
                                                {isEditing && selectedRowIndex === 0 ? (
                                                    <input
                                                        type="text"
                      
                                                        value={editedLocation}
                                                        onChange={handleLocationChange}
                                                        onKeyDown={(event) => handleKeyDown(event, 0)}
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
                                                    palletData.location
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>



                    <h1 style={{ margin: 0 }}>{formatMessage({ id: 'palletContent' })}</h1>


                    <Paper style={{ flex: 1, overflowX: "auto", margin: 0 }}>
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
                                <TableHead>
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'PalletName' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'SN' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_RFTray_BEDID' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_PS_BEDID' })}</TableCell>
                                        <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'QR_HS_BEDID' })}</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartonDetailData.map((carton: any, rowIndex: number) => (
                                        <TableRow key={carton.id}>
                                            <TableCell>{carton.id}</TableCell>
                                            <TableCell>{carton.palletName}</TableCell>
                                            <TableCell>{carton.cartonName}</TableCell>
                                            <TableCell>{carton.sn}</TableCell>
                                            <TableCell>{carton.qrRfTray}</TableCell>
                                            <TableCell>{carton.qrPs}</TableCell>
                                            <TableCell>{carton.qrHs}</TableCell>
                                            <TableCell>{carton.qrRfTrayBedid}</TableCell>
                                            <TableCell>{carton.qrPsBedid}</TableCell>
                                            <TableCell>{carton.qrHsBedid}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}

        </div>
    );
}

export default ACIStock;
