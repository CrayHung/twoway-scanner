import { formatMessage } from '@formatjs/intl';
import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
const ACIShippedPage = () => {
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const [allShippedData, setAllShippedData] = useState<any[]>([]);
    const { formatMessage } = useIntl();

    const fetchData = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/shipped/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                alert("獲取 出貨表格  失敗")
            }
            else {
                const data: any[] = await response.json();
                setAllShippedData(data)
            }
        } catch (error) {
            console.error("新增失敗:", error);
            return { success: false, message: error };
        }
    }


useEffect(() => {
    fetchData();
}, []);


    return (
        <div>
            {(allShippedData.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}> no data</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh",
                        overflow: "auto",
                    }}>
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
                                    <TableCell>id</TableCell>
                                        <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'sn' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'shippedTime' })}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allShippedData.map((row: any) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.palletName}</TableCell>
                                            <TableCell>{row.cartonName}</TableCell>
                                            <TableCell>{row.sn}</TableCell>
                                            <TableCell>{row.qrRftray}</TableCell>
                                            <TableCell>{row.qrPs}</TableCell>
                                            <TableCell>{row.qrHs}</TableCell>
                                            <TableCell>{row.shippedTime}</TableCell>
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

export default ACIShippedPage;
