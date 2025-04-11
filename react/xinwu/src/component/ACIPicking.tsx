import { Grid, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Button, Checkbox, Modal, Box, FormControlLabel, Radio, RadioGroup, TextField, Autocomplete } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../global';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";
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

const ACIPicking = () => {
    const { globalUrl, palletName, setPalletName } = useGlobalContext();
    const location = useLocation();
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const [tableView, setTableView] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //增加紙箱
    const [showAddCartonModal, setShowAddCartonModal] = useState(false);
    const [inputWorkOrderNumber, setInputWorkOrderNumber] = useState(""); // 文字輸入框的值 (工單)
    const [inputCartonAmount, setInputCartonAmount] = useState<string | number>("");
    const [inputACIPartNumber, setInputACIPartNumber] = useState(""); // 文字輸入框的值 (料號)
    const [ACIPartNumber, setACIPartNumber] = useState<any[]>([])


    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 當前日期 (YYYY-MM-DD 格式)
    const time = now.toTimeString().split(' ')[0]; // 當前時間 (HH:mm:ss)
    const dateTime = `${today} ${time}`; // 合併日期和時間




    //for pallet
    //掃描初始棧板用
    const [tempPalletName, setTempPalletName] = useState<string>('');
    const [allPalletData, setAllPalletData] = useState<any[]>([]);
    //for carton
    //記錄棧板中有多少紙箱資料
    const [cartonDetails, setCartonDetails] = useState<any[]>([]);
    const [currentPalletData, setCurrentPalletData] = useState<PalletData | null>(null);

    //使用者用文字框搜尋紙箱
    const [carton, setCarton] = useState('');

    //for 選擇哪幾行的check box (用以出貨 或 合併 或 重工)
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    //for 合併設備用
    const [selectedPalletName, setSelectedPalletName] = useState<string>(''); // Radio 選擇的值
    const [inputPalletName, setInputPalletName] = useState(""); // 文字輸入框的值

    //for 合併設備 將要合併的對象的pallet資料抓出來
    const [selectedPallet, setSelectedPallet] = useState<PalletData | null>(null);

    /**
     * 點擊”出貨”按鈕後 , 
     * 要跳一個視窗讓使用者填入幾個欄位的訊息 , 
     * 訊息的內容要直接加入到下載excel的內容裡面 
     * (ASN_Number
     * shipping_date
     * shipping_company_contractor
     * )
     */
    const [typeASN_Number, setTypeASN_Number] = useState<string>('');
    const [typeshipping_date, setTypeshipping_date] = useState<string>('');
    const [typeshipping_company_contractor, setShipping_company_contractor] = useState<string>('');
    const [customer, setCustomer] = useState<string>('');

    const [showShipModal, setShowShipModal] = useState(false);


    //如果組件有掛載的參數,則將參數設給tempPalletName
    useEffect(() => {
        if (location.state?.palletName) {
            setTempPalletName(location.state.palletName);

        }
    }, [location.state]);

    useEffect(() => {
        if (tempPalletName) {
            fetchPalletDetailData1();
        }
    }, [tempPalletName])


    //一開始就先取得所有的pallletName , quantity的資料
    useEffect(() => {
        fetchAllPalletName();
    }, []);
    const fetchAllPalletName = async () => {
        try {
            const response = await fetch(`${globalUrl.url}/api/get-all-pallet`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllPalletData(data);
                // console.log("所有pallet資料:", JSON.stringify(data, null, 2))

            } else {
                console.error('無法取得 Pallet 資料:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching pallet details:', error);
        }
    };

    /**
     * 改成通用型Get API
     */
    const getRequest = async (apiPath: string, body: any) => {
        try {
            const response = await fetch(`${globalUrl.url}${apiPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`取得失敗: ${errorMessage}`);
            }
            else {
                const data = response.json();
                return data;
            }
        } catch (error) {
            console.error("取得失敗:", error);
            return { success: false, message: error };
        }
    }



    /**
     * 改成通用型Update API
     */
    const updateRequest = async (apiPath: string, body: object) => {

        try {
            const response = await fetch(`${globalUrl.url}${apiPath}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`更新失敗: ${errorMessage}`);
            }
            else {
                return { success: true, message: "更新成功" };
            }
        } catch (error) {
            console.error("更新失敗:", error);
            return { success: false, message: error };
        }
    }


    /**
     * 改成通用型Delete API
     */
    const deleteRequest = async (apiPath: string, body: object) => {

        try {
            const response = await fetch(`${globalUrl.url}${apiPath}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`刪除失敗: ${errorMessage}`);
            }
            else {
                return { success: true, message: "刪除成功" };
            }
        } catch (error) {
            console.error('刪除失敗:', error);
            return { success: false, message: error };
        }
    }

    /**
     * 改成通用型Post API
     */
    const postRequest = async (apiPath: string, body: object) => {

        try {
            const response = await fetch(`${globalUrl.url}${apiPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`新增失敗: ${errorMessage}`);
            }
            else {
                return { success: true, message: "新增成功" };
            }
        } catch (error) {
            console.error("新增失敗:", error);
            return { success: false, message: error };
        }
    }

    //下載.xlxs
    const handleDownloadCustomerExcel = (dataForDownload: any[]) => {

        const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "excel");
        XLSX.writeFile(workbook, `${dateTime}.xlsx`);

    };

    //重新fetch cartonDetails的資料
    const fetchCartonDetails = async () => {
        //根據palletName取得該棧板名稱的CartonDetail
        try {
            const response = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: palletName }),
            });

            if (response.ok) {
                const data = await response.json();


                if (Array.isArray(data) && data.length === 0) {
                    alert('Pallet Name資料為空');
                    setCartonDetails([]);
                } else {
                    setCartonDetails(data);
                }
            } else {
                console.error('無法取得 該Pallet內的carton 資料:', response.statusText);
                setCartonDetails([]);
                alert('無法取得 該Pallet內的carton 資料 :' + response.statusText);

            }
        } catch (error) {
            console.error('Error fetching carton details:', error);
            alert('Error : ' + error);
            setCartonDetails([]);
            alert('錯誤:' + error);
        }
    };


    /**
     * for 出貨 , 做以下事   
     * 1.carton表移除選擇的資料
     * 2.更新pallet表的quantity  
     * 3.選擇的資料存入到"已出貨"表
     * 4.下載excel (將使用者輸入的資料加入到customerExcelData)
     * 5.重新fetch一次後端新資料-->渲染前端
     */

    /**
     * 更改為加入購物車 , 做以下事
     * 1. carton表移除選擇的資料
     * 2. 更新pallet表的quantity  
     * 3. 選擇的資料存入到"出貨"(cart)表
     * 4. 重新fetch一次後端新資料-->渲染前端
     * 
     */


    const handleOpenShipModal = () => {
        setShowShipModal(true);
    }



    const handleShip = async () => {
        //有被勾選的checkbox 資料
        const selectedData = cartonDetails.filter((row) => selectedRows.includes(row.id));
        const selectedCount = selectedRows.length;

        console.log("選擇的項目selectedData :", JSON.stringify(selectedData, null, 2))

        if (selectedCount === 0) {
            alert('重新選擇要出貨的項目');
            return;
        }

        alert("選擇的檔案內容是" + JSON.stringify(selectedData, null, 2));

        const requestDeleteBody = {
            pallet_name: palletName,
            ids: selectedData.map((detail) => detail.id),
        };
        //  console.log("要刪除的Bdoy :", JSON.stringify(requestBody, null, 2))
        /*
        格式
        {
            "pallet_name": "Pallet123",
            "ids": [1, 2, 3, 4]
        }*/


        // 從 allPalletData 中找出該筆對應的 palletName資料
        const updatedPalletData = allPalletData.map((pallet) => {
            if (pallet.palletName === palletName) {
                return {
                    ...pallet,
                    quantity: Math.max(0, pallet.quantity - selectedCount), // 確保數量不會變成負數
                };
            }
            return pallet;
        });



        // 找到更新後的該 pallet 的 quantity
        const updatedPallet = updatedPalletData.find(p => p.palletName === palletName);
        if (!updatedPallet) {
            alert("找不到 pallet");
            return;
        }


        const requestUpdateBody = {
            pallet_name: palletName,
            quantity: updatedPallet.quantity,
        };

        //加入已出貨(shipped)用這個postShippedBody
        // const postShippedBody = selectedData.map(item => ({
        //     ...item,
        //     shippedTime: dateTime
        // }));
        //加入出貨(cart)用這個postShippedBody
        const postShippedBody = selectedData.map(item => ({
            ...item,
            addedTime: dateTime
        }));

        console.log("postShippedBody :", JSON.stringify(postShippedBody, null, 2))


        ////////////////////////////////  API call  ////////////////////////////////////

        // //刪除carton的資料
        const resultDelete = await deleteRequest("/api/carton-detail/ship", requestDeleteBody);
        if (resultDelete.success) {
            // alert("出貨成功");
        } else {
            alert(`出貨失敗: ${resultDelete.message}`);
        }
        // //更新pallet的quantity
        const resultUpdate = await updateRequest("/api/update-quantity", requestUpdateBody);
        if (resultUpdate.success) {
            // alert("更新成功");
        } else {
            alert(`更新失敗: ${resultUpdate.message}`);
        }
        // //將資料加入到"出貨"(cart)
        const resultPost = await postRequest("/api/cart/add", postShippedBody);
        if (resultPost.success) {
            // alert("新增成功");
        } else {
            alert(`新增失敗: ${resultPost.message}`);
        }
        // // //將資料加入到"已出貨"(shipped)
        // const resultPost = await postRequest("/api/post-shipped", postShippedBody);
        // if (resultPost.success) {
        //     // alert("新增成功");
        // } else {
        //     alert(`新增失敗: ${resultPost.message}`);
        // }


        //更新cartonDetails , 避免資料不同步
        fetchCartonDetails();
        //更新allPalletData , 避免資料不同步
        // setAllPalletData(updatedPalletData);
        fetchAllPalletName();

        //將選擇的欄位清空
        setSelectedPallet(null);
        setTempPalletName('');
        setSelectedRows([]);

        //關閉Modal
        setShowShipModal(false);


    };






    //checkbox選擇所有資料時
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = cartonDetails.map((row) => row.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    //checkbox選擇單一行資料時
    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        console.log("cartonDetails : ", JSON.stringify(cartonDetails, null, 2))
    }, [cartonDetails])

    //根據scan出來的tempPalletName字串去fetch cartonDetails , 如有資料則將全域變數設為tempPalletName字串 
    //並渲染出該pallet底下的所有cartonDetails資訊
    const fetchPalletDetailData = async (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key !== "Enter") {
            setTableView(false);
            return;
        }


        //根據輸入的palletName取得該棧板名稱的CartonDetail
        try {
            const cartonResponse = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: tempPalletName }),
            });
            if (!cartonResponse.ok) {
                throw new Error('無法取得該Pallet內的carton資料: ' + cartonResponse.statusText);
            }

            const cartonData = await cartonResponse.json();

            if (Array.isArray(cartonData) && cartonData.length === 0) {
                alert('Pallet Name資料為空');
                setCartonDetails([]);
                setTableView(false);
            } else {
                setCartonDetails(cartonData);
                setTableView(true);
            }

            setPalletName(tempPalletName);
            setTempPalletName('');

            // Fetch pallet data

            const palletResponse = await fetch(`${globalUrl.url}/api/get-pallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: tempPalletName }),
            });
            if (!palletResponse.ok) {
                throw new Error('無法取得該Pallet內的carton資料: ' + palletResponse.statusText);
            }
            const palletData = await palletResponse.json();
            setCurrentPalletData(palletData);

        } catch (error) {
            console.error('Error:', error);
            alert('錯誤: ');
            setCurrentPalletData(null);
            setCartonDetails([]);
            setTableView(false);
            setPalletName('');
            setTempPalletName('');
        }
    };

    //乾鉅傳遞的參數(tempPalletName)直接fetch資料
    const fetchPalletDetailData1 = async () => {
        //根據輸入的palletName取得該棧板名稱的CartonDetail
        try {
            const cartonResponse = await fetch(`${globalUrl.url}/api/get-carton-detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: tempPalletName }),
            });
            if (!cartonResponse.ok) {
                throw new Error('無法取得該Pallet內的carton資料: ' + cartonResponse.statusText);
            }

            const cartonData = await cartonResponse.json();

            if (Array.isArray(cartonData) && cartonData.length === 0) {
                alert('Pallet Name資料為空');
                setCartonDetails([]);
                setTableView(false);
            } else {
                setCartonDetails(cartonData);
                setTableView(true);
            }

            setPalletName(tempPalletName);
            setTempPalletName('');

            // Fetch pallet data

            const palletResponse = await fetch(`${globalUrl.url}/api/get-pallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pallet_name: tempPalletName }),
            });
            if (!palletResponse.ok) {
                throw new Error('無法取得該Pallet內的carton資料: ' + palletResponse.statusText);
            }
            const palletData = await palletResponse.json();
            setCurrentPalletData(palletData);

        } catch (error) {
            console.error('Error:', error);
            alert('錯誤: ');
            setCurrentPalletData(null);
            setCartonDetails([]);
            setTableView(false);
            setPalletName('');
            setTempPalletName('');
        }
    };

    /**
     * for 合併 , 做以下事   
     * 1.判斷要合併的pallet的maxquantity-quantity是否>=選擇的資料筆數
     * 2.更新carton表中選擇的檔案的palletName為要合併的palletName
     * 3.更新pallet表的quantity(舊跟新 兩個都要更新)
     * 4.重新fetch一次後端新資料-->渲染前端
     */

    //for 合併
    const handleMerge = () => {
        setShowModal(true);
    };
    const handleMergeConfirm = async () => {

        /**
         * 
        currentPalletData=目前棧板的資料
        palletName=目前的棧板名稱(全域變數)
        selectedData=目前的棧板中,checkbox選擇到的行資料

        selectedPallet=選擇要合併的棧板
        selectedPalletName=選擇要合併的棧板名稱
         * 
         */

        const selectedData = cartonDetails.filter((row) => selectedRows.includes(row.id));
        const selectedCount = selectedRows.length;


        alert(selectedRows + "合併到:" + selectedPalletName + "棧板");
        setShowModal(false);

        console.log("selectedPalletName : " + selectedPalletName);
        //透過palletName取得選擇要合併的單一個pallet的資訊
        // Fetch pallet data


        const palletResponse = await fetch(`${globalUrl.url}/api/get-pallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pallet_name: selectedPalletName }),
        });
        if (!palletResponse.ok) {
            throw new Error('無法取得該Pallet的資料: ' + palletResponse.statusText);
        }
        const palletData = await palletResponse.json();
        setSelectedPallet(palletData);

        console.log("selectedPallet :", JSON.stringify(palletData, null, 2))

        //判斷選擇要合併的棧板(selectedPallet)maxQuantity-quantity>=selectData.length?
        const checkQuantity = (palletData: any, selectedData: any) => {
            const remainingQuantity = palletData.maxQuantity - palletData.quantity;
            return remainingQuantity >= selectedData.length;
        };
        //如果pallet空間不夠則直接跳出handleMergeConfirm
        if (!checkQuantity(palletData, selectedData)) {
            alert("要核定的pallet剩餘空間不足");
            return;
        }
        // console.log("selectedData :", JSON.stringify(selectedData, null, 2))

        //如果棧板空間夠,
        //1. carton表中 選擇到的行的palletName要更新
        //2. 要將pallet表中新舊pallet的quantity更新
        const requestUpdatePalletNameBody =
        {
            id: selectedRows,
            pallet_name: selectedPalletName
        };

        const addNewQuantity = (palletData?.quantity ?? 0) + selectedCount;
        const reduceNewQuantity = (currentPalletData?.quantity ?? 0) - selectedCount;

        //選擇合併的pallet是要增加quantity
        const requestIncreaseQuantityBody =
        {
            pallet_name: selectedPalletName,
            quantity: addNewQuantity
        }
            ;
        //當前的pallet是要減少quantity
        const requestDecreaseQuantityBody =
        {
            pallet_name: palletName,
            quantity: reduceNewQuantity
        }
            ;
        //更新palletName
        const resultUpdatePalletNeme = await updateRequest("/api/updateCartonsPalletName", requestUpdatePalletNameBody);
        if (resultUpdatePalletNeme.success) {
            alert("更新成功");
        } else {
            alert(`更新失敗: ${resultUpdatePalletNeme.message}`);
        }


        // //更新數量
        const resultIncreaseQuantity = await updateRequest("/api/update-quantity", requestIncreaseQuantityBody);
        const resultDecreaseQuantity = await updateRequest("/api/update-quantity", requestDecreaseQuantityBody);
        if (resultIncreaseQuantity.success) {
            alert("新增成功");
        } else {
            alert(`新增失敗: ${resultIncreaseQuantity.message}`);
        }

        if (resultDecreaseQuantity.success) {
            alert("減少成功");
        } else {
            alert(`減少失敗: ${resultDecreaseQuantity.message}`);
        }


        //更新cartonDetails , 避免資料不同步
        fetchCartonDetails();

    };


    //for 重工
    /**
    * for 重工 , 做以下事   
    * 1.carton表移除選擇的資料
    * 2.更新pallet表的quantity 
    * 3.選擇的資料存入到"重工"表
    * 4.重新fetch一次後端新資料-->渲染前端
    */
    const handleRepack = async () => {
        //有被勾選的checkbox 資料
        const selectedData = cartonDetails.filter((row) => selectedRows.includes(row.id));
        const selectedCount = selectedRows.length;
        if (selectedCount === 0) {
            alert('重新選擇要重工的項目');
            return;
        }
        const requestDeleteBody = {
            pallet_name: palletName,
            ids: selectedData.map((detail) => detail.id),
        };

        // 從 allPalletData 中找出該筆對應的 palletName資料
        const updatedPalletData = allPalletData.map((pallet) => {
            if (pallet.palletName === palletName) {
                return {
                    ...pallet,
                    quantity: Math.max(0, pallet.quantity - selectedCount), // 確保數量不會變成負數
                };
            }
            return pallet;
        });
        // 找到更新後的該 pallet 的 quantity
        const updatedPallet = updatedPalletData.find(p => p.palletName === palletName);
        if (!updatedPallet) {
            alert("找不到 pallet");
            return;
        }
        const requestUpdateBody = {
            pallet_name: palletName,
            quantity: updatedPallet.quantity,
        };

        //將選擇到的資料行內容存到repack表中 , "重工"狀態(pack)為false
        const postRepackBody = selectedData.map(({ id, palletName, ...item }) => ({
            ...item,
            pack: false,
            repackTime: dateTime
        }));

        console.log("postRepackBody : ", JSON.stringify(postRepackBody, null, 2))
        ////////////////////////////////  API call  ////////////////////////////////////

        // //刪除carton的資料
        const resultDelete = await deleteRequest("/api/carton-detail/ship", requestDeleteBody);
        if (resultDelete.success) {
            // alert("資料移出cartonDetail成功");
        } else {
            alert(`出貨失敗: ${resultDelete.message}`);
        }
        // //更新pallet的quantity
        const resultUpdate = await updateRequest("/api/update-quantity", requestUpdateBody);
        if (resultUpdate.success) {
            // alert("pallet數量更新成功");
        } else {
            alert(`更新失敗: ${resultUpdate.message}`);
        }
        // //將資料加入到"重工"表
        const resultPost = await postRequest("/api/post-repack", postRepackBody);
        if (resultPost.success) {
            // alert("資料新增至重工表成功");
        } else {
            alert(`新增失敗: ${resultPost.message}`);
        }
        //////////////////////////////////////////////////////////////////////////////
        //更新cartonDetails , 避免資料不同步
        fetchCartonDetails();
        //更新allPalletData , 避免資料不同步
        fetchAllPalletName();
        //將選擇的欄位清空
        setSelectedPallet(null);
        setTempPalletName('');
        setSelectedRows([]);


    };





    const handleExitButtonClick = () => {
        navigate('/');
    };


    //如果跳出此頁面或重整,則將palletName設為空字串
    useEffect(() => {
        // 當路由變化時清空 palletName
        return () => {
            setPalletName('');
            console.log("路由變化，清空全域變數 palletName");
        };
    }, [location]); // location 變化時觸發



    /**紙箱input欄位,按下enter後可以將該筆carton的checkbox打勾 */
    const handleCheckBoxforCarton = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSelectedRows((prevSelected) => {
                // 找出符合 cartonName 的 row IDs
                const matchingRows = cartonDetails
                    .filter((row: any) => row.cartonName === carton)
                    .map((row: any) => row.id);

                // 如果所有符合的 row 都已被選取，則取消選取，否則選取它們
                const allSelected = matchingRows.every(id => prevSelected.includes(id));
                return allSelected
                    ? prevSelected.filter(id => !matchingRows.includes(id)) // 取消勾選
                    : [...prevSelected, ...matchingRows]; // 勾選
            });

            //清空input欄位
            setCarton('');
        }
    };



    /**
     * for 增加箱子 , 做以下事
     * 1.點擊增加箱子跳出Modal , Modal包含以下欄位 以及 確認按鈕
     *  - 工單號碼
     *  - 紙箱數量
     *  - 料號模式
     * 2. 按下確認按鈕後產生如同addNewWorkOrder的表格
     * 
     */

    //fetch 料號對應表並渲染
    const fetchACIPartNumber = async () => {
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
            setACIPartNumber(data);

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    useEffect(() => {
        fetchACIPartNumber();
    }, []);

    const handleAddBox = async () => {
        //跳出Modal
        setShowAddCartonModal(true);
    }

    /**
     * 
     * 
     *     //增加紙箱
     * 
     */

    const handleSubmitAddCarton = () => {
        /**
          * 
         currentPalletData=目前棧板的資料
         palletName=目前的棧板名稱(全域變數)
          * 
          */

        //判斷目前棧板數量是否足夠(max-quantity-quantity)
        const checkQuantity = (palletData: any) => {
            const remainingQuantity = palletData.maxQuantity - palletData.quantity;
            return remainingQuantity >= inputCartonAmount;
        };
        //如果pallet空間不夠則直接跳出 handleSubmitAddCarton
        if (!checkQuantity(currentPalletData)) {
            alert("要核定的pallet剩餘空間不足");
            return;
        }
        //如果夠
        //1.則更新棧版的quantity
        //pallet的quantity數量更新 (/api/update-quantity)
        const newQuantity = (currentPalletData?.quantity ?? 0) + Number(inputCartonAmount);
        const requestUpdateQuantityBody =
        {
            pallet_name: palletName,
            quantity: newQuantity
        }
        // 2.新增數筆cartonDetail
        //1. carton表中 選擇到的行的palletName要更新

        //2. 要將pallet表中新舊pallet的quantity更新

    }


    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
                overflow: "auto",
            }}>

            {/* 增加紙箱 */}
            <Modal open={showAddCartonModal} onClose={() => setShowAddCartonModal(false)}>
                <Box sx={modalStyle}>
                    <form>
                        <Grid container spacing={2}>
                            {/* 工單號碼 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 工單號碼"
                                    variant="outlined"
                                    value={inputWorkOrderNumber}
                                    onChange={(event) => setInputWorkOrderNumber(event.target.value)}
                                />
                            </Grid>
                            {/* 紙箱數量 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="輸入 紙箱數量"
                                    variant="outlined"
                                    value={inputCartonAmount}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        if (/^\d*$/.test(value)) { // 允許空值或純數字
                                            setInputCartonAmount(value);
                                        }
                                    }}
                                    onBlur={() => {
                                        // 當輸入框失焦時，轉換成 number，確保 state 一致
                                        setInputCartonAmount((prev) => prev === "" ? 0 : Number(prev));
                                    }}
                                />
                            </Grid>
                            {/* 料號模式 */}
                            <Grid item xs={12}>
                                {/* <TextField
                                    fullWidth
                                    label="輸入 料號"
                                    variant="outlined"
                                    value={inputACIPartNumber}
                                    onChange={(event) => setInputACIPartNumber(event.target.value)}
                                /> */}
                                <Autocomplete
                                    freeSolo  // 允許使用者輸入非選單內的值
                                    options={ACIPartNumber.filter(item =>
                                        (item.aciPartNumber ?? item.partNumber) // 如果 aciPartNumber 是 null，就使用 partNumber
                                            .toLowerCase()
                                            .includes(inputACIPartNumber.toLowerCase())
                                    )}

                                    getOptionLabel={(option) => option.aciPartNumber ?? option.partNumber} // 顯示 aciPartNumber，若為 null 則顯示 partNumber
                                    onInputChange={(event, newInputValue) => setInputACIPartNumber(newInputValue)}  // 更新輸入值
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label="輸入 料號"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            {/* 確認按鈕 */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSubmitAddCarton}
                                    disabled={!inputWorkOrderNumber || !inputCartonAmount || !inputACIPartNumber} // 當未輸入時禁用按鈕
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
                                            const foundPallet = allPalletData.find(row => row.palletName === inputPalletName);
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
                                    {allPalletData
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




            {/* {!tableView &&
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="palletName">{formatMessage({ id: 'PalletName' })} : </label>
                    <input
                        type="text"
                        id="palletName"
                        value={tempPalletName}
                        onChange={(e) => setTempPalletName(e.target.value)}
                        placeholder="輸入 Pallet Name"
                        style={{ padding: '5px', width: '250px' }}
                        onKeyDown={fetchPalletDetailData}
                    />

                </div>
            } */}

            {tableView && (cartonDetails.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>no data</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "90vh",
                        overflow: "auto",
                    }}>
                    {selectedRows.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <Box>
                                    <Button variant="outlined" color="secondary" onClick={handleShip} >
                                        加入待出貨清單
                                    </Button>
                                    {/* <Button variant="outlined" color="secondary" onClick={handleOpenShipModal} >
                                    加入出貨清單(購物車)
                                </Button> */}
                                    <Button variant="outlined" color="secondary" onClick={handleMerge} style={{ marginLeft: '10px' }}>
                                        {formatMessage({ id: 'transfer' })}
                                    </Button>
                                    {/* <Button variant="outlined" color="secondary" onClick={handleRepack} style={{ marginLeft: '10px' }}>
                                    {formatMessage({ id: 'repack' })}...尚未
                                </Button>

                                <Button variant="outlined" color="secondary" onClick={handleAddBox} style={{ marginLeft: '10px' }}>
                                    {formatMessage({ id: 'addBox' })}...尚未
                                </Button> */}

                                </Box>
                                <Button variant="contained" sx={{ marginRight: 1 }} onClick={handleExitButtonClick}>
                                    {formatMessage({ id: 'exit' })}
                                </Button>
                            </Box>
                        </div>
                    )}
                    <>
                        <label>{formatMessage({ id: 'CartonNames' })}：</label>
                        <input
                            type="text"
                            value={carton}
                            onChange={(e) => setCarton(e.target.value)}
                            onKeyDown={handleCheckBoxforCarton}
                        />
                    </>
                    <Paper style={{ flex: 1, overflowX: "auto" }}>
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
                            <Table stickyHeader aria-label="sticky table"
                                style={{
                                    minWidth: '800px', // 最小寬度，確保資料過多時滾動
                                    tableLayout: 'auto',
                                }}>
                                <TableHead>
                                    <TableRow style={{ border: '1px solid #ccc' }}>

                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={
                                                    selectedRows.length > 0 &&
                                                    selectedRows.length < cartonDetails.length
                                                }
                                                checked={selectedRows.length === cartonDetails.length}
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
                                    {cartonDetails.map((row: any) => (
                                        <TableRow key={row.id}>

                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedRows.includes(row.id)}
                                                    onChange={() => handleSelectRow(row.id)}
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
                    </Paper>
                </div>
            ))}
        </div>
    );
};

export default ACIPicking;
