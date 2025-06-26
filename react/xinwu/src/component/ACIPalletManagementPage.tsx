import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, Backdrop, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useIntl } from "react-intl";
import ACIPicking from './ACIPicking';
import * as XLSX from 'xlsx';

interface PalletData {
    id: number;
    palletName: string;
    maxQuantity: number;
    quantity: number;
    location: string;
}
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

const ACIPalletManagementPage = () => {
    const { formatMessage } = useIntl();

    /*
    1.取得所有stock表中的pallet
    2.根據palletName去取得該pallet表 , 並拼接成渲染的表格 (可以用兩個表格,一個顯示stock內容, 一個顯示pallet內容)
    3.pallet表格的最後有個"編輯"按鈕 , 點擊該按鈕即連結到新頁面 , 並透過該palletName去取得cartonDetails表+渲染cartonDetails表格
    4.
    */

    const { globalUrl, palletName, setPalletName } = useGlobalContext();

    //一開始渲染Table的資料
    const [allStockData, setAllStockData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any[]>([]);


    //for 編輯時控制BackDrop
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocation, setEditedLocation] = useState(""); // 編輯的 location
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null); // 保存當前編輯的行索引

    //for 選擇哪幾行的check box (用以整個棧板出貨)
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectedRowsPalletName, setSelectedRowsPalletName] = useState<string[]>([]);
    const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);


    //for Stock用以快速找到棧板要刪除用
    const [selectedRowsToDelete, setSelectedRowsToDelete] = useState<number[]>([]);
    const [selectedRowsToDeletePalletName, setSelectedRowsToDeletePalletName] = useState<string[]>([]);

    //整個棧板 設備轉移
    const [showModal, setShowModal] = useState(false);
    //選擇要加入的pallet
    const [selectedPalletName, setSelectedPalletName] = useState<string>(''); // Radio 選擇的值
    const [inputPalletName, setInputPalletName] = useState("");
    const [allCartonAmount, setAllCartonAmount] = useState<number>(0);
    //for 合併設備 將要合併的對象的pallet資料抓出來
    const [selectedPallet, setSelectedPallet] = useState<PalletData | null>(null);
    const [allMergeCartonID, setAllMergeCartonID] = useState<any[]>([]); // 存選中的 id

    const [typeASN_Number, setTypeASN_Number] = useState<string>('');
    const [typeshipping_date, setTypeshipping_date] = useState<string>('');
    const [typeshipping_company_contractor, setShipping_company_contractor] = useState<string>('');
    const [showShipModal, setShowShipModal] = useState(false);

    //使用者用文字框搜尋棧板
    const [pal, setPal] = useState('');
    //使用者用文字框搜尋棧板
    const [palToDel, setPalToDel] = useState('');


    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間

    const navigate = useNavigate();

    useEffect(() => {
        fetchStock();
    }, []);

    useEffect(() => {
        if (allStockData.length > 0) {
            fetchPallet();
        }
    }, [allStockData]);


    const fetchStock = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-stock`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                //把palletName為null的資料篩掉
                const filterData = data.filter((item: any) => item.palletName !== null);
                setAllStockData(filterData);
                console.log("返回的stock filterData : ", JSON.stringify(filterData, null, 2))

            } else {
                console.error('無法取得 stock 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };


    const fetchPallet = async () => {
        try {
            const palletNames = allStockData.map(stock => stock.palletName);
            const uniquePalletNames = Array.from(new Set(palletNames)); // 避免重複請求

            // console.log("palletNames : "+palletNames);
            console.log("uniquePalletNames : ", JSON.stringify(uniquePalletNames, null, 2));


            //取得所有的pallet資料
            const response = await fetch(`${globalUrl.url}/api/get-multiple-pallets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uniquePalletNames),
            });

            if (!response.ok) {
                console.error("Failed to fetch pallets:", response.status, response.statusText);
                return;
            }

            const pallets = await response.json();
            setPalletData(pallets);
            console.log("取得的pallets :", JSON.stringify(pallets, null, 2));
        } catch (error) {
            console.error('Error fetching pallet details:', error);
        }
    };


    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedLocation(e.target.value);
    };

    const handleSave = () => {
        if (selectedRowIndex !== null) {
            if (!palletData) {
                console.error("palletData is null or undefined");
                return;
            }
            // 更新前端資料 (這邊跟Stock的單一物件不同 , 藥用陣列的方式去更新)
            const updatedPalletData = palletData.map((pallet, index) =>
                index === selectedRowIndex
                    ? { ...pallet, location: editedLocation } // 更新該行資料
                    : pallet // 其他不變
            );

            setPalletData(updatedPalletData);
            setIsEditing(false);


            // 更新後端資料
            const updatedLocation = editedLocation;
            // const palletId = palletData.id;
            const palletId = palletData[selectedRowIndex].id;

            fetch(`${globalUrl.url}/api/update-pallet-location/${palletId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: updatedLocation })
            })
                .then(response => response.json())
                .then(updatedPallet => {
                    console.log('Updated pallet:', updatedPallet);
                    setIsEditing(false); // 隱藏編輯框
                })
                .catch(error => {
                    console.error('Error updating pallet:', error);
                    setIsEditing(false); // 隱藏編輯框
                });
        }
    };


    const handleLocationClick = (location: string, rowIndex: number) => {
        setEditedLocation(location); // 設定為當前行的 location
        setSelectedRowIndex(rowIndex); // 記錄當前行的索引
        setIsEditing(true); // 顯示 Backdrop 和輸入框
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {

        if (event.key === "Enter") {
            handleSave(); // 儲存變更
            setIsEditing(false); // 隱藏輸入框
        }
    }

    // 隱藏 Backdrop 和輸入框
    const handleBackgroundClick = () => {
        setIsEditing(false);
        setEditedLocation("");
    };

    //checkbox選擇單一行資料時
    // const handleSelectRow = (id: number) => {
    //     setSelectedRows((prev) =>
    //         );
    // };

    //checkbox選擇單一行資料時,同時設定selectedRowsPalletName
    const handleSelectRow = (rowData: any, id: number) => {




        setSelectedRows((prevSelected) => {
            // 檢查該行是否已經選擇
            const isSelected = prevSelected.includes(id);


            // 更新 selectedRowsData
            setSelectedRowsData((prevData) => {
                if (isSelected) {
                    // 取消選取：移除對應 id 的資料
                    return prevData.filter((item) => item.id !== id);
                } else {
                    // 新增選取：加入 rowData
                    return [...prevData, rowData];
                }
            });



            // 更新 selectedRows
            const updatedSelectedRows = isSelected
                ? prevSelected.filter((rowId) => rowId !== id) // 如果已選擇，則取消選擇
                : [...prevSelected, id]; // 如果未選擇，則選擇該行

            // 更新 selectedRowsPalletName
            setSelectedRowsPalletName((prevPalletNames) => {
                // 取得當前行的 palletName
                const palletName = palletData.find((row) => row.id === id)?.palletName;

                // 檢查 palletName 是否存在
                if (!palletName) return prevPalletNames;

                // 更新 selectedRowsPalletName
                return isSelected
                    ? prevPalletNames.filter((name) => name !== palletName) // 如果已選擇，則取消選擇
                    : [...prevPalletNames, palletName]; // 如果未選擇，則選擇該 palletName
            });

            return updatedSelectedRows;
        });
    };

    const handleSelectRowToDel = (id: number) => {
        setSelectedRowsToDelete((prevSelected) => {
            // 檢查該行是否已經選擇
            const isSelected = prevSelected.includes(id);

            // 更新 selectedRows
            const updatedSelectedRows = isSelected
                ? prevSelected.filter((rowId) => rowId !== id) // 如果已選擇，則取消選擇
                : [...prevSelected, id]; // 如果未選擇，則選擇該行

            // 更新 selectedRowsToDeletePalletName
            setSelectedRowsToDeletePalletName((prevPalletNames) => {
                // 取得當前行的 palletName
                const palletName = allStockData.find((row) => row.id === id)?.palletName;

                // 檢查 palletName 是否存在
                if (!palletName) return prevPalletNames;

                // 更新 selectedRowsToDeletePalletName
                return isSelected
                    ? prevPalletNames.filter((name) => name !== palletName) // 如果已選擇，則取消選擇
                    : [...prevPalletNames, palletName]; // 如果未選擇，則選擇該 palletName
            });

            return updatedSelectedRows;
        });
    };


    // /**pallet input欄位,按下enter後可以將該筆pallet的checkbox打勾 */
    // const handleCheckBoxforPallet = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === "Enter") {
    //         setSelectedRows((prevSelected) => {

    //             // 找出符合 pallet 的 row IDs
    //             const matchingRows = palletData
    //                 .filter((row: any) => row.palletName === pal)
    //                 .map((row: any) => row.id);

    //             // 如果所有符合的 row 都已被選取，則取消選取，否則選取它們
    //             const allSelected = matchingRows.every(id => prevSelected.includes(id));
    //             return allSelected
    //                 ? prevSelected.filter(id => !matchingRows.includes(id)) // 取消勾選
    //                 : [...prevSelected, ...matchingRows]; // 勾選
    //         });

    //         //清空input欄位
    //         setPal('');
    //     }
    // };

    /**(pallet)pallet input欄位,按下enter後可以將該筆pallet的checkbox打勾 */
    const handleCheckBoxforPallet = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {

            // 找出符合 palletName 的 rows
            const matchingRows = palletData.filter((row: any) => row.palletName === pal);
            // 提取 ID 和 palletName
            const matchingIds = matchingRows.map((row: any) => row.id);
            const matchingPalletNames = matchingRows.map((row: any) => row.palletName);

            const currentSelectedIds = selectedRows;

            // 確認是否所有符合的 row 都已被選取
            const allSelected = matchingIds.every(id => currentSelectedIds.includes(id));


            setSelectedRows((prevSelected) => {

                // const allSelected = matchingIds.every(id => prevSelected.includes(id));

                // 更新選取的 rows ID
                const updatedSelectedRows = allSelected
                    ? prevSelected.filter(id => !matchingIds.includes(id)) // 取消勾選
                    : [...prevSelected, ...matchingIds]; // 勾選

                // 更新選取的 palletName
                setSelectedRowsPalletName((prevPalletNames) =>
                    allSelected
                        ? prevPalletNames.filter(name => !matchingPalletNames.includes(name)) // 取消 palletName
                        : [...prevPalletNames, ...matchingPalletNames] // 勾選 palletName
                );

                return updatedSelectedRows;
            });


            setSelectedRowsData(prevData => {

                if (allSelected) {
                    // UNSELECT: Filter out the row objects whose IDs match
                    console.log("Removing data for IDs:", matchingIds);
                    return prevData.filter(dataRow => !matchingIds.includes(dataRow.id));
                } else {
                    const existingDataIds = new Set(prevData.map(d => d.id));
                    const dataToAdd = matchingRows.filter(matchRow => !existingDataIds.has(matchRow.id));
                    console.log("Adding data objects:", dataToAdd);
                    return [...prevData, ...dataToAdd];
                }

            });
            // 清空 input 欄位
            setPal('');
        }
    };
    useEffect(() => {
        console.log("selectedRowsData:", JSON.stringify(selectedRowsData, null, 2));
    }, [selectedRowsData])

    useEffect(() => {
        console.log("selectedRows:" + selectedRows);
        console.log("selectedRowsToDelete:" + selectedRowsToDelete);
        console.log("selectedRowsPalletName:" + selectedRowsPalletName);
        console.log("selectedRowsToDeletePalletName:" + selectedRowsToDeletePalletName);


    }, [selectedRows, selectedRowsToDelete, selectedRowsPalletName, selectedRowsToDeletePalletName])


    //整個棧板加入購物車邏輯 (複數個棧板)
    //做以下的事
    //1. 將checkbox選到的多個pallet的cartonDetail刪掉 (CartonDetailRepositiry)
    //2. 將checkbox選到的多個pallet的quantity數字改為0 (PalletRepositiry)
    //3. 將資料加入到出貨清單(購物車Cart)
    //4. 重新fetch一次所有pallet用以更新前端渲染


    //for整個棧板出貨 , 傳送複數個palletName資料已獲得那些pallet裡面的cartonDetails
    const prepareShippedData = async () => {
        try {
            // 從後端獲取所有選擇的 pallet 內的 cartonDetail
            const response = await fetch(`${globalUrl.url}/api/carton-detail/by-pallet-names`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ palletNames: selectedRowsPalletName }),
            });

            if (!response.ok) {
                throw new Error("獲取 CartonDetail 失敗");
            }
            // 取得 pallet 內的 cartonDetail 資料
            const cartonDetails = await response.json();

            // 格式化為 shipped 資料
            const requestShippedBody = cartonDetails.map((carton: { palletName: any; cartonName: any; sn: any; qrRfTray: any; qrPs: any; qrHs: any; qrRfTrayBedid: any; qrPsBedid: any; qrHsBedid: any; }) => ({
                palletName: carton.palletName,
                cartonName: carton.cartonName,
                sn: carton.sn,
                qrRfTray: carton.qrRfTray,
                qrPs: carton.qrPs,
                qrHs: carton.qrHs,
                qrRfTrayBedid: carton.qrRfTrayBedid,
                qrPsBedid: carton.qrPsBedid,
                qrHsBedid: carton.qrHsBedid
                // shippedTime: dateTime,
            }));

            return requestShippedBody;
        } catch (error) {
            console.error("準備 shippedBody 失敗:", error);
            return [];
        }
    };

    //加入到待出貨清單
    const handleShipConfirm = async () => {

        const requestDeleteBody = { pallet_names: selectedRowsPalletName };
        const requestUpdateBody = { pallet_names: selectedRowsPalletName };
        const requestShippedBody = await prepareShippedData();

        console.log("requestShippedBody:", JSON.stringify(requestShippedBody, null, 2))
        try {
            // 刪除 
            await fetch(`${globalUrl.url}/api/carton-detail/allPalletship`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestDeleteBody),
            });

            // 更新 quantity=0
            await fetch(`${globalUrl.url}/api/update-quantityToZero`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestUpdateBody),
            });

            //將資料加入到出貨清單(購物車)
            if (requestShippedBody.length > 0) {
                await fetch(`${globalUrl.url}/api/cart/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestShippedBody),
                });
            }


            // 清空選擇的 palletName 陣列
            setSelectedRowsData([]);
            setSelectedRows([]);
            setSelectedRowsPalletName([]);

            alert("更新成功");
            // 重新取得 pallet 資料並更新表格
            await fetchPallet();

            console.log("操作成功，表格已更新");
        } catch (error) {
            console.error("操作失敗:", error);
            alert("操作失敗，請稍後再試");
        }

        setShowShipModal(false);

    };




    // /**
    //  * 
    //  * 以下這個出貨邏輯適用於未加入ShippingCart(購物車)邏輯
    //  * 
    //  */
    //     //整個棧板出貨 (複數個棧板)
    //     //做以下的事
    //     //1. 將checkbox選到的多個pallet的cartonDetail刪掉 (CartonDetailRepositiry)
    //     //2. 將checkbox選到的多個pallet的quantity數字改為0 (PalletRepositiry)
    //     //3. 將資料加入到已出貨清單
    //     //4. 重新fetch一次所有pallet用以更新前端渲染

    //     const handleOpenShipModal = () => {
    //         setShowShipModal(true);
    //     }


    //     //for整個棧板出貨 , 傳送複數個palletName資料已獲得那些pallet裡面的cartonDetails
    //     const prepareShippedData = async () => {
    //         try {
    //             // 從後端獲取所有選擇的 pallet 內的 cartonDetail
    //             const response = await fetch(`${globalUrl.url}/api/carton-detail/by-pallet-names`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ palletNames: selectedRowsPalletName }),
    //             });

    //             if (!response.ok) {
    //                 throw new Error("獲取 CartonDetail 失敗");
    //             }
    //             // 取得 pallet 內的 cartonDetail 資料
    //             const cartonDetails = await response.json();

    //             // 格式化為 shipped 資料
    //             const requestShippedBody = cartonDetails.map((carton: { palletName: any; cartonName: any; sn: any; qrRftray: any; qrPs: any; qrHs: any; qrRftrayBedid: any; qrPsBedid: any; qrHsBedid: any; }) => ({
    //                 palletName: carton.palletName,
    //                 cartonName: carton.cartonName,
    //                 sn: carton.sn,
    //                 qrRftray: carton.qrRftray,
    //                 qrPs: carton.qrPs,
    //                 qrHs: carton.qrHs,
    //                 qrRftrayBedid: carton.qrRftrayBedid,
    //                 qrPsBedid: carton.qrPsBedid,
    //                 qrHsBedid: carton.qrHsBedid,
    //                 shippedTime: dateTime,
    //             }));

    //             return requestShippedBody;
    //         } catch (error) {
    //             console.error("準備 shippedBody 失敗:", error);
    //             return [];
    //         }
    //     };

    //     //下載.xlxs
    //     const handleDownloadCustomerExcel = (dataForDownload: any[]) => {

    //         const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
    //         XLSX.writeFile(workbook, `${dateTime}.xlsx`);

    //     };

    //     //出貨
    //     const handleShipConfirm = async () => {

    //         const requestDeleteBody = { pallet_names: selectedRowsPalletName };
    //         const requestUpdateBody = { pallet_names: selectedRowsPalletName };
    //         const requestShippedBody = await prepareShippedData();

    //         console.log("requestShippedBody:", JSON.stringify(requestShippedBody, null, 2))
    //         try {
    //             // 刪除 
    //             await fetch(`${globalUrl.url}/api/carton-detail/allPalletship`, {
    //                 method: 'DELETE',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify(requestDeleteBody),
    //             });

    //             // 更新 quantity=0
    //             await fetch(`${globalUrl.url}/api/update-quantityToZero`, {
    //                 method: 'PUT',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify(requestUpdateBody),
    //             });

    //             //將資料加入到已出貨清單
    //             if (requestShippedBody.length > 0) {
    //                 await fetch(`${globalUrl.url}/api/post-shipped`, {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify(requestShippedBody),
    //                 });
    //             }


    //             // 清空選擇的 palletName 陣列
    //             setSelectedRows([]);
    //             setSelectedRowsPalletName([]);

    //             alert("更新成功");
    //             // 重新取得 pallet 資料並更新表格
    //             await fetchPallet();

    //             console.log("操作成功，表格已更新");
    //         } catch (error) {
    //             console.error("操作失敗:", error);
    //             alert("操作失敗，請稍後再試");
    //         }

    //         const customerExcelData = requestShippedBody.map((row: { qrHs: any; qrPs: any; qrRfTray: any; create_date: any; }) => ({
    //             ASN_Number: typeASN_Number,
    //             component_QR_code_syntax: row.qrRfTray,
    //             cable_operator_known_material_ID: "",   //
    //             housing_QR_code_syntax: row.qrHs,
    //             QR_PS: row.qrPs,
    //             manufacture_batch_number_or_identifier: "",
    //             manufacture_country: "Taiwan",
    //             manufacture_date: row.create_date,
    //             purchase_order_received_date: "",
    //             purchase_order_number: "",
    //             shipping_date: typeshipping_date,
    //             shipping_company_contractor: typeshipping_company_contractor,
    //             tracking_number: ""
    //         }));

    //         console.log("customerExcelData:", JSON.stringify(customerExcelData, null, 2))

    //         await handleDownloadCustomerExcel(customerExcelData);

    //         setShowShipModal(false);

    //     };

    //     /**
    //      * 
    //      * 以上適用未加入ShippingCart(購物車)時的邏輯
    //      * 
    //      */


    /**
     * 整個棧板設備轉移 (複數個棧板)  做以下的事
     * 
     * 1.判斷要合併的pallet的maxquantity-quantity-選擇的複數棧板的資料總和 是否>0
     * 2.更新carton表中選擇的檔案的palletName為要合併的palletName
     * 3.更新pallet表的quantity(舊跟新 兩個都要更新)
     * 4.重新fetch一次後端新資料-->渲染前端
     */

    //for整個棧板 設備轉移 , 傳送複數個palletName資料已獲得那些pallet裡面的cartonDetails
    const prepareMergeData = async () => {
        try {
            // 從後端獲取所有選擇的 pallet 內的 cartonDetail
            const response = await fetch(`${globalUrl.url}/api/carton-detail/by-pallet-names`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ palletNames: selectedRowsPalletName }),
            });

            if (!response.ok) {
                throw new Error("獲取 CartonDetail 失敗");
            }
            // 取得 所有pallet 內的 cartonDetail 資料
            const carton = await response.json();

            //全部carton資料的id陣列
            const cartonCount = carton.length;
            const idArray = carton?.map((carton: { id: any; }) => carton.id) || [];
            console.log("idArray :" + idArray);


            //總資料筆數
            setAllCartonAmount(cartonCount);
            setAllMergeCartonID(idArray);

            // 格式化為 merge 資料
            const requestMergeBody = carton.map((carton: { id: any; palletName: any; cartonName: any; sn: any; qrRfTray: any; qrPs: any; qrHs: any; qrRfTrayBedid: any; qrPsBedid: any; qrHsBedid: any; }) => ({
                id: carton.id,
                palletName: carton.palletName,
                cartonName: carton.cartonName,
                sn: carton.sn,
                qrRfTray: carton.qrRfTray,
                qrPs: carton.qrPs,
                qrHs: carton.qrHs,
                qrRfTrayBedid: carton.qrRfTrayBedid,
                qrPsBedid: carton.qrPsBedid,
                qrHsBedid: carton.qrHsBedid,
            }));


            // **回傳一個物件，包含數量與 ID 陣列**
            return { cartonCount, idArray };
        } catch (error) {
            console.error("準備 MergeBody 失敗:", error);
            // **在錯誤時也回傳一個預設的物件**
            return { cartonCount: 0, idArray: [] };
        }
    };
    const handleMerge = () => {
        setShowModal(true);
    };
    const handleMergeConfirm = async () => {

        setShowModal(false);
        //取得選擇要合併的棧板資料
        const palletResponse = await fetch(`${globalUrl.url}/api/get-pallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pallet_name: inputPalletName }),
        });
        if (!palletResponse.ok) {
            throw new Error('無法取得該Pallet的資料: ' + palletResponse.statusText);
        }
        const palletData = await palletResponse.json();
        setSelectedPallet(palletData);

        // **直接解構獲取最新的值**
        const { cartonCount, idArray } = await prepareMergeData();

        // alert("palletData:" + JSON.stringify(palletData, null, 2))
        console.log("palletData.maxQuantity:" + palletData.maxQuantity);
        console.log("palletData.quantity:" + palletData.quantity);
        console.log("allCartonAmount:" + cartonCount);



        //判斷選擇要合併的棧板(selectedPallet)maxQuantity-quantity - 總資料筆數allCartonAmount >= 0
        const remainingQuantity = palletData.maxQuantity - palletData.quantity - cartonCount;
        //如果pallet空間不夠則直接跳出handleMergeConfirm
        if (remainingQuantity < 0) {
            alert("要合併的pallet剩餘空間不足");
            return;
        }

        alert("合併後剩餘空間:" + remainingQuantity);

        //如果棧板空間夠,
        //1. 將所有carton的palletName透過id (allMergeCartonID) 更新為選擇的palletName
        //2. 要將pallet表中pallet的quantity更新


        try {
            //將選到所有carton的palletName更新為inputPalletName (用id)
            const requestBody =
            {
                id: idArray,
                pallet_name: inputPalletName
            }
            console.log("requestBody: ", JSON.stringify(requestBody, null, 2))

            await fetch(`${globalUrl.url}/api/updateCartonsPalletName`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });


            // 更新 checkbox選到pallet的quantity為0
            const requestZeroQuantityBody =
            {
                pallet_names: selectedRowsPalletName
            }
            console.log("requestZeroQuantityBody: ", JSON.stringify(requestZeroQuantityBody, null, 2))
            await fetch(`${globalUrl.url}/api/update-quantityToZero`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestZeroQuantityBody),
            });

            //更新 要加入棧板的quantity
            const addNewQuantity = palletData.quantity + cartonCount;
            const requestUpdateQuantityBody =
            {
                pallet_name: palletData.palletName,
                quantity: addNewQuantity
            }

            await fetch(`${globalUrl.url}/api/update-quantity`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestUpdateQuantityBody),
            });


            // 清空選擇的 palletName 陣列
            setSelectedRows([]);
            setSelectedRowsPalletName([]);
            // 清空
            setInputPalletName("");
            setSelectedPallet(null);
            setAllMergeCartonID([]);
            setAllCartonAmount(0)

            alert("更新成功");
            // 重新取得 pallet 資料並更新表格
            await fetchPallet();

            console.log("操作成功，表格已更新");
        } catch (error) {
            console.error("操作失敗:", error);
            alert("操作失敗，請稍後再試");
        }

    };



    /**(stock)pallet input欄位,按下enter後可以將該筆pallet的checkbox打勾 */
    const handleCheckBoxforStock = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSelectedRowsToDelete((prevSelected) => {
                // 找出符合 palletName 的 rows
                const matchingRows = allStockData.filter((row: any) => row.palletName === palToDel);

                // 提取 ID 和 palletName
                const matchingIds = matchingRows.map((row: any) => row.id);
                const matchingPalletNames = matchingRows.map((row: any) => row.palletName);

                // 確認是否所有符合的 row 都已被選取
                const allSelected = matchingIds.every(id => prevSelected.includes(id));

                // 更新選取的 rows ID
                const updatedSelectedRows = allSelected
                    ? prevSelected.filter(id => !matchingIds.includes(id)) // 取消勾選
                    : [...prevSelected, ...matchingIds]; // 勾選

                // 更新選取的 palletName
                setSelectedRowsToDeletePalletName((prevPalletNames) =>
                    allSelected
                        ? prevPalletNames.filter(name => !matchingPalletNames.includes(name)) // 取消 palletName
                        : [...prevPalletNames, ...matchingPalletNames] // 勾選 palletName
                );

                return updatedSelectedRows;
            });

            // 清空 input 欄位
            setPalToDel('');

        }
    };
    //從庫存中將複數個棧板刪除
    /**
     * 做以下
     * 1. 從stock中將該複數個pallet刪除 (/api/stock/delete-by-ids )
     *  - 判斷那些pallet裡面是否還有資料 , 如有則不給刪除
     * 2. 從pallet中將複數個棧板名稱的棧板資料刪除 
     * 
     * 
     */
    //回傳棧板裡面目前的cartonDetail的長度,如果不是0則不給刪除棧板
    const prepareDeleteData = async () => {
        try {
            // 從後端獲取所有選擇的 pallet 內的 cartonDetail
            const response = await fetch(`${globalUrl.url}/api/carton-detail/by-pallet-names`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ palletNames: selectedRowsToDeletePalletName }),
            });

            if (!response.ok) {
                throw new Error("獲取 CartonDetail 失敗");
            }
            // 取得 pallet 內的 cartonDetail 資料
            const cartonDetails = await response.json();
            console.log("棧板內總筆書:" + cartonDetails.length);
            return Array.isArray(cartonDetails) ? cartonDetails.length : 0;

        } catch (error) {
            console.error("準備 shippedBody 失敗:", error);
            return [];
        }
    }
    const handleDeleteConfirm = async () => {

        console.log("selectedRowsToDeletePalletName:" + selectedRowsToDeletePalletName);

        //如果那些棧板內還有carton資料則不給刪
        const dataLength = await prepareDeleteData();
        if (dataLength > 0) {
            alert("棧板內還有紙箱 , 無法刪除");
            return;
        }

        // alert("dataLength:" + dataLength);
        const requestDeleteBody = { ids: selectedRowsToDelete };
        try {
            // 刪除stock資料
            await fetch(`${globalUrl.url}/api/stock/delete-by-ids`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestDeleteBody),
            });
            //刪除pallet資料
            await fetch(`${globalUrl.url}/api/carton-detail/allPalletship`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestDeleteBody),
            });

            // 清空選擇的 palletName 陣列
            setSelectedRowsToDelete([]);
            setSelectedRowsToDeletePalletName([]);


            alert("更新成功");
            // 重新取得 pallet 資料並更新表格
            await fetchPallet();
            await fetchStock();

            console.log("操作成功，表格已更新");
        } catch (error) {
            console.error("操作失敗:", error);
            alert("操作失敗，請稍後再試");
        }
    }




    return (
        <div style={{ display: "flex", gap: "16px" }}>
            {/* 選擇要將設備合併到某個pallet */}
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 渲染 palletName 與 Radio */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 Pallet Name"
                                    variant="outlined"
                                    value={inputPalletName}
                                    onChange={(event) => setInputPalletName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault(); // 防止表單提交
                                            const foundPallet = palletData.find(row => row.palletName === inputPalletName);
                                            if (foundPallet) {
                                                setSelectedPalletName(inputPalletName); // 設定選取的 Radio
                                            } else {
                                                alert("沒有此 palletName");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setInputPalletName(""); // 點擊時清空輸入框
                                        setSelectedPalletName(""); // 取消選取的 Radio
                                    }}
                                />
                            </Grid>

                            {/* 渲染 palletName 與 Radio */}
                            <Grid item xs={12}>
                                <RadioGroup
                                    value={selectedPalletName}
                                    onChange={(event) => {
                                        setSelectedPalletName(event.target.value);
                                        setInputPalletName(event.target.value); // 設定輸入框為選取的 palletName
                                    }}
                                >
                                    {palletData
                                        .filter((row) => !selectedRowsPalletName.includes(row.palletName)) // 過濾掉 selectedRowsPalletName 裡的值
                                        // .filter((row) => row.palletName !== palletName) // 過濾掉相同的 palletName
                                        .map((row) => (
                                            <FormControlLabel
                                                key={row.id}
                                                value={row.palletName}
                                                control={<Radio />}
                                                label={row.palletName}
                                            />
                                        ))}
                                </RadioGroup>
                            </Grid>

                            {/* 確認按鈕 */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleMergeConfirm}
                                    disabled={!selectedPalletName} // 當未選擇時禁用按鈕
                                >
                                    {formatMessage({ id: 'confirm' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {/* 確認出貨前要讓使用者填入一些必要訊息 , 
            typeASN_Number 
            typeshipping_date
            typeshipping_company_contractor
            客戶
            */}
            {/* <Modal open={showShipModal} onClose={() => setShowShipModal(false)}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>

                            //ASN_Number 
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 ASN_Number"
                                    variant="outlined"
                                    value={typeASN_Number}
                                    onChange={(event) => setTypeASN_Number(event.target.value)}
                                />
                            </Grid>

                            //shipping_date
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 shipping_date"
                                    variant="outlined"
                                    type="date"
                                    value={typeshipping_date}
                                    onChange={(event) => setTypeshipping_date(event.target.value)}
                                    InputLabelProps={{ shrink: true }} // 讓 label 不會擋住 placeholder
                                />
                            </Grid>

                            shipping_company_contractor
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 shipping_company_contractor"
                                    variant="outlined"
                                    value={typeshipping_company_contractor}
                                    onChange={(event) => setShipping_company_contractor(event.target.value)}
                                />
                            </Grid>

                            //從這邊開始 要建立ACI 達運 客戶表
                            //客戶  ,  單選式下拉 + 文字搜尋
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入客戶名稱"
                                    variant="outlined"
                                    value={customer}
                                    onChange={(event) => setCustomer(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault(); // 防止表單提交
                                            const foundCustomer = palletData.find(row => row.palletName === inputPalletName);
                                            if (foundPallet) {
                                                setSelectedPalletName(inputPalletName); // 設定選取的 Radio
                                            } else {
                                                alert("沒有此 客戶");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setInputPalletName(""); // 點擊時清空輸入框
                                        setSelectedPalletName(""); // 取消選取的 Radio
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <RadioGroup
                                    value={selectedPalletName}
                                    onChange={(event) => {
                                        setSelectedPalletName(event.target.value);
                                        setInputPalletName(event.target.value); // 設定輸入框為選取的 palletName
                                    }}
                                >
                                    {palletData
                                        .filter((row) => !selectedRowsPalletName.includes(row.palletName)) // 過濾掉 selectedRowsPalletName 裡的值
                                        // .filter((row) => row.palletName !== palletName) // 過濾掉相同的 palletName
                                        .map((row) => (
                                            <FormControlLabel
                                                key={row.id}
                                                value={row.palletName}
                                                control={<Radio />}
                                                label={row.palletName}
                                            />
                                        ))}
                                </RadioGroup>
                            </Grid> 


                            //確認按鈕 
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleShipConfirm}
                                    disabled={!typeASN_Number || !typeshipping_date || !typeshipping_company_contractor}
                                >
                                    {formatMessage({ id: 'confirm' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal> */}

            <Backdrop
                open={isEditing}
                onClick={handleBackgroundClick}
                style={{ zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            />
            {/* 渲染stock表 :  pallet_name  stock_time      */}
            <Paper style={{ flex: 1, overflowX: "auto", minWidth: "400px" }}>
                <h1>stock</h1>
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label>{formatMessage({ id: 'PalletName' })}：</label>
                        <input
                            type="text"
                            value={palToDel}
                            onChange={(e) => setPalToDel(e.target.value)}
                            onKeyDown={handleCheckBoxforStock}
                            style={{ padding: '5px', fontSize: '16px' }}
                        />
                        {selectedRowsToDelete.length > 0 && (
                            <Button variant="contained" color="primary" onClick={handleDeleteConfirm}>
                                刪除
                            </Button>
                        )}
                    </div>
                </>


                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{formatMessage({ id: 'deletePallet' })}</TableCell>
                                <TableCell align="center"><strong>{formatMessage({ id: 'id' })}</strong></TableCell>
                                <TableCell align="center"><strong>{formatMessage({ id: 'PalletName' })}</strong></TableCell>
                                <TableCell align="center"><strong>{formatMessage({ id: 'stockTime' })}</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allStockData.length > 0 ? (
                                allStockData.map((row, rowIndex: number) => (
                                    <TableRow key={row.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRowsToDelete.includes(row.id)}
                                                onChange={() => handleSelectRowToDel(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.palletName}</TableCell>
                                        <TableCell align="center">{row.stockTime}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align="center" colSpan={3}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>


            {/* 渲染pallet表 :  pallet_name  max_quantity  quantity  location 編輯按鈕     */}

            <Paper style={{ flex: 2, overflowX: "auto" }}>
                <h1>pallet</h1>
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label>{formatMessage({ id: 'PalletName' })}：</label>
                        <input
                            type="text"
                            value={pal}
                            onChange={(e) => setPal(e.target.value)}
                            onKeyDown={handleCheckBoxforPallet}
                            style={{ padding: '5px', fontSize: '16px' }}
                        />

                        {selectedRows.length > 0 && selectedRowsData.some(row => row.quantity !== 0) && (
                            <Button variant="contained" color="primary" onClick={handleShipConfirm}>
                                加入待出貨清單
                            </Button>

                        )}
                        {selectedRows.length > 0 && selectedRowsData.some(row => row.quantity !== 0) && (
                            <Button variant="contained" color="primary" onClick={handleMerge}>
                                設備轉移
                            </Button>

                        )}

                    </div>
                </>

                <div style={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    overflowX: "auto",
                    border: "1px solid #ccc",
                }}>

                    <TableContainer component={Paper}>
                        <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow style={{ border: '1px solid #ccc' }}>
                                    <TableCell>{formatMessage({ id: 'shipPallet' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'MaxQuantity' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'Quantity' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'Location' })}</TableCell>
                                    <TableCell>{formatMessage({ id: 'operate' })}</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {palletData.map((row: any, rowIndex: number) => (
                                    <TableRow key={row.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleSelectRow(row, row.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.palletName}</TableCell>
                                        <TableCell>{row.maxQuantity}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleLocationClick(row.location, rowIndex)} // 傳遞該行的 location 和索引
                                            >
                                                {isEditing && selectedRowIndex === rowIndex ? (
                                                    <input
                                                        type="text"
                                                        value={editedLocation}
                                                        onChange={handleLocationChange}
                                                        onKeyDown={(event) => handleKeyDown(event, rowIndex)}
                                                        style={{
                                                            backgroundColor: 'white',
                                                            width: '1000px',
                                                            height: '50px',
                                                            fontSize: '18px',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            zIndex: 1002,
                                                        }}
                                                        onBlur={handleSave}
                                                    />
                                                ) : (
                                                    <span style={{ color: 'blue', fontWeight: 'bold' }}>
                                                        {row.location}
                                                    </span>
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate('/ACI/picking', { state: { palletName: row.palletName } })}
                                            >
                                                {formatMessage({ id: 'edit' })}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>



        </div>
    );
}

export default ACIPalletManagementPage;
