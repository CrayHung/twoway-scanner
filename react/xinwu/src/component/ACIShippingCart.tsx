import { Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Table, Checkbox } from '@mui/material';
import React, { useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";

const ACIShippingCart = () => {

    const navigate = useNavigate();
    const { formatMessage } = useIntl();

    //記錄棧板中有多少紙箱資料
    const [cartonDetails, setCartonDetails] = useState<any[]>([]);
    //使用者用文字框搜尋紙箱
    const [carton, setCarton] = useState('');
    //for 選擇哪幾行的check box
    const [selectedRows, setSelectedRows] = useState<number[]>([]);



    /**紙箱input欄位,按下enter後可以將該筆carton的checkbox打勾 */
    const handleCheckBoxforCarton = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSelectedRows((prevSelected) => {
                // 找出符合 cartonName 的 row IDs
                const matchingRows = cartonDetails
                    .filter((row: any) => row.cartonName === carton)
                    .map((row: any) => row.id);

                // 如果所有符合的 row 都已被選取，則取消選取，否則選取它們
                const allSelected = matchingRows.every(id => prevSelected.includes(id));
                return allSelected
                    ? prevSelected.filter(id => !matchingRows.includes(id)) // 取消勾選
                    : [...prevSelected, ...matchingRows]; // 勾選
            });

            //清空input欄位
            setCarton('');
        }
    };
    //checkbox選擇單一行資料時
    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    //checkbox選擇所有資料時
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = cartonDetails.map((row) => row.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };



    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "auto",
            }}>

            {(cartonDetails.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>no data</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh",
                        overflow: "auto",
                    }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box>
                                <Button variant="outlined" color="secondary"  >
                                    {formatMessage({ id: 'ship' })}
                                </Button>
                            </Box>
              
                        </Box>
                    </div>
                    <>
                        <label>{formatMessage({ id: 'CartonNames' })}：</label>
                        <input
                            type="text"
                            value={carton}
                            onChange={(e) => setCarton(e.target.value)}
                            onKeyDown={handleCheckBoxforCarton}
                        />
                    </>
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

                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={
                                                    selectedRows.length > 0 &&
                                                    selectedRows.length < cartonDetails.length
                                                }
                                                checked={selectedRows.length === cartonDetails.length}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'sn' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                        <TableCell>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartonDetails.map((row: any) => (
                                        <TableRow key={row.id}>

                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedRows.includes(row.id)}
                                                    onChange={() => handleSelectRow(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.palletName}</TableCell>
                                            <TableCell>{row.cartonName}</TableCell>
                                            <TableCell>{row.sn}</TableCell>
                                            <TableCell>{row.qrRfTray}</TableCell>
                                            <TableCell>{row.qrPs}</TableCell>
                                            <TableCell>{row.qrHs}</TableCell>
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

export default ACIShippingCart;
