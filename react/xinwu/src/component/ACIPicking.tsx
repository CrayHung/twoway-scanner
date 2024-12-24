import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
import * as XLSX from 'xlsx';

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

const ACIPicking = () => {
    const { formatMessage } = useIntl();
    const { globalUrl } = useGlobalContext();
    const [tableView, setTableView] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const [showTableData, setShowTableData] = useState<any[]>([]);

    //for check box
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [dataForDownload, setDataForDownload] = useState<any[]>([]);

    //for modal 合併用
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);



    //下載.xlxs
    const handleDownloadCustomerExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
        XLSX.writeFile(workbook, "AllData.xlsx");

    };


    const handleActionOne = async () => {
        alert("刪除" + selectedRows);
        alert("下載xlsx");

        const selectedData = showTableData.filter((row) => selectedRows.includes(row.id));
        alert("選擇的檔案內容是" + JSON.stringify(selectedData, null, 2));
        await setDataForDownload(selectedData);

        await handleDownloadCustomerExcel();

    };

    const handleActionTwo = () => {
        setShowModal(true);
    };


    const handleCheckboxChange = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = showTableData.map((row) => row.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };



    const fetchData = async () => {
        setTableView(true);
        const requestBody = { QR_PS: [1] };



        try {
            const response = await fetch(`${globalUrl.url}/api/snfuzzy-search-details `, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Failed to get 所有對應表');
            }

            const data = await response.json();
            console.log(data);
            setShowTableData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        console.log(showTableData);
    }, [showTableData]);


    const handleConfirm = () => {
        alert("合併到:" + selectedWorkOrder);
        setShowModal(false);
    };

    return (

        <div>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 渲染 workOrderNumber 與 Radio */}
                            <Grid item xs={12}>
                                <RadioGroup
                                    value={selectedWorkOrder}
                                    onChange={(event) => setSelectedWorkOrder(event.target.value)}
                                >
                                    {/* 去除重複 */}
                                    {Array.from(new Map(showTableData.map((row: any) => [row.workOrderNumber, row])).values()).map((row: any) => (
                                        <FormControlLabel
                                            key={row.id}
                                            value={row.workOrderNumber}
                                            control={<Radio />}
                                            label={row.workOrderNumber}
                                        />
                                    ))}


                                    {/* {showTableData.map((row: any) => (
                                        <FormControlLabel
                                            key={row.id}
                                            value={row.workOrderNumber}
                                            control={<Radio />}
                                            label={row.workOrderNumber}
                                        />
                                    ))} */}
                                </RadioGroup>
                            </Grid>

                            {/* 確認按鈕 */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleConfirm}
                                    disabled={!selectedWorkOrder} // 當未選擇時禁用按鈕
                                >
                                    確認
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {!tableView &&
                <input type="text" onChange={fetchData} placeholder="掃描barcode" />
            }

            {tableView && showTableData.length > 0 && (
                <>
                    <div style={{ marginBottom: '10px' }}>
                        <Button variant="outlined" color="secondary" onClick={handleActionOne} >
                            出貨
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleActionTwo} style={{ marginLeft: '10px' }}>
                            合併
                        </Button>
                    </div>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>

                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selectedRows.length > 0 &&
                                                selectedRows.length < showTableData.length
                                            }
                                            checked={selectedRows.length === showTableData.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>

                                    <TableCell>ID</TableCell>
                                    <TableCell>Work Order Number</TableCell>
                                    <TableCell>QR_PS</TableCell>
                                    <TableCell>QR_HS</TableCell>
                                    <TableCell>QR_RF_TRAY</TableCell>
                                    <TableCell>Part Number</TableCell>
                                    <TableCell>Company</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showTableData.map((row: any) => (
                                    <TableRow key={row.id}>

                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleCheckboxChange(row.id)}
                                            />
                                        </TableCell>

                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.workOrderNumber}</TableCell>
                                        <TableCell>{row.QR_PS_BEDID}</TableCell>
                                        <TableCell>{row.QR_HS_BEDID}</TableCell>
                                        <TableCell>{row.QR_RFTray_BEDID}</TableCell>
                                        <TableCell>{row.partNumber}</TableCell>
                                        <TableCell>{row.company || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </div>
    );
};

export default ACIPicking;
