import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const TwowayScannerImportOracleXlsx = () => {

    //先解析excel檔案出來前端顯示
    const [excelData, setExcelData] = useState<(string | number)[][]>([]);


    const handleFileUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            // 使用第一個工作表
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData);

        };

        reader.readAsArrayBuffer(file);
    };


    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

            {excelData && excelData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {excelData[0].map((cell, index) => (
                                    <TableCell key={index}>{cell}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {excelData.slice(1).map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p>No data</p>
            )}
        </div>
    );
}

export default TwowayScannerImportOracleXlsx;
