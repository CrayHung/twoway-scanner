## API README

架構分為 workOrder / workOrderDetail 兩層資料，
詳細項目請參考最後的資料架構

### workOrder 第一層表單 API

#### GET API (GET)
http://localhost:8080/api/get-work-orders

#### POST API (POST)
http://localhost:8080/api/post-work-orders

BODY 範例(JSON):

{
  "workOrderNumber": "WO004",
  "quantity": 10,
  "partNumber": "PART001",
  "createUser": "user1",
  "editUser": "user1"
}
日期的部分會由當前資料庫時間自動判定，無需自行輸入

#### Search API (POST)
修正為 post 方法
URL 範例：
http://localhost:8080/api/fuzzy-search-work-orders

BODY:
{
  "workOrderNumber": ["001"],
  "createDateStart": ["2023-01-01"],
  "createDateEnd": ["2023-12-31"]
}

#### UPDATE/EDIT API (PUT)
http://localhost:8080/api/update-work-orders/{id}

URL 範例：
http://localhost:8080/api/update-work-orders/4

BODY 範例(JSON):
{
  "workOrderNumber": "WO004",
  "quantity": 100,
  "partNumber": "PART001",
  "editUser": "edituser1"
}
同樣，日期的部分會由當前資料庫時間自動判定，無需自行輸入
且不修改 createUser

#### DELETE API (DELETE)
http://localhost:8080/api/update-work-orders/{id}

URL 範例：
http://localhost:8080/api/delete-work-orders/4


### workOrderDetail 第二層表單 API

#### GET API (GET)
http://localhost:8080/api/get-work-order-details

#### POST API (POST)

http://localhost:8080/api/post-work-order-details

BODY 範例(JSON):

[
  {
    "workOrderNumber": ["WO-001"],
    "SN": ["SN001"],
    "QR_RFTray": ["RF001"],
    "QR_PS": ["PS001"],
    "QR_HS": ["HS001"],
    "QR_RFTray_BEDID": ["RFBED"],
    "QR_PS_BEDID": ["PSBED"],
    "QR_HS_BEDID": ["HSBED"]
    "QR_backup1": ["BK001"],
    "QR_backup2": ["BK002"],
    "QR_backup3": ["BK003"],
    "QR_backup4": ["BK004"],
    "note": ["測試註記"],
    "create_user": ["tester"],
    "edit_user": ["tester"]
  },
  {
    "workOrderNumber": ["WO-001"],
    "SN": ["SN001"],
    "QR_RFTray": ["RF001"],
    "QR_PS": ["PS001"],
    "QR_HS": ["HS001"],
    "QR_RFTray_BEDID": ["RFBED"],
    "QR_PS_BEDID": ["PSBED"],
    "QR_HS_BEDID": ["HSBED"]
    "QR_backup1": ["BK001"],
    "QR_backup2": ["BK002"],
    "QR_backup3": ["BK003"],
    "QR_backup4": ["BK004"],
    "note": ["測試註記"],
    "create_user": ["tester"],
    "edit_user": ["tester"]
  }
]

注意：可以一次性提交多個工單詳細信息。

#### Search API (GET)

##### SN與日期 範圍搜尋（其餘模糊）
URL: http://localhost:8080/api/snfield-search-details
方法: POST
Headers:
Content-Type: application/json

JSON 可用名稱範例
{
  "workOrderNumber": ["WO2023", "WO2024"],
  "snStart": ["SN1000"],
  "snEnd": ["SN9999"],
  "QR_RFTray": ["RF001", "RF002"],
  "QR_PS": ["PS001", "PS002"],
  "QR_HS": ["HS001", "HS002"],
  "QR_RFTray_BEDID": ["RFBED"],
  "QR_PS_BEDID": ["PSBED"],
  "QR_HS_BEDID": ["HSBED"],
  "QR_backup1": ["BK1001", "BK1002"],
  "QR_backup2": ["BK2001", "BK2002"],
  "QR_backup3": ["BK3001", "BK3002"],
  "QR_backup4": ["BK4001", "BK4002"],
  "productionDateStart": ["2023-01-01", "2023-06-01"],
  "productionDateEnd": ["2023-12-31", "2024-05-31"],
  "note": ["note1", "note2"],
  "create_user": ["user1", "user2"],
  "edit_user": ["editor1", "editor2"],
  "partNumber": ["PART001", "PART002"],
  "company": ["Company A", "Company B"]
}

