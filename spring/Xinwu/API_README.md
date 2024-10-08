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

#### Search API (GET)
URL 範例：
搜尋 2023-1-1 ~ 2024-12-31 的所有 data
http://localhost:8080/api/search-work-orders?productionDateStart=2023-01-01&productionDateEnd=2024-12-31

範例 2:
(空白待補充)

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

{
  "workOrderNumber": "WO-001",
  "detail_id": 7,
  "SN": "SN001",
  "QR_RFTray": "RF001",
  "QR_PS": "PS001",
  "QR_HS": "HS001",
  "QR_backup1": "BK001",
  "QR_backup2": "BK002",
  "QR_backup3": "BK003",
  "QR_backup4": "BK004",
  "note": "測試註記",
  "create_user": "tester",
  "edit_user": "tester"
}

#### Search API (GET)

##### SN與日期 範圍搜尋（其餘模糊）
URL: http://localhost:8080/api/snfield-search-details
方法: POST
Headers:
Content-Type: application/json

JSON 可用名稱範例
{
  "workOrderNumbers": ["WO2023", "WO2024"],
  "snStart": ["SN1000"],
  "snEnd": ["SN9999"],
  "QR_RFTray": ["RF001", "RF002"],
  "QR_PS": ["PS001", "PS002"],
  "QR_HS": ["HS001", "HS002"],
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

http://localhost:8080/api/update-work-order-details/{id}

URL 範例：
http://localhost:8080/api/update-work-order-details/10

BODY 範例(JSON):
{
  "workOrderNumber": "WO-001",
  "detail_id": 7,
  "SN": "SN001",
  "QR_RFTray": "RF001",
  "QR_PS": "PS001",
  "QR_HS": "HS001",
  "QR_backup1": "BK001",
  "QR_backup2": "BK002",
  "QR_backup3": "BK003",
  "QR_backup4": "BK004",
  "note": "編輯註記",
  "edit_user": "edit_user"
}
同樣，日期的部分會由當前資料庫時間自動判定，無需自行輸入
且不修改 createUser

#### DELETE API (DELETE)
http://localhost:8080/api/delete-work-order-details/{id}

URL 範例：
http://localhost:8080/api/delete-work-order-details/10

### 資料架構
其中第一層 workOrder 的 mysql 資料架構為：
+-------------------+--------------+------+-----+---------+----------------+
| Field             | Type         | Null | Key | Default | Extra          |
+-------------------+--------------+------+-----+---------+----------------+
| id                | bigint       | NO   | PRI | NULL    | auto_increment |
| work_order_number | varchar(255) | NO   | UNI | NULL    |                |
| quantity          | int          | NO   |     | NULL    |                |
| part_number       | varchar(255) | NO   |     | NULL    |                |
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
