// 保持 import 區域不變
import {
    Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Backdrop, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { useGlobalContext } from '../global';

type StockInput = {
    palletNames: string[];
    shipId: string | null;
};


type CartonData = {
    id: number;
    palletName: string;
    cartonName: string;
    sn: string;
    qrRfTray: string;
    qrPs: string;
    qrHs: string;
    qrRfTrayBedid: string;
    qrPsBedid: string;
    qrHsBedid: string;
};

type PalletData = {
    id: number;
    palletName: string;
    maxQuantity: number;
    quantity: number;
    location: string;
};

const ACIStock = () => {
    const { formatMessage } = useIntl();
    const { globalUrl, } = useGlobalContext();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間

    const [palletname, setPalletname] = useState('');
    const [palletDataList, setPalletDataList] = useState<PalletData[]>([]);

    const [selectedPalletNames, setSelectedPalletNames] = useState<string[]>([]);

    const [cartonDetailData, setCartonDetailData] = useState<CartonData[]>([]);
    const [selectedPallet, setSelectedPallet] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPalletName, setEditingPalletName] = useState<string | null>(null);
    const [editedLocation, setEditedLocation] = useState("INSP");
    const [openModal, setOpenModal] = useState(false);


    const [afterStockInData, setAfterStockInData] = useState<any[]>([]);
    const [showPalletData, setShowPalletData] = useState(false);

    //ship入庫
    const [palletOrShipName, setPalletOrShipName] = useState('');


    //使用ship入庫要多生成一個欄位shipId 並傳給後端
    const generateShipId = () => {
        const now = new Date();
        return `SHIP_${now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}`;
    };



    // 單一入庫（Ship 或 Pallet 條碼皆可）
    const handleStockOrShipInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = palletOrShipName.trim();
            if (!input) return;

            // Ship_開頭,保持setPalletOrShipName
            if (input.startsWith('SHIP_')) {
                // Ship 條碼 → 查 Ship 對應 Pallet Names
                const shipRes = await fetch(`${globalUrl.url}/api/get-ship-pallets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ shipId: input }),
                });

                if (!shipRes.ok) {
                    alert(`查無 Ship: ${input}`);
                    setPalletOrShipName('');
                    return;
                }

                const shipData = await shipRes.json();  // 假設回傳 { palletNames: ["Pallet1", "Pallet2"] }

                if (!shipData.palletNames || shipData.palletNames.length === 0) {
                    alert(`Ship: ${input} 內沒有 Pallet 資料`);
                    setPalletOrShipName('');
                    return;
                }

                // 載入所有 Pallet
                for (const pallet of shipData.palletNames) {
                    await loadPalletAndCarton(pallet);
                }

                setPalletOrShipName(input);

            } else {
                // Pallet 條碼
                await loadPalletAndCarton(input);
                setPalletOrShipName('');
            }


        }
    };

    //入庫共用邏輯
    const loadPalletAndCarton = async (palletName: string) => {
        const trimmed = palletName.trim();
        if (!trimmed) return;

        const isDuplicate = palletDataList.some(p => p.palletName === trimmed);
        if (isDuplicate) {
            console.warn(`Pallet "${trimmed}" 已經存在，略過`);
            return;
        }

        // 查詢 pallet 資訊
        const palletRes = await fetch(`${globalUrl.url}/api/get-pallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pallet_name: trimmed }),
        });
        if (!palletRes.ok) {
            console.error(`無法取得 pallet 資訊 (${trimmed})`);
            return;
        }
        const palletData = await palletRes.json();
        const newPallet: PalletData = {
            id: palletData.id,
            palletName: palletData.palletName,
            maxQuantity: palletData.maxQuantity,
            quantity: palletData.quantity,
            location: 'INSP'
        };
        setPalletDataList(prev => [...prev, newPallet]);

        // 查詢 carton detail 資訊
        const cartonRes = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pallet_name: trimmed }),
        });
        if (!cartonRes.ok) {
            console.error(`無法取得 carton 資訊 (${trimmed})`);
            return;
        }
        const cartonData: CartonData[] = await cartonRes.json();
        setCartonDetailData(prev => {
            const newData = cartonData.filter(newItem =>
                !prev.some(prevItem => prevItem.id === newItem.id)
            );
            return [...prev, ...newData];
        });

        setSelectedPalletNames(prev => [...prev, trimmed]);
    };
    //單一pallet入庫
    const handleStockInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await loadPalletAndCarton(palletname);
            setPalletname('');
        }
    };
    //ship入庫
    // const handleShipInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter') {


    //         const entries = shipName
    //             .split(/[\n\r,，\s]+/) // 支援逗號、換行、空格作為分隔符
    //             .map(p => p.trim())
    //             .filter(p => p.length > 0);

    //         for (const pallet of entries) {
    //             await loadPalletAndCarton(pallet);
    //         }

    //         setShipName('');
    //     }
    // };




    //單一pallet入庫
    // const handleStockInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter') {
    //         const trimmed = palletname.trim();
    //         if (!trimmed) return;


    //         const isDuplicate = palletDataList.some(p => p.palletName === trimmed);
    //         if (isDuplicate) {
    //             alert(`Pallet "${trimmed}" 已經存在，請勿重複輸入`);
    //             setPalletname('');
    //             return;
    //         }


    //         // 查詢 pallet 資訊
    //         const getPalletData = async () => {
    //             const response = await fetch(`${globalUrl.url}/api/get-pallet`, {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ pallet_name: trimmed }),
    //             });
    //             if (!response.ok) {
    //                 alert("無法取得 pallet 資訊");
    //                 return;
    //             }

    //             const data = await response.json();
    //             const newPallet: PalletData = {
    //                 id: data.id,
    //                 palletName: data.palletName,
    //                 maxQuantity: data.maxQuantity,
    //                 quantity: data.quantity,
    //                 location: 'INSP'
    //             };
    //             setPalletDataList(prev => [...prev, newPallet]);
    //         };

    //         // 查詢 cartonDetail 資訊
    //         const getCartonDetailData = async () => {
    //             const response = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ pallet_name: trimmed }),
    //             });
    //             if (!response.ok) {
    //                 alert("無法取得 carton detail 資訊");
    //                 return;
    //             }
    //             const data: CartonData[] = await response.json();
    //             setCartonDetailData(prev => {
    //                 const newData = data.filter(newItem =>
    //                     !prev.some(prevItem => prevItem.id === newItem.id)
    //                 );
    //                 return [...prev, ...newData];
    //             });
    //         };

    //         await getPalletData();
    //         await getCartonDetailData();

    //         setSelectedPalletNames(prev => [...prev, trimmed]);
    //         setPalletname('');
    //     }
    // };

    const handleLocationClick = (palletName: string) => {
        const current = palletDataList.find(p => p.palletName === palletName);
        if (current) {
            setEditedLocation(current.location);
            setEditingPalletName(palletName);
            setIsEditing(true);
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedLocation(e.target.value);
    };

    const handleSave = async () => {
        if (!editingPalletName) return;

        setPalletDataList(prev =>
            prev.map(p => p.palletName === editingPalletName ? { ...p, location: editedLocation } : p)
        );

        const target = palletDataList.find(p => p.palletName === editingPalletName);
        if (target) {
            await fetch(`${globalUrl.url}/api/update-pallet-location/${target.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: editedLocation }),
            });
        }

        setIsEditing(false);
        setEditingPalletName(null);
    };

    const filteredData = cartonDetailData.filter(item => item.palletName === selectedPallet);
    const uniquePallets: string[] = Array.from(new Set(cartonDetailData.map(item => item.palletName)));

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




    //將palletDataList中的pallet加入到stock
    const confirmPostInStock = async () => {

        //判斷是不是使用ship入庫 , 如果是則產生shipId , 不是的話就保留shipId=null
        // const isShipMode = selectedPalletNames.length > 1;
        // const shipId = isShipMode ? generateShipId() : null;

        const payload: StockInput = {
            palletNames: selectedPalletNames,
            shipId: palletOrShipName,
        };

        console.log("新增的stock資料 : ", JSON.stringify(selectedPalletNames, null, 2))
        console.log("新增的stock資料 : ", JSON.stringify(payload, null, 2))

        try {
            const response = await fetch(`${globalUrl.url}/api/post-multiple-stocks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                alert("無法入庫");
                throw new Error("Failed to post stock");
            }

            const result = await response.json();
            console.log("stock data : ", JSON.stringify(result, null, 2));
            alert("入庫成功");

            setAfterStockInData(result);

            setShowPalletData(true);

        } catch (error) {
            console.error("Error:", error);
        }
        //將pallet加入stcok裡面完成入庫作業 (只能post單一pallet..已不用)
        // const stockIn = async () => {
        //     try {
        //         const response = await fetch(`${globalUrl.url}/api/post-stock`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 pallet_name: palletname,
        //                 stock_time: dateTime
        //             }),
        //         });
        //         if (!response.ok) {
        //             alert("無法入庫");
        //             throw new Error('Failed to stock in');
        //         }
        //         else {
        //             const data: any[] = await response.json();
        //             console.log("stock data : ", JSON.stringify(data, null, 2));

        //         }
        //     } catch (error) {
        //         console.error('Error fetching:', error);
        //     }
        // }
        // await stockIn();
    }





    return (
        <div style={{ display: "flex", flexDirection: "column", height: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", flexDirection: "row", overflow: "auto" }}>
                <div>
                    <label>{formatMessage({ id: 'PalletName' })}：</label>
                    <input
                        type="text"
                        value={palletname}
                        placeholder="輸入 Pallet Name"
                        onChange={(e) => setPalletname(e.target.value)}
                        onKeyDown={handleStockInput}
                    />
                </div>
                <div>
                    <label>TWY ：</label>
                    <input
                        type="text"
                        value={palletOrShipName}
                        placeholder="掃描/輸入 Pallet 或 Ship 條碼"
                        onChange={(e) => setPalletOrShipName(e.target.value)}
                        onKeyDown={handleStockOrShipInput}
                    />
                </div>
            </div>
            <Backdrop open={isEditing} onClick={() => setIsEditing(false)} style={{ zIndex: 10, backgroundColor: "rgba(0,0,0,0.4)" }}>
                <div onClick={(e) => e.stopPropagation()}>
                    <TextField
                        value={editedLocation}
                        onChange={handleLocationChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                        autoFocus
                        label="編輯 Location"
                        variant="filled"
                        style={{ backgroundColor: "white" }}
                    />
                </div>
            </Backdrop>

            {/* Modal 顯示 pallet 明細 */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>詳細資料 - {selectedPallet}</DialogTitle>
                <DialogContent>
                    <Table>
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
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'Location1' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.palletName}</TableCell>
                                    <TableCell>{item.cartonName}</TableCell>
                                    <TableCell>{item.sn}</TableCell>
                                    <TableCell>{item.qrRfTray}</TableCell>
                                    <TableCell>{item.qrPs}</TableCell>
                                    <TableCell>{item.qrHs}</TableCell>
                                    <TableCell>{item.qrRfTrayBedid}</TableCell>
                                    <TableCell>{item.qrPsBedid}</TableCell>
                                    <TableCell>{item.qrHsBedid}</TableCell>
                                    <TableCell>
                                        {
                                            palletDataList.find(p => p.palletName === selectedPallet)?.location || "INSP"
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>關閉</Button>
                </DialogActions>
            </Dialog>

            {palletDataList.length > 0 && (
                <div>
                    <TableContainer component={Paper} style={{ marginTop: 16 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pallet Name</TableCell>
                                    <TableCell>maxQuantity</TableCell>
                                    <TableCell>quantity</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>變更location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {palletDataList.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                            onClick={() => {
                                                setSelectedPallet(p.palletName);
                                                setOpenModal(true);
                                            }}
                                        >
                                            {p.palletName}
                                        </TableCell>
                                        <TableCell>{p.maxQuantity}</TableCell>
                                        <TableCell>{p.quantity}</TableCell>
                                        <TableCell>{p.location}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleLocationClick(p.palletName)}>編輯</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained"
                        color="primary"
                        onClick={confirmPostInStock}>入庫</Button>
                </div>
            )}

            {showPalletData && (
                <div>
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
                                    {/* {afterStockInData.map((carton: any, rowIndex: number) => ( */}
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
                </div>
            )}


        </div >
    );
};

export default ACIStock;
