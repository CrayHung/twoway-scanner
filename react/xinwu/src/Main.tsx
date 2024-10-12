import React, { useEffect, useState } from 'react';
import "./Main.css"
import { useGlobalContext } from './global';
import { Box, Paper } from '@mui/material';
import {
  Table, TableCell, TableHead, TableRow, TableContainer, TableBody,
  TablePagination
} from "@mui/material";

interface Record {
  plateNumber: string;
  recognitionTime: Date;
  recognitionTimeStr: string;
  carType: string;
  imagePath: string;
  cameraId: string;
  plateIn: boolean;

}



const Main = () => {

  const { jwtToken, setJwtToken, isLoggedIn, setIsLoggedIn, globalUrl } = useGlobalContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [record, setRecord] = useState<Record[]>([]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [record]);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch(`${globalUrl.url}/lpr/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get record');
      }

      const data: Record[] = await response.json();
      console.log("allowlist : " + JSON.stringify(data));
      setRecord(data);

    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [])



  return (
    <>

      <div style={{ width: "100vw", paddingLeft: "4px", paddingRight: "4px", paddingTop: "4px" }}>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 128px)', width: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">項次</TableCell>
                  <TableCell align="center">序號SN</TableCell>
                  <TableCell align="center">序號QR_RFTray</TableCell>
                  <TableCell align="center">序號QR_PS</TableCell>
                  <TableCell align="center">序號QR_HS</TableCell>
                  <TableCell align="center">序號備用1</TableCell>
                  <TableCell align="center">序號備用2</TableCell>
                  <TableCell align="center">序號備用3</TableCell>
                  <TableCell align="center">序號備用4</TableCell>
                  <TableCell align="center">生產日期</TableCell>
                  <TableCell align="center">備註</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {record.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row: any, index: any) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index}</TableCell>
                    <TableCell align="center">{row.recognitionTimeStr}</TableCell>
                    <TableCell align="center">{row.carType}</TableCell>
                    <TableCell align="center">{row.imagePath}</TableCell>
                    <TableCell align="center">{row.cameraId}</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                    <TableCell align="center">{row.plateIn }</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={record.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default Main;
