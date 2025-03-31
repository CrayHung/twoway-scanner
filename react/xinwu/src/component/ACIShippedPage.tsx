import { formatMessage } from '@formatjs/intl';
import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


const ACIShippedPage = () => {
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const [allShippedData, setAllShippedData] = useState<any[]>([]);

    const { formatMessage } = useIntl();


    const [DateStart, setDateStart] = useState<Date | null>(null);
    const [DateEnd, setDateEnd] = useState<Date | null>(null);
    const [filteredShippedData, setFilteredShippedData] = useState<any[]>([]);


    const navigate = useNavigate();


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
                setAllShippedData(data);
                setFilteredShippedData(data);
            }
        } catch (error) {
            console.error("新增失敗:", error);
            return { success: false, message: error };
        }
    }


    useEffect(() => {
        fetchData();
    }, []);


    //篩選日期符合的資料
    useEffect(() => {
        // 沒有篩選條件時，顯示全部資料
        if (!DateStart && !DateEnd) {
            setFilteredShippedData(allShippedData);
            return;
        }

        let filteredData = allShippedData;
        // 當兩者都有選時，篩選 DateStart ~ DateEnd

        if (DateStart && DateEnd) {
            filteredData = filteredData.filter((item) => {
                const shippedTime = new Date(item.shippedTime);
                return shippedTime >= DateStart && shippedTime <= DateEnd;
            });
        }
        //只選開始日期 , 顯示 DateStart 到今天的資料
        else if (DateStart) {
            filteredData = filteredData.filter((item) => {
                const shippedTime = new Date(item.shippedTime);
                return shippedTime >= DateStart && shippedTime <= new Date();
            });
        }
        //只選結束日期 , 顯示 過往 到 DateEnd的資料
        else if (DateEnd) {
            filteredData = filteredData.filter((item) => {
                const shippedTime = new Date(item.shippedTime);
                return shippedTime <= DateEnd;
            });
        }
        setFilteredShippedData(filteredData);
    }, [DateStart, DateEnd, allShippedData]);

    //如果日期返空,則將資料顯示為全資料
    const resetFilteredData = () => {
        fetchData();
    };



    const routeBack = () => {
        navigate('/ACI/shipped/reload');
    }

    return (
        <div>
            {(filteredShippedData.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center', marginTop: '20px' }}> no data</p>
                    <Button onClick={routeBack}>back</Button>
                </>
            ) : (

                <>

                    <label>{formatMessage({ id: 'startdate' })}：</label>
                    <DatePicker
                        selectsStart
                        selected={DateStart}
                        onChange={(date) => setDateStart(date)}
                        startDate={DateStart}
                        portalId="root"
                    />
                    <label>{formatMessage({ id: 'enddate' })}：</label>
                    <DatePicker
                        selectsEnd
                        selected={DateEnd}
                        onChange={(date) => setDateEnd(date)}
                        endDate={DateEnd}
                        startDate={DateStart}
                        minDate={DateStart}
                        portalId="root"

                    />

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
                                        {filteredShippedData.map((row: any) => (
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
                </>
            ))}
        </div>

    );
}

export default ACIShippedPage;
