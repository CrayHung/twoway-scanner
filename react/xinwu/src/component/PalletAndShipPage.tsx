import React, { useEffect, useState, useMemo } from 'react';
import { IconButton, Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, ToggleButton, ToggleButtonGroup, Typography, FormControlLabel, Radio, RadioGroup, Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Collapse, List, ListItem, ListItemButton } from '@mui/material';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { downloadBarcode } from './GenerateBarCode';

const PalletAndShipPage = () => {

    const navigate = useNavigate();
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const [allPalletAndShipData, setAllPalletAndShipData] = useState<any[]>([]);

    const [allPalletData, setAllPalletData] = useState<any[]>([]);

    const fetchAllPalletData = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-pallet`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                //篩選出 只有尚未組合為ship出貨的pallet
                const filterData = data.filter((item: any) => item.shipId === null);

                await setAllPalletData(filterData);
                console.log("返回的 allPallet filterData : ", JSON.stringify(filterData, null, 2))

            } else {
                console.error('無法取得 allPallet 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching allPallet details:', error);
        }

    }

    const fetchAllPalletAndShipData = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-ship-pallets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const filterData = data.filter((item: any) => item.palletName !== null);

                await setAllPalletAndShipData(filterData);
                console.log("返回的 allPalletAndShipData filterData : ", JSON.stringify(filterData, null, 2))

            } else {
                console.error('無法取得 allPalletAndShipData 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching allPalletAndShipData details:', error);
        }
    };



    const fetchAddPalletInShipId = async (palletName: string) => {
        console.log('即將送出的:', { shipId: selectedShipId, palletNames: palletName });



        try {
            //將palletNames加入到指定的ship
            const response = await fetch(`${globalUrl.url}/api/update-ship-pallets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shipId: selectedShipId,
                    palletNames: palletName
                }),
            });

            console.log("呼叫 update-shipId:", {
                shipId: selectedShipId,
                pallet_name: palletName
            });

            //將新加入ship的棧板的shipId更改
            const secondResponse = await fetch(`${globalUrl.url}/api/update-shipId`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shipId: selectedShipId,
                    pallet_name: palletName
                }),
            });

            if (secondResponse.ok) {
                const secondResult = await secondResponse.json();
            } else {
                console.error("第二個API失敗:", secondResponse.status, await secondResponse.text());
            }

            const firstResponse = await response;   // 等待 fetch 完成
            if (firstResponse.ok) {
                const data = await firstResponse.json();
                const filterData = data.filter((item: { palletName: null; }) => item.palletName !== null);
                await setAllPalletAndShipData(filterData);
                // console.log("返回的 allPalletAndShipData filterData : ", JSON.stringify(filterData, null, 2))



            } else {
                console.log('無法取得 allPalletAndShipData 資料:', response);
            }

            handleCloseModal();

            //產生ship圖檔
            downloadBarcode(selectedShipId);

            setSelectedShipId('');



        } catch (error) {
            console.log('Error fetching allPalletAndShipData details:', error);
            handleCloseModal();
        }
    };




    const routeBack = () => {
        navigate('/palletAndShipPage/reload');

    }

    useEffect(() => {
        fetchAllPalletAndShipData();
    }, [])

    useEffect(() => {
        fetchAllPalletData();
    }, [])




    /**
     * 
     */

    const [openModal, setOpenModal] = useState(false);
    const [selectedShipId, setSelectedShipId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');


    const handleOpenModal = (shipId: any) => {
        setSelectedShipId(shipId);
        setSearchTerm('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {

        fetchAllPalletData();
        fetchAllPalletAndShipData();
        setOpenModal(false);
        setSelectedShipId('');
    };



    const filteredPallets = allPalletData.filter(pallet =>
        pallet.palletName.toLowerCase().includes(searchTerm.toLowerCase())
    );



    /** */
    const [openPalletModal, setOpenPalletModal] = useState(false);
    const [selectedPalletName, setSelectedPalletName] = useState('');
    const [palletDetails, setPalletDetails] = useState(null);

    const handlePalletClick = async (palletName: React.SetStateAction<string>) => {
        setSelectedPalletName(palletName);
        setOpenPalletModal(true);

        try {
            const response = await fetch(`${globalUrl.url}/api/get-pallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: palletName }),
            });

            if (response.ok) {
                const data = await response.json();
                setPalletDetails(data);
            } else {
                console.error('取得 pallet 詳細失敗:', response.status, await response.text());
                setPalletDetails(null);
            }
        } catch (error) {
            console.error('API 錯誤:', error);
            setPalletDetails(null);
        }
    };


    /**
     * 處理toggleButton
     */

    const [viewMode, setViewMode] = useState<'withShip' | 'onlyPallet'>('withShip');
    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'withShip' | 'onlyPallet' | null) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };



    return (
        <div>
            {(allPalletAndShipData.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center', marginTop: '20px' }}> no data</p>
                    <Button onClick={routeBack}>back</Button>
                </>
            ) : (
                <>
                    <Modal open={openModal} onClose={handleCloseModal}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
                            <h3>添加 Pallet 到 {selectedShipId}</h3>
                            <TextField
                                fullWidth
                                placeholder="搜尋 pallet"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                {filteredPallets.map((pallet, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton onClick={() => fetchAddPalletInShipId(pallet.palletName)}>
                                            {pallet.palletName}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                {filteredPallets.length === 0 && <ListItem>無符合資料</ListItem>}
                            </List>
                        </Box>
                    </Modal>


                    {/* 顯示pallet detail */}
                    <Modal open={openPalletModal} onClose={() => setOpenPalletModal(false)}>
                        <div style={{ background: '#fff', padding: '20px', maxWidth: '80%', margin: '5% auto', borderRadius: '8px' }}>
                            <h3>Pallet: {selectedPalletName}</h3>

                            {palletDetails ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(palletDetails).map((key, index) => (
                                                <TableCell key={index} style={{ fontWeight: 'bold' }}>
                                                    {key}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {Object.values(palletDetails).map((value, index) => (
                                                <TableCell key={index}>
                                                    {String(value)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : (
                                <p>載入中或沒有資料</p>
                            )}
                        </div>
                    </Modal>



                    <Box p={2} sx={{ height: '90vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={handleViewModeChange}
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton value="withShip">ship 出貨資料</ToggleButton>
                            <ToggleButton value="onlyPallet">pallet 出貨資料</ToggleButton>
                        </ToggleButtonGroup>


                        <TableContainer component={Paper} sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ship_id</TableCell>
                                        {viewMode === 'withShip' ? (
                                            <>
                                                <TableCell>pallet_names</TableCell>
                                                <TableCell>生產時間</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>pallet_name</TableCell>
                                                <TableCell>maxQuantity</TableCell>
                                                <TableCell>quantity</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {viewMode === 'withShip'
                                        ? allPalletAndShipData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                <TableCell
                                                    style={{ cursor: 'pointer', color: 'blue' }}
                                                    onClick={() => handleOpenModal(row.shipId)}
                                                >
                                                    {row.shipId}
                                                </TableCell>
                                                <TableCell>
                                                    {row.palletNames
                                                        ? row.palletNames.split(',').map((name: string, index: number) => (
                                                            <div
                                                                key={index}
                                                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                                onClick={() => handlePalletClick(name)}
                                                            >
                                                                {name}
                                                            </div>
                                                        ))
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>{row.storageTime || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                        : allPalletData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                <TableCell>null</TableCell>
                                                <TableCell>
                                                    <span
                                                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                        onClick={() => handlePalletClick(row.palletName)}
                                                    >
                                                        {row.palletName}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{row.maxQuantity }</TableCell>
                                                <TableCell>{row.quantity }</TableCell>
                                                
                                            </TableRow>
                                        ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Box>


                </>
            ))
            }
        </div >

    );
}

export default PalletAndShipPage;
