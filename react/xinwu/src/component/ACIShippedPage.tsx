import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { downloadBarcode } from './GenerateBarCode';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    // maxWidth: 1500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const ACIShippedPage = () => {
    const { formatMessage } = useIntl();
    const { table3Data } = useGlobalContext();

    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const [allShippedData, setAllShippedData] = useState<any[]>([]);


    // const [DateStart, setDateStart] = useState<Date | null>(null);
    // const [DateEnd, setDateEnd] = useState<Date | null>(null);

    //不用起始和結束的範圍 , 直接選擇一個日期做篩選資料
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [delivery, setDelivery] = useState("");
    const [customer, setCustomer] = useState("");


    //如果沒篩選日期,直接用點選的話
    const [selectedShippedDate, setSelectedShippedDate] = useState<string | null>(null);

    const [originalShippedData, setOriginalShippedData] = useState<any[]>([]);
    const [filteredShippedData, setFilteredShippedData] = useState<any[]>([]);

    //顯示單一時間(單一筆)出貨的資料
    const [modalShippedData, setModalShippedData] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);


    //分組資料
    const [groupedData, setGroupedData] = useState<{ [key: string]: any[] }>({});
    const [selectedGroup, setSelectedGroup] = useState<any[]>([]);



    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間




    const [typeASN_Number, setTypeASN_Number] = useState<string>('');
    const [typeshipping_date, setTypeshipping_date] = useState<string>(() => {
        const d = new Date().toISOString().slice(0, 10);
        return d;
    });
    const [typereceived_date, setTypereceived_date] = useState<string>(() => {
        const d = new Date().toISOString().slice(0, 10);
        return d;
    });
    const [typepurchase_order_number, setTypepurchase_order_number] = useState<string>('');

    const [typeshipping_company_contractor, setShipping_company_contractor] = useState<string>('RXO');
    const [typeTracking_Number, seTypeTracking_Number] = useState<string>('');


    const [showShipModal, setShowShipModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [autoCompleteValue, setAutoCompleteValue] = useState<string | null>(null);

    const [selectedCustomerPart, setSelectedCustomerPart] = useState('');
    const [customerData, setCustomerData] = useState<any[]>([]);


    const navigate = useNavigate();

    //以shippedTime分組的資料
    const fetchData = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/shipped/grouped`);
            if (!response.ok) {
                alert("獲取 出貨表格 失敗");
                return;
            }
            const data = await response.json();

            // 將 "yyyy-MM-dd HH:mm:ss" 轉為可被 Date 正確解析的格式
            const sortedData = data.sort((a: { shippedTime: string; }, b: { shippedTime: string; }) => {
                const dateA = new Date(a.shippedTime.replace(" ", "T")).getTime();
                const dateB = new Date(b.shippedTime.replace(" ", "T")).getTime();
                return dateB - dateA;
            });



            setOriginalShippedData(sortedData);
            setAllShippedData(sortedData);
            setFilteredShippedData(sortedData);

        } catch (error) {
            console.error("獲取失敗:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    //全部的資料
    // const fetchData = async () => {
    //     try {
    //         const response = await fetch(`${globalUrl.url}/api/shipped/all`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             alert("獲取 出貨表格  失敗")
    //         }
    //         else {
    //             const data: any[] = await response.json();
    //             setAllShippedData(data);
    //             setFilteredShippedData(data);
    //         }
    //     } catch (error) {
    //         console.error("新增失敗:", error);
    //         return { success: false, message: error };
    //     }
    // }

    useEffect(() => {
        fetch(`${globalUrl.url}/api/shipped/all`)
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc: any, item: any) => {
                    if (!acc[item.shippedTime]) acc[item.shippedTime] = [];
                    acc[item.shippedTime].push(item);
                    return acc;
                }, {});
                setGroupedData(grouped);
            });
    }, []);


    const handleOpenModal = (shippedTime: string) => {

        // const dateOnly = shippedTime.split(" ")[0]; // 取出 "2025-03-31"的字串
        // setSelectedShippedDate(dateOnly);

        const group = groupedData[shippedTime] || [];
        setModalShippedData(group);

        console.log("modalShippedData : ", JSON.stringify(modalShippedData, null, 2))

        setShowModal(true);
    };


    //篩選日期符合的資料 (此為使用起始和結束的版本...現在只選擇單一日期故不使用)
    // useEffect(() => {

    //     //取得當天最後時刻
    //     const getEndOfDay = (date: Date) => {
    //         const end = new Date(date);
    //         end.setHours(23, 59, 59, 999);
    //         return end;
    //     };

    //     let filteredData = originalShippedData;

    //     // 若無 DateStart 和 DateEnd，但有點選 row，則顯示該row當天的資料
    //     if (!DateStart && !DateEnd && selectedShippedDate) {
    //         filteredData = originalShippedData.filter((item) =>
    //             item.shippedTime.startsWith(selectedShippedDate)
    //         );
    //         setFilteredShippedData(filteredData);
    //         setAllShippedData(filteredData);
    //         return;
    //     }


    //     // 當兩者都有選時，篩選 DateStart ~ DateEnd

    //     if (DateStart && DateEnd) {
    //         const endOfDay = getEndOfDay(DateEnd);
    //         filteredData = filteredData.filter((item) => {
    //             const shippedTime = new Date(item.shippedTime);
    //             return shippedTime >= DateStart && shippedTime <= endOfDay;
    //         });
    //         //只有選DateStart時，篩選 DateStart ~ 今天
    //     } else if (DateStart) {
    //         filteredData = filteredData.filter((item) => {
    //             const shippedTime = new Date(item.shippedTime);
    //             return shippedTime >= DateStart && shippedTime <= new Date();
    //         });
    //         //只有選DateEnd時，篩選 過往資料 ~ DateEnd
    //     } else if (DateEnd) {
    //         const endOfDay = getEndOfDay(DateEnd);
    //         filteredData = filteredData.filter((item) => {
    //             const shippedTime = new Date(item.shippedTime);
    //             return shippedTime <= endOfDay;
    //         });
    //     }

    //     setFilteredShippedData(filteredData);
    //     setAllShippedData(filteredData);


    // }, [DateStart, DateEnd, selectedShippedDate, originalShippedData]);


    const handleApply = () => {
        const getStartOfDay = (date: Date) => {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            return start;
        };
        const getEndOfDay = (date: Date) => {
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            return end;
        };

        let filteredData = [...originalShippedData];

        // 日期篩選...比對shippedTime
        if (selectedDate) {
            const start = getStartOfDay(selectedDate);
            const end = getEndOfDay(selectedDate);

            filteredData = filteredData.filter((item) => {
                const shippedTime = new Date(item.shippedTime);
                return shippedTime >= start && shippedTime <= end;
            });
        }

        // Delivery 篩選,以逗號分隔...比對asnNumber
        if (delivery.trim() !== "") {

            const deliveryList = delivery
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c !== "");

       
            filteredData = filteredData.filter((item) =>
            deliveryList.includes(item.asnNumber)
        );

        }

        // Customer 篩選,以逗號分隔...比對cable_operator_known_material_id
        if (customer.trim() !== "") {
            const customerList = customer
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c !== "");

            filteredData = filteredData.filter((item) =>
                customerList.includes(item.cable_operator_known_material_id)
            );
        }

        setFilteredShippedData(filteredData);
        setAllShippedData(filteredData);
    };

    //改為按下Apply才進行渲染..故把這段註解調
    // useEffect(() => {
    //     if (!selectedDate && !selectedShippedDate) {
    //         setFilteredShippedData(originalShippedData);
    //         setAllShippedData(originalShippedData);
    //         return;
    //     }

    //     const getStartOfDay = (date: Date) => {
    //         const start = new Date(date);
    //         start.setHours(0, 0, 0, 0);
    //         return start;
    //     };

    //     const getEndOfDay = (date: Date) => {
    //         const end = new Date(date);
    //         end.setHours(23, 59, 59, 999);
    //         return end;
    //     };

    //     const dateToUse = selectedDate || (selectedShippedDate ? new Date(selectedShippedDate) : null);

    //     if (dateToUse) {
    //         const start = getStartOfDay(dateToUse);
    //         const end = getEndOfDay(dateToUse);

    //         const filteredData = originalShippedData.filter((item) => {
    //             const shippedTime = new Date(item.shippedTime);
    //             return shippedTime >= start && shippedTime <= end;
    //         });

    //         setFilteredShippedData(filteredData);
    //         setAllShippedData(filteredData);
    //     }

    // }, [selectedDate, selectedShippedDate, originalShippedData]);


    useEffect(() => {
        console.log("allShippedData : ", JSON.stringify(allShippedData, null, 2))
    }, [allShippedData])


    const routeBack = () => {
        navigate('/ACI/shipped/reload');

    }
    //下載.xlxs
    const handleDownloadCustomerExcel = (dataForDownload: any[]) => {

        const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
        XLSX.writeFile(workbook, `${dateTime}.xlsx`);

    };

    //改為直接導入ship表的資料來下載
    const downloadShip = async (data: any) => {



        const customerExcelData = data.map((row: {
            asnNumber: any;
            cable_operator_known_material_id: any;
            manufacture_batch_number_or_identifier: any;
            manufacture_country: any;
            manufacture_date: any;
            purchase_order_received_date: any;
            purchase_order_number: any;
            shipping_date: any;
            shipping_company_contractor: any;
            tracking_number: any;
            palletName: any; qrHs: any; qrPs: any; qrRftray: any;
        }) => ({

            ASN_Number: row.asnNumber,
            component_QR_code_syntax: row.qrRftray,
            housing_QR_code_syntax: row.qrHs,
            cable_operator_known_material_ID: row.cable_operator_known_material_id,

            manufacture_batch_number_or_identifier: row.manufacture_batch_number_or_identifier,
            manufacture_country: row.manufacture_country,
            manufacture_date: row.manufacture_date,
            purchase_order_received_date: row.purchase_order_received_date,
            purchase_order_number: row.purchase_order_number,
            shipping_date: row.shipping_date,
            shipping_company_contractor: row.shipping_company_contractor,
            tracking_number: row.tracking_number

        }));

        // console.log("要下載的檔案 customerExcelData :", JSON.stringify(customerExcelData, null, 2) );
        await handleDownloadCustomerExcel(customerExcelData ?? []);

    }



    // const downloadShip = async (data: any) => {



    //     if (!typeASN_Number || !typereceived_date || !selectedCustomerPart) {
    //         alert("請填寫所有必要欄位再下載");
    //         return;
    //     }


    //     const customerExcelData = data.map((row: { palletName: any; qrHs: any; qrPs: any; qrRftray: any; }) => ({
    //         ASN_Number: typeASN_Number,
    //         component_QR_code_syntax: row.qrRftray,
    //         housing_QR_code_syntax: row.qrHs,
    //         cable_operator_known_material_ID: selectedCustomerPart,   //帶入客戶料號

    //         manufacture_batch_number_or_identifier: row.palletName, //還不確定是什麼  先放棧板名稱
    //         manufacture_country: "Taiwan",
    //         manufacture_date: today,    //建立日期?
    //         purchase_order_received_date: typereceived_date,
    //         purchase_order_number: typepurchase_order_number,
    //         shipping_date: typeshipping_date,
    //         shipping_company_contractor: typeshipping_company_contractor,
    //         tracking_number: typeTracking_Number
    //     }));

    //     // console.log("要下載的檔案 customerExcelData :", JSON.stringify(customerExcelData, null, 2) );
    //     await handleDownloadCustomerExcel(customerExcelData ?? []);

    // }




    //渲染下拉式顧客選單
    const handleSelectChange = (event: any) => {
        setSelectedCustomer(event.target.value);
    };

    //當選擇客戶名稱改變 , 就改變selectedCustomerPart , 並將selectedCustomerPart加入倒excel裡面
    useEffect(() => {
        if (selectedCustomer) {
            const matched = customerData.find(
                (c) => c.customerName.toLowerCase() === selectedCustomer.toLowerCase()
            );
            if (matched) {
                setSelectedCustomerPart(matched.customerPartNumber);
            }
        }
    }, [selectedCustomer]);

    const handleConfirm = () => {
        const matchedCustomer = customerData.find(
            (customer) => customer.customerName.toLowerCase() === inputValue.trim().toLowerCase()
        );

        if (matchedCustomer) {
            setSelectedCustomer(matchedCustomer.customerName);
            setAutoCompleteValue(matchedCustomer.customerName);
        }

        setInputValue('');
    };

    const fetchAciCustomer = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-customerTable`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();

                setCustomerData(data);
                console.log("customer : ", JSON.stringify(data, null, 2))

            } else {
                console.error('無法取得 customer 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    useEffect(() => {
        fetchAciCustomer();
    }, []);


    return (
        <div>
            {(allShippedData.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center', marginTop: '20px' }}> no data</p>
                    <Button onClick={routeBack}>back</Button>
                </>
            ) : (

                <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md text-center">
                    {/* 確認出貨前要讓使用者填入一些必要訊息 , 
            typeASN_Number 
            received Date
            selectedCustomer
            typeshipping_date
            typeshipping_company_contractor
            **Tracking Number
  
            */}

                    {/* 原本下載要再輸入一次typeASN_Number 
                        received Date
                        selectedCustomer
                        typeshipping_date
                        typeshipping_company_contractor
                        **Tracking Number...等欄位 , 現在改用直接帶入ship表的資料 
                    */}
                    {/* <Modal open={showShipModal} onClose={() => setShowShipModal(false)}>
                        <Box sx={modalStyle}>
                            <form>
                                <Grid container spacing={2}>

                        
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 ASN_Number"
                                            variant="outlined"
                                            value={typeASN_Number}
                                            onChange={(event) => setTypeASN_Number(event.target.value)}
                                        />
                                    </Grid>

                             
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 purchase_order_number"
                                            variant="outlined"
                                            value={typepurchase_order_number}
                                            onChange={(event) => setTypepurchase_order_number(event.target.value)}
                                        />
                                    </Grid>

                             
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 received_date"
                                            variant="outlined"
                                            type="date"
                                            value={typereceived_date}
                                            onChange={(event) => setTypereceived_date(event.target.value)}
                                            InputLabelProps={{ shrink: true }} 
                                        />
                                    </Grid>



                                 
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 shipping_date"
                                            variant="outlined"
                                            type="date"
                                            value={typeshipping_date}
                                            onChange={(event) => setTypeshipping_date(event.target.value)}
                                            InputLabelProps={{ shrink: true }} 
                                        />
                                    </Grid>

                            
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 shipping_company_contractor"
                                            variant="outlined"
                                            value={typeshipping_company_contractor}
                                            onChange={(event) => setShipping_company_contractor(event.target.value)}
                                            onClick={(event) => setShipping_company_contractor('')}
                                        />
                                    </Grid>

                                
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="輸入 Tracking Number"
                                            variant="outlined"
                                            value={typeTracking_Number}
                                            onChange={(event) => seTypeTracking_Number(event.target.value)}
                                            onClick={() => seTypeTracking_Number('')}
                                        />
                                    </Grid>


                  
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                     
                                            <FormControl style={{ minWidth: 200 }}>
                                                <InputLabel id="customer-select-label">選擇客戶</InputLabel>
                                                <Select
                                                    labelId="customer-select-label"
                                                    value={selectedCustomer}
                                                    onChange={handleSelectChange}
                                                    label="選擇客戶"
                                                >
                                                    {customerData.map((customer) => (
                                                        <MenuItem key={customer.id} value={customer.customerName}>
                                                            {customer.customerName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                             
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Autocomplete
                                                    freeSolo
                                                    value={autoCompleteValue}
                                                    onChange={(event, newValue) => {
                                                        setAutoCompleteValue(newValue);
                                                        if (typeof newValue === 'string') {
                                                            const matched = customerData.find(
                                                                (c) => c.customerName.toLowerCase() === newValue.toLowerCase()
                                                            );
                                                            if (matched) {
                                                                setSelectedCustomer(matched.customerName);
                                                            }
                                                        }
                                                    }}
                                                    inputValue={inputValue}
                                                    onInputChange={(event, newInputValue) => {
                                                        setInputValue(newInputValue);
                                                    }}
                                                    options={customerData.map((customer) => customer.customerName)}
                                                    filterOptions={(options, state) =>
                                                        options.filter((option) =>
                                                            option.toLowerCase().includes(state.inputValue.toLowerCase())
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="輸入客戶名稱"
                                                            variant="outlined"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleConfirm();
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    style={{ width: 200 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleConfirm}
                                                >
                                                    確認
                                                </Button>
                                            </Box>
                                        </Box>


                                    </Grid>


                       
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => downloadShip(modalShippedData)}
                                            disabled={!typeASN_Number || !typeshipping_date || !typeshipping_company_contractor || !selectedCustomer}
                                        >
                                            {formatMessage({ id: 'confirm' })}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Modal> */}

                    <Modal open={showModal} onClose={() => setShowModal(false)}>

                        <Box sx={modalStyle}>
                            {/* <Paper style={{ flex: 1, overflowX: "auto" }}> */}
                            <h2>出貨時間：{modalShippedData[0]?.shippedTime}</h2>

                            <Box display="flex" justifyContent="flex-end" mb={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // onClick={() => setShowShipModal(true)}  
                                    onClick={() => downloadShip(modalShippedData)}

                                >
                                    Download excel
                                </Button>
                            </Box>


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
                                        // minWidth: '800px', // 最小寬度，確保資料過多時滾動
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

                                            <TableCell>ASN_Number</TableCell>



                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* {filteredShippedData.map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.palletName}</TableCell>
                                                <TableCell>{row.cartonName}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.qrRftray}</TableCell>
                                                <TableCell>{row.qrPs}</TableCell>
                                                <TableCell>{row.qrHs}</TableCell>
                                                <TableCell>{row.shippedTime}</TableCell>
                                            </TableRow> */}

                                        {modalShippedData.map((row: any) => (
                                            <TableRow key={row.id} onClick={() => handleOpenModal(row.shippedTime)} style={{ cursor: 'pointer' }}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.palletName}</TableCell>
                                                <TableCell>{row.cartonName}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.qrRftray}</TableCell>
                                                <TableCell>{row.qrPs}</TableCell>
                                                <TableCell>{row.qrHs}</TableCell>
                                                <TableCell>{row.shippedTime}</TableCell>

                                                <TableCell>{row.asnNumber}</TableCell>


                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </TableContainer>
                            {/* </Paper> */}
                        </Box>
                    </Modal>

                    {/* 不用起始和結束的範圍 , 直接選擇一個日期做篩選資料 */}
                    {/* <label>{formatMessage({ id: 'startdate' })}：</label>
                    <DatePicker
                        selectsStart
                        selected={DateStart}
                        onChange={(date) => setDateStart(date)}
                        startDate={DateStart}
                        portalId="root"
                        inline
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
                        inline                          
                    /> */}



                    <h2 className="text-xl font-semibold mb-4">已出貨的歷史清單</h2>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                        // inline
                        />
                    </div>
                    <div className="flex justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block font-medium mb-1">Delivery(比對asnNumber)</label>
                            <input
                                type="text"
                                value={delivery}
                                onChange={(e) => setDelivery(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                        </div>


                        <div className="flex-1">
                            <label className="block font-medium mb-1">Customer(比對cable_operator_known_material_id)</label>
                            <input
                                type="text"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button className="bg-green-300 hover:bg-green-400 text-green-900 font-semibold py-2 rounded" onClick={handleApply}>
                            Apply
                        </button>
                        <button className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold py-2 rounded"  onClick={() => downloadShip(filteredShippedData)}>
                            Download
                        </button>
                    </div>

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
                                    overflowY: "auto",
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
                                            {/* <TableCell>id</TableCell>
                                            <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'sn' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_HS' })}</TableCell> */}
                                            <TableCell>{formatMessage({ id: 'shippedTime' })}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allShippedData.map((row: any) => (
                                            <TableRow key={row.id}>
                                                {/* <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.palletName}</TableCell>
                                                <TableCell>{row.cartonName}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.qrRftray}</TableCell>
                                                <TableCell>{row.qrPs}</TableCell>
                                                <TableCell>{row.qrHs}</TableCell> */}
                                                <TableCell onClick={() => handleOpenModal(row.shippedTime)} style={{ cursor: "pointer", color: "blue" }}>{row.shippedTime}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
            ))}
        </div>

    );
}

export default ACIShippedPage;
