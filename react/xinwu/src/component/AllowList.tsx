// AllowList.tsx

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Modal, Typography, TextField } from '@mui/material';

import { ImageModalStyle } from "../styles/ModalStyle";
import { style } from "../styles/ModalStyle";
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../global';
import UploadXls from './UploadXls';
import DownloadRecordXlsx from './DownloadRecordXlsx';

interface AllowListItem {
    plateNumber: string;
    visitorEndStr: string;
    visitorStartStr: string;
    passStatus: string;

  }

const AllowList= () => {


    const navigate = useNavigate();

    const [number , setNumber]=useState<string>('');
    const [time , setTime]=useState<string>('');
    
    const [blackList,setBlackList]=useState<AllowListItem[]>([]);
    const [whiteList,setWhiteList]=useState<AllowListItem[]>([]);


    const [isBlackModalOpen, setIsBlackModalOpen] = useState<boolean>(false);
    const [isDeleteBlackModalOpen, setIsDeleteBlackModalOpen] = useState<boolean>(false);

    const [isWhiteModalOpen, setIsWhiteModalOpen] = useState<boolean>(false);
    const [isDeleteWhiteModalOpen, setIsDeleteWhiteModalOpen] = useState<boolean>(false);

    const [carNumberToDelete, setCarNumberToDelete] = useState('');

    const {  jwtToken , setJwtToken ,isLoggedIn, setIsLoggedIn,globalUrl } = useGlobalContext();
    const todayDate: Date = new Date();
    const formattedDate: string = todayDate.toISOString().split('T')[0];

    //得黑名單
    const fetchBlackList = async () => {
        try {
          const response = await fetch(`${globalUrl.url}/allow/all/black`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to get blacklist');
          }
  
          const data: AllowListItem[]  = await response.json();
          console.log("blacklist : " + JSON.stringify(data));
          setBlackList(data);
      
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      };
    useEffect(() => {
    fetchBlackList();
  }, [jwtToken]);
    //得白名單
    const fetchAllowList = async () => {
        try {
          const response = await fetch(`${globalUrl.url}/allow/all/visitorBooking`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to get AllowList');
          }
  
          const data: AllowListItem[]  = await response.json();
          console.log("allowlist : " + JSON.stringify(data));
          setWhiteList(data);
      
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      };
    useEffect(() => {
        fetchAllowList();
      }, [jwtToken]);

    /*black*/
    const handleBlackOpen = () => setIsBlackModalOpen(true);
    const handleBlackClose = () => setIsBlackModalOpen(false);

    const handleDeleteBlackOpen = () => setIsDeleteBlackModalOpen(true);
    const handleDeleteBlackClose = () => setIsDeleteBlackModalOpen(false);

    /*white*/
    const handleWhiteOpen = () => setIsWhiteModalOpen(true);
    const handleWhiteClose = () => setIsWhiteModalOpen(false);

    const handleDeleteWhiteOpen = () => setIsDeleteWhiteModalOpen(true);
    const handleDeleteWhiteClose = () => setIsDeleteWhiteModalOpen(false);

    /*value change-ADD*/
    const handleCerNumberChange =(e: ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();
        setNumber(e.target.value);
        console.log(number);
    }
    const handleTimeChange =(e: ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();
        setTime(e.target.value);
        console.log(time);
    }



    //新增黑名單
    const handleBlackSubmit=(e: FormEvent)=>{
        e.preventDefault();
        const newData: AllowListItem = { 
            plateNumber: `${number}`, 
            visitorStartStr: `${formattedDate}`, 
            visitorEndStr: `${time}`,
            passStatus:"Black"
        };

        setBlackList((prevData) => [...prevData, newData]);
        console.log(newData);
        handleBlackClose();

        fetchAddBlack(newData);

    }    
    //新增白名單
    const handleWhiteSubmit=(e: FormEvent)=>{
        e.preventDefault();
        const newData: AllowListItem = { 
            plateNumber: `${number}`, 
            visitorStartStr: `${formattedDate}`, 
            visitorEndStr: `${time}`,
            passStatus:"pass"
        };

        setWhiteList((prevData) => [...prevData, newData]);
        console.log(newData);
        handleWhiteClose();

        fetchAddWhite(newData);
    }
    //新增黑名單 API fetch
    const fetchAddBlack = async (newData:any) => {
        try {
          const response = await fetch(`${globalUrl.url}/allow/addNewBlack`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to add Black');
          }
  
          const data = await response.json();


        } catch (error: any) {
          console.error('Error fetching token:', error);
      };
      fetchAllowList();
      fetchBlackList();
    }
    //新增白名單 API fetch
    const fetchAddWhite = async (newData:any) => {
        try {
          const response = await fetch(`${globalUrl.url}/allow/addNewWhite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to add White');
          }
  
          const data = await response.json();


        } catch (error: any) {
          console.error('Error fetching token:', error);
      };
      fetchAllowList();
      fetchBlackList();
    }
    //刪除黑名單 API fetch
    const fetchDeleteBlack = async (newData:any) => {
        try {
            const response = await fetch(`${globalUrl.url}/allow/deleteblack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newData),
            });
    
            if (!response.ok) {
            throw new Error('Failed to delete Black');
            }
            if (response.ok) {
                const data = await response.json();
                console.log("以刪除黑名單:" + data);
        


            handleDeleteBlackClose();
            } else {
                // 處理 API 錯誤情況
                console.error('Error deleting blacklist:', response.statusText);
              }



        } catch (error: any) {
            console.error('Error fetching token:', error);
        };
        // 重新取得 Allow List
        fetchAllowList();
        fetchBlackList();
    }
    //刪除白名單 API fetch
    const fetchDeleteWhite = async (newData:any) => {
        try {
            const response = await fetch(`${globalUrl.url}/allow/deletewhite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newData),
            });
    
            if (!response.ok) {
            throw new Error('Failed to delete white');
            }
            if (response.ok) {
                const data = await response.json();
                console.log("以刪除白名單:" + newData.plateNumber);
        

            handleDeleteWhiteClose();
            } else {
                // 處理 API 錯誤情況
                console.error('Error deleting whitelist:', response.statusText);
              }



        } catch (error: any) {
            console.error('Error fetching token:', error);
        };
        // 重新取得 Allow List
        fetchAllowList();
        fetchBlackList();
    }
    //刪除黑名單
    const handleDeleteBlackSubmit = async (e:FormEvent) => {
        e.preventDefault();
        const newData = {
            plateNumber: `${number}`
            };

        fetchDeleteBlack(newData);
    }
    //刪除白名單
    const handleDeleteWhiteSubmit = async (e:FormEvent) => {
        e.preventDefault();
        const newData = {
            plateNumber: `${number}`
          };

        fetchDeleteWhite(newData);

    }

    return (

        <Box  sx={{ display: 'flex', gap: '16px', margin:'16px'}}>
            <Box sx={{ overflowY: 'auto' ,overflowX: 'hidden', marginRight: '10px'}}>
                {/* 左側表格 */}
                <TableContainer component={Paper} style={{ flex: 1, marginRight: '10px', border: '1px solid #ddd', }} >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f4f4f9', zIndex: 1 }}>
                            <TableRow >
                                <TableCell align='center' >black</TableCell>
                                <Button onClick={handleBlackOpen}>+</Button>
                                <Button onClick={handleDeleteBlackOpen}>-</Button>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#f4f4f9', zIndex: 1, textAlign: 'center', verticalAlign: 'middle', }}>plateNumber</TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#f4f4f4', zIndex: 1, textAlign: 'center', verticalAlign: 'middle', }}>End time</TableCell>
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {blackList?.map((item, index) => (
                                <TableRow key={index} >
                                    <TableCell align="center">{item.plateNumber}</TableCell>
                                    <TableCell align="center">{item.visitorEndStr}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ overflowY: 'auto',overflowX: 'hidden' }}>
                {/* 右側表格 */}
                <TableContainer component={Paper} style={{ flex: 1, marginRight: '10px', border: '1px solid #ddd', }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            <TableCell align='center' >white</TableCell>
                                <Button onClick={handleWhiteOpen}>+</Button>
                                <Button onClick={handleDeleteWhiteOpen}>-</Button>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#f4f4f4', zIndex: 1, textAlign: 'center', verticalAlign: 'middle', }}>plateNumber</TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#f4f4f4', zIndex: 1, textAlign: 'center', verticalAlign: 'middle', }}>End time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {whiteList?.map((item, index) => (
                                <TableRow key={index} >
                                    <TableCell align="center">{item.plateNumber}</TableCell>
                                    <TableCell align="center">{item.visitorEndStr}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* Add black modal */}
                <Modal open={isBlackModalOpen} onClose={handleBlackClose} >
                    <Box sx={style}>
                        
                        <form onSubmit={handleBlackSubmit} >
                            <Box>
                                <TextField 
                                    label="carNumber"
                                    onChange={handleCerNumberChange}
                                />
                                <TextField 
                                    label="ex : 2024-01-01 00:00:00"
                                    onChange={handleTimeChange}
                                />
                                <Button variant="contained" type="submit" >送出</Button>
                            </Box>
                        </form>


                    </Box>
                </Modal>
                {/* Add white modal */}
                <Modal open={isWhiteModalOpen} onClose={handleWhiteClose} >
                    <Box sx={style}>
                        
                            <form onSubmit={handleWhiteSubmit} >
                            <Box>


                                <TextField
                                    label="carNumber"
                                    onChange={handleCerNumberChange}
                                />

                                <TextField
                                    label="ex : 2024-01-01 00:00:00"
                                    onChange={handleTimeChange}
                                />
                               
                                    <Button variant="contained" type="submit">送出</Button>
                                </Box>
                            </form>


                    </Box>
                </Modal>
                {/* Delete black modal */}
                <Modal open={isDeleteBlackModalOpen} onClose={handleDeleteBlackClose} >
                    <Box sx={style}>
                        
                            <form onSubmit={handleDeleteBlackSubmit} >
                            <Box>
                                <TextField
                                  label="carNumber"
                                  onChange={handleCerNumberChange}
                                />
                                    <Button variant="contained" type="submit">送出</Button>
                                </Box>
                            </form>


                    </Box>
                </Modal>
                {/* Delete white modal */}
                <Modal open={isDeleteWhiteModalOpen} onClose={handleDeleteWhiteClose} >
                    <Box sx={style}>
                        
                            <form onSubmit={handleDeleteWhiteSubmit} >
                            <Box>

                                <Typography variant="h5" component="h5">
                                    white
                                </Typography>
                                <TextField
                                  label="carNumber"
                                  onChange={handleCerNumberChange}
                                />
                               

                                    <Button variant="contained" type="submit">送出</Button>
                                </Box>
                            </form>


                    </Box>
                </Modal>


                            <UploadXls></UploadXls>


        </Box>

    );
};

export default AllowList;
