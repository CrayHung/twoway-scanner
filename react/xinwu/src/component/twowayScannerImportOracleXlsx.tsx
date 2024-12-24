import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Button,
} from '@mui/material';
import JSZip from 'jszip';

const TwowayScannerImportOracleXlsx = () => {
    //for import
    const [excelData, setExcelData] = useState<(string | number)[][]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    //for bar code
    const canvasRefs = useRef<HTMLCanvasElement[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleColumnChange = (event: SelectChangeEvent<string>) => {
        setSelectedColumn(event.target.value);
    };

    useEffect(() => {
        if (canvasRefs.current.length > 0 && excelData.length > 0 && selectedColumn) {
            const columnIndex = excelData[0].indexOf(selectedColumn);
            if (columnIndex === -1) return;

            //從第二航開始處理資料,跳過第一航的標題
            excelData.slice(1).forEach((row, rowIndex) => {
                //目標欄位的值,若不存在則回傳空字串
                const value = row[columnIndex]?.toString() || '';
                //根據欄位值,將產生的條碼統一長度(長度為10位數 , 不足的用0補上)
                const normalizedValue = value.padStart(10, '0');


                const canvas = canvasRefs.current[rowIndex];
                if (canvas) {
                    JsBarcode(canvas, normalizedValue, {
                        width: 2,
                        height: 50,
                        fontSize: 12,
                        displayValue: false,
                        margin: 0,
                        textAlign: "center",

                    });
                }
            });
        }
    }, [excelData, selectedColumn]);

    //for download
    const generateBarcodeImage = (text: string): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');


        JsBarcode(canvas, text, {
            width: 2,
            height: 50,
            fontSize: 12,
            displayValue: false,
            margin: 0,
            textAlign: "center",
        });
        return canvas;
    };

    const downloadBarcode = (text: string) => {
        const canvas = generateBarcodeImage(text);
        canvas.toBlob((blob) => {
            if (blob) {
                saveAs(blob, `${text}.png`);
            }
        });
    };

    const downloadAllBarcodes = () => {
        const zip = new JSZip();
        excelData.slice(1).forEach((row, index) => {
            if (selectedColumn && excelData[0].includes(selectedColumn)) {
                const text = row[excelData[0].indexOf(selectedColumn)]?.toString() || '';
                const canvas = generateBarcodeImage(text);
                const dataUrl = canvas.toDataURL('image/png');
                zip.file(`${text || `barcode_${index + 1}`}.png`, dataUrl.split(',')[1], { base64: true });
            }
        });
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'barcodes.zip');
        });
    };


    return (
        <div style={{ overflow: 'hidden' }}>

            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />



            {excelData && excelData.length > 0 && (
                <>
                    <FormControl sx={{ minWidth: 200, margin: '16px 0' }}>
                        <InputLabel id="select-column-label"></InputLabel>
                        <Select
                            labelId="select-column-label"
                            value={selectedColumn}
                            onChange={handleColumnChange}
                        >
                            <MenuItem value="SN">SN</MenuItem>
                            <MenuItem value="QR_RFTray">QR_RFTray</MenuItem>
                            <MenuItem value="PackingID">PackingID</MenuItem>
                        </Select>
                    </FormControl>

                    {selectedColumn && (
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ margin: '16px 0' }}
                            onClick={downloadAllBarcodes}
                        >
                            Download All Barcodes
                        </Button>
                    )}

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {selectedColumn && <TableCell>Barcode</TableCell>}
                                        {selectedColumn && <TableCell>Download</TableCell>}

                                        {excelData[0].map((cell, index) => (
                                            <TableCell key={index}>{cell}</TableCell>
                                        ))}
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {excelData.slice(1).map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {selectedColumn && (
                                                <TableCell>
                                                    {excelData[0].includes(selectedColumn) &&
                                                        row[excelData[0].indexOf(selectedColumn)] && (
                                                            <img
                                                                src={generateBarcodeImage(
                                                                    row[
                                                                        excelData[0].indexOf(selectedColumn)
                                                                    ]?.toString() || ''
                                                                ).toDataURL('image/png')}
                                                                alt="Barcode"
                                                                style={{
                                                                    height: '50px',
                                                                    width: '200px',
                                                                    objectFit: 'fill',
                                                                }}
                                                            />
                                                        )}
                                                </TableCell>
                                            )}

                                            {selectedColumn && (
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            downloadBarcode(
                                                                row[
                                                                    excelData[0].indexOf(selectedColumn)
                                                                ]?.toString() || ''
                                                            )
                                                        }
                                                    >
                                                        Download
                                                    </Button>
                                                </TableCell>
                                            )}


                                            {row.map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}>{cell}</TableCell>
                                            ))}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}


        </div>
    );
};

export default TwowayScannerImportOracleXlsx;
