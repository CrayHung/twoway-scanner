CREATE DATABASE IF NOT EXISTS twowaydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE twowaydb;

CREATE USER 'user'@'%' IDENTIFIED BY '123456';
GRANT ALL ON twowaydb.* to 'user'@'%';
FLUSH PRIVILEGES;

-- CREATE TABLE IF NOT EXISTS record (
--   id int AUTO_INCREMENT,
--   plate_number varchar(255) DEFAULT NULL,
--   recognition_time datetime(6) DEFAULT NULL,
--   recognition_time_str varchar(255) DEFAULT NULL,
--   car_type varchar(255) DEFAULT NULL,
--   image_path varchar(255) DEFAULT NULL,
--   camera_id varchar(255) DEFAULT NULL,
--   plate_in Boolean DEFAULT 1,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE IF NOT EXISTS allow_list (
--   id int AUTO_INCREMENT,
--   plate_number varchar(255) DEFAULT NULL,
--   pass_status varchar(255) DEFAULT NULL,
--   visitor_start_str varchar(255) DEFAULT NULL,
--   visitor_end_str varchar(255) DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE IF NOT EXISTS parking_lot (
--   id int AUTO_INCREMENT,
--   amount int DEFAULT NULL,
--   car_type varchar(255) DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

CREATE TABLE IF NOT EXISTS users (
  id int AUTO_INCREMENT,
  username varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  company varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS refresh_token (
  id int AUTO_INCREMENT,
  user_id INT,
  token varchar(255) DEFAULT NULL,
  createdDate TIMESTAMP,
  expirationDate TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CREATE TABLE IF NOT EXISTS speeding (
--   id int AUTO_INCREMENT,
--   plate_number varchar(255) DEFAULT NULL,
--   recognition_time datetime(6) DEFAULT NULL,
--   recognition_time_str varchar(255) DEFAULT NULL,
--   car_type varchar(255) DEFAULT NULL,
--   image_path varchar(255) DEFAULT NULL,
--   camera_id varchar(255) DEFAULT NULL,
--   avgSpeed int DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

-- 創建 達運專用的 input_modes 表
CREATE TABLE IF NOT EXISTS input_modes (
  id INT AUTO_INCREMENT,
  part_number VARCHAR(255) NOT NULL,
  input_mode VARCHAR(255) NOT NULL,
  number_per_pallet INT NOT NULL,
  summary TEXT,
  note TEXT,
  create_user VARCHAR(255),
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edit_user VARCHAR(255),
  edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (part_number)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 創建 達運專用的 workOrder 表
CREATE TABLE IF NOT EXISTS work_orders (
  id INT AUTO_INCREMENT,
  work_order_number VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  part_number VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  create_user VARCHAR(255),
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edit_user VARCHAR(255),
  edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (part_number) REFERENCES input_modes(part_number) ON UPDATE CASCADE,
  UNIQUE (work_order_number)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改 work_order_details 表結構
DROP TABLE IF EXISTS work_order_details;
CREATE TABLE work_order_details (
  id INT AUTO_INCREMENT,
  work_order_number VARCHAR(255) NOT NULL,
  detail_id INT NOT NULL,
  sn VARCHAR(255),
  qr_rf_tray VARCHAR(255),
  qr_ps VARCHAR(255),
  qr_hs VARCHAR(255),
  qr_rf_tray_bedid VARCHAR(255),
  qr_ps_bedid VARCHAR(255),
  qr_hs_bedid VARCHAR(255),
  qr_backup1 VARCHAR(255),
  qr_backup2 VARCHAR(255),
  qr_backup3 VARCHAR(255),
  qr_backup4 VARCHAR(255),
  note TEXT,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  create_user VARCHAR(255),
  edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  edit_user VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (work_order_number) REFERENCES work_orders(work_order_number) ON UPDATE CASCADE,
  UNIQUE (work_order_number, detail_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pallet (
  id INT AUTO_INCREMENT,
  pallet_name VARCHAR(255) NOT NULL,
  max_quantity INT,
  quantity INT,
  created_at DATETIME,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS carton_detail (
  id INT AUTO_INCREMENT,
  pallet_name VARCHAR(255),
  carton_name VARCHAR(255),
  sn VARCHAR(255) NOT NULL,
  qr_rftray_bedid VARCHAR(255),
  qr_ps_bedid VARCHAR(255),
  qr_hs_bedid VARCHAR(255),
  PRIMARY KEY (id)
);

-- 插入測試數據到 input_modes 表
INSERT INTO input_modes (part_number, input_mode, number_per_pallet, summary, create_user, create_date, edit_user, edit_date)
VALUES
  ('P1A00G0-003G', 'E', 104, 'AMT-MB851TC2RN0/ASEM/Moto MB/1794MHz/ 204/258 /51dB FWD/32dB RTN/23.0dB Slope/Plug-in Sidactor/ASEM Housing/With Power Supply/GaN Forward Hybrids/RoHS/For ACI', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('K1A0000-036G', 'D', 48, 'HSG01-MB-PS/ASEM/Moto MB Housing/Port 1 to 4 W/45-90 VPS W/Internal Ground Strap/Without Seizure Screw/With Dust Cover/Individually Boxed/RoHS/For', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('K1A0000-032G', 'C', 20, 'MB-MPPS-II/ASEM/Moto MB Cable Power/45-90V AC Input/ 24V/1.8A DC Output /Triac & Sidactor Type/Input Control/With Pillar Screws/Heat Sinks x 2/For', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('K1A00G0-013G', 'B', 104, 'AMT-MB851TM2RN0/ASEM/Moto MB/1794MHz/ 204/258 /51dB FWD/32dB RTN/20.0dB Slope/Plug-in Sidactor/Module Only/GaN Forward Hybrids/RoHS/For', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('K1A0000-037G', 'A', 48, 'HSG01-MB-00/ASEM/Moto MB Housing/Port 1 to 4 W/O PWS W/internal Ground strap/ W/O Seizure Screw /With Dust Cover/Individually Boxed/RoHS/For ACI', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00');
-- 確認插入的數據
SELECT COUNT(*) FROM input_modes;

-- 以下為測試用數據

-- INSERT INTO record (id,plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, plate_in)
-- VALUES
--   (1,'ABC-123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 1),
--   (2,'AAA-789', '2023-12-14 12:30:00.000000', '2023-12-14 13:45:00.000000', 'car', '2.jpg', 'cam1', 0),
--   (3,'77-DE', '2023-12-14 12:30:00.000000', '2023-12-14 14:15:00.000000', 'truck', '3.jpg', 'cam2', 1);


-- INSERT INTO allow_list (id,plate_number,pass_status,visitor_start_str,visitor_end_str) VALUES 
--   (1,'ABC-123','pass','',''),
--   (2,'AAA-789','pass','',''),
--   (3,'77-DE','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
--   (4,'XYZ-789','temp_pass','2023-11-05 00:15:03.000000','2023-12-30 00:15:03.000000'),
--   (5,'AA-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
--   (6,'BB-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000');

-- INSERT INTO parking_lot (id,amount, car_type) VALUES 
--   (1,100, 'car'),
--   (2,100, 'truck');

-- 因password會加密儲存,所以創建的時候給明碼沒用,用API  /registerAdmin註冊
-- 或是在spring啟動時就先創建一個帳號(DataLoader)
-- INSERT INTO users (username, password, role)
-- VALUES
--   ('test', '$2a$10$sEo9Vh3mWscdSDjANOHLiulyQoncOzRbwAmZEIQmsw5HrrhXLj.LS' , 'ADMIN');
-- SELECT COUNT(*) FROM users;

-- INSERT INTO refresh_token (id,user_id, token, createdDate, expirationDate)
-- VALUES
--   (1,1, 'token123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000'),
--   (2,2, 'token456', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000');

-- INSERT INTO speeding (id,plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, avgSpeed)
-- VALUES
--   (1,'ABC-123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 5),
--   (2,'AAA-789', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '2.jpg', 'cam2', 7),
--   (3,'123-XYZ', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '3.jpg', 'cam1', 10);



-- 測試數據 for 工單 work_orders 
-- INSERT INTO work_orders (work_order_number, quantity, part_number, company, create_user, create_date, edit_user, edit_date)
-- VALUES
--   ('WO-001', 3, 'K1A0000-037G', 'Twoway', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
--   ('WO-002', 200, 'K1A00G0-013G', 'ACI', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
--   ('WO-003', 200, 'K1A0000-032G', 'ACI', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
--   ('WO-004', 200, 'K1A0000-036G', 'ACI', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
--   ('WO-005', 150, 'P1A00G0-003G', 'Twoway', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00');
-- SELECT COUNT(*) FROM work_orders;

-- 測試數據 for work_order_details
-- INSERT INTO work_order_details (work_order_number, detail_id, sn, qr_rf_tray, qr_ps, qr_hs, qr_rf_tray_bedid, qr_ps_bedid, qr_hs_bedid, qr_backup1, qr_backup2, qr_backup3, qr_backup4, note, create_user, create_date, edit_user, edit_date)
-- VALUES
--   ('WO-001', 1, 'SN001', 'QRRF001', 'QRPS001', 'QRHS001', 'BEDRF001', 'BEDPS001', 'BEDHS001', 'QRBU001', 'QRBU002', 'QRBU003', 'QRBU004', 'Note for WO-001 #1', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
--   ('WO-001', 2, 'SN002', 'QRRF002', 'QRPS002', 'QRHS002', 'BEDRF002', 'BEDPS002', 'BEDHS002', 'QRBU005', 'QRBU006', 'QRBU007', 'QRBU008', 'Note for WO-001 #2', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
--   ('WO-001', 3, 'SN003', 'QRRF003', 'QRPS003', 'QRHS003', 'BEDRF003', 'BEDPS003', 'BEDHS003', 'QRBU009', 'QRBU010', 'QRBU011', 'QRBU012', 'Note for WO-001 #3', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
--   ('WO-002', 1, 'SN004', 'QRRF004', 'QRPS004', 'QRHS004', 'BEDRF004', 'BEDPS004', 'BEDHS004', 'QRBU013', 'QRBU014', 'QRBU015', 'QRBU016', 'Note for WO-002 #1', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
--   ('WO-002', 2, 'SN005', 'QRRF005', 'QRPS005', 'QRHS005', 'BEDRF005', 'BEDPS005', 'BEDHS005', 'QRBU017', 'QRBU018', 'QRBU019', 'QRBU020', 'Note for WO-002 #2', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
--   ('WO-003', 1, 'SN006', 'QRRF006', 'QRPS006', 'QRHS006', 'BEDRF006', 'BEDPS006', 'BEDHS006', 'QRBU021', 'QRBU022', 'QRBU023', 'QRBU024', 'Note for WO-003 #1', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00'),
--   ('WO-004', 1, 'SN007', 'QRRF007', 'QRPS007', 'QRHS007', 'BEDRF007', 'BEDPS007', 'BEDHS007', 'QRBU025', 'QRBU026', 'QRBU027', 'QRBU028', 'Note for WO-004 #1', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00'),
--   ('WO-005', 1, 'SN008', 'QRRF008', 'QRPS008', 'QRHS008', 'BEDRF008', 'BEDPS008', 'BEDHS008', 'QRBU029', 'QRBU030', 'QRBU031', 'QRBU032', 'Note for WO-005 #1', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00');
-- SELECT COUNT(*) FROM work_order_details;
