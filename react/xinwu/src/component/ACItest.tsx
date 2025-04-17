// App.tsx or RandomGenerator.tsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
import './SearchForm.css';
import { downloadBarcode } from './GenerateBarCode';





const generateRandomString = (length = 6) =>
    Math.random().toString(36).substring(2, 2 + length).toUpperCase();

const generateRandomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateQR = (existing: Set<string>): string => {
    let qr = '';
    do {
        qr = `$ID:${Math.floor(10000000 + Math.random() * 90000000)}.$`;
    } while (existing.has(qr));
    existing.add(qr);
    return qr;
};

const ACItest = () => {

    const { formatMessage } = useIntl();
    const { table3Data, globalUrl } = useGlobalContext();


    const [table1, setTable1] = useState<any>(null);
    const [table2, setTable2] = useState<any[]>([]);
    const [pallet, setPallet] = useState<any[]>([]);
    const [cartonDetail, setCartonDetail] = useState<any[]>([]);





    const handleGenerate = () => {
        const workOrderNumber = generateRandomString(6);
        const quantity = generateRandomNumber(1, 10);
        const partOptions = table3Data.map((item: { partNumber: any; }) => item.partNumber);
        const partNumber = partOptions[Math.floor(Math.random() * partOptions.length)];
        const company = 'aci';
        const createUser = 'aciadmin';
        const editUser = 'aciadmin';


        const table1Data = {
            workOrderNumber,
            quantity,
            partNumber,
            company,
            createUser,
            editUser,
        };

        const qrSet = new Set<string>();
        const snSet = new Set<number>();
        const cartonNameSet = new Set<string>();
        const table2Data = [];

        const generateUniqueCartonName = () => {
            let name: string;
            do {
                name = `$ID:${Math.floor(10000000 + Math.random() * 90000000)}.$`;
            } while (cartonNameSet.has(name));
            cartonNameSet.add(name);
            return name;
        };

        for (let i = 0; i < quantity; i++) {
            let sn: number;
            do {
                sn = generateRandomNumber(100000, 999999);
            } while (snSet.has(sn));
            snSet.add(sn);

            const record: any = {
                workOrderNumber,
                SN: sn.toString(),
                QR_RFTray: '',
                QR_PS: '',
                QR_HS: '',
                QR_backup1: '',
                QR_backup2: '',
                QR_backup3: '',
                QR_backup4: '',
                note: '',
                create_user: 'aciadmin',
                edit_user: 'aciadmin',
                QR_RFTray_BEDID: '',
                QR_PS_BEDID: '',
                QR_HS_BEDID: '',
                cartonName: generateUniqueCartonName(),
            };



            const partData = table3Data.find((item: { partNumber: any; }) => item.partNumber === partNumber);
            const inputMode = partData?.inputMode;
            if (inputMode) {
                if (['A', 'D', 'E'].includes(inputMode)) {
                    const qr = generateQR(qrSet);
                    record.QR_HS = qr;
                    record.QR_HS_BEDID = qr;
                }
                if (['C', 'D', 'E'].includes(inputMode)) {
                    const qr = generateQR(qrSet);
                    record.QR_PS = qr;
                    record.QR_PS_BEDID = qr;
                }
                if (['B', 'E'].includes(inputMode)) {
                    const qr = generateQR(qrSet);
                    record.QR_RFTray = qr;
                    record.QR_RFTray_BEDID = qr;
                }
            }

            
            table2Data.push(record);
        }






        setTable1(table1Data);
        setTable2(table2Data);



    };


    const handleUploadAndDownload = async () => {
        if (!table1 || table2.length === 0) {
            alert("請先產生資料！");
            return;
        }

        const getMaxQuantity = (table3Data: any[], partNumber: string): number => {
            const match = table3Data.find(item => item.partNumber === partNumber);
            return match ? match.numberPerPallet : 0;
        };


        const palletname = `${table1.partNumber}_${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`;

        const maxQuantity = getMaxQuantity(table3Data, table1.partNumber);
        // 建立 pallet 資料
        const pallet = [
            {
                palletName: palletname,
                maxQuantity: maxQuantity,
                quantity: table2.length,
                cartonNames: table2.map(item => item.cartonName)
            }
        ];

        // 建立 cartonDetail 資料
        const cartonDetail = table2.map(item => ({
            palletName: palletname,
            cartonName: item.cartonName,
            sn: item.SN,
            qrRfTray: item.QR_RFTray || null,
            qrPs: item.QR_PS || null,
            qrHs: item.QR_HS || null,
            qrRfTrayBedid: item.QR_RFTray_BEDID || null,
            qrPsBedid: item.QR_PS_BEDID || null,
            qrHsBedid: item.QR_HS_BEDID || null,
        }));
        setPallet(pallet);
        setCartonDetail(cartonDetail);

        try {
            // 上傳 table1
            const res1 = await fetch(`${globalUrl.url}/api/post-work-orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(table1),
            });

            if (!res1.ok) throw new Error("上傳 table1 失敗");

            // 上傳 table2
            const res2 = await fetch(`${globalUrl.url}/api/post-work-order-details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(table2),
            });

            if (!res2.ok) throw new Error("上傳 table2 失敗");


            //新增到pallet表
            const res3 = await fetch(`${globalUrl.url}/api/post-pallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pallet),
            });
            if (!res3.ok) throw new Error("上傳 pallet 失敗");


            //新增到cartonDetails表
            const res4 = await fetch(`${globalUrl.url}/api/post-carton-details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartonDetail),
            });
            if (!res4.ok) throw new Error("上傳 cartonDetail 失敗");

            alert("新增棧板 : " + palletname);

        } catch (error) {
            console.error(" 發生錯誤:", error);
        }

    };


    return (
        <div style={{ padding: 20 }}>
            <button onClick={handleGenerate}>產生測試資料</button>
            <button onClick={handleUploadAndDownload} disabled={!table1 || table2.length === 0}>
                上傳
            </button>

            {table1 && (
                <div>
                    <h3>Table1</h3>
                    <pre>{JSON.stringify(table1, null, 2)}</pre>
                </div>
            )}

            {table2.length > 0 && (
                <div
                    style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                    }}
                >
                    <h3>Table2</h3>
                    <pre>{JSON.stringify(table2, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ACItest;
