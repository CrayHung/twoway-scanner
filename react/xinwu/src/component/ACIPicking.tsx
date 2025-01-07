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

    //for palletName
    const [palletName, setPalletName] = useState('');
    const [palletDetails, setPalletDetails] = useState([]);



    //下載.xlxs
    const handleDownloadCustomerExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
        XLSX.writeFile(workbook, "AllData.xlsx");

    };

    //for 出貨
    const handleActionOne = async () => {
        alert("刪除" + selectedRows);
        alert("下載xlsx");

        const selectedData = showTableData.filter((row) => selectedRows.includes(row.id));
        alert("選擇的檔案內容是" + JSON.stringify(selectedData, null, 2));
        await setDataForDownload(selectedData);

        await handleDownloadCustomerExcel();

    };

    //for 合併
    const handleActionTwo = () => {
        setShowModal(true);
    };


    const handleCheckboxChange = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         const allIds = palletDetails.map((row) => row.id);
    //         setSelectedRows(allIds);
    //     } else {
    //         setSelectedRows([]);
    //     }
    // };



    const fetchData = async () => {
        setTableView(true);


        if (!palletName.trim()) {
            alert('請輸入有效的 Pallet Name');
            setTableView(false);
            return;
        }

        try {
            const response = await fetch(`${globalUrl.url}/api/get-pallet-details`, {
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
                console.error('無法取得 Pallet 資料:', response.statusText);
                setPalletDetails([]);
            }
        } catch (error) {
            console.error('Error fetching pallet details:', error);
            setPalletDetails([]);
        }
    };

    useEffect(() => {
        console.log(palletDetails);
    }, [palletDetails]);


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
                // <input type="text" onChange={fetchData} placeholder="掃描barcode" />

                <div style={{ marginBottom: '10px' }}>
                <label htmlFor="palletName">Pallet Name: </label>
                <input
                    type="text"
                    id="palletName"
                    value={palletName}
                    onChange={(e) => setPalletName(e.target.value)}
                    placeholder="輸入 Pallet Name"
                    style={{ padding: '5px', width: '250px' }}
                />
                <button
                    onClick={fetchData}
                    style={{
                        marginLeft: '10px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}
                >
                    查詢
                </button>
            </div>
            }

            {tableView && palletDetails.length > 0 && (
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
                                                selectedRows.length < palletDetails.length
                                            }
                                            checked={selectedRows.length === palletDetails.length}
                                            // onChange={handleSelectAll}
                                        />
                                    </TableCell>

                                    <TableCell>ID</TableCell>
                                    <TableCell>palletName</TableCell>
                                    <TableCell>workOrderNumber</TableCell>
                                    <TableCell>sn</TableCell>
                                    <TableCell>qrRftrayBedid</TableCell>
                                    <TableCell>qrPsBedid</TableCell>
                                    <TableCell>qrHsBedid</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {palletDetails.map((row: any) => (
                                    <TableRow key={row.id}>

                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleCheckboxChange(row.id)}
                                            />
                                        </TableCell>

                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.palletName}</TableCell>
                                        <TableCell>{row.workOrderNumber}</TableCell>
                                        <TableCell>{row.sn}</TableCell>
                                        <TableCell>{row.qrRftrayBedid}</TableCell>
                                        <TableCell>{row.qrPsBedid}</TableCell>
                                        <TableCell>{row.qrHsBedid || 'N/A'}</TableCell>
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
