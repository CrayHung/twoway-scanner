import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from "react-intl";
import { useGlobalContext } from '../global';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, Button, Grid, MenuItem, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const AccountPage = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const { userRole, isLoggedIn, globalUrl } = useGlobalContext();

    //一進頁面就先取得所有user資料 用來渲染table
    const [Data, setData] = useState<any[]>([]);

    // 一進頁面就先取得所有user資料a
    const fetchAll = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/user/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get 所有User資料');
            }

            const data: any[] = await response.json();
            setData(data);
            console.log("所有的user資料:", JSON.stringify(data, null, 2));

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchAll();
    }, []);


    //編輯
    const [openEditForm, setOpenEditForm] = useState(false);
    const handleEditClose = () => setOpenEditForm(false);
    const [editUser, setEditUser] = useState({
        id: "",
        username: "",
        password: "",
        role: "",
        company: ""
    });
    const handleEdit = (rowData: any) => {
        setEditUser({
            id: rowData.id,
            username: rowData.username,
            password: rowData.password,
            role: rowData.role,
            company: rowData.company
        });

        setOpenEditForm(true);
    }
    const handleEditUsernameChange = (username: any) => {
        setEditUser({
            ...editUser,
            username: username
        });
    };
    const handleEditRoleChange = (role: any) => {
        setEditUser({
            ...editUser,
            role: role
        });
    };
    const handleEditCompanyChange = (company: any) => {
        setEditUser({
            ...editUser,
            company: company
        });
    };


    const saveChanges = async () => {

        const requestBody = {
            username: editUser.username,
            password: editUser.password,
            role: editUser.role,
            company: editUser.company
        };

        const response = await fetch(`${globalUrl.url}/user/update/${editUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        // const result = await response.json();
        // console.log('更新成功:', result);
        setOpenEditForm(false);
        fetchAll();

    }

    //刪除
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const handleDeleteClose = () => setOpenDeleteForm(false);
    const [deleteUser, setDeleteUser] = useState({
        id: "",
        username: "",
        password: "",
        role: ""
    });
    const handleDeleteClick = (row: any) => {
        setDeleteUser(row);
        setOpenDeleteForm(true);
    };

    const handleDeleteConfirm = async () => {

        const deleteId = deleteUser.id;
        try {
            const response = await fetch(`${globalUrl.url}/user/delete/${deleteId}`, {
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


    //重置密碼
    const [openResetForm, setOpenResetForm] = useState(false);
    const handleResetClose = () => setOpenResetForm(false);
    const [editPassword, setEditPassword] = useState({
        id: "",
        username: "",
        password: "",
        role: "",
        company: ""
    });
    const handleReset = (rowData: any) => {
        setEditPassword({
            id: rowData.id,
            username: rowData.username,
            password: rowData.password,
            role: rowData.role,
            company: rowData.company
        });

        setOpenResetForm(true);
    }
    const handlePasswordChange = (password: any) => {
        setEditPassword({
            ...editPassword,
            password: password
        });
    };
    const handlePasswordEmpty = () => {
        handlePasswordChange('');
    };


    const saveResetChanges = async () => {

        const requestBody = {
            username: editPassword.username,
            password: editPassword.password,
            role: editPassword.role,
            company: editPassword.company
        };


        const response = await fetch(`${globalUrl.url}/user/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        // const result = await response.json();

        // console.log('更新成功:', result);
        setOpenResetForm(false);
        fetchAll();

    }



    return (
        <div>

            {/* 重置 */}
            <Modal open={openResetForm} onClose={handleResetClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'reset-password' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            value={editPassword.password}
                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                            onClick={() => handlePasswordEmpty()}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" fullWidth onClick={saveResetChanges}>
                                    {formatMessage({ id: 'submit' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>


            {/* 編輯 */}
            <Modal open={openEditForm} onClose={handleEditClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'edit' })}
                    </Typography>
                    <form>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Grid container spacing={1} >
                                    <Grid item xs={10}>
                                        <TextField
                                            label={formatMessage({ id: 'account' })}
                                            value={editUser.username}
                                            onChange={(e) => handleEditUsernameChange(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                            <Grid item xs={10}>
                                <TextField
                                    select
                                    label={formatMessage({ id: 'role' })}
                                    value={editUser.role}
                                    onChange={(e) => handleEditRoleChange(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="USER">USER</MenuItem>
                                    <MenuItem value="OPERATOR">OPERATOR</MenuItem>
                                    <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={10}>
                                <TextField
                                    select
                                    label={formatMessage({ id: 'company' })}
                                    value={editUser.company}
                                    onChange={(e) => handleEditCompanyChange(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value=""> NO </MenuItem>
                                    <MenuItem value="Twoway">Twoway</MenuItem>
                                    <MenuItem value="ACI"> ACI </MenuItem>
   
                                </TextField>
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

            {/* 刪除 */}
            <Modal open={openDeleteForm} onClose={handleDeleteClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        {formatMessage({ id: 'id' })}
                    </Typography>
                    <Typography>
                        {formatMessage({ id: 'username' })}: {deleteUser.username}
                    </Typography>
                    <Typography>
                        {formatMessage({ id: 'role' })}:  {deleteUser.role}
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
            {/* <div>
                <button onClick={() => { navigate("/register") }}>{formatMessage({ id: 'register' })}</button>
            </div> */}

            <Typography variant="h4" gutterBottom>
                {formatMessage({ id: 'account-page' })}
            </Typography>
            {Data.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{formatMessage({ id: 'account' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'role' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'company' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'reset-password' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'edit' })}</TableCell>
                                <TableCell>{formatMessage({ id: 'delete' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Data.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.company}</TableCell>
                                    <TableCell>
                                        <button onClick={() => handleReset(user)}>{formatMessage({ id: 'reset-password' })}</button>
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleEdit(user)}>{formatMessage({ id: 'edit' })}</button>
                                    </TableCell>

                                    <TableCell>
                                        <button onClick={() => handleDeleteClick(user)}>{formatMessage({ id: 'delete' })}</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No users found.</Typography>
            )}

        </div >
    );
}

export default AccountPage;
