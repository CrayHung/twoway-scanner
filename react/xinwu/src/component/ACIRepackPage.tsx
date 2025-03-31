import { formatMessage } from '@formatjs/intl';
import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Typography, TextField, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
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
//將A~E轉換呈現
const formatInputMode = (mode: any) => {
    switch (mode) {
        case 'A':
            return 'QR_HS';
        case 'B':
            return 'QR_RFTray';
        case 'C':
            return 'QR_PS';
        case 'D':
            return (
                <>
                    QR_PS <br /> QR_HS
                </>
            );
        case 'E':
            return (
                <>
                    QR_PS <br /> QR_HS<br /> QR_RFTray
                </>
            );
        default:
            return mode; // 預設情況下返回原始值
    }
};


const ACIRepackPage = () => {
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const [allRepackData, setAllRepackData] = useState<any[]>([]);


    // const [selectedItems, setSelectedItems] = useState<{ [key: string]: { qrRftray: boolean, qrPs: boolean, qrHs: boolean } }>({});
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: { [key: string]: boolean } }>({});



    const { formatMessage } = useIntl();

    const fetchData = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-pack`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                alert("獲取 重工表格  失敗")
            }
            else {
                const data: any[] = await response.json();
                setAllRepackData(data)
            }
        } catch (error) {
            console.error("新增失敗:", error);
            return { success: false, message: error };
        }
    }


    useEffect(() => {
        fetchData();
    }, []);



    // 處理個別 checkbox 點擊
    // const handleCheckboxChange = (id: string, field: "qrRftray" | "qrPs" | "qrHs") => {
    const handleCheckboxChange = (id: string, field: string) => {
        /*
        selectedItems = {
            "101": { qrRftray: false, qrPs: true, qrHs: true },
            "102": { qrRftray: true, qrPs: false, qrHs: false }
          };
        */

        setSelectedItems(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: !prev[id]?.[field] // 切換選中狀態
            }
        }));
    };

    // 處理標題checkbox變更（全選/取消全選）
    const handleHeaderCheckboxChange = (field: string) => {
        // 檢查是否已經全部選取
        const allChecked = allRepackData.every((row) => selectedItems[row.id]?.[field]);

        // 更新所有行的checkbox
        const updatedSelectedItems = allRepackData.reduce((acc, row) => {
            acc[row.id] = {
                ...acc[row.id],
                [field]: !allChecked, // 反轉選取狀態
            };
            return acc;
        }, {} as { [key: string]: { [key: string]: boolean } });

        setSelectedItems(updatedSelectedItems);
    };



    const [openNewWorkOrder, setOpenNewWorkOrder] = useState(false);
    const handleModalClose = () => setOpenNewWorkOrder(false);
    const [selectedAciPartNumber, setSelectedAciPartNumber] = useState('');
    const [selectedWorkOrderNumber, setSelectedWorkOrderNumber] = useState('');
    const [selectedInputModel, setSelectedInputModel] = useState('');
    const [partTableData, setPartTableData] = useState<any[]>([]);
    const [selectedCartonQuantity, setSelectedCartonQuantity] = useState('');


    //fetch 料號對應表並渲染
    const fetchPart = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-input-modes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 料號對應表');
            }

            const data: any[] = await response.json();
            setPartTableData(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchPart();
    }, []);


    const handleAddNewWorkOrder = async () => {

    }

    return (
        <div>

            <Modal open={openNewWorkOrder} onClose={handleModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'newwork' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'workOrderNumber' })}
                                            value={selectedWorkOrderNumber}
                                            onChange={(e) => setSelectedWorkOrderNumber(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'aciPartNumber' })}
                                            value={selectedAciPartNumber}
                                            onChange={(e) => setSelectedAciPartNumber(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={10}>
                                <TextField
                                    select
                                    label={formatMessage({ id: 'part-shipping-model' })}
                                    value={selectedInputModel}
                                    onChange={(e) => setSelectedInputModel(e.target.value)}
                                    fullWidth

                                >

                                    {Array.from(new Set(partTableData.map((row: any) => row.inputMode))).map((uniqueMode, index) => (
                                        <MenuItem key={index} value={uniqueMode}>
                                            {index + 1}.{formatInputMode(uniqueMode)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'quantity' })}
                                            value={selectedCartonQuantity}
                                            onChange={(e) => setSelectedCartonQuantity(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleAddNewWorkOrder}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                </Box>
            </Modal>


            {(allRepackData.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>no data</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh",
                        overflow: "auto",
                    }}>

                    <Button variant="contained" color="success" onClick={() => { setOpenNewWorkOrder(true) }}>
                        新建工單
                    </Button>

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
                            <Table stickyHeader aria-label="sticky table"
                                style={{
                                    minWidth: '800px', // 最小寬度，確保資料過多時滾動
                                    tableLayout: 'auto',
                                }}>
                                <TableHead>
                                    <TableRow style={{ border: '1px solid #ccc' }}>
                                        <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'sn' })}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                onChange={() => handleHeaderCheckboxChange("qrRftray")}
                                                checked={allRepackData.every((row) => selectedItems[row.id]?.qrRftray)}
                                            />
                                            {formatMessage({ id: 'QR_RFTray' })}
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                onChange={() => handleHeaderCheckboxChange("qrPs")}
                                                checked={allRepackData.every((row) => selectedItems[row.id]?.qrPs)}
                                            />
                                            {formatMessage({ id: 'QR_PS' })}
                                        </TableCell>
                                        <TableCell>
                                        <Checkbox
                                                onChange={() => handleHeaderCheckboxChange("qrHs")}
                                                checked={allRepackData.every((row) => selectedItems[row.id]?.qrHs)}
                                            />
                                            {formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'repackTime' })}</TableCell>


                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allRepackData.map((row: any) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.sn}</TableCell>

                                            <TableCell>
                                                {row.qrRftray ? (
                                                    <>
                                                        <Checkbox
                                                            checked={!!selectedItems[row.id]?.qrRftray}
                                                            onChange={() => handleCheckboxChange(row.id, "qrRftray")}
                                                        />
                                                        {row.qrRftray}
                                                    </>
                                                ) : (
                                                    row.qrRftray
                                                )}


                                            </TableCell>
                                            <TableCell>
                                                {row.qrPs ? (
                                                    <>
                                                        <Checkbox
                                                            checked={!!selectedItems[row.id]?.qrPs}
                                                            onChange={() => handleCheckboxChange(row.id, "qrPs")}
                                                        />
                                                        {row.qrPs}
                                                    </>
                                                ) : (
                                                    row.qrPs
                                                )}

                                            </TableCell>
                                            <TableCell>
                                                {row.qrHs ? (
                                                    <>
                                                        <Checkbox
                                                            checked={!!selectedItems[row.id]?.qrHs}
                                                            onChange={() => handleCheckboxChange(row.id, "qrHs")}
                                                        />
                                                        {row.qrHs}
                                                    </>
                                                ) : (
                                                    row.qrHs
                                                )}

                                            </TableCell>
                                            <TableCell>{row.cartonName}</TableCell>
                                            <TableCell>{row.repackTime}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            ))}
        </div>
    );
}

export default ACIRepackPage;