##### 日期範圍搜尋（SN與其餘模糊）
URL: http://localhost:8080/api/snfuzzy-search-details
方法: POST
Headers:
Content-Type: application/json

JSON 可用名稱範例
{
  "workOrderNumber": ["WO123", "WO456"],
  "SN": ["SN001", "SN002"],
  "QR_RFTray": ["RF001", "RF002"],
  "QR_PS": ["PS001", "PS002"],
  "QR_HS": ["HS001", "HS002"],
  "QR_RFTray_BEDID": ["RFBED"],
  "QR_PS_BEDID": ["PSBED"],
  "QR_HS_BEDID": ["HSBED"]
  "QR_backup1": ["B1001", "B1002"],
  "QR_backup2": ["B2001", "B2002"],
  "QR_backup3": ["B3001", "B3002"],
  "QR_backup4": ["B4001", "B4002"],
  "note": ["note1", "note2"],
  "create_user": ["user1", "user2"],
  "edit_user": ["user3", "user4"],
  "partNumber": ["PART123", "PART456"],
  "company": ["Twoway", "ACI"],
  "productionDateStart": ["2023-01-01", "2023-02-01"],
  "productionDateEnd": ["2023-12-31", "2023-11-30"]
}

#### UPDATE/EDIT API (PUT)

http://localhost:8080/api/update-work-order-details

BODY 範例(JSON):
[
  {
    "id": 13,
    "SN": ["SN010-updated"],
    "QR_RFTray": ["QRRF008-updated"],
    "QR_PS": ["QRPS008-updated"],
    "QR_HS": ["QRHS008-updated"],
    "QR_RFTray_BEDID": ["RFBED-updated"],
    "QR_PS_BEDID": ["PSBED-updated"],
    "QR_HS_BEDID": ["HSBED-updated"],
    "QR_backup1": ["QRBU029-updated"],
    "QR_backup2": ["QRBU030-updated"],
    "QR_backup3": ["QRBU031-updated"],
    "QR_backup4": ["QRBU032-updated"],
    "note": ["Note for WO-003 updated"],
    "edit_user": ["user1-updated"]
  },
  {
    "id": 14,
    "SN": ["SN011-updated"],
    "QR_RFTray": ["QRRF009-updated"],
    "QR_PS": ["QRPS009-updated"],
    "QR_HS": ["QRHS009-updated"],
    "QR_RFTray_BEDID": ["RFBED-updated"],
    "QR_PS_BEDID": ["PSBED-updated"],
    "QR_HS_BEDID": ["HSBED-updated"],
    "QR_backup1": ["QRBU033-updated"],
    "QR_backup2": ["QRBU034-updated"],
    "QR_backup3": ["QRBU035-updated"],
    "QR_backup4": ["QRBU036-updated"],
    "note": ["Note for WO-003 updated"],
    "edit_user": ["user1-updated"]
}
]

注意：

1. 可以一次性更新多個工單詳細信息。
2. 必須提供每個要更新的記錄的 id。
3. edit_date 會由系統自動設置為當前日期，無需手動提供。
4. 不允許更改 create_user 和 create_date。
5. 若要清空，需傳入該 項目data: null，沒有傳入的項目就會維持原樣 
  傳入body例如: 
  {
    "id": 2,  
    "SN": "EDITED_SN_NUMBER2",
    "edit_user": "EDIT_USER3",
    "note": null
  }
  其餘的QR等項目都會維持原樣

#### 新增 data 時，檢查重複SN/BEDID 的 PUT API (PUT)

URL: http://localhost:8080/api/batch-create-work-order-details
方法: PUT
Headers:
Content-Type: application/json

功能說明：
- 用於在輸入資料時即時檢查 SN 和 BEDID 是否重複
- 如發現重複，會立即返回錯誤信息
- 若無重複，則進行資料更新

BODY 範例(JSON):
[
  {
    "id": 1,
    "SN": "SN001",
    "QR_RFTray": "RF001",
    "QR_PS": "PS001",
    "QR_HS": "HS001",
    "QR_RFTray_BEDID": "RFBED001",
    "QR_PS_BEDID": "PSBED001",
    "QR_HS_BEDID": "HSBED001",
    "QR_backup1": "BK001",
    "QR_backup2": "BK002",
    "QR_backup3": "BK003",
    "QR_backup4": "BK004",
    "note": "測試註記",
    "edit_user": "tester"
  }
]

