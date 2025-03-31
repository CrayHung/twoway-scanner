import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Button, Grid, IconButton, MenuItem, Modal, TextField, Typography, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
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


const ACICustomerPage = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, workNo, setWorkNo, part, setPart, quant, setQuant } = useGlobalContext();
    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)


    const [allCustomerData, setAllCustomerData] = useState<any[]>([]);
    const [partTableData, setPartTableData] = useState<any[]>([]);
    const [aciPartNumber, setAciPartNumber] = useState<any[]>([]);


    const [selectedAciPartNumber, setSelectedAciPartNumber] = useState('');
    const [selectedCustomerPartNumber, setSelectedCustomerPartNumber] = useState('');
    const [selectedCustomerName, setSelectedCustomerName] = useState('');


    const [editPart, setEditPart] = useState({
        id: "",
        aciPartNumber: "",
        customerPartNumber: "",
        customerName: "",
        inputMode: ""
    });


    //用來記錄表單是否有必填欄位沒有填
    const [errors, setErrors] = useState<{ partNumber?: string; aciPartNumber?: string; inputMode?: string; numberPerPallet?: string }>({});
    //新增表單
    const [openAddForm, setOpenAddForm] = useState(false);
    const handleAddClose = () => setOpenAddForm(false);

    //fetch 料號對應表並渲染
    const fetchPartTable = async () => {
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
        fetchPartTable();
    }, []);

    //fetch 客戶對應表並渲染
    const fetchAll = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-customerTable`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 料號對應表');
            }

            const data: any[] = await response.json();
            setAllCustomerData(data);


        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchAll();
    }, []);

    //編輯單筆料號
    const [openEditForm, setOpenEditForm] = useState(false);
    const handleEditClose = () => setOpenEditForm(false);
    const handleEdit = (rowData: any) => {
        setEditPart({
            id: rowData.id,
            aciPartNumber: rowData.aciPartNumber,
            customerPartNumber: rowData.customerPartNumber,
            customerName: rowData.customerName,
            inputMode: rowData.inputMode
        });

        setOpenEditForm(true);
    }
    const handleAciPartNmberChange = (selectedAciPartNumber: any) => {
        setEditPart({
            ...editPart,
            aciPartNumber: selectedAciPartNumber
        });
    };
    const handleCustomPartNumberChange = (selectedCustomPartNumber: any) => {
        setEditPart({
            ...editPart,
            customerPartNumber: selectedCustomPartNumber
        });
    };
    const handleEditCustomerNameChange = (name: any) => {
        setEditPart({
            ...editPart,
            customerName: name
        });
    };

    //更新資料
    const saveChanges = async () => {

        try {
            const response = await fetch(`${globalUrl.url}/api/put-acipart/${editPart.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    aciPartNumber: editPart.aciPartNumber,
                    customerPartNumber: editPart.customerPartNumber,
                    customerName: editPart.customerName,
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('更新成功:', result);
                setOpenEditForm(false);
                fetchAll();

            } else {
                console.error('更新失敗:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    }


    // delete
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const handleDeleteClose = () => setOpenDeleteForm(false);
    const [deletePart, setDeletePart] = useState({
        id: "",
        aciPartNumber: ""
    });
    const handleDeleteClick = (row: any) => {
        setDeletePart(row);
        setOpenDeleteForm(true);
    };
    const handleDeleteConfirm = async () => {

        const deleteId = deletePart.id;
        try {
            const response = await fetch(`${globalUrl.url}/api/del-acipart/${deleteId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                console.log('刪除成功:');
                setOpenDeleteForm(false);
                fetchAll();

            } else {
                console.error('更新失敗:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const handleInputChange = (field: 'aciPartNumber' | 'customerPartNumber' | 'customerName', value: string) => {
        if (field === 'aciPartNumber') {
            setSelectedAciPartNumber(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                aciPartNumber: value.trim() ? undefined : '必填',
            }));
        } else if (field === 'customerPartNumber') {
            setSelectedCustomerPartNumber(value)
            setErrors((prevErrors) => ({
                ...prevErrors,
                customerPartNumber: value.trim() ? undefined : '必填'
            }));
        } else if (field === 'customerName') {
            setSelectedCustomerName(value)
            setErrors((prevErrors) => ({
                ...prevErrors,
                customerName: value.trim() ? undefined : '必填'
            }));
        }
    };

    //新增
    const handleAddPart = async () => {

        let newErrors: { aciPartNumber?: string; customerPartNumber?: string; customerName?: string; } = {};

        if (!selectedAciPartNumber.trim()) {
            newErrors.aciPartNumber = formatMessage({ id: 'required-field' });
        }
        if (!selectedCustomerPartNumber.trim()) {
            newErrors.customerPartNumber = formatMessage({ id: 'required-field' });
        }
        if (!selectedCustomerName.trim()) {
            newErrors.customerName = formatMessage({ id: 'required-field' });
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 如果通過驗證，則執行提交邏輯
        console.log('表單提交', { selectedAciPartNumber,selectedCustomerPartNumber,  selectedCustomerName });
        setErrors({});


        //根據selectedAciPartNumber比對partTableData
        //將相同的內容的partTableData.inputMode設定到此
        const newData = {
            aciPartNumber: selectedAciPartNumber,
            customerPartNumber: selectedCustomerPartNumber,
            customerName: selectedCustomerName,
            inputMode: partTableData.find(item => item.aciPartNumber === selectedAciPartNumber)?.inputMode || ""
        };


        try {
            const response = await fetch(`${globalUrl.url}/api/post-customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error('Failed to 新增料號');
            }
            setOpenAddForm(false);
            fetchAll();


        } catch (error) {
            console.error('Error fetching :', error);
        }

    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "auto",
            }}>

            <Modal open={openAddForm} onClose={handleAddClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'add-customer' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            {/* ACI */}
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <FormControl fullWidth margin="normal" error={!!errors.aciPartNumber}>
                                            <InputLabel>{formatMessage({ id: 'aciPartNumber' })}</InputLabel>
                                            <Select
                                                value={selectedAciPartNumber || ''} // 確保初始值存在
                                                onChange={(e) => handleInputChange('aciPartNumber', e.target.value)}
                                            >
                                                {partTableData.map((part) => (
                                                    <MenuItem key={part.aciPartNumber} value={part.aciPartNumber}>
                                                        {part.aciPartNumber}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.aciPartNumber && <FormHelperText>{errors.aciPartNumber}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'customerPartNumber' })}
                                            value={selectedCustomerPartNumber}
                                            // onChange={(e) => setSelectedCustomerPartNumber(e.target.value)}
                                            onChange={(e) => handleInputChange('customerPartNumber', e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'customerName' })}
                                            value={selectedCustomerName}
                                            // onChange={(e) => setSelectedCustomerName(e.target.value)}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>




                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleAddPart}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            <Modal open={openEditForm} onClose={handleEditClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'edit' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>{formatMessage({ id: 'aciPartNumber' })}</InputLabel>
                                        <Select
                                            // value={editPart.aciPartNumber}
                                            value={editPart.aciPartNumber || ''} // 確保初始值存在
                                            onChange={(e) => handleAciPartNmberChange(e.target.value)}
                                        >
                                            {partTableData.map((part) => (
                                                <MenuItem key={part.aciPartNumber} value={part.aciPartNumber}>
                                                    {part.aciPartNumber}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>




                            {/* ACI */}


                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'customPartNumber' })}
                                            value={editPart.customerPartNumber}
                                            onChange={(e) => handleCustomPartNumberChange(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'part' })}
                                            value={editPart.customerName}
                                            onChange={(e) => handleEditCustomerNameChange(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>





                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={saveChanges}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            <Modal open={openDeleteForm} onClose={handleDeleteClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'id' })}
                    </Typography>
                    <Typography>
                        {formatMessage({ id: 'aciPartNumber' })}: {deletePart.aciPartNumber}
                    </Typography>

                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={4}>
                            <Button variant="contained" color="primary" fullWidth onClick={handleDeleteConfirm}>
                                {formatMessage({ id: 'submit' })}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Modal>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Button variant="contained" onClick={() => { setOpenAddForm(true) }}>
                    {formatMessage({ id: 'add-customer' })}
                </Button>


            </Box>


            <Paper sx={{ width: '100%', height: '90%', overflow: 'hidden' }}>
                {/* <TableContainer component={Paper} style={{ height: 'calc(100vh - 110px)', overflow: 'auto' }}> */}

                {/* <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}> */}
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
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow style={{ border: '1px solid #ccc' }}>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'aciPartNumber' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'customerPartNumber' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'customerName' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'inputMode' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'deletet' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allCustomerData.map((row: any, rowIndex: number) => (
                                <TableRow key={rowIndex} style={{ border: '1px solid #ccc' }}>
                                    <TableCell style={{ border: '1px solid #ccc' }}>{row.id}</TableCell>
                                    <TableCell style={{ border: '1px solid #ccc' }}>{row.aciPartNumber}</TableCell>

                                    <TableCell style={{ border: '1px solid #ccc' }}>{row.customerPartNumber}</TableCell>
                                    <TableCell style={{ border: '1px solid #ccc' }}>{row.customerName}</TableCell>
                                    <TableCell style={{ border: '1px solid #ccc' }}>{formatInputMode(row.inputMode)}</TableCell>
                                    <TableCell style={{ border: '1px solid #ccc' }}>
                                        <button onClick={() => handleEdit(row)}>{formatMessage({ id: 'edit' })}</button>
                                    </TableCell>

                                    <TableCell style={{ border: '1px solid #ccc' }}>
                                        <button onClick={() => handleDeleteClick(row)}>{formatMessage({ id: 'delete' })}</button>
                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

        </div >
    );
}

export default ACICustomerPage;
