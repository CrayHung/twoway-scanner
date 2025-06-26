import { IconButton, Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, ToggleButton, ToggleButtonGroup, Typography, FormControlLabel, Radio, RadioGroup, Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Collapse } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";


type StockItem = {
    id: number;
    palletName: string;
    stockTime: string;
    shipId?: string;
};


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};


const ACIShipHistoryPage = () => {

    const { formatMessage } = useIntl();
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const navigate = useNavigate();


    const [allStockData, setAllStockData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any[]>([]);


    ///////////////////////////////////////////////////////////

    const [mode, setMode] = useState<'ship' | 'pallet'>('ship');
    const [openShips, setOpenShips] = useState<Set<string>>(new Set());

    const handleToggleShip = (shipId: string) => {
        const newSet = new Set(openShips);
        if (newSet.has(shipId)) {
            newSet.delete(shipId);
        } else {
            newSet.add(shipId);
        }
        setOpenShips(newSet);
    };

    const handleModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newMode: 'ship' | 'pallet' | null
    ) => {
        if (newMode) {
            setMode(newMode);
            setOpenShips(new Set());
        }
    };

    const groupByShip = () => {
        const groups = new Map<string, StockItem[]>();
        const unGrouped: StockItem[] = [];

        allStockData.forEach(item => {
            if (item.shipId) {
                if (!groups.has(item.shipId)) {
                    groups.set(item.shipId, []);
                }
                groups.get(item.shipId)!.push(item);
            } else {
                unGrouped.push(item);
            }
        });

        return { groups, unGrouped };
    };

    const { groups, unGrouped } = groupByShip();

    ////////////////////////////////////////////////

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
                await setAllStockData(filterData);
                console.log("返回的stock filterData : ", JSON.stringify(filterData, null, 2))

                await fetchPallet();
            } else {
                console.error('無法取得 stock 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };


    const fetchPallet = async () => {
        try {

            console.log("allStockData :", JSON.stringify(allStockData, null, 2))
            const palletNames = allStockData.map(stock => stock.palletName);
            console.log("palletNames : ", JSON.stringify(palletNames, null, 2))
            const uniquePalletNames = Array.from(new Set(palletNames)); // 避免重複請求

            // console.log("palletNames : "+palletNames);
            console.log("uniquePalletNames : ", JSON.stringify(uniquePalletNames, null, 2));
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





    useEffect(() => {
        if (allStockData.length > 0) {
            fetchPallet();
        }
    }, [allStockData]);

    //一進入程式 , 先獲取所有入庫的資料 , 分為 1.ship  2.pallet
    useEffect(() => {
        fetchStock();
    }, [])

    //


    const routeBack = () => {
        navigate('/ACI/shipHistoryPage/reload');

    }


    return (
        <div>
            {(palletData.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center', marginTop: '20px' }}> no data</p>
                    <Button onClick={routeBack}>back</Button>
                </>
            ) : (

                <>

                    <Box p={2} sx={{ height: '90vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                        <ToggleButtonGroup
                            value={mode}
                            exclusive
                            onChange={handleModeChange}
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton value="ship">Ship 入庫</ToggleButton>
                            <ToggleButton value="pallet">Pallet 入庫</ToggleButton>
                        </ToggleButtonGroup>

                        <TableContainer component={Paper} sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>項目</TableCell>
                                        <TableCell>Pallet 名稱</TableCell>
                                        <TableCell>入庫時間</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mode === 'ship' ? (
                                        <>
                                            {(() => {
                                                const grouped: { [shipId: string]: StockItem[] } = {};
                                                allStockData.forEach((item) => {
                                                    const key = item.shipId || '單一pallet入庫';
                                                    if (!grouped[key]) {
                                                        grouped[key] = [];
                                                    }
                                                    grouped[key].push(item);
                                                });

                                                const rows: JSX.Element[] = [];

                                                Object.keys(grouped).forEach((shipId) => {
                                                    const pallets = grouped[shipId];

                                                    rows.push(
                                                        <TableRow key={`ship-${shipId}`} sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell>
                                                                <button
                                                                    onClick={() => handleToggleShip(shipId)}
                                                                    style={{
                                                                        border: 'none',
                                                                        background: 'none',
                                                                        cursor: 'pointer',
                                                                        fontSize: '1rem',
                                                                        marginRight: '8px',
                                                                    }}
                                                                >
                                                                    {openShips.has(shipId) ? '▼' : '▶'}
                                                                </button>
                                                                <strong>{shipId}</strong>
                                                            </TableCell>
                                                            <TableCell colSpan={2}>共 {pallets.length} 個 Pallet</TableCell>
                                                        </TableRow>
                                                    );

                                                    if (openShips.has(shipId)) {
                                                        pallets.forEach((pallet) => {
                                                            rows.push(
                                                                <TableRow key={`pallet-${pallet.id}`}>
                                                                    <TableCell></TableCell>
                                                                    <TableCell>{pallet.palletName}</TableCell>
                                                                    <TableCell>{pallet.stockTime}</TableCell>
                                                                </TableRow>
                                                            );
                                                        });
                                                    }
                                                });

                                                return rows;
                                            })()}
                                        </>
                                    ) : (
                                        <>
                                            {allStockData
                                                .filter((item) => !item.shipId) // 只保留沒有 shipId 的 pallet
                                                .map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.shipId || '未分類'}</TableCell>
                                                        <TableCell>{item.palletName}</TableCell>
                                                        <TableCell>{item.stockTime}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>


                </>
            ))}
        </div>

    );
}

export default ACIShipHistoryPage;