成功回應範例：
{
    "message": "成功更新工單號 WO-001 的詳細信息"
}

錯誤回應範例（SN重複）：
{
    "message": "更新失敗！請檢查以下問題：\n- SN 'SN001' 已存在於資料庫中"
}

錯誤回應範例（BEDID重複）：
{
    "message": "更新失敗！請檢查以下問題：\n- 工單號 WO-001 的BEDID重複：\nRF_Tray_BEDID: RFBED001"
}

注意事項：
1. id 為必填欄位，用於識別要更新的記錄
2. SN 和 BEDID 會進行重複檢查
3. 若檢查到任何重複，整批資料都不會更新
4. edit_date 會自動設為當前日期
5. create_user 和 create_date 不允許修改

#### DELETE API (DELETE)
http://localhost:8080/api/delete-work-order-details/{id}

URL 範例：
http://localhost:8080/api/delete-work-order-details/10


### InputMode API

#### GET API (GET)
http://localhost:8080/api/get-input-modes
獲取所有輸入模式。

#### POST API (POST)
http://localhost:8080/api/post-input-modes
創建新的輸入模式。
BODY 範例(JSON):

{
  "partNumber": "PART001",
  "inputMode": "MODE1"
}

注意:

partNumber 不能為空
inputMode 不能為空


#### UPDATE/EDIT API (PUT)

http://localhost:8080/api/put-input-modes/{id}
更新指定 id 的輸入模式。

URL 範例:
http://localhost:8080/api/put-input-modes/1

BODY 範例(JSON):
{
  "partNumber": "PART001-UPDATED",
  "inputMode": "MODE1-UPDATED"
}

注意:

partNumber 不能為空
inputMode 不能為空

#### DELETE API (DELETE)
http://localhost:8080/api/del-input-modes/{id}
刪除指定 id 的輸入模式。
URL 範例:
http://localhost:8080/api/del-input-modes/1


### 資料架構
其中第一層 workOrder 的 mysql 資料架構為：
+-------------------+--------------+------+-----+---------+----------------+
| Field             | Type         | Null | Key | Default | Extra          |
+-------------------+--------------+------+-----+---------+----------------+
| id                | bigint       | NO   | PRI | NULL    | auto_increment |
| work_order_number | varchar(255) | NO   | UNI | NULL    |                |
| quantity          | int          | NO   |     | NULL    |                |
| part_number       | varchar(255) | NO   |     | NULL    |                |
| company           | varchar(255) | YES  |     | NULL    |                |
| create_user       | varchar(255) | YES  |     | NULL    |                |
| create_date       | date         | YES  |     | NULL    |                |
| edit_user         | varchar(255) | YES  |     | NULL    |                |
| edit_date         | date         | YES  |     | NULL    |                |
+-------------------+--------------+------+-----+---------+----------------+

第二層 workOrderDetail 的 mysql 資料架構為：

+-------------------+--------------+------+-----+---------+----------------+
| Field             | Type         | Null | Key | Default | Extra          |
+-------------------+--------------+------+-----+---------+----------------+
| id                | bigint       | NO   | PRI | NULL    | auto_increment |
| work_order_number | varchar(255) | NO   | MUL | NULL    |                |
| detail_id         | int          | NO   |     | NULL    |                |
| sn                | varchar(255) | YES  |     | NULL    |                |
| qr_rf_tray        | varchar(255) | YES  |     | NULL    |                |
| qr_ps             | varchar(255) | YES  |     | NULL    |                |
| qr_hs             | varchar(255) | YES  |     | NULL    |                |
| qr_backup1        | varchar(255) | YES  |     | NULL    |                |
| qr_backup2        | varchar(255) | YES  |     | NULL    |                |
| qr_backup3        | varchar(255) | YES  |     | NULL    |                |
| qr_backup4        | varchar(255) | YES  |     | NULL    |                |
| note              | text         | YES  |     | NULL    |                |
| create_date       | date         | YES  |     | NULL    |                |
| create_user       | varchar(255) | YES  |     | NULL    |                |
| edit_date         | date         | YES  |     | NULL    |                |
| edit_user         | varchar(255) | YES  |     | NULL    |                |
+-------------------+--------------+------+-----+---------+----------------+

其中  work_order_number 是由第二層外鍵到第一層的  work_order_number
每個第二層的 detail_id 對應一個 work_order_number,
且不同的 work_order_number 的 detail_id 都會從 1 開始
