import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Backdrop, TextField } from '@mui/material';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ACICreatePallet = () => {
    const { formatMessage } = useIntl();
    const [open, setOpen] = useState(true); // 初初始為true , 一進來就開啟
    const [palletName, setPalletName] = useState('');
    const [maxBoxes, setMaxBoxes] = useState('');
    const [maxBoxesError, setMaxBoxesError] = useState('');

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間

    //渲染Table的資料
    const [allStockData, setAllStockData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any[]>([]);



    const { globalUrl } = useGlobalContext();
    
    useEffect(() => {
        if (allStockData.length > 0) {
            fetchPallet();
        }
    }, [allStockData]);

    const fetchPallet = async () => {
        try {
            const palletNames = allStockData.map(stock => stock.palletName);
            const uniquePalletNames = Array.from(new Set(palletNames)); // 避免重複請求

            console.log("palletNames : "+palletNames);
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


    const handleConfirm = async () => {
        if (!palletName || !maxBoxes) {
            alert("請填寫所有欄位");
            return;
        }

        //棧板數量需為正整數
        const number = parseInt(maxBoxes, 10);
        if (isNaN(number) || number <= 0) {
            setMaxBoxesError("請輸入大於 0 的正整數");
            return;
        }

        console.log("棧板名稱:", palletName);
        console.log("最大箱數:", maxBoxes);
        setOpen(false);

        // stock表要傳的
        const requestPostBody = { pallet_name: palletName, stock_time: dateTime };
        // pallet表 建立pallet資料
        // const palletData : any[] = [];
        // palletData.push({
        //         pallet_name: palletName,
        //         maxQuantity: maxBoxes,
        //         quantity: 0
        //     })


        const palletData = [
            {
                palletName: palletName,
                maxQuantity: maxBoxes,
                quantity: 0,

            }
        ];

        try {
            //將棧板加入到stock表 
            await fetch(`${globalUrl.url}/api/post-stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPostBody),
            });
            //將棧板加入到pallet表 
            await fetch(`${globalUrl.url}/api/post-pallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(palletData),
            });


            alert("更新成功");
            await fetchStock();
            await fetchPallet();

            console.log("操作成功，表格已更新");
        } catch (error) {
            console.error("操作失敗:", error);
            alert("操作失敗，請稍後再試");
        }

    };

    const handleMaxBoxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允許數字輸入
        if (/^\d*$/.test(value)) {
            setMaxBoxes(value);
            setMaxBoxesError('');
        }
    };

    return (
        <div style={{ display: "flex", gap: "16px" }}>
            <Modal
                open={open}
                onClose={() => {setOpen(false) }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        請輸入棧板資訊
                    </Typography>
                    <TextField
                        fullWidth
                        label="棧板名稱"
                        value={palletName}
                        onChange={(e) => setPalletName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="棧板最大箱數"
                        type="number"
                        value={maxBoxes}
                        onChange={handleMaxBoxesChange}
                        error={!!maxBoxesError}
                        helperText={maxBoxesError}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        disabled={!palletName || !maxBoxes}
                    >
                        確認
                    </Button>
                </Box>
            </Modal>

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
                                allStockData.map((row, rowIndex: number) => (
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


                <div style={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    overflowX: "auto",
                    border: "1px solid #ccc",
                }}>

                    <TableContainer component={Paper}>
                        <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow style={{ border: '1px solid #ccc' }}>

                                    <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'MaxQuantity' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'Quantity' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'Location1' })}</TableCell>


                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {palletData.map((row: any, rowIndex: number) => (
                                    <TableRow key={row.id}>

                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.palletName}</TableCell>
                                        <TableCell>{row.maxQuantity}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>{row.location}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>
        </div>
    );
};

export default ACICreatePallet;