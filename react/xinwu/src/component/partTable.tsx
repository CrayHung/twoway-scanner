import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Button, Grid, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material';
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

const PartTable = () => {

    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const { currentUser, setCurrentUser, globalUrl, table1Data, setTable1Data, table2Data, setTable2Data, workNo, setWorkNo, part, setPart, quant, setQuant } = useGlobalContext();
    const today = new Date().toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)

    //fetch 料號對應表並渲染
    const fetchAll = async () => {
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
        fetchAll();
    }, []);


    const [partTableData, setPartTableData] = useState<any[]>([]);
    const [selectedPartNumber, setSelectedPartNumber] = useState('');
    const [selectedInputModel, setselectedInputModel] = useState('');

    const [numberPerPallet, setNumberPerPallet] = useState('');
    const [summary, setSummary] = useState('');
    const [note, setNote] = useState('');

    //新增表單
    const [openAddForm, setOpenAddForm] = useState(false);
    const handleAddClose = () => setOpenAddForm(false);
    const handleAddPart = async () => {

        const newData = {
            partNumber: selectedPartNumber,
            inputMode: selectedInputModel,
            numberPerPallet: Number(numberPerPallet),
            summary: summary,
            note: note,
            createUser: currentUser,
            createDate: today,

        };


        try {
            const response = await fetch(`${globalUrl.url}/api/post-input-modes`, {
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



    //編輯單筆料號
    const [openEditForm, setOpenEditForm] = useState(false);
    const handleEditClose = () => setOpenEditForm(false);
    const [editPart, setEditPart] = useState({
        id: "",
        partNumber: "",
        inputMode: "",
        numberPerPallet: "",
        summary: "",
        note: "",
    });

    const handleEdit = (rowData: any) => {
        setEditPart({
            id: rowData.id,
            partNumber: rowData.partNumber,
            inputMode: rowData.inputMode,

            numberPerPallet: rowData.numberPerPallet,
            summary: rowData.summary,
            note: rowData.note,
        });

        setOpenEditForm(true);
    }
    const handleEditPartChange = (part: any) => {
        setEditPart({
            ...editPart,
            partNumber: part
        });
    };

    const handleSelectInputModeChange = (inputmode: any) => {
        setEditPart({
            ...editPart,
            inputMode: inputmode
        });
    };
    const handleNumberPerPalletChange = (pallet: any) => {
        setEditPart({
            ...editPart,
            numberPerPallet: pallet
        });
    };
    const handleSummaryChange = (summary: any) => {
        setEditPart({
            ...editPart,
            summary: summary
        });
    };
    const handleNoteChange = (note: any) => {
        setEditPart({
            ...editPart,
            note: note
        });
    };
    const saveChanges = async () => {


        try {
            const response = await fetch(`${globalUrl.url}/api/put-input-modes/${editPart.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    partNumber: editPart.partNumber,
                    inputMode: editPart.inputMode,

                    numberPerPallet: Number(editPart.numberPerPallet),
                    summary: editPart.summary,
                    note: editPart.note,
                    editUser: currentUser,
                    editDate: today,
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


    //刪除單筆料號
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const handleDeleteClose = () => setOpenDeleteForm(false);
    const [deletePart, setDeletePart] = useState({
        id: "",
        partNumber: "",
        inputMode: ""
    });
    const handleDeleteClick = (row: any) => {
        setDeletePart(row);
        setOpenDeleteForm(true);
    };

    const handleDeleteConfirm = async () => {

        const deleteId = deletePart.id;
        try {
            const response = await fetch(`${globalUrl.url}/api/del-input-modes/${deleteId}`, {
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



    const handleExitButtonClick = () => {
        navigate('/');
    };



    return (
        // <div style={{ width: '100%', position: 'relative', left: 0, overflow: 'auto' }}>
        <div style={{ overflow: "hidden" }}>
            <Modal open={openAddForm} onClose={handleAddClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'add-part' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'part' })}
                                            value={selectedPartNumber}
                                            onChange={(e) => setSelectedPartNumber(e.target.value)}
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
                                    onChange={(e) => setselectedInputModel(e.target.value)}
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
                                            label={formatMessage({ id: 'number_per_pallet' })}
                                            value={numberPerPallet}
                                            onChange={(e) => setNumberPerPallet(e.target.value)}
                                            fullWidth
                                            type="number"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'summary' })}
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'note' })}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
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
                        {formatMessage({ id: 'edit-part' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'part' })}
                                            value={editPart.partNumber}
                                            onChange={(e) => handleEditPartChange(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>



                            <Grid item xs={10}>
                                <TextField
                                    select
                                    label={formatMessage({ id: 'part-shipping-model' })}
                                    value={editPart.inputMode}
                                    onChange={(e) => handleSelectInputModeChange(e.target.value)}
                                    fullWidth
                                    margin="normal"
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
                                            label={formatMessage({ id: 'number_per_pallet' })}
                                            value={editPart.numberPerPallet}
                                            onChange={(e) => handleNumberPerPalletChange(e.target.value)}
                                            fullWidth
                                            type="number"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'summary' })}
                                            value={editPart.summary}
                                            onChange={(e) => handleSummaryChange(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'note' })}
                                            value={editPart.note}
                                            onChange={(e) => handleNoteChange(e.target.value)}
                                            fullWidth
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
                        {formatMessage({ id: 'part' })}: {deletePart.partNumber}
                    </Typography>
                    <Typography>
                        {formatMessage({ id: 'part-shipping-model' })}:  {formatInputMode(deletePart.inputMode)}
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
                    {formatMessage({ id: 'add-part' })}
                </Button>

                <Button variant="contained" sx={{ marginRight: 1 }} onClick={handleExitButtonClick}>
                    {formatMessage({ id: 'exit' })}
                </Button>
            </Box>


            {/* <div>
                <button onClick={() => { setOpenAddForm(true) }}>{formatMessage({ id: 'add-part' })}</button>
                <button style={{ float: 'right' }} onClick={handleExitButtonClick}>{formatMessage({ id: 'exit' })}</button>
            </div> */}

            <Paper sx={{ width: '100%', height: '90%', overflow: 'hidden' }}>
                 <TableContainer component={Paper} style={{ height: 'calc(100vh - 110px)', overflow: 'auto' }}>

                {/* <TableContainer component={Paper} style={{ maxHeight: '100%', overflowY: 'scroll' }}> */}
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow style={{ border: '1px solid #ccc' }}>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'id' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'part' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'part-shipping-model' })}</TableCell>


                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'number_per_pallet' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'summary' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'note' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_user' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'create_date' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_user' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit_date' })}</TableCell>


                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'edit-part' })}</TableCell>
                                <TableCell style={{ width: '100px', height: '30px', border: '1px solid #ccc' }}>{formatMessage({ id: 'delete-part' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {partTableData.map((row: any, rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                    {Object.keys(row).map((colKey) => (
                                        <TableCell key={colKey}>
                                            {colKey === 'inputMode' ? formatInputMode(row.inputMode) : row[colKey]}
                                        </TableCell>
                                    ))}

                                    <TableCell>
                                        <button onClick={() => handleEdit(row)}>{formatMessage({ id: 'edit-part' })}</button>
                                    </TableCell>

                                    <TableCell>
                                        <button onClick={() => handleDeleteClick(row)}>{formatMessage({ id: 'delete-part' })}</button>
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

export default PartTable;
