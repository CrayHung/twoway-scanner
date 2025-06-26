import { Autocomplete, Select, MenuItem, Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Table, Checkbox, Grid, Modal, TextField, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";
import * as XLSX from 'xlsx';
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


type ExcelRow = {
    deliveryNumber: number;
    asnNumber: string;
    customerName: string;
    customerPart: string;
    aciPart: number;
    amount: number;
    shippedTime: number;
};

const ACIShippingCart = () => {


    const { globalUrl, palletName, setPalletName } = useGlobalContext();

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = getFormattedDateTime('TW'); // 合併日期和時間
    const USdateTime = getFormattedDateTime('US');

    
    // 通用時間格式 , 傳入TW或US 可以得到該地區時間字串
    function getFormattedDateTime(region: 'TW' | 'US'): string {
        const now = new Date();
      
        const timeZone = region === 'TW' ? 'Asia/Taipei' : 'America/Los_Angeles';
      
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 24小時制
        });
      
        const parts = formatter.formatToParts(now);
        const getPart = (type: string) => parts.find(p => p.type === type)?.value.padStart(2, '0');
      
        const year = getPart('year');
        const month = getPart('month');
        const day = getPart('day');
        const hour = getPart('hour');
        const minute = getPart('minute');
        const second = getPart('second');
      
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }


      //獲得美國日期 (YYYY-MM-DD 格式)
      function getUSDate(): string {
        const now = new Date();
      
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      
        const parts = formatter.formatToParts(now);
        const getPart = (type: string) => parts.find(p => p.type === type)?.value.padStart(2, '0');
      
        const year = getPart('year');
        const month = getPart('month');
        const day = getPart('day');
      
        return `${year}-${month}-${day}`;
      }



    const navigate = useNavigate();
    const { formatMessage } = useIntl();

    //記錄棧板中有多少紙箱資料
    const [cartonDetails, setCartonDetails] = useState<any[]>([]);
    //使用者用文字框搜尋紙箱
    const [carton, setCarton] = useState('');

    //for 選擇哪幾行的check box
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectedRowsPalletName, setSelectedRowsPalletName] = useState<string[]>([]);
    const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);

    //一開始渲染Table的資料
    const [allStockData, setAllStockData] = useState<any[]>([]);
    const [palletData, setPalletData] = useState<any[]>([]);
    const [cartData, setCartData] = useState<any[]>([]);
    const [customerData, setCustomerData] = useState<any[]>([]);


    //設備轉移用
    const [showModal, setShowModal] = useState(false);
    const [selectedPalletName, setSelectedPalletName] = useState<string>(''); // Radio 選擇的值
    const [inputPalletName, setInputPalletName] = useState(""); // 文字輸入框的值


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


    //用來設定是否有選擇excel了 , 


    useEffect(() => {
        console.log("🟢 selectedRowsData 更新:", selectedRowsData);
    }, [selectedRowsData]);



    useEffect(() => {
        console.log("🟢 palletData 更新:", palletData);
    }, [palletData]);

    useEffect(() => {
        console.log("🟢 selectedRows 更新:", selectedRows);
    }, [selectedRows]);

    useEffect(() => {
        console.log("🟢 selectedRowsPalletName 更新:", selectedRowsPalletName);
    }, [selectedRowsPalletName]);

    useEffect(() => {
        console.log("🟢 selectedRowsPalletID 更新:", selectedRowsPalletName);
    }, [selectedRowsPalletName]);

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


    useEffect(() => {
        fetchAciCustomer();
    }, []);

    useEffect(() => {
        fetchStock();
    }, []);


    useEffect(() => {
        if (allStockData.length > 0) {
            fetchPallet();
        }
    }, [allStockData]);

    useEffect(() => {
        fetchCart();

    }, []);


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


    //checkbox選擇單一行資料時,同時設定selectedRowsPalletName
    const handleSelectRow = (rowData: any, id: number, palletName: string) => {



        setSelectedRows((prevSelected) => {
            const isSelected = prevSelected.includes(id);

            setSelectedRowsData((prevData) => {
                if (isSelected) {
                    // 取消選取：移除對應 id 的資料
                    return prevData.filter((item) => item.id !== id);
                } else {
                    // 新增選取：加入 rowData
                    return [...prevData, rowData];
                }
            });

            const updatedSelectedRows = isSelected
                ? prevSelected.filter((rowId) => rowId !== id)
                : [...prevSelected, id];

            // console.log("更新後 selectedRows:", updatedSelectedRows);

            setSelectedRowsPalletName((prevPalletNames) => {
                const updatedPalletNames = isSelected
                    ? prevPalletNames.filter((name) => name !== palletName)
                    : [...prevPalletNames, palletName];

                return updatedPalletNames;
            });

            return updatedSelectedRows;
        });
    };

    //checkbox選擇所有資料時
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = cartData.map((row) => row.id);
            const allPalletNames = cartData.map((row) => row.palletName);

            setSelectedRowsData(cartData);

            setSelectedRows(allIds);
            setSelectedRowsPalletName(allPalletNames);
        } else {
            setSelectedRowsData([]);

            setSelectedRowsPalletName([])
            setSelectedRows([]);
        }
    };



    const handleCheckBoxforCarton = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            console.log("此時的setCarton為 : " + carton);
            // console.log("palletData : ", JSON.stringify(palletData, null, 2));
            // console.log("cartData : ", JSON.stringify(cartData, null, 2));

            // 找出符合 cartonName 的 rows
            const matchingRows = cartData.filter((row: any) => row.cartonName === carton);

            // 提取 ID 和 palletName
            const matchingIds = matchingRows.map((row: any) => row.id);
            const matchingPalletNames = Array.from(new Set(matchingRows.map((row: any) => row.palletName)));

            const currentSelectedIds = selectedRows;

            // 確認是否所有符合的 row 都已被選取
            const allSelected = matchingIds.every(id => currentSelectedIds.includes(id));

            setSelectedRows((prevSelected) => {

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
            setCarton('');
        }


    };

    //取得所有的cart資料
    const fetchCart = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/cart/items`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                console.error("Failed to fetch pallets:", response.status, response.statusText);
                return;
            }

            const cart = await response.json();
            setCartData(cart);
            console.log("取得的cart :", JSON.stringify(cart, null, 2));
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
    };


    //下載.xlxs
    const handleDownloadCustomerExcel = (dataForDownload: any[]) => {

        const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
        XLSX.writeFile(workbook, `${USdateTime}.xlsx`);

    };



    //將購物車內容加入到以出貨清單 , 使用/cart/checkout API
    //可以將傳入的資料新增近shipped+移出cart
    //重新fetch一次所有cartData用以更新前端渲染

    const handleOpenShipModal = () => {
        setShowShipModal(true);
    }

    // //for出貨 傳送複數個palletName資料已獲得那些pallet裡面的cartonDetails
    // const prepareShippedData = async () => {
    //     try {

    //         const body = JSON.stringify({ palletNames: selectedRowsPalletName });
    //         console.log("Request body:", body);
    //         // console.log("selectedRowsPalletName :" + selectedRowsPalletName);
    //         // console.log("body: " + JSON.stringify({ palletNames: selectedRowsPalletName }));
    //         // 從後端獲取所有選擇的 pallet 內的 cartonDetail
    //         const response = await fetch(`${globalUrl.url}/api/cart/by-pallet-names`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: body,
    //         });

    //         if (!response.ok) {
    //             throw new Error("獲取 CartonDetail 失敗");
    //         }
    //         // 取得 pallet 內的 cartonDetail 資料
    //         const cartonDetails = await response.json();


    //         console.log("cartonDetails :", JSON.stringify(cartonDetails, null, 2))
    //         // 格式化為 shipped 資料
    //         const requestShippedBody = cartonDetails.map((carton: { palletName: any; cartonName: any; sn: any; qrRfTray: any; qrPs: any; qrHs: any; qrRfTrayBedid: any; qrPsBedid: any; qrHsBedid: any; }) => ({
    //             palletName: carton.palletName,
    //             cartonName: carton.cartonName,
    //             sn: carton.sn,
    //             qrRfTray: carton.qrRfTray,
    //             qrPs: carton.qrPs,
    //             qrHs: carton.qrHs,
    //             qrRfTrayBedid: carton.qrRfTrayBedid,
    //             qrPsBedid: carton.qrPsBedid,
    //             qrHsBedid: carton.qrHsBedid,
    //             shippedTime: dateTime,
    //         }));

    //         return requestShippedBody;
    //     } catch (error) {
    //         console.error("準備 shippedBody 失敗:", error);
    //         return [];
    //     }
    // };

    //for出貨 傳送複數個palletName資料已獲得那些pallet裡面的cartonDetails
    const prepareShippedData = async () => {
        try {

            const body = JSON.stringify({ ids: selectedRows });
            console.log("選擇到的rows :", body);
            // console.log("selectedRowsPalletName :" + selectedRowsPalletName);
            // console.log("body: " + JSON.stringify({ palletNames: selectedRowsPalletName }));
            // 從後端獲取所有選擇的 pallet 內的 cartonDetail
            const response = await fetch(`${globalUrl.url}/api/cart/by-pallet-ID`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body,
            });

            if (!response.ok) {
                throw new Error("獲取 CartonDetail 失敗");
            }
            // 取得 pallet 內的 cartonDetail 資料
            const cartonDetails = await response.json();
            const USDate =  getUSDate();

            // console.log("cartonDetails :", JSON.stringify(cartonDetails, null, 2))
            // 格式化為 shipped 資料
            const requestShippedBody = cartonDetails.map((carton: { id: any; palletName: any; cartonName: any; sn: any; qrRfTray: any; qrPs: any; qrHs: any; qrRfTrayBedid: any; qrPsBedid: any; qrHsBedid: any; }) => ({
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
                shippedTime: USdateTime,

                asn_number: typeASN_Number,
                cable_operator_known_material_id: selectedCustomerPart, //帶入客戶料號
                manufacture_batch_number_or_identifier: carton.palletName, //還不確定是什麼  先放棧板名稱
                manufacture_country: "Taiwan",
                manufacture_date: USDate,  //建立日期?  先放上美國當日時間
                purchase_order_received_date: typereceived_date,
                purchase_order_number: typepurchase_order_number,
                shipping_date: typeshipping_date,
                shipping_company_contractor: typeshipping_company_contractor,
                tracking_number: typeTracking_Number,


                customer: selectedCustomer




            }));

            return requestShippedBody;
        } catch (error) {
            console.error("準備 shippedBody 失敗:", error);
            return [];
        }
    };

    //出貨
    //將購物車內容加入到以出貨清單 , 使用/cart/checkout API
    //可以將傳入的資料新增近shipped+移出cart
    //正常要加資料加入到ship表中(/post-shipped) , 但這邊的/cart/checkout已經有包含將資料加入到ship了,故不用再call一次加入到ship表的API(/post-shipped)
    //重新fetch一次所有cartData用以更新前端渲染
    const handleShipConfirm = async () => {

        const requestShippedBody = await prepareShippedData();
        console.log("準備出貨的資料是 : ", JSON.stringify(requestShippedBody, null, 2))

        try {
            if (requestShippedBody.length > 0) {
                const response = await fetch(`${globalUrl.url}/api/cart/checkout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestShippedBody),
                });

                if (!response.ok) {
                    throw new Error("獲取 CartonDetail 失敗");
                }

                alert("post-shipped OK");

            }

            // 清空選擇的 palletName 陣列
            setSelectedRowsData([]);
            setSelectedRows([]);
            setSelectedRowsPalletName([]);

            alert("更新成功");
            // 重新取得 cart 資料並更新表格
            await fetchCart();

            console.log("操作成功，表格已更新");
        } catch (error) {
            console.error("操作失敗:", error);
            alert("操作失敗，請稍後再試");
        }


        const USDate =  getUSDate();

        const customerExcelData = requestShippedBody.map((row: { palletName: any; qrHs: any; qrPs: any; qrRfTray: any; }) => ({
            ASN_Number: typeASN_Number,
            component_QR_code_syntax: row.qrRfTray,
            housing_QR_code_syntax: row.qrHs,
            cable_operator_known_material_ID: selectedCustomerPart,   //帶入客戶料號

            manufacture_batch_number_or_identifier: row.palletName, //還不確定是什麼  先放棧板名稱
            manufacture_country: "Taiwan",
            manufacture_date: USDate,    //建立日期?
            purchase_order_received_date: typereceived_date,
            purchase_order_number: typepurchase_order_number,
            shipping_date: typeshipping_date,
            shipping_company_contractor: typeshipping_company_contractor,
            tracking_number: typeTracking_Number
        }));

        // console.log("excel的資料是 :", JSON.stringify(customerExcelData, null, 2))

        // await handleDownloadCustomerExcel(customerExcelData);


        setShowShipModal(false);

    };




    //渲染下拉式顧客選單
    const handleSelectChange = (event: any) => {
        setSelectedCustomer(event.target.value);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

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


    //將待出貨中的資料作設備轉移
    // 做以下事
    //  1.  判斷要合併的pallet的maxquantity-quantity是否>=選擇的資料筆數
    //  2.  將選到的資料加回pallet (update pallet+1)
    //  3.  將選到的資料加回cartonDetails
    //  4.  將選到的內容{ids:[1,7]} 從cart表中移除
    //  5.  重新fetch一次後端新資料-->渲染前端

    const handleMerge = () => {
        setShowModal(true);
    };


    const handleMergeConfirm = async () => {


        const selectedCount = selectedRowsData.length;


        alert(selectedRows + "合併到:" + selectedPalletName + "棧板");
        alert("合併的資料筆數 : " + selectedCount);
        setShowModal(false);

        console.log("selectedPalletName :" + selectedPalletName);

        //  1.  判斷要合併的pallet的maxquantity-quantity是否>=選擇的資料筆數
        //  1.1 先抓出要選擇合併的pallet資料
        //  1.2 根據抓出的pallet.maxquantity- pallet.quantity  >=  selectedRows.length 判斷是否可加
        const responsePallets = await fetch(`${globalUrl.url}/api/get-pallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pallet_name: selectedPalletName }),
        });

        if (!responsePallets.ok) {
            console.error("Failed to fetch pallets:", responsePallets.status, responsePallets.statusText);
            return;
        }
        const pallets = await responsePallets.json();
        //  判斷選擇要合併的棧板maxQuantity-quantity>=selectedRowsData.length?
        const result = pallets.maxQuantity - pallets.quantity;
        if (result < selectedRowsData.length) {
            alert("要核定的pallet剩餘空間不足");
            return;
        }

        const resultToADD = pallets.quantity + selectedRowsData.length;

        //  將選到的資料長度加回pallet (update pallet+1)
        await fetch(`${globalUrl.url}/api/update-quantity`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pallet_name: selectedPalletName, quantity: resultToADD }),
        });


        //  將選到的資料加到cartonDetails表中
        // 要保留的欄位
        const requiredFields = [
            "palletName",
            "cartonName",
            "sn",
            "qrRfTray",
            "qrPs",
            "qrHs",
            "qrRfTrayBedid",
            "qrPsBedid",
            "qrHsBedid"
        ];
        //  cartonDetails需要的格式
        const transformedData = selectedRowsData.map(item => {
            const newItem: any = {};

            requiredFields.forEach((field) => {
                // palletName欄位改成選擇要加入的棧板名稱 selectedPalletName
                newItem[field] = field === "palletName"
                    ? selectedPalletName
                    : item[field] !== undefined
                        ? item[field]
                        : null;
            });
            return newItem;
        });
        // console.log("準備加入倒cartonDetail的資料:" , JSON.stringify(transformedData, null, 2) )
        await fetch(`${globalUrl.url}/api/post-carton-details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transformedData),
        });

        //    4.  將選到的內容{ids:[1,7]} 從cart表中移除


        await fetch(`${globalUrl.url}/api/cart/remove-multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedRows }),
        });

        //  5.  重新fetch一次後端新資料-->渲染前端
        fetchCart();

    };



    /************************************************
     * 渲染改為先渲染上傳檔案button後才開放checkbox可選狀態
     * 以下是excelData讀入後以
[
  [
    "deliveryNumber",
    "asnNumber",
    "customerName",
    "customerPart",
    "aciPart",
    "amount",
    "shippedTime"
  ],
  [
    1,
    "test1",
    "cray2",
    "custome12",
    77,
    5,
    45810.58332175926
  ]
]
儲存
     * 
     ************************************************/
    // const [excelData, setExcelData] = useState<(string | number)[][]>([]);
    // const [columns, setColumns] = useState([]);

    // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const reader = new FileReader();

    //     reader.onload = (event) => {
    //         const data = new Uint8Array(event.target?.result as ArrayBuffer);
    //         const workbook = XLSX.read(data, { type: 'array' });

    //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //         const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    //         setExcelData(jsonData);
    //     };

    //     reader.readAsArrayBuffer(file);
    // };


    /***********************************************/

    const [excelData, setExcelData] = useState<Record<string, string | number>[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet, {
                defval: "", // 填補空白欄位為空字串
                raw: false,
            });

            // 檢查每一列的每個欄位是否為空或 null
            const hasEmptyCell = jsonData.some(row =>
                Object.values(row).some(value => value === null || value === "")
            );

            if (hasEmptyCell) {
                alert("Excel 檔案中存在空值，請確認內容並重新上傳。");
                setExcelData([]); // 清空資料
                return;
            }


            setExcelData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };


    /***********************************************/



    const handleUpload = () => {
        console.log('Send to backend:', excelData);

        // TODO: 用 fetch/axios POST 至後端 API 儲存進 MySQL
        // fetch('/api/save-excel', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(excelData),
        // });
    };

    useEffect(() => {
        console.log("excelData : ", JSON.stringify(excelData, null, 2))
    }, [excelData])




    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                // overflow: "auto",
            }}>
            {/* 確認出貨前要讓使用者填入一些必要訊息 , 
            typeASN_Number 

            received Date
            selectedCustomer
            typeshipping_date
            typeshipping_company_contractor
            **Tracking Number
  
            */}
            <Modal open={showShipModal} onClose={() => setShowShipModal(false)}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>

                            {/* ASN_Number */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 ASN_Number"
                                    variant="outlined"
                                    value={typeASN_Number}
                                    onChange={(event) => setTypeASN_Number(event.target.value)}
                                />
                            </Grid>

                            {/* purchase_order_number */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 purchase_order_number"
                                    variant="outlined"
                                    value={typepurchase_order_number}
                                    onChange={(event) => setTypepurchase_order_number(event.target.value)}
                                />
                            </Grid>

                            {/* received_date */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 received_date"
                                    variant="outlined"
                                    type="date"
                                    value={typereceived_date}
                                    onChange={(event) => setTypereceived_date(event.target.value)}
                                    InputLabelProps={{ shrink: true }} // 讓 label 不會擋住 placeholder
                                />
                            </Grid>



                            {/* shipping_date */}
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

                            {/* shipping_company_contractor */}
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

                            {/* Tracking Number */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 Tracking Number"
                                    variant="outlined"
                                    value={typeTracking_Number}
                                    onChange={(event) => seTypeTracking_Number(event.target.value)}
                                    onClick={(event) => seTypeTracking_Number('')}
                                />
                            </Grid>


                            {/* 客戶料號  ,  使用單選式下拉 + 文字搜尋 */}
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {/* 下拉式單選選單 */}
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

                                    {/* 自動完成輸入框 + 確認按鈕 */}
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


                            {/* 確認按鈕 */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleShipConfirm}
                                    disabled={!typeASN_Number || !typeshipping_date || !typeshipping_company_contractor || !selectedCustomer}
                                >
                                    {formatMessage({ id: 'confirm' })}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>



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
                                        .filter((row) => row.palletName !== palletName) // 過濾掉相同的 palletName
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

            {/* ******************************************************************************* */}
            {/* /***********************************************
     * 以下是excelData讀入後以
[
  [
    "deliveryNumber",
    "asnNumber",
    "customerName",
    "customerPart",
    "aciPart",
    "amount",
    "shippedTime"
  ],
  [
    1,
    "test1",
    "cray2",
    "custome12",
    77,
    5,
    45810.58332175926
  ]
]
儲存
     * 
     ************************************************/ }
            {/* < input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {excelData && excelData.length > 0 && (
                <div style={{ maxHeight: '30%', overflow: 'auto', marginBottom: '10px' }}>
                    <h3>excel 內容</h3>
                    <Paper sx={{ width: '100%', overflow: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
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
                    </Paper>
                </div>
            )} */}
            {/* ******************************************************************************* */}

            {/* Cart 資料區塊 */}
            {/* <Paper sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
                <h3>待出貨清單</h3>

                {/* 動態按鈕 */}
            {/* <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {(cartData.length > 0 || excelData.length > 0) && (
                        <>
                            {excelData.length > 1 &&
                                (() => {
                                    const headers = excelData[0];
                                    const dataRow = excelData[1];
                                    const amountIndex = headers.indexOf("amount");
                                    const expectedCount = amountIndex !== -1 ? Number(dataRow[amountIndex]) : 0;
                                    const shouldShowShipButton = cartData.length === expectedCount;

                                    return shouldShowShipButton ? (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleOpenShipModal}
                                        >
                                            出貨
                                        </Button>
                                    ) : (
                                        <span style={{ color: 'red' }}>
                                            選取的excel 的 amount {expectedCount} 不符合，待出貨清單為 {cartData.length} 筆，需資料相符才可出貨
                                        </span>
                                    );
                                })()}
                            <Button variant="outlined" color="secondary" onClick={handleMerge}>
                                設備轉移
                            </Button>
                        </>
                    )}
                </div> */}
            {/* ******************************************************************************* */}
            {/* /***********************************************
     * 以下是excelData讀入後以
[
  {
    deliveryNumber: 1,
    asnNumber: "test1",
    customerName: "cray2",
    customerPart: "custome12",
    aciPart: 77,
    amount: 5,
    shippedTime: 45810.58332175926
  },
  ...
]
儲存
     * 
     ************************************************/ }
            {/* Excel 資料區塊 */}
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

            {excelData.length > 0 && (
                <div style={{ maxHeight: '30%', overflow: 'auto', marginBottom: '10px' }}>
                    <h3>excel 內容</h3>
                    <Paper sx={{ width: '100%', overflow: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(excelData[0]).map((key) => (
                                            <TableCell key={key}>{key}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {excelData.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {Object.keys(excelData[0]).map((key) => (
                                                <TableCell key={key}>{row[key]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            )}
            {/* Cart 資料區塊 */}
            <Paper sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
                <h3>待出貨清單</h3>
       
                        {excelData.length > 0 && !excelData.some(row => Object.values(row).some(v => v === "" || v === null)) && 
                            (() => {
                                const amountValue = excelData[0]?.amount;
                                const expectedCount = typeof amountValue === "number" ? amountValue : Number(amountValue);
                                const shouldShowShipButton = cartData.length === expectedCount;

                                return shouldShowShipButton ? (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleOpenShipModal}
                                    >
                                        出貨
                                    </Button>
                                ) : (
                                    <span style={{ color: 'red' }}>
                                        選取的 excel 的 amount : {expectedCount} ; 待出貨清單的數量 : {cartData.length} ，需數量相符才可出貨
                                    </span>
                                );
                            })()
                        }
                        <br></br>
                        {cartData.length > 0 && (
                        <Button variant="outlined" color="secondary" onClick={handleMerge}>
                            設備轉移
                        </Button>)}

     



                {/* 空資料處理 */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {cartData.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>no data</p>
                    ) : (
                        <>

                            <div style={{ marginBottom: '10px' }}>
                                <label>{formatMessage({ id: 'CartonNames' })}：</label>
                                <input
                                    type="text"
                                    value={carton}
                                    onChange={(e) => setCarton(e.target.value)}
                                    onKeyDown={handleCheckBoxforCarton}
                                />
                            </div>

                            <TableContainer component="div" style={{ maxHeight: '400px', overflow: 'auto' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedRows.length > 0 && selectedRows.length < cartData.length}
                                                    checked={selectedRows.length === cartData.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>{formatMessage({ id: 'id' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'PalletName' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'CartonNames' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'sn' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_RFTray' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_PS' })}</TableCell>
                                            <TableCell>{formatMessage({ id: 'QR_HS' })}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartData.map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedRows.includes(row.id)}
                                                        onChange={() => handleSelectRow(row, row.id, row.palletName)}
                                                    />
                                                </TableCell>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.palletName}</TableCell>
                                                <TableCell>{row.cartonName}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.qrRfTray}</TableCell>
                                                <TableCell>{row.qrPs}</TableCell>
                                                <TableCell>{row.qrHs}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </div>
            </Paper>

        </div >
    );
}

export default ACIShippingCart;
